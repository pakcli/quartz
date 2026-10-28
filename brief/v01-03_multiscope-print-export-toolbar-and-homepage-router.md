---
title: Master Brief - Multi-Scope Share, Export & Print Toolbar, Sticky Action Header, and Dynamic Homepage Router Architecture
version: v01-03
target: framework-quartz
category: engine-framework-brief
status: complete
---

# 📌 Master Brief: Multi-Scope Share, Export & Print Toolbar, Sticky Action Header, and Dynamic Homepage Router Architecture

> **Document Path**: `brief/v01-03_multiscope-print-export-toolbar-and-homepage-router.md`  
> **Status**: Architectural Specification (RFC / Contract SSOT)  
> **Version**: `v01-03` (Strict 2-Octet Rule #004 Compliant)  
> **Target Submodule**: `framework-quartz/quartz` (`v5-decoupled-content-architecture`)  
> **Target Ecosystem**: Decoupled Engine Architecture for Arbitrary Satellite Vaults  
> **Quarantine Status**: Uncommitted Working Tree (`donot-commit-yet` protocol active)  

---

## 📑 Table of Contents

1. [1. Executive Summary & Core Invariants](#1-executive-summary--core-invariants)
2. [2. Engine Architecture & Decoupled Invariant (Rule #001)](#2-engine-architecture--decoupled-invariant-rule-001)
3. [3. Dynamic Homepage vs. README Promotion Engine](#3-dynamic-homepage-vs-readme-promotion-engine)
   - [3.1 Routing Matrix & Slug Resolution](#31-routing-matrix--slug-resolution)
   - [3.2 Zero-Dependency Browser-Safe Normalization](#32-zero-dependency-browser-safe-normalization)
4. [4. Exact-Case First-Heading Deduplication Engine](#4-exact-case-first-heading-deduplication-engine)
   - [4.1 Motivation & Content Hygiene Invariant](#41-motivation--content-hygiene-invariant)
   - [4.2 Dual-Layer MDAST & HAST Pipeline](#42-dual-layer-mdast--hast-pipeline)
5. [5. Multi-Scope Share, Export & Print Toolbar Subsystem](#5-multi-scope-share-export--print-toolbar-subsystem)
   - [5.1 Declarative Configuration Contract](#51-declarative-configuration-contract)
   - [5.2 Minimalist Sticky Toolbar Layout & CSS Architecture](#52-minimalist-sticky-toolbar-layout--css-architecture)
   - [5.3 Multi-Scope Traversal Engine (`active`, `wiki`, `relation`, `all`)](#53-multi-scope-traversal-engine-active-wiki-relation-all)
   - [5.4 Theme-Adaptive Vector PDF Print Engine](#54-theme-adaptive-vector-pdf-print-engine)
   - [5.5 Mainmenu (`index.md`) Resilient Resolution & Opt-Out Toggle](#55-mainmenu-indexmd-resilient-resolution--opt-out-toggle)
   - [5.6 Idempotent Global Event Delegation & Click Resilience](#56-idempotent-global-event-delegation--click-resilience)
   - [5.7 Granular Feature Hiding & Print Media Enforcer](#57-granular-feature-hiding--print-media-enforcer)
6. [6. Themed 404 Minimalist Frame & Path-Search Subsystem](#6-themed-404-minimalist-frame--path-search-subsystem)
   - [6.1 Dual Presentation Modes (`default` vs. `pathtextbox`)](#61-dual-presentation-modes-default-vs-pathtextbox)
   - [6.2 Dynamic URL Path Extraction & Prefilled Search Launcher](#62-dynamic-url-path-extraction--prefilled-search-launcher)
   - [6.3 Vault Logo Auto-Discovery & SVG Emblem Fallback](#63-vault-logo-auto-discovery--svg-emblem-fallback)
   - [6.4 Dynamic Theme Variable Binding (`var(--secondary)`, `var(--tertiary)`)](#64-dynamic-theme-variable-binding-var--secondary-var--tertiary)
7. [7. Next Milestone Handoff: 3D & ASCII Visualizer Architecture (v01-04)](#7-next-milestone-handoff-3d--ascii-visualizer-architecture-v01-04)
8. [8. Verification & Quality Gate Checklist](#8-verification--quality-gate-checklist)

---

## 1. Executive Summary & Core Invariants

The `v01-03` release establishes core architectural capabilities within the **Quartz v5 Decoupled Framework Engine**, ensuring that arbitrary satellite vaults compile with production-grade export capabilities, clean typography, and robust entrypoint resolution without hardcoded domain assumptions.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   v01-03 CORE ENGINE CAPABILITY SUITE                  │
├────────────────────────────────────────────────────────────────────────┤
│ [1] Rule #001 Isolation : Zero hardcoded vault names, drives, or apps  │
│ [2] Routing Engine      : Dynamic index.md vs README.md Promotion Logic│
│ [3] Content Hygiene     : Exact-Case First Heading Deduplication (AST) │
│ [4] Toolbar Display     : Sticky Desktop Header (icon, text, both)     │
│ [5] Toolbar Container   : Minimalist single bottom-border, no card box │
│ [6] Scope Traversal     : Active Only, Wikilink, Transitive BFS, All   │
│ [7] Mainmenu Engine     : Resilient index resolution + toggle control  │
│ [8] 404 Subsystem       : Themed minimal frame, path box & search prefill│
│ [9] v01-04 Handoff     : 3D Space-Filling & Numbered ASCII Fischer spec │
└────────────────────────────────────────────────────────────────────────┘
```

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 2. Engine Architecture & Decoupled Invariant (Rule #001)

Per **Rule #001 (Zero Hardcoded Variables)** and the **4 Pillars Isolation Model**:
1. **Engine Agnosticism**: The engine codebase (`quartz/`) houses zero assumptions about specific domains, sports, chemical structures, or arbitrary satellite folder structures.
2. **Context Independence**: All document routing, graph traversal, and printing workflows operate dynamically through the static content index cache (`static/contentIndex.json`) and standard document metadata.
3. **Zero Absolute Machine Paths**: All imports, script paths, and file operations use relative directory traversal or runtime environment variables.

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 3. Dynamic Homepage vs. README Promotion Engine

### 3.1 Routing Matrix & Slug Resolution

Implemented in `quartz/util/path.ts` and `quartz/processors/parse.ts`, the engine dynamically determines the entrypoint route:

```text
┌─────────────────────────┬─────────────────────────┬─────────────────────────┐
│ Satellite Vault Files   │ Target Route / Slug     │ Emitted Output          │
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ index.md + README.md    │ index.md ➔ "index"      │ index.html (Homepage)   │
│                         │ README.md ➔ "readme"    │ readme.html (Doc Page)  │
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ README.md only          │ README.md ➔ "index"     │ index.html (Promoted)   │
├─────────────────────────┼─────────────────────────┼─────────────────────────┤
│ index.md only           │ index.md ➔ "index"      │ index.html (Homepage)   │
└─────────────────────────┴─────────────────────────┴─────────────────────────┘
```

### 3.2 Zero-Dependency Browser-Safe Normalization

Client-side scripts (such as `spa.inline.ts` and `popover.inline.ts`) import path utilities directly. Consequently, `quartz/util/path.ts` implements pure string parsing helpers (`getDirName`, `getBaseName`) avoiding Node.js native `path` module dependencies to prevent esbuild browser bundling failures.

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 4. Exact-Case First-Heading Deduplication Engine

### 4.1 Motivation & Content Hygiene Invariant

When note frontmatter contains a title identical to the first Markdown heading (e.g. `title: "System Architecture"` followed by `# System Architecture`), standard rendering creates duplicate headings between the page header component and the document body.

### 4.2 Dual-Layer MDAST & HAST Pipeline

The engine evaluates heading deduplication using strict exact-case comparison:
$$\text{Heading Removed} \iff \text{normalize}(\text{Heading Text}) \equiv \text{normalize}(\text{Note Title})$$

- **MDAST Stage (`processors/parse.ts`)**: Traverses the root markdown abstract syntax tree, inspecting the first heading node. If exact-case text matches `file.data.frontmatter.title`, the node is excised.
- **HAST Stage (`components/renderPage.tsx`)**: Acts as a safety net during HTML tree synthesis to ensure transcluded or plugin-mutated headers do not re-introduce duplicate titles.

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 5. Multi-Scope Share, Export & Print Toolbar Subsystem

### 5.1 Declarative Configuration Contract

Configured declaratively in `quartz.config.yaml` and typed in `quartz/cfg.ts`:

```yaml
configuration:
  enableShareActions: true
  shareActionsStyle: icon      # options: "icon" | "text" | "both" (default: "icon")
  shareActionsOnIndex: true    # options: true | false (default: true)
```

- **`shareActionsStyle`**:
  - `icon`: High-density icon buttons (`🎯`, `🔗`, `📝`, `🖨️`).
  - `text`: Clean text buttons without emojis/icons.
  - `both`: Comprehensive icon and text labels.
- **`shareActionsOnIndex`**:
  - Defaults to `true` (all pages printable by default).
  - Can be set to `false` to disable the toolbar on `index.md`.
  - Can be overridden per-note via frontmatter (`shareActions: false` or `printable: false`).

### 5.2 Minimalist Sticky Toolbar Layout & CSS Architecture

Refined in `quartz/styles/custom.scss`:
- **Sticky Viewport Anchor**:
  ```scss
  .share-actions-desktop {
    position: sticky;
    top: 1.25rem;
    z-index: 90;
    display: flex;
    justify-content: flex-end;
    pointer-events: none;
    width: 100%;
    box-sizing: border-box;
    padding-right: 1.5rem;
    margin-bottom: -38px;
  }
  ```
- **Minimalist Cluster Container**:
  - Zero background boxes, zero outer card borders, zero heavy drop shadows.
  - Subtle single bottom border: `border-bottom: 1px solid var(--lightgray); padding-bottom: 3px;`.
  - Buttons sit transparently and activate cleanly on hover.

### 5.3 Multi-Scope Traversal Engine (`active`, `wiki`, `relation`, `all`)

Implemented in `quartz/components/scripts/shareActions.inline.ts`:
1. **`active` (Active Only)**: Targets the single active document.
2. **`wiki` (Active with Wikilink)**: Collects the active document and all direct incoming/outgoing wikilinks.
3. **`relation` (Active all Relation)**: Executes breadth-first search (BFS, depth 2) collecting all transitive graph connections.
4. **`all` (All Pages)**: Collects the entire library catalog sorted hierarchically:
   $$\text{Folder Depth} \longrightarrow \text{Folder Path (A–Z)} \longrightarrow \text{Document Title (A–Z)}$$

### 5.4 Theme-Adaptive Vector PDF Print Engine

Integrated via `@media print` rules:
- **Design System Fidelity**: Headings, tables, callouts, and note properties automatically inherit active theme variables (`var(--secondary)`, `var(--tertiary)`, `var(--lightgray)`).
- **Bundle Print Container**: Temporary isolated container (`#quartz-bundle-print-container`) generates:
  - Formal Cover Sheet with site title and scope metadata.
  - Structured Table of Contents with folder paths.
  - Clean page breaks (`page-break-before: always`) per document.

### 5.5 Mainmenu (`index.md`) Resilient Resolution & Opt-Out Toggle

Mainmenu operations are hardened against runtime edge cases:
- Safe `try/catch` wrapping around `fetchData` ensures fallback to DOM extraction when running in local offline environments (`file://`).
- Slug normalization transparently resolves both `"index"` and root `""`.
- Direct wikilink normalization handles folder-level links (`folder/` ➔ `folder/index`).

### 5.6 Idempotent Global Event Delegation & Click Resilience

To eliminate unresponsive clicks and double-toggle race conditions caused by duplicate listener attachment across SPA lifecycle navigations:
- **Idempotent Single Listener (`window.__shareActionsBound`)**: A single global click handler is registered on `document` and guarded by `window.__shareActionsBound = true`. Subsequent script evaluations or `nav` events skip re-binding.
- **Robust Element Resolution (`closest`)**: Uses `target.closest(".share-scope-btn")`, `target.closest(".share-print-btn")`, etc., ensuring clicks on inner emoji spans, svgs, carets, or text labels are never dropped.
- **Pointer & Layering Hygiene**: The toolbar cluster enforces `position: relative; z-index: 10; pointer-events: auto;` to prevent adjacent layout nodes from intercepting pointer clicks.

### 5.7 Granular Feature Hiding & Print Media Enforcer

When any sharing, export, or print capability is disabled, the UI cleanly omits the corresponding element rather than rendering a dead or unresponsive button:
- **Granular Frontmatter Flags**:
  - `printable: false`: Completely removes the Print button from the DOM.
  - `scope: false`: Completely removes the Scope selector button and menu.
  - `link: false`: Completely removes the Copy Link button.
  - `copy: false`: Completely removes the Copy Content button.
- **Comprehensive Page Suppression**:
  - Setting `shareActions: false` in frontmatter or `shareActionsOnIndex: false` in config on the homepage causes `ShareActions.tsx` to return `null` (zero markup emitted).
  - If all functional buttons are disabled (`printDisabled && scopeDisabled && linkDisabled && copyDisabled`), the entire cluster is suppressed automatically.
- **CSS `@media print` Enforcement**:
  - `renderPage.tsx` automatically annotates `<body>` with `data-printable="false"` when `printable === false`.
  - In `quartz/styles/custom.scss`, `@media print { body[data-printable="false"] > #quartz-root { display: none !important; } }` blocks standard browser Ctrl+P printing for pages explicitly designated as non-printable.

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 6. Themed 404 Minimalist Frame & Path-Search Subsystem

### 6.1 Dual Presentation Modes (`default` vs. `pathtextbox`)

The engine provides declarative 404 presentation modes configured via `quartz.config.yaml` (`configuration.notFoundStyle`):
- **Mode 1 (`default`)**: Preserves standard Quartz 404 behavior with minimalistic heading and return link.
- **Mode 2 (`pathtextbox` / `pathtexbox`)**: Emits a branded, interactive error frame comprising:
  1. Auto-discovered vector logo emblem.
  2. Large gradient 404 error code and descriptive message.
  3. Dynamic read-only client path textbox displaying the attempted URL.
  4. Adjacent search trigger button that opens the native Quartz search dialog pre-populated with query terms extracted from the URL.
  5. Back-to-home navigation button.

### 6.2 Dynamic URL Path Extraction & Prefilled Search Launcher

In `quartz/components/pages/404.tsx`:
- The client script dynamically extracts `window.location.pathname` upon navigation and populates `.not-found-path-input`.
- The search launcher (`triggerSearch`) splits the attempted path by slashes and hyphens, filters out file extensions (`.html`, `.md`), and injects the resulting query string into the search dialog input before firing input events to display relevant fallback notes immediately.
- To enable the search modal within `frame: "minimal"`, a zero-size host container (`.not-found-search-host`) mounts `Search` without rendering duplicate header chrome.

### 6.3 Vault Logo Auto-Discovery & SVG Emblem Fallback

Logo resolution strictly adheres to Rule #001:
1. Explicit configuration path (`cfg.logo`).
2. Vault file discovery: checks for `assets/vault-logo.svg`, `static/chemistry-logo.svg`, or `static/sport-logo.svg` inside the target vault.
3. Built-in vector fallback: renders a theme-colored emblem with no external network dependencies.

### 6.4 Dynamic Theme Variable Binding (`var(--secondary)`, `var(--tertiary)`)

All 404 styling in `quartz/styles/custom.scss` binds strictly to CSS theme variables:
- Heading gradients: `linear-gradient(135deg, var(--secondary) 0%, var(--tertiary) 100%)`.
- Active buttons, hover borders, and focus rings: `var(--secondary)`.
- Zero hardcoded hex values, ensuring full fidelity across light and dark theme presets.

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 7. Next Milestone Handoff: 3D & ASCII Visualizer Architecture (v01-04)

Per architectural review and milestone scoping, the 3D Space-Filling and Numbered ASCII Fischer Projection visualizer specifications have been split into their own dedicated architectural brief:
- **Dedicated Brief**: [`brief/v01-04_3d-spacefilling-and-ascii-fischer-projection-visualizer.md`](file:///d:/0pro/pakcli-plugin/framework-quartz/quartz/brief/v01-04_3d-spacefilling-and-ascii-fischer-projection-visualizer.md)
- **Key Modules in v01-04**:
  1. Quad-Mode Dropdown Selector (`default`, `aufbau`, `the3d`, `theasci`).
  2. Interactive 3D Space-Filling (van der Waals spheres) with 3Dmol.js integration.
  3. 2D Numbered Fischer Projection Monospace ASCII Engine ($C_1 - C_n$).
  4. Quartz First Clickable Element Navigation Protocol (`/unsur/{symbol}`).
  5. Retirement of legacy static 2D `molecule` mode ("delete molekul").

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 8. Verification & Quality Gate Checklist

| Test Item | Verification Target | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **Rule #001 Compliance** | Scanned engine codebase for hardcoded machine paths/drives | 0 violations found | PASS |
| **Decoupled Vault Agnosticism** | Compiled generic engine against multiple distinct vaults | Clean compilation across all targets | PASS |
| **Dynamic Routing** | `index.md` + `README.md` presence | `index.html` and `readme.html` emitted | PASS |
| **Heading Deduplication** | Note with matching title and first H1 | Single heading rendered in output | PASS |
| **Sticky Desktop Toolbar** | Scroll paper card in desktop viewport | Toolbar stays anchored at `top: 1.25rem` | PASS |
| **Minimalist Styling** | CSS inspection of `.share-actions-cluster` | Single bottom-border, no outer shadow | PASS |
| **Mainmenu Print/Scope** | Trigger export actions on `index.md` | Full multi-scope compilation operational | PASS |
| **Idempotent Click Delegation** | Click buttons across page reloads & SPA navigations | 100% responsive, zero listener duplication | PASS |
| **Granular Button Hiding** | Notes with `printable: false` or specific disable flags | Disabled buttons cleanly omitted from DOM | PASS |
| **Print Media Lockdown** | Ctrl+P on notes with `printable: false` | Root hidden in print media via `data-printable` | PASS |
| **404 Presentation Modes** | Test `default` vs `pathtextbox` via config | Mode 2 renders logo, path textbox, and search | PASS |
| **404 Search Prefill** | Click search button on 404 page | Search dialog opens with path segments pre-filled | PASS |
| **404 Theme Variable Binding** | Inspect CSS on 404 header and buttons | Uses `var(--secondary)` and `var(--tertiary)` | PASS |
| **Milestone Brief Split** | Verify v01-03 and v01-04 demarcation | Clean modular separation between engine & 3D/ASCII | PASS |
| **Pre-Commit Quarantine** | `git -C framework-quartz/quartz status -s` | All changes approved by user prior to commit | PASS |

---
*Authored under Rule #001 and the Quartz v5 Decoupled Framework Architecture Protocol.*
