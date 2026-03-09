# SPM Cloud Monorepo

This repository contains the SPM Cloud frontend applications managed as a **pnpm workspace** with **Nx** for task orchestration.

## Project Structure

```
spm-cloud-monorepo/
├── apps/
│   ├── spm-web-react/     # React + Vite application
│   └── spm-web-next/      # Next.js application
├── packages/              # Shared libraries (future use)
├── nx.json                # Nx configuration
├── pnpm-workspace.yaml    # Workspace definition
└── package.json           # Root scripts and dependencies
```

---

## Key Concepts

### What is pnpm?

[pnpm](https://pnpm.io/) is a fast, disk-efficient package manager for Node.js. Unlike npm, which copies packages into every project's `node_modules`, pnpm uses a **content-addressable store** and hard links. This means:

- Packages are downloaded once and shared across all projects on your machine
- `node_modules` folders are smaller and install faster
- Dependency resolution is stricter, which prevents "phantom dependency" bugs where code accidentally imports a package it doesn't explicitly depend on

### What is a pnpm workspace?

A **pnpm workspace** lets you manage multiple Node.js projects (called "workspace packages") in a single repository. Our workspace is defined in `pnpm-workspace.yaml`:

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

This tells pnpm that every folder inside `apps/` and `packages/` is its own project with its own `package.json`. When you run `pnpm install` from the root, pnpm:

1. Installs dependencies for **all** projects in one pass
2. Links projects together so they can import from each other without publishing to npm
3. Hoists shared dependencies to reduce duplication

### What is Nx?

[Nx](https://nx.dev/) is a build orchestration tool. In a monorepo with multiple apps, you need something smart enough to:

- **Run tasks in the right order** — if a shared library changes, Nx knows to rebuild it before rebuilding the apps that depend on it
- **Cache results** — if nothing changed in a project, Nx skips the build/test/lint and returns the cached result instantly
- **Run tasks in parallel** — independent projects build simultaneously

Without Nx, you'd have to manually coordinate builds across projects or write custom scripts. Nx handles this automatically by analyzing the dependency graph.

### Why do we need both?

- **pnpm** handles **package installation and linking** — it's the package manager
- **Nx** handles **task execution and caching** — it's the build orchestrator

They complement each other. pnpm makes sure dependencies are installed correctly across the workspace, and Nx makes sure tasks like `build`, `dev`, `test`, and `lint` run efficiently.

---

## Prerequisites

- **Node.js 22+** — this repo includes an `.nvmrc` file. If you use nvm:
  ```bash
  nvm use
  ```
- **pnpm** — install globally if you don't have it:
  ```bash
  npm install -g pnpm
  ```

## Getting Started

1. **Clone the repository**

   ```bash
   git clone git@github.com-elevate:elevate-doug/spm-cloud-monorepo.git
   cd spm-cloud-monorepo
   ```

2. **Set the correct Node version**

   ```bash
   nvm use
   ```

3. **Install all dependencies**

   ```bash
   pnpm install
   ```

   This installs dependencies for the root workspace and both apps in one command.

---

## Running the Apps

### React App (Vite)

```bash
pnpm run react
```

This starts the Vite dev server for `spm-web-react`. By default it runs on [http://localhost:5173](http://localhost:5173).

### Next.js App

```bash
pnpm run next
```

This starts the Next.js dev server for `spm-web-next`. By default it runs on [http://localhost:3000](http://localhost:3000).

### Run Both Apps Simultaneously

```bash
pnpm run dev
```

This uses Nx to start dev servers for all apps in parallel.

---

## Other Commands

| Command | Description |
| --- | --- |
| `pnpm run build` | Build all apps |
| `pnpm run lint` | Lint all apps |
| `pnpm run test` | Run tests across all apps |
| `pnpm run react` | Start the React (Vite) dev server |
| `pnpm run next` | Start the Next.js dev server |

You can also target a specific project directly with Nx:

```bash
# Build only the React app
npx nx build spm-web-react

# Test only the Next.js app
npx nx test spm-web-next
```
