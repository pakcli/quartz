---
title: Master Brief - RDKit.js Cheminformatics & Frontmatter-Driven Periodic Table Architecture
version: v01-02
target: framework-quartz
category: engine-framework-brief
status: draft
---

# 📌 Master Brief: RDKit.js Cheminformatics & Frontmatter-Driven Elemental Architecture

> **Document Path**: `brief/v01-02_rdkit-cheminformatics-periodic-table-visualizer.md`  
> **Status**: Architectural Specification (RFC / Contract SSOT)  
> **Version**: `v01-02` (Strict 2-Octet Rule #004 Compliant)  
> **Target Submodule**: `framework-quartz/quartz` (`v5-decoupled-content-architecture`)  
> **Target Satellite Vault**: `framework-quartz-example-chemistry-library`  
> **Quarantine Status**: Uncommitted Working Tree (`donot-commit-yet` protocol active)  

---

## 📑 Table of Contents

1. [1. Executive Summary & Core Invariant](#1-executive-summary--core-invariant)
2. [2. Architectural Topology: Dual-Mode Chemistry Visualizer](#2-architectural-topology-dual-mode-chemistry-visualizer)
3. [3. Frontmatter-Driven Elemental Color Topology](#3-frontmatter-driven-elemental-color-topology)
   - [3.1 Frontmatter Color & Category Contract](#31-frontmatter-color--category-contract)
   - [3.2 4-Tier Color Resolution Fallback Chain](#32-4-tier-color-resolution-fallback-chain)
   - [3.3 Standard Periodic Table Family & CPK Palette SSOT](#33-standard-periodic-table-family--cpk-palette-ssot)
4. [4. RDKit.js Cheminformatics Engine Specification](#4-rdkitjs-cheminformatics-engine-specification)
   - [4.1 Role & WebAssembly (WASM) Architecture](#41-role--webassembly-wasm-architecture)
   - [4.2 Frontmatter `smiles` & Markdown Codeblock Integration](#42-frontmatter-smiles--markdown-codeblock-integration)
   - [4.3 On-the-Fly Molecular Descriptor Computation](#43-on-the-fly-molecular-descriptor-computation)
5. [5. Dual-Mode Sidebar Graph View Contract](#5-dual-mode-sidebar-graph-view-contract)
   - [5.1 Segmented Mode Switcher: `[ 🌐 Relasi ]` & `[ 🧪 Molekul ]`](#51-segmented-mode-switcher--relasi---molekul-)
   - [5.2 Text Wireframe Layout](#52-text-wireframe-layout)
6. [6. Implementation Roadmap & Verification Checklist](#6-implementation-roadmap--verification-checklist)

---

## 1. Executive Summary & Core Invariant

Digital gardens and wikis in chemistry, pharmacology, and materials science require scientific rigor and aesthetic excellence. Per user architectural directive:
* **Zero Bohr Mechanics**: All Bohr atomic orbital models, shell electron counts ($K, L, M, N$), and solar-system atomic diagrams are strictly eliminated from Quartz.
* **Pure Dual-Mode Focus**: The framework provides strictly two modes:
  1. **`🌐 Relasi`**: Force-Directed Knowledge Graph mapping interconnected Obsidian notes, color-coded by elemental family.
  2. **`🧪 Molekul`**: Publication-quality 2D chemical structure diagrams rendered by **RDKit.js** (WebAssembly) from canonical SMILES strings with stereochemical precision.

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 2. Architectural Topology: Dual-Mode Chemistry Visualizer

```text
┌────────────────────────────────────────────────────────────────────────┐
│                   DUAL-MODE CHEMISTRY COMPILATION PIPELINE             │
├────────────────────────────────────────────────────────────────────────┤
│ 1. SATELLITE NOTE VAULT (Pure Markdown & Metadata)                     │
│    - Frontmatter: { symbol: "Fe", category: "transition-metal" }       │
│    - Molecular:   { formula: "H2O", smiles: "O", category: "covalent" }│
│    - Codeblocks:  ```smiles CC(=O)Oc1ccccc1C(=O)O ``` (Aspirin)        │
├────────────────────────────────────────────────────────────────────────┤
│                                  │                                     │
│                                  ▼                                     │
│ 2. ENGINE COLOR RESOLVER & METADATA HARVESTER                          │
│    - Extracts frontmatter `color` / `category` / `symbol`              │
│    - Resolves via Periodic Table SSOT (CPK & Element Family Map)       │
│    - Injects CSS variables (--elem-color, --elem-glow, --elem-family)  │
├────────────────────────────────────────────────────────────────────────┤
│                                  │                                     │
│                 ┌────────────────┴────────────────┐                    │
│                 ▼                                 ▼                    │
│        [Mode 1: 🌐 Relasi]               [Mode 2: 🧪 Molekul]          │
│        Force-Directed Pixi.js Graph      RDKit.js WebAssembly Engine   │
│        - Document relational topology    - 2D Vector Structure SVGs    │
│        - Notes color-coded by family     - Stereochemistry (Wedge/Dash)│
│        - Click-to-navigate links         - Molecular Descriptors (MW)  │
└────────────────────────────────────────────────────────────────────────┘
```

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 3. Frontmatter-Driven Elemental Color Topology

### 3.1 Frontmatter Color & Category Contract

Satellite note vaults author elemental and compound metadata without hardcoding styling rules:

```yaml
---
# Elemental Note Example: unsur/fe.md
title: Besi (Iron)
symbol: Fe
atomicNumber: 26
mass: 55.845
category: transition-metal   # Options: alkali-metal | alkaline-earth | transition-metal | post-transition | metalloid | reactive-nonmetal | halogen | noble-gas | lanthanide | actinide
group: 8
period: 4
color: "#ea580c"             # Optional author override; falls back to category color if omitted
smiles: "[Fe]"
---
```

```yaml
---
# Molecular Note Example: senyawa-kimia/h2o.md
title: Dihidrogen Monoksida (Air)
formula: H2O
category: covalent-compound
smiles: O
color: "#0284c7"
---
```

### 3.2 4-Tier Color Resolution Fallback Chain

```text
Tier 1: Explicit Frontmatter `color` (e.g. color: "#f97316")
   │   (If absent)
   ▼
Tier 2: Explicit Frontmatter `category` (e.g. category: "transition-metal")
   │   (If absent)
   ▼
Tier 3: Engine Periodic Table SSOT lookup by `symbol` or `atomicNumber` (e.g. symbol: "Fe" -> #ea580c)
   │   (If absent)
   ▼
Tier 4: Active Quartz Theme Accent Fallback (`--secondary` / `#059669`)
```

### 3.3 Standard Periodic Table Family & CPK Palette SSOT

| Periodic Family Key | Indonesian Label | Dominant Palette | Luminous Glow Accent | Representative Elements |
| :--- | :--- | :--- | :--- | :--- |
| `reactive-nonmetal` | Non-Logam Reaktif | `#06b6d4` (Cyan) | `rgba(6, 182, 212, 0.4)` | $H, C, N, O, P, S$ |
| `alkali-metal` | Logam Alkali | `#f97316` (Vivid Orange) | `rgba(249, 115, 22, 0.4)` | $Li, Na, K, Rb, Cs$ |
| `alkaline-earth` | Logam Alkali Tanah | `#f59e0b` (Amber Gold) | `rgba(245, 158, 11, 0.4)` | $Be, Mg, Ca, Sr, Ba$ |
| `transition-metal` | Logam Transisi | `#ea580c` (Rust Copper) | `rgba(234, 88, 12, 0.4)` | $Fe, Ti, Cr, Ni, Cu, Au$ |
| `post-transition` | Logam Pasca-Transisi | `#10b981` (Mint Emerald) | `rgba(16, 185, 129, 0.4)` | $Al, Ga, In, Sn, Pb$ |
| `metalloid` | Metaloid | `#14b8a6` (Teal Jade) | `rgba(20, 184, 166, 0.4)` | $B, Si, Ge, As, Sb$ |
| `halogen` | Halogen | `#84cc16` (Lime Green) | `rgba(132, 204, 22, 0.4)` | $F, Cl, Br, I$ |
| `noble-gas` | Gas Mulia | `#a855f7` (Neon Violet) | `rgba(168, 85, 247, 0.4)` | $He, Ne, Ar, Kr, Xe$ |
| `lanthanide-actinide`| Lantanida & Aktinida| `#6366f1` (Indigo Amethyst)| `rgba(99, 102, 241, 0.4)` | $La, Ce, U, Th, Pu$ |

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 4. RDKit.js Cheminformatics Engine Specification

### 4.1 Role & WebAssembly (WASM) Architecture

RDKit.js is the official WebAssembly build of the industry-standard C++ RDKit cheminformatics library. In Quartz v5:
* **Zero Backend Dependency**: Compiles and runs 100% in client browsers. No Python, Conda, or Node.js native bindings required at runtime.
* **Lazy-Loaded Binary**: The `RDKit_minimal.wasm` (~4.2 MB) is loaded on-demand only when a note containing `smiles` frontmatter or a ````smiles ```` codeblock is mounted. Subsequent views are served instantly from HTTP browser cache.

### 4.2 Frontmatter `smiles` & Markdown Codeblock Integration

#### Pattern 1: Automatic Header Structure
When a note has frontmatter `smiles: "CC(=O)Oc1ccccc1C(=O)O"` (Aspirin):
* The engine instantiates an RDKit molecule: `const mol = RDKitModule.get_mol(smiles)`.
* Generates an SVG string via `mol.get_svg_with_highlights(details)`.
* Renders the SVG directly inside the sidebar `🧪 Molekul` tab.

#### Pattern 2: Inline Fenced Codeblock
Authors can embed structures anywhere in prose:
````markdown
```smiles
title: Caffeine
smiles: CN1C=NC2=C1C(=O)N(C(=O)N2C)C
```
````

### 4.3 On-the-Fly Molecular Descriptor Computation

RDKit automatically extracts and computes physicochemical descriptors client-side:
* **Molecular Weight ($M_W$)**: Exact mass (e.g. $18.015\text{ g/mol}$ for $H_2O$).
* **Exact Formula**: Hill-sorted chemical formula (e.g. $C_9H_8O_4$).
* **LogP**: Partition coefficient estimation.
* **Hydrogen Bond Donors / Acceptors ($HBD / HBA$)**: Lipinski rule indicators.

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 5. Dual-Mode Sidebar Graph View Contract

### 5.1 Segmented Mode Switcher: `[ 🌐 Relasi ]` & `[ 🧪 Molekul ]`

The sidebar `.graph` header houses a clean 2-tab segmented control:
* **`[ 🌐 Relasi ]` (Default)**: Force-directed network graph of linked notes, with node colors derived from element categories.
* **`[ 🧪 Molekul ]`**: High-resolution 2D chemical structure rendered by RDKit.js from frontmatter `smiles`, complete with molecular formula, molecular weight ($M_W$), and property badges.

### 5.2 Text Wireframe Layout

```text
┌──────────────────────────────────────────────────────────────┐
│  Graph View                     ┌──────────────┬───────────┐ │
│                                 │  🌐 Relasi   │ 🧪 Molekul│ │  <-- Dual-Mode Switcher
├─────────────────────────────────┴──────────────┴───────────┤
│                                                        [⛶] │
│                     O                                      │
│                    //                                      │  <-- RDKit.js 2D SVG
│             C ─── C                                        │      (Crisp, Stereokimia Akurat,
│            /       \                                       │       Ikatan Rangkap & Tunggal)
│         H3C         O ─── C6H4 ─── COOH                    │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🧪 Aspirin (Asam Asetilsalisilat)                    │  │  <-- Descriptor Panel
│  │ 📝 SMILES: CC(=O)Oc1ccccc1C(=O)O                     │  │
│  │ ⚖️ BM: 180.16 g/mol  •  LogP: 1.19  •  TPSA: 63.6 Å² │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

[⬆️ Back to Table of Contents](#-table-of-contents)

---

## 6. Implementation Roadmap & Verification Checklist

- [x] **v01-01**: Decoupled Quartz v5 Runner Engine with 3 execution modes.
- [x] **v01-02 RFC Brief**: Author Master Brief defining RDKit.js, Frontmatter-Driven Periodic Table Color Topology, and Dual-Mode Switcher (`🌐 Relasi` + `🧪 Molekul`).
- [ ] **Remove Bohr 3D Artifacts**: Eliminate Bohr canvas and orbital SVG code across engine scripts and styles.
- [ ] **Periodic Table Color Registry**: Implement `framework-quartz/quartz/quartz/util/periodicTable.ts` defining elemental families and CPK color mappings.
- [ ] **RDKit.js Molecular Visualizer**: Add clean RDKit.js renderer in `components/scripts/moleculeGraph.inline.ts`.
- [ ] **Sidebar Switcher**: Wire Dual-Mode `[ 🌐 Relasi ]` and `[ 🧪 Molekul ]` tabs in Graph View.
- [ ] **Build Verification**: Run `node ./quartz/bootstrap-cli.mjs build -d "../../framework-quartz-example-chemistry-library"` and verify zero regressions.
- [ ] **Quarantine Compliance**: Keep all modifications uncommitted in the working tree per `donot-commit-yet`.

[⬆️ Back to Table of Contents](#-table-of-contents)
