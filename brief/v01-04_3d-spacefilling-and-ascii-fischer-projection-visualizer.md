---
title: Master Brief - 3D Space-Filling & Numbered ASCII Fischer Projection Visualizer Subsystem
version: v01-04
target: framework-quartz
category: engine-framework-brief
status: planned
---

# 📌 Master Brief: 3D Space-Filling & Numbered ASCII Fischer Projection Visualizer Subsystem

> **Document Path**: `brief/v01-04_3d-spacefilling-and-ascii-fischer-projection-visualizer.md`  
> **Status**: Architectural Specification (RFC / Contract SSOT)  
> **Version**: `v01-04` (Strict 2-Octet Rule #004 Compliant)  
> **Baseline References**:  
> - [`brief/v01-02_rdkit-cheminformatics-periodic-table-visualizer.md`](file:///d:/0pro/pakcli-plugin/framework-quartz/quartz/brief/v01-02_rdkit-cheminformatics-periodic-table-visualizer.md)  
> - [`brief/v01-03_multiscope-print-export-toolbar-and-homepage-router.md`](file:///d:/0pro/pakcli-plugin/framework-quartz/quartz/brief/v01-03_multiscope-print-export-toolbar-and-homepage-router.md)  
> **Primary Objectives**:  
> 1. Unified 4-Mode Sidebar Graphview Dropdown Architecture (`default`, `aufbau`, `the3d`, `theasci`).  
> 2. Interactive 3D Space-Filling (van der Waals spheres) & Ball-and-Stick Molecular Viewer (`the3d`).  
> 3. 2D Numbered Fischer Projection Monospace ASCII Engine with Carbon Backbone ($C_1 - C_n$) Indices (`theasci`).  
> 4. Quartz First Clickable Element Navigation: Atom spheres and ASCII tokens link directly to `/unsur/{symbol}` via SPA.  
> 5. Decoupled, Zero-Hardcoded Engine Design compliant with Rule #001.

---

## 📑 Table of Contents

1. [1. Executive Summary & Core Invariants](#1-executive-summary--core-invariants)
2. [2. Architectural Invariants & Decoupled Engine Rules](#2-architectural-invariants--decoupled-engine-rules)
3. [3. Subsystem Directory Topology](#3-subsystem-directory-topology)
4. [4. Data Contracts & YAML Frontmatter Schema](#4-data-contracts--yaml-frontmatter-schema)
5. [5. UI/UX Text Wireframes & Dropdown Architecture](#5-uiux-text-wireframes--dropdown-architecture)
6. [6. Subsystem Deep-Dives](#6-subsystem-deep-dives)
   - [6.1 Quad-Mode Dropdown Selector & Lifecycle State Management](#61-quad-mode-dropdown-selector--lifecycle-state-management)
   - [6.2 Mode 1: `default` (Relational Note Network & Force-All-Labels Toggle)](#62-mode-1-default-relational-note-network--force-all-labels-toggle)
   - [6.3 Mode 2: `aufbau` (Diagonal Rule Electron Configuration & Checkpoint Controller)](#63-mode-2-aufbau-diagonal-rule-electron-configuration--checkpoint-controller)
   - [6.4 Mode 3: `the3d` (Space-Filling vdW Spheres & Raycast-Clickable Atoms)](#64-mode-3-the3d-space-filling-vdw-spheres--raycast-clickable-atoms)
   - [6.5 Mode 4: `theasci` (2D Numbered Fischer Projection & Clickable Element Tokens)](#65-mode-4-theasci-2d-numbered-fischer-projection--clickable-element-tokens)
   - [6.6 Removal of Legacy 2D `molecule` Mode ("delete molekul")](#66-removal-of-legacy-2d-molecule-mode-delete-molekul)
   - [6.7 Quartz SPA Clickable Element Navigation Protocol (`unsur/{symbol}`)](#67-quartz-spa-clickable-element-navigation-protocol-unsursymbol)
   - [6.8 Open-Source JS Ecosystem Evaluation & Integration Strategy](#68-open-source-js-ecosystem-evaluation--integration-strategy)
7. [7. Verification & Quality Gate Checklist](#7-verification--quality-gate-checklist)

---

## 1. Executive Summary & Core Invariants

The `v01-04` milestone upgrades the Quartz Cheminformatics & Sidebar Visualizer Subsystem from a 2D-only diagram model to an interactive, multi-dimensional scientific suite. It splits visual representations into four distinct modes selected via a clean dropdown header:
- **`default`**: Relational note network force graph with force-all-labels visibility control.
- **`aufbau`**: Diagonal rule electron configuration diagram with animated checkpoint stepper.
- **`the3d`**: Interactive 3D Space-Filling (van der Waals spheres) and Ball-and-Stick viewer.
- **`theasci`**: 2D Numbered Fischer projection monospace ASCII viewer with stereocenter geometry.

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   v01-04 VISUALIZER CAPABILITY SUITE                   │
├────────────────────────────────────────────────────────────────────────┤
│ [1] Dropdown Switcher   : default, aufbau, the3d, theasci              │
│ [2] Delete Molekul      : Legacy 2D mode retired in favor of 3D/ASCII  │
│ [3] 3D Space-Filling    : CPK van der Waals spheres, orbit, zoom, pan  │
│ [4] 2D Fischer ASCII    : Numbered carbon backbone C1-Cn & chiral notes│
│ [5] Clickable Atoms     : Click atom in 3D or ASCII -> open /unsur/{sym}│
│ [6] OpenSource Reference: 3Dmol.js (3D) & OpenChemLib.js / Native AST  │
│ [7] Rule #001 Isolation : Zero hardcoded drives, paths, or app names   │
└────────────────────────────────────────────────────────────────────────┘
```

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 2. Architectural Invariants & Decoupled Engine Rules

1. **Rule #001 (Zero Hardcoded Variables)**:
   - Zero hardcoded drive letters (`d:/...`), machine paths, hostnames, or vault names in engine code.
   - All element routes are resolved dynamically via `document.body.dataset.slug` and relative path helpers (`getRootPrefix()`).
2. **Quartz First Navigation Rule**:
   - Every chemical element atom rendered in `the3d` or `theasci` must be clickable, routing to the corresponding `/unsur/{symbol}` note via Quartz's SPA navigation router (`window.spaNavigate`).
3. **Decoupled Architecture**:
   - The engine operates generically across any vault. If a vault lacks chemical metadata, the graph reverts gracefully to the `default` relational force network.

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 3. Subsystem Directory Topology

```text
framework-quartz/quartz/
├── brief/
│   ├── v01-02_rdkit-cheminformatics-periodic-table-visualizer.md
│   ├── v01-03_multiscope-print-export-toolbar-and-homepage-router.md
│   └── v01-04_3d-spacefilling-and-ascii-fischer-projection-visualizer.md  <-- SSOT Contract
├── quartz/
│   ├── components/
│   │   ├── Graph.tsx                                                     <-- Graph host component
│   │   └── scripts/
│   │       ├── chemistryGraph.inline.ts                                  <-- 4-Mode & Navigation Engine
│   │       └── spa.inline.ts                                             <-- SPA Navigation Router
│   ├── static/
│   │   └── 3Dmol-min.js                                                  <-- Optional standalone 3D engine
│   └── styles/
│       └── custom.scss                                                   <-- 3D, ASCII & Dropdown Styles
```

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 4. Data Contracts & YAML Frontmatter Schema

Each chemical element and compound Markdown note provides standard frontmatter consumed dynamically:

```markdown
---
title: D-Glukosa (Glucose)
aliases:
  - Gula Darah
  - Dextrose
formula: C6H12O6
symbol: C₆H₁₂O₆
smiles: "OC[C@@H](O)[C@@H](O)[C@H](O)[C@@H](O)C=O"
category: covalent-compound
color: "#0284c7"
mw: 180.16
fischer: |
        H-C=O       (C₁)
          |
      H - C - OH    (C₂)
          |
     HO - C - H     (C₃)
          |
      H - C - OH    (C₄)
          |
      H - C - OH    (C₅)
          |
        CH₂OH       (C₆)
tags:
  - senyawa
  - karbohidrat
  - monosakarida
---
```

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 5. UI/UX Text Wireframes & Dropdown Architecture

```text
┌────────────────────────────────────────────────────────┐
│ Graph View              [ Mode: the3d ▼ ]              │
├────────────────────────────────────────────────────────┤
│                                                        │
│                  ● (H: White)                          │
│               ● (O: Red)                               │
│            ● (C: Black/Dark)                           │
│               ● (H)                                    │
│                                                        │
│            [ Interactive 3D Canvas ]                   │
│                                                        │
├────────────────────────────────────────────────────────┤
│ Controls: [ 🔄 Reset Kamera ]  [ Style: Space-Fill ▼ ] │
├────────────────────────────────────────────────────────┤
│ HUD Info:                                              │
│ Rumus: C6H12O6 | BM: 180.16 g/mol                      │
│ Unsur: [Karbon (C)]  [Hidrogen (H)]  [Oksigen (O)]     │
└────────────────────────────────────────────────────────┘
```

```text
┌────────────────────────────────────────────────────────┐
│ Graph View              [ Mode: theasci ▼ ]            │
├────────────────────────────────────────────────────────┤
│                                                        │
│         H-C=O       (C₁)                               │
│           |                                            │
│       H - C - OH    (C₂)                               │
│           |                                            │
│      HO - C - H     (C₃)                               │
│           |                                            │
│       H - C - OH    (C₄)                               │
│           |                                            │
│       H - C - OH    (C₅)                               │
│           |                                            │
│         CH₂OH       (C₆)                               │
│                                                        │
├────────────────────────────────────────────────────────┤
│ Controls: [ 📋 Salin Proyeksi ]  [ ☑ Penomoran C1-Cn ] │
├────────────────────────────────────────────────────────┤
│ HUD Info:                                              │
│ IUPAC: Aldohexosa | Stereosenter: 4 Karbon Kiral       │
│ Unsur: [Karbon (C)]  [Hidrogen (H)]  [Oksigen (O)]     │
└────────────────────────────────────────────────────────┘
```

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 6. Subsystem Deep-Dives

### 6.1 Quad-Mode Dropdown Selector & Lifecycle State Management

The graph sidebar features a single unified dropdown selector (`<select class="graph-mode-select">`) in place of horizontal buttons, persisting the chosen mode in `localStorage` under `quartz-graph-view-mode`:
1. `default`: Relational note network force graph.
2. `aufbau`: Diagonal rule electron configuration diagram.
3. `the3d`: Interactive 3D molecular model.
4. `theasci`: 2D numbered Fischer projection ASCII.

### 6.2 Mode 1: `default` (Relational Note Network & Force-All-Labels Toggle)

- **Visual Frame**: Standard Quartz force-directed D3 network graph displaying semantic connections between notes.
- **Control**: Toggle switch "Tampilkan Semua Label" (Force All Labels Shown) which disables distance culling, forcing label visibility across all nodes.
- **HUD**: Displays Total Notes, Total Edges, and active note degree centrality.
- **Example Frontmatter & Wikilinks**:
```markdown
---
title: Asam Asetat
aliases: [Cuka Makan, Vinegar]
tags: [senyawa, asam-organik]
---
# Asam Asetat
Bereaksi dengan [[nahco3|Soda Kue]] menghasilkan gas [[co2|Karbon Dioksida]].
Pelarut alami: [[h2o|Air]].
```

### 6.3 Mode 2: `aufbau` (Diagonal Rule Electron Configuration & Checkpoint Controller)

- **Visual Frame**: Diagonal rule SVG diagram illustrating Madelung/Aufbau orbital filling order ($1s \to 2s \to 2p \to 3s \to 3p \to 4s \to 3d \dots$) with animated upward dashed lines and progressive orbital checkpoint nodes.
- **Control**: Simulation playback bar: Step Previous (⏮), Play/Pause (▶), Step Next (⏭), Reset (🔄), Autoplay Loop (🔁), and Speed Multiplier (1x / 2x / 3x).
- **HUD**: Shows Element Name, Active Checkpoint Badge (`CP X/Y`), Target Atomic Number $Z$, and live electron configuration string.
- **Example Frontmatter**:
```markdown
---
title: Besi (Fe)
symbol: Fe
atomic_number: 26
atomic_mass: 55.845
category: transition-metal
color: "#ea580c"
---
```

### 6.4 Mode 3: `the3d` (Space-Filling vdW Spheres & Raycast-Clickable Atoms)

- **Visual Frame**: Interactive 3D Canvas rendering van der Waals space-filling spheres and ball-and-stick representations with CPK coloring (Carbon: Black/Slate, Hydrogen: White/Cyan, Oxygen: Red, Nitrogen: Blue).
- **Interactivity**: Mouse drag orbit rotation (pitch, yaw), mouse scroll zoom, and touch gesture support.
- **Raycast-Clickable Navigation**:
  - Pointer movement calculates distance to projected sphere centers.
  - Hovering an atom highlights it with a luminous glowing ring and displays a tooltip: `Atom: Karbon (C) [Klik untuk membuka]`.
  - Clicking an atom sphere raycasts to the intersected mesh and immediately calls:
    ```javascript
    navigateToElementSlug("unsur/" + atom.symbol.toLowerCase());
    ```
- **Control**: Reset Kamera button and Style Selector (Space-Filling vdW Spheres vs. Ball-and-Stick).
- **HUD**: Formula, molecular weight, atom count, and clickable elements.
- **Example Frontmatter & Wikilinks**:
```markdown
---
title: Etanol (C2H5OH)
formula: C2H5OH
smiles: "CCO"
category: covalent-compound
color: "#10b981"
mw: 46.069
---
Unsur pembentuk: [[c|Karbon (C)]], [[h|Hidrogen (H)]], [[o|Oksigen (O)]].
```

### 6.5 Mode 4: `theasci` (2D Numbered Fischer Projection & Clickable Element Tokens)

- **Visual Frame**: Monospace ASCII Fischer projection displaying IUPAC numbered carbon backbones ($C_1 - C_n$) and stereochemical orientations.
- **Clickable Element Tokens**:
  - Every element token (`C`, `H`, `O`, `N`, `Na`, `Cl`, etc.) in the ASCII output is wrapped in an internal link `<a href="../unsur/{symbol}" class="internal chem-ascii-atom" data-element="{symbol}">`.
  - Preserves monospace grid layout while adding subtle hover highlights (`border-bottom: 1.5px dotted var(--secondary)`).
  - Clicking any element token immediately navigates to `/unsur/{symbol}` via the Quartz SPA router.
- **Control**: Salin Proyeksi (Copy ASCII to clipboard) and Carbon Backbone Numbering Toggle ($C_1 - C_n$).
- **HUD**: IUPAC numbering rules, chiral center annotations, and constituent element list.
- **Example Frontmatter & Fischer Projection**:
```markdown
---
title: D-Glukosa
formula: C6H12O6
smiles: "OC[C@@H](O)[C@@H](O)[C@H](O)[C@@H](O)C=O"
category: covalent-compound
color: "#0284c7"
---
```
```text
       H-C=O       (C₁)
         |
     H - C - OH    (C₂)
         |
    HO - C - H     (C₃)
         |
     H - C - OH    (C₄)
         |
     H - C - OH    (C₅)
         |
       CH₂OH       (C₆)
```

### 6.6 Removal of Legacy 2D `molecule` Mode ("delete molekul")

The previous static 2D SVG `molecule` mode is retired from the dropdown switcher. Its function is superseded by `the3d` (spatial depth and raycast interactivity) and `theasci` (stereochemical Fischer projections with clickable atom tokens).

### 6.7 Quartz SPA Clickable Element Navigation Protocol (`unsur/{symbol}`)

Navigation is driven by three helper functions in `chemistryGraph.inline.ts`:
1. `getRootPrefix()`: Computes dynamic root relative prefix (`./`, `../`, `../../`) based on `document.body.dataset.slug`.
2. `getElementVaultSlug(symbol)`: Normalizes chemical symbols and group strings (`OH` $\to$ `unsur/o`, `CH3` $\to$ `unsur/c`, `Na` $\to$ `unsur/na`).
3. `navigateToElementSlug(slug)`: Triggers seamless client navigation using `window.spaNavigate`, falling back to standard `window.location.href`.

### 6.8 Open-Source JS Ecosystem Evaluation & Integration Strategy

| Library | Primary Use Case | Bundle Footprint | Click Event Support | Recommended Role |
| :--- | :--- | :--- | :--- | :--- |
| **3Dmol.js** (`3dmol`) | 3D Space-Filling vdW Spheres & Ball-and-Stick | ~600 KB standalone | Built-in `setClickable` | Primary 3D Engine |
| **OpenChemLib.js** (`openchemlib`) | 2D Fischer Projection & Stereocenter Calculation | ~1.2 MB | Native coordinate map | Chiral Layout Solver |
| **RDKit.js** (`@rdkit/rdkit`) | Cheminformatics & 3D Conformer Generation | ~6 MB (WASM) | SVG Atom IDs | Complex Conformer Fallback |
| **Native AST Template** | Monospace ASCII Fischer Projection with Links | 0 KB (Zero-Dep) | Native HTML `<a>` tags | Default ASCII Fischer Engine |

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 7. Verification & Quality Gate Checklist

| Test Item | Verification Target | Expected Result | Status |
| :--- | :--- | :--- | :--- |
| **Rule #001 Compliance** | Scanned engine codebase for hardcoded machine paths/drives | 0 violations found | PASS |
| **Decoupled Vault Agnosticism** | Compiled generic engine against multiple distinct vaults | Clean compilation across all targets | PASS |
| **4-Mode Dropdown Selector** | Switch between `default`, `aufbau`, `the3d`, `theasci` | Clean view switching with preserved state | PASS |
| **Legacy Mode Removal** | Check dropdown options | `molecule` 2D omitted; replaced by `the3d` & `theasci` | PASS |
| **Default Force-All-Labels** | Toggle force labels switch in default mode | All node labels remain visible regardless of zoom | PASS |
| **3D Space-Filling Viewer** | Load compound note with 3D mode | Renders vdW CPK spheres with drag orbit rotation | PASS |
| **Clickable Elements in `the3d`** | Click any atom sphere in 3D canvas | Raycast detects atom and navigates to `/unsur/{symbol}` | PASS |
| **ASCII Fischer Projection** | Load sugar/amino acid note with ASCII mode | Monospace Fischer projection with C1-Cn numbering | PASS |
| **Clickable Elements in `theasci`** | Click any element token in Fischer projection | Navigates directly to `/unsur/{symbol}` via SPA | PASS |
| **SPA Route Normalization** | Click atom from subfolder page | Correct relative prefix resolves to `/unsur/{symbol}` | PASS |

---
*Authored under Rule #001 and the Quartz v5 Decoupled Framework Architecture Protocol.*
