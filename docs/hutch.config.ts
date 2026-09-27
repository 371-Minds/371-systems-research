// @hutch cli=0.26.0-canary.10 cottontail=0.6.0-canary.14
export default {
  packageManager: "bun",
  scripts: {
    install: ["hutch", "pm", "install", "--frozen-lockfile"],
    dev: "hutch pm run dev",
    start: "hutch pm run dev",
    build: "hutch pm run build",
    preview: "hutch pm run preview",
    check: "hutch pm run check",
    "check:examples": "hutch pm run check:examples",
    "test:project-boundary": "hutch pm run test",
    clean: "rm -rf dist .astro",
    deploy:
      'hutch pm run deploy --branch="$PAGES_BRANCH"',
  },
};
