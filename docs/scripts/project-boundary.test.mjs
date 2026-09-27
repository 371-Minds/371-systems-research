import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";
import ts from "typescript";
import { parse as parseYaml } from "yaml";

const projectRoot = new URL("../", import.meta.url);
const configSource = readFileSync(
  new URL("hutch.config.ts", projectRoot),
  "utf8",
);
const manifest = JSON.parse(
  readFileSync(new URL("package.json", projectRoot), "utf8"),
);
const rootManifest = JSON.parse(
  readFileSync(new URL("../package.json", projectRoot), "utf8"),
);
const parsedLockfile = ts.parseConfigFileTextToJson(
  "bun.lock",
  readFileSync(new URL("../bun.lock", projectRoot), "utf8"),
);
assert.equal(parsedLockfile.error, undefined);
const lockfile = parsedLockfile.config;
const deployWorkflow = readFileSync(
  new URL("../.github/workflows/docs-deploy.yml", projectRoot),
  "utf8",
);
const exampleChecker = readFileSync(
  new URL("scripts/check-code-examples.mjs", projectRoot),
  "utf8",
);

test("Hutch delegates reproducible docs installs to the Bun workspace", () => {
  assert.match(configSource, /\bpackageManager:\s*"bun"/);
  assert.match(
    configSource,
    /\binstall:\s*\[\s*"hutch"\s*,\s*"pm"\s*,\s*"install"\s*,\s*"--frozen-lockfile"\s*\]/,
  );
  assert.equal(manifest.private, true);
  assert.match(rootManifest.packageManager, /^bun@\d+\.\d+\.\d+$/);
  assert.deepEqual(rootManifest.workspaces, ["docs"]);
  assert.equal(lockfile.lockfileVersion, 2);
  assert.deepEqual(lockfile.workspaces[""].dependencies, rootManifest.dependencies);
  assert.deepEqual(lockfile.workspaces.docs.dependencies, manifest.dependencies);
  assert.deepEqual(
    lockfile.workspaces.docs.devDependencies,
    manifest.devDependencies,
  );
  assert.equal(existsSync(new URL("bun.lock", projectRoot)), false);
  for (const path of ["package-lock.json", "../package-lock.json"]) {
    assert.equal(existsSync(new URL(path, projectRoot)), false);
  }
  assert.match(deployWorkflow, /run:\s*hutch run install\s*\n/);
  assert.match(deployWorkflow, /uses:\s*oven-sh\/setup-bun@/);
  assert.match(deployWorkflow, /bun-version-file:\s*package\.json/);
  assert.ok(
    deployWorkflow.indexOf("uses: oven-sh/setup-bun@") <
      deployWorkflow.indexOf("- name: Install docs dependencies"),
  );
});

test("root commands route to docs without npm and expose verification and preview", () => {
  for (const command of ["dev", "build", "lint", "test", "preview"]) {
    assert.equal(rootManifest.scripts[command], `bun run --cwd docs ${command}`);
    assert.equal(typeof manifest.scripts[command], "string");
  }
  assert.equal(
    rootManifest.scripts.check,
    "bun run lint && bun run test && bun run --cwd docs check:examples",
  );
  assert.equal(manifest.scripts.test, "bun test ./scripts/project-boundary.test.mjs");
  assert.match(manifest.scripts.dev, /--port 3000/);
  assert.match(manifest.scripts.preview, /--port 3000/);
  for (const scripts of [rootManifest.scripts, manifest.scripts]) {
    for (const command of Object.values(scripts)) {
      assert.doesNotMatch(command, /\b(?:npm|npx)\b/);
    }
  }
});

test("CI installs manifest-pinned Bun before dependency installation", () => {
  for (const [workflow, manifestPath] of [
    ["docs-deploy.yml", "package.json"],
    ["release.yml", "package/package.json"],
    ["cef-check.yml", "package/package.json"],
  ]) {
    const source = readFileSync(
      new URL(`../.github/workflows/${workflow}`, projectRoot),
      "utf8",
    );
    const jobs = Object.values(parseYaml(source).jobs);
    let installJobs = 0;
    for (const job of jobs) {
      const steps = job.steps ?? [];
      const installIndex = steps.findIndex((step) => step.run === "hutch run install");
      if (installIndex === -1) continue;
      installJobs++;
      const bunIndex = steps.findIndex((step) => step.uses?.startsWith("oven-sh/setup-bun@"));
      assert.ok(bunIndex >= 0 && bunIndex < installIndex, workflow);
      assert.equal(steps[bunIndex].with["bun-version-file"], manifestPath);
      assert.equal(steps.some((step) => step.with?.cache === "npm"), false);
    }
    assert.ok(installJobs > 0, `${workflow} must exercise dependency installation`);
  }
});

test("documentation examples own their ambient runtime types", () => {
  assert.equal(manifest.devDependencies["@types/bun"], "^1.4.0");
  assert.match(
    exampleChecker,
    /typeRoots:\s*\[join\(docsRoot, "node_modules", "@types"\)\]/,
  );
  assert.doesNotMatch(exampleChecker, /join\(packageRoot, "node_modules"/);
});

test("tag deployments use the canonical strict release version gate", () => {
  assert.match(
    deployWorkflow,
    /^      - name: Verify release tag and version\n        if: github\.event_name == 'push'\n        id: release-type$/m,
  );
  assert.match(
    deployWorkflow,
    /^        run: node package\/scripts\/verify-release-version\.mjs$/m,
  );
  assert.ok(
    deployWorkflow.indexOf("- name: Verify release tag and version") <
      deployWorkflow.indexOf("- name: Install docs dependencies"),
  );

  const stableOrManual =
    "if: github.event_name == 'workflow_dispatch' || steps.release-type.outputs.prerelease != 'true'";
  for (const step of [
    "Install docs dependencies",
    "Check docs",
    "Build docs",
    "Deploy to Cloudflare Pages",
  ]) {
    const start = deployWorkflow.indexOf(`      - name: ${step}\n`);
    assert.notEqual(start, -1, `missing ${step}`);
    const next = deployWorkflow.indexOf("\n      - ", start + 1);
    const stepSource = deployWorkflow.slice(
      start,
      next === -1 ? undefined : next,
    );
    assert.ok(
      stepSource.includes(stableOrManual),
      `${step} must skip SemVer prereleases but run for manual dispatches`,
    );
  }
  assert.doesNotMatch(deployWorkflow, /contains\(github\.ref_name/);
});

test("docs tools delegate to Bun scripts rather than npm exec semantics", () => {
  for (const command of [
    "dev",
    "build",
    "preview",
    "check",
    "check:examples",
    "test",
    "deploy",
  ]) {
    assert.ok(configSource.includes(`hutch pm run ${command}`));
    assert.equal(typeof manifest.scripts[command], "string");
  }

  assert.doesNotMatch(configSource, /hutch pm exec/);
  assert.ok(configSource.includes('hutch pm run deploy --branch="$PAGES_BRANCH"'));
  assert.doesNotMatch(configSource, /:\s*["'`](?:astro|wrangler)\b/);
});
