# Systems Scientist Research Hub & Electrobun Metasystem

A unified cybernetic workbench combining **Electrobun's ultra-lightweight desktop runtime** with a **Metasystemic Research Ingestion Engine**. Seamlessly federates across **multiple Google Drive accounts** and external data providers via the **Model Context Protocol (MCP)**, providing feedback loop modeling and 1-click frictionless deployment pipelines for non-technical users.

---

## 🌟 Core Architecture & Capabilities

### 1. Multi-Drive Federated Ingestion
- **Multi-Tenant Authentication:** Connect multiple Google Drive accounts simultaneously (Personal, Research Lab, Enterprise).
- **In-Memory Token Lifecycle:** Client-side OAuth with ephemeral memory storage. Zero credential persistence or server-side leakage.
- **Universal Search & Filtering:** Filter across all connected drives by mime types (Google Docs, PDFs, Sheets, Code, Ontologies).
- **Document Inspector & Ontology Extractor:** Deep document content inspection with instant extraction of causal relationships and cybernetic feedback dynamics.

### 2. Model Context Protocol (MCP) Gateway
- **Standardized Resource Addressing:** Exposes documents and files as canonical MCP URIs (`mcp://google-drive/<account>/<fileId>`).
- **Pre-Configured MCP Connectors:**
  - **Google Drive MCP Gateway:** Resource streams across authenticated accounts.
  - **Electrobun Desktop Host MCP:** Bridges windowing, micro-runtime bundles, and native cross-platform IPC.
  - **ArXiv Systems Science MCP:** Ingests systems dynamics, cybernetics, and complex adaptive systems preprints.
  - **GitHub Metasystem Bridge:** Tracks repository states, releases, and workflow automations.
- **Custom MCP Server Integration:** Dynamic SSE / WebSocket connector for attaching custom team MCP servers (Notion, Obsidian, PostgreSQL, microservices).

### 3. Cybernetic Causal Loop Simulation Engine
- **Stafford Beer's Viable System Model (VSM):** System 1 through System 5 layered architecture.
- **Balancing (B1) & Reinforcing (R1) Loops:** Dynamic tracking of cognitive load damping versus adoption rate acceleration.
- **Real-Time Interactive Canvas:** HTML5 Canvas particle simulation with live parameter adjustment:
  - *UI Abstraction Level* (Zero-CLI factor)
  - *Feedback Velocity*
  - *Cognitive Friction Damping Factor*
- **Continuous Metrics Charting:** Real-time Euler integration plots tracking Adoption Rate, Systemic Coherence, and Cognitive Load.

### 4. Zero-Friction Non-Tech Deployment
- **1-Click HTML Bundle Exporter:** Generates self-contained, zero-dependency interactive bundles runnable in any browser without installation or CLI configuration.
- **Autonomous Deployment Manifests:** Generates standardized `metasystem-mcp-deploy.json` configurations ready for automated CI/CD.

---

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) 1.4.2 (pinned in `package.json`) for dependency management and scripts
- Node.js 22+ for Node-based Astro, Wrangler, and release tooling
- Modern web browser (Chrome, Edge, Safari, Firefox)

### Developer Installation & Run

These setup steps are for contributors hosting the workbench. Research users can use the hosted workbench or an exported standalone HTML bundle without a terminal.

```bash
# Clone the repository
git clone https://github.com/371-Minds/electrobun.git
cd electrobun

# Install the exact workspace dependencies recorded in bun.lock
bun install --frozen-lockfile

# Start local development server on port 3000
bun run dev
```

Visit `http://localhost:3000` or navigate directly to the workbench at `/systems-research-hub/`.

### Verification & Preview

Run contributor commands from the repository root:

| Command | Purpose |
|---|---|
| `bun run lint` | Check Astro and TypeScript diagnostics |
| `bun run test` | Run package-manager and docs boundary regression tests |
| `bun run check` | Run lint, regression tests, and documentation example validation |
| `bun run build` | Generate the static site in `docs/dist` |
| `bun run preview` | Preview the built site on port 3000 |

Use `bun install` when intentionally changing dependencies and commit the resulting `bun.lock`; use `--frozen-lockfile` for repeatable installs and CI. The root lockfile covers the `docs` workspace. Native development in `package` and `kitchen` uses separate Bun lockfiles and still builds through **Hutch**, not an Electrobun executable in `node_modules` (see [BUILD.md](BUILD.md)).

Bun manages repository development dependencies; the dependency-free `npm/electrobun` bootstrap, npm registry publication/acceptance, and release versioning remain compatible with npm. Published templates retain their Hutch-owned dependency resolution.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | [Astro](https://astro.build/) & [Starlight](https://starlight.astro.build/) |
| **Package Manager** | [Bun](https://bun.sh/) with frozen lockfile installs |
| **Desktop Runtime** | [Electrobun](https://framework.blackboard.sh/electrobun/) (Cottontail & System WebViews) |
| **Authentication** | Google Workspace OAuth 2.0 (Client-side ephemeral) & Firebase Auth |
| **Protocol** | Model Context Protocol (MCP) JSON-RPC 2.0 Schema |
| **Visual Simulation** | HTML5 Canvas 2D Dynamic Physics Engine |
| **Language** | TypeScript |

---

## 📁 Repository Structure

```
├── docs/
│   ├── src/
│   │   ├── components/
│   │   │   └── SystemsResearchHub.astro   # Main research hub & simulation workbench
│   │   ├── lib/
│   │   │   ├── driveAuth.ts               # Multi-Drive ephemeral OAuth manager
│   │   │   ├── driveApi.ts                # Federated Google Drive v3 client
│   │   │   └── mcpRegistry.ts             # Model Context Protocol registry & gateway
│   │   └── content/docs/
│   │       ├── systems-research-hub.mdx   # Standalone Research Hub route
│   │       ├── index.mdx                  # Landing page & integrated hub
│   │       └── electrobun/                # Electrobun desktop runtime guides & APIs
│   ├── astro.config.mjs                   # Astro & Starlight configuration
│   └── package.json                       # Documentation workspace packages
├── package.json                           # Root monorepo workspace manifest
├── bun.lock                               # Reproducible root/docs dependency graph
├── AGENTS.md                              # AI Agent & Metasystemic architectural directives
└── README.md                              # Project documentation
```

---

## 📄 License
MIT License. Built for seamless research ingestion and zero-friction adoption across technical and non-technical stakeholders.
