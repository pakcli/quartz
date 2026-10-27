---
title: Master Brief - Quartz v5 Decoupled Runner Architecture
version: v01-01
target: framework-quartz
category: engine-framework-brief
status: draft
---

# 📌 Master Brief: Quartz v5 Decoupled Framework Engine

> **Document Path**: `brief/v01-01_quartzv5-decoupled-runner.md`  
> **Status**: Specification Engine (Decoupled Hub)  
> **Version**: `v01-01` (Strict 2-Octet Rule #004 Compliant)  
> **Official Engine Repo**: `https://github.com/pakcli/quartz`  
> **Active Engine Branch**: `v5-decoupled-content-architecture`  

---

## 📑 Table of Contents

1. [1. Engine Definition & Ecosystem Role](#1-engine-definition--ecosystem-role)
2. [2. The 3 Decoupled Execution & Compilation Modes](#2-the-3-decoupled-execution--compilation-modes)
3. [3. Operational Modes Summary & Dedicated Guide Handoff](#3-operational-modes-summary--dedicated-guide-handoff)
4. [4. Dynamic Homepage Entrypoint Resolution](#4-dynamic-homepage-entrypoint-resolution)
5. [5. Internal Documentation Quarantine (`brief/`)](#5-internal-documentation-quarantine-brief)
6. [6. Implemented Features: Dual Graph View](#6-implemented-features-dual-graph-view)

---

## 1. Engine Definition & Ecosystem Role

This repository serves as the **Central Decoupled Framework Engine Hub** (`https://github.com/pakcli/quartz`):
* **Standalone Compiler**: Maintains the Quartz v5 compiler engine, TypeScript source code, global styling, layout components, and transformer plugins (KaTeX, Dual-Mode Chemistry Orbital Graph, Hover Popovers, Search).
* **Interface Contract for Satellite Vaults**: Provides a clean compilation contract for external note repositories (*satellite vaults*). Satellite vaults never house framework dependencies or build scripts; instead, their notes are dynamically injected into `/content` during compilation.

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 2. The 3 Decoupled Execution & Compilation Modes

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   THE 3 DECOUPLED COMPILATION MODES                    │
├────────────────────────────────────────────────────────────────────────┤
│ [Mode 1: Local -> Local]                                               │
│ Local Notes Vault  ──(Local Path)──► Local Engine (framework-quartz)   │
│                                      │                                 │
│                                      ▼                                 │
│                                      localhost:8080 (Offline Preview)  │
├────────────────────────────────────────────────────────────────────────┤
│ [Mode 2: Local -> Framework in GitHub Server]                          │
│ Local Notes Vault  ──(Git Dispatch)─► GitHub Runner (pakcli/quartz)    │
│                                       │                                │
│                                       ▼                                │
│                                       Automated Remote Staging Build   │
├────────────────────────────────────────────────────────────────────────┤
│ [Mode 3: Repo Markdown -> Framework in GitHub Server (GitHub-to-GitHub)│
│ Satellite Repo     ──(Push Action)─► Clones pakcli/quartz on Runner    │
│                                      │                                 │
│                                      ▼                                 │
│                                      Deploy to GitHub Pages Artifact   │
└────────────────────────────────────────────────────────────────────────┘
```

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 3. Operational Modes Summary & Dedicated Guide Handoff

The decoupled architecture supports three distinct execution pipelines depending on developer environment and deployment targets.

| Mode | Pipeline Flow | Primary Invariant / Mechanism | Target Environment |
| :-: | :--- | :--- | :--- |
| **Mode 1** | Local Notes ➔ Local Engine | Local `-d` path mount; zero network/tokens required | `localhost:8080` (Pure Offline Dev) |
| **Mode 2** | Local Notes ➔ Cloud Engine | `gh workflow run` dispatch via GitHub CLI | Cloud GitHub Actions Staging |
| **Mode 3** | Repo Markdown ➔ GitHub Server | Pure Git push; native Pages artifact upload | Public `github.io` Production |

> [!TIP]
> 📖 **Actionable Step-by-Step Runbook**:  
> Per [[all-lads-tool/skill/dedicated-guide-specification.md|dedicated-guide-specification]], granular copy-paste installation commands, prerequisites, CLI parameters, and error troubleshooting are maintained in the dedicated user manual:  
> 👉 **[[GUIDE.md|Open Dedicated Operational Guide (GUIDE.md)]]**

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 4. Dynamic Homepage Entrypoint Resolution

To prevent 404 routing errors on the root path (`/`), the decoupled engine supports an automatic 3-tier fallback chain for satellite vaults:

| Priority Tier | Target File | Resolution Logic | Handling Layer |
| :-: | :--- | :--- | :--- |
| **Tier 1 (Default)** | `index.md` at vault root | Used immediately as the main landing page. | Quartz ContentPage Emitter |
| **Tier 2 (Fallback A)** | `README.md` at vault root | If `index.md` is absent, automatically mapped to act as the home entrypoint. | Runner Pre-Flight Step |
| **Tier 3 (Fallback B)** | First available `.md` | If neither exists, automatically discovers the first Markdown note and redirects the root URL `/` to it. | Runner Discovery + Quartz AliasRedirects |

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 5. Internal Documentation Quarantine (`brief/`)

All files located inside `brief/` (including standardized 2-octet versioned files matching `v01-01_*`) are internal engineering specifications:
* **Exclusion Invariant**: The `brief/` directory is strictly ignored during build and packaging.
* **Dual Protection Layer**:
  1. Filtered out during CI content synchronization (`rsync --exclude='brief'`).
  2. Blocked via `ignorePatterns: [..., "brief"]` in the configuration so internal files never emit to public static HTML.

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 6. Implemented Features: Dual Graph View

The engine includes an interactive dual-mode graph renderer:
1. **Context View (Default)**: Organic knowledge-graph network powered by D3 force-directed spring physics.
2. **Scientific View (Atomic Orbital View)**: Concentric planetary / electron shell model (`d3.forceRadial`) mapping nucleus concepts at the center with orbital rings ($K, L, M$ shells) for elements, covalent bonds for compounds (`H2O`, `CO2`), and outermost rings for everyday terminology.

[⬆️ Back to Table of Contents](#-table-of-contents)
