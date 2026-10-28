/**
 * Quartz v5 Dual-Mode Cheminformatics & Molecule Visualizer
 * Dual Mode Switcher:
 *  - [ 🌐 Relasi ] : Relational Force-Directed Graph of linked Obsidian notes
 *  - [ 🧪 Molekul ] : 2D Chemical Structure & SMILES Cheminformatics
 *
 * NOTE: Color and metadata are resolved dynamically from the Markdown note's frontmatter!
 * Priority: Frontmatter `color` -> Frontmatter `category` -> Periodic Table Fallback -> Theme Accent.
 */

interface ElementFallback {
  symbol: string
  name: string
  smiles: string
  color: string
  category: string
  mw?: number
  aliases?: string[]
}

// Built-in fallback database aligned with IUPAC & Indonesian chemical nomenclature
const FALLBACK_ELEMENTS: Record<string, ElementFallback> = {
  h: { symbol: "H", name: "Hydrogen", smiles: "[H]", color: "#06b6d4", category: "reactive-nonmetal", mw: 1.008, aliases: ["hidrogen", "hydrogen"] },
  he: { symbol: "He", name: "Helium", smiles: "[He]", color: "#a855f7", category: "noble-gas", mw: 4.003, aliases: ["helium"] },
  li: { symbol: "Li", name: "Lithium", smiles: "[Li]", color: "#f97316", category: "alkali-metal", mw: 6.94, aliases: ["litium", "lithium"] },
  be: { symbol: "Be", name: "Beryllium", smiles: "[Be]", color: "#f59e0b", category: "alkaline-earth", mw: 9.012, aliases: ["berilium", "beryllium"] },
  b: { symbol: "B", name: "Boron", smiles: "[B]", color: "#14b8a6", category: "metalloid", mw: 10.81, aliases: ["boron"] },
  c: { symbol: "C", name: "Carbon", smiles: "[C]", color: "#8b5cf6", category: "reactive-nonmetal", mw: 12.011, aliases: ["karbon", "carbon", "arang"] },
  n: { symbol: "N", name: "Nitrogen", smiles: "[N]", color: "#3b82f6", category: "reactive-nonmetal", mw: 14.007, aliases: ["nitrogen", "zat lemas"] },
  o: { symbol: "O", name: "Oxygen", smiles: "O=O", color: "#ef4444", category: "reactive-nonmetal", mw: 15.999, aliases: ["oksigen", "oxygen", "zat asam"] },
  f: { symbol: "F", name: "Fluorine", smiles: "[F]", color: "#84cc16", category: "halogen", mw: 18.998, aliases: ["fluorin", "fluorine", "fluor"] },
  ne: { symbol: "Ne", name: "Neon", smiles: "[Ne]", color: "#a855f7", category: "noble-gas", mw: 20.180, aliases: ["neon"] },
  na: { symbol: "Na", name: "Sodium", smiles: "[Na]", color: "#f97316", category: "alkali-metal", mw: 22.990, aliases: ["natrium", "sodium"] },
  mg: { symbol: "Mg", name: "Magnesium", smiles: "[Mg]", color: "#f59e0b", category: "alkaline-earth", mw: 24.305, aliases: ["magnesium"] },
  al: { symbol: "Al", name: "Aluminium", smiles: "[Al]", color: "#10b981", category: "post-transition", mw: 26.982, aliases: ["aluminium", "aluminum"] },
  si: { symbol: "Si", name: "Silicon", smiles: "[Si]", color: "#14b8a6", category: "metalloid", mw: 28.085, aliases: ["silikon", "silicon", "silika"] },
  p: { symbol: "P", name: "Phosphorus", smiles: "[P]", color: "#f97316", category: "reactive-nonmetal", mw: 30.974, aliases: ["fosfor", "phosphorus"] },
  s: { symbol: "S", name: "Sulfur", smiles: "[S]", color: "#eab308", category: "reactive-nonmetal", mw: 32.06, aliases: ["belerang", "sulfur"] },
  cl: { symbol: "Cl", name: "Chlorine", smiles: "[Cl]", color: "#84cc16", category: "halogen", mw: 35.45, aliases: ["klorin", "chlorine", "klor"] },
  ar: { symbol: "Ar", name: "Argon", smiles: "[Ar]", color: "#a855f7", category: "noble-gas", mw: 39.948, aliases: ["argon"] },
  k: { symbol: "K", name: "Potassium", smiles: "[K]", color: "#f97316", category: "alkali-metal", mw: 39.098, aliases: ["kalium", "potassium"] },
  ca: { symbol: "Ca", name: "Calcium", smiles: "[Ca]", color: "#f59e0b", category: "alkaline-earth", mw: 40.078, aliases: ["kalsium", "calcium"] },
  fe: { symbol: "Fe", name: "Iron", smiles: "[Fe]", color: "#ea580c", category: "transition-metal", mw: 55.845, aliases: ["besi", "iron", "ferrum"] },
  cu: { symbol: "Cu", name: "Copper", smiles: "[Cu]", color: "#ea580c", category: "transition-metal", mw: 63.546, aliases: ["tembaga", "copper", "cuprum"] },
  zn: { symbol: "Zn", name: "Zinc", smiles: "[Zn]", color: "#64748b", category: "transition-metal", mw: 65.38, aliases: ["seng", "zinc", "zincum"] },
  ag: { symbol: "Ag", name: "Silver", smiles: "[Ag]", color: "#94a3b8", category: "transition-metal", mw: 107.87, aliases: ["perak", "silver", "argentum"] },
  sn: { symbol: "Sn", name: "Tin", smiles: "[Sn]", color: "#10b981", category: "post-transition", mw: 118.71, aliases: ["timah", "tin", "stannum"] },
  au: { symbol: "Au", name: "Gold", smiles: "[Au]", color: "#f59e0b", category: "transition-metal", mw: 196.97, aliases: ["emas", "gold", "aurum"] },
  hg: { symbol: "Hg", name: "Mercury", smiles: "[Hg]", color: "#64748b", category: "transition-metal", mw: 200.59, aliases: ["raksa", "mercury", "merkuri", "hydrargyrum"] },
  pb: { symbol: "Pb", name: "Lead", smiles: "[Pb]", color: "#10b981", category: "post-transition", mw: 207.2, aliases: ["timbal", "lead", "plumbum"] },
  h2o: { symbol: "H₂O", name: "Dihidrogen Monoksida (Air)", smiles: "O", color: "#0284c7", category: "covalent-compound", mw: 18.015, aliases: ["air", "water", "h2o"] },
  co2: { symbol: "CO₂", name: "Karbon Dioksida", smiles: "O=C=O", color: "#8b5cf6", category: "covalent-compound", mw: 44.01, aliases: ["karbon dioksida", "carbon dioxide", "co2"] },
}

const CATEGORY_PALETTE: Record<string, string> = {
  "reactive-nonmetal": "#06b6d4",
  "alkali-metal": "#f97316",
  "alkaline-earth": "#f59e0b",
  "transition-metal": "#ea580c",
  "post-transition": "#10b981",
  "metalloid": "#14b8a6",
  "halogen": "#84cc16",
  "noble-gas": "#a855f7",
  "lanthanide-actinide": "#6366f1",
  "covalent-compound": "#0284c7",
}

/**
 * Resolve chemical color with strict priority:
 * 1. Explicit Markdown Frontmatter `color`
 * 2. Explicit Markdown Frontmatter `category`
 * 3. Fallback Periodic Table mapping
 * 4. CSS Variable (--secondary)
 */
function resolveDynamicColor(fallbackKey: string): string {
  const body = document.body
  // 1. Explicit Markdown frontmatter color (e.g. `color: "#ff5500"`)
  const fmColor = body.dataset.chemColor
  if (fmColor && fmColor.trim()) {
    return fmColor.trim()
  }

  // 2. Explicit Markdown frontmatter category (e.g. `category: "transition-metal"`)
  const fmCategory = body.dataset.chemCategory
  if (fmCategory && CATEGORY_PALETTE[fmCategory.toLowerCase().trim()]) {
    return CATEGORY_PALETTE[fmCategory.toLowerCase().trim()]
  }

  // 3. Fallback periodic table catalog by key/slug
  if (FALLBACK_ELEMENTS[fallbackKey]?.color) {
    return FALLBACK_ELEMENTS[fallbackKey].color
  }

  // 4. Default theme accent from CSS
  const computed = getComputedStyle(document.documentElement).getPropertyValue("--secondary").trim()
  return computed || "#059669"
}

function isChemicalEntity(path: string, pageTitle: string, body: HTMLElement): boolean {
  // 1. Explicit frontmatter chemistry properties
  if (body.dataset.chemSmiles || body.dataset.chemFormula || body.dataset.chemSymbol) {
    return true
  }

  // 2. Known IUPAC or standard chemistry categories
  const cat = (body.dataset.chemCategory || "").toLowerCase().trim()
  if (
    cat &&
    (CATEGORY_PALETTE[cat] ||
      cat === "unsur" ||
      cat === "senyawa" ||
      cat === "element" ||
      cat === "compound" ||
      cat === "covalent-compound" ||
      cat.endsWith("-metal") ||
      cat === "metaloid" ||
      cat === "gas-mulia")
  ) {
    return true
  }

  // 3. Path belongs to unsur or senyawa directory
  const p = path.toLowerCase()
  if (p.includes("/unsur/") || p.includes("/senyawa-kimia/") || p.includes("/senyawa/")) {
    return true
  }

  // 4. Aliases in frontmatter
  let aliases: string[] = []
  try {
    if (body.dataset.chemAliases) {
      aliases = JSON.parse(body.dataset.chemAliases)
    }
  } catch (_) {}

  const aliasStrings = aliases.map((a) => String(a).toLowerCase().trim())

  // 5. Check against known element / compound keys, symbols, and aliases
  const titleLower = pageTitle.toLowerCase().trim()
  for (const [key, fb] of Object.entries(FALLBACK_ELEMENTS)) {
    const symLower = fb.symbol.toLowerCase()
    const nameLower = fb.name.toLowerCase()
    const knownAliases = (fb.aliases || []).map((a) => a.toLowerCase())

    // Direct path match (e.g. /fe.html, /unsur/fe, /senyawa-kimia/h2o)
    if (p.includes(`/${key}.`) || p.endsWith(`/${key}`) || p.includes(`-${key}.`)) {
      return true
    }

    // Direct symbol or name match
    if (titleLower === key || titleLower === symLower || titleLower === nameLower) {
      return true
    }

    // Parenthetical symbol match, e.g. "Besi (Fe)", "Karbon (C)", "Oksigen (O)"
    if (titleLower.includes(`(${key})`) || titleLower.includes(`(${symLower})`)) {
      return true
    }

    // Aliases match in frontmatter or known element aliases
    if (
      aliasStrings.includes(key) ||
      aliasStrings.includes(symLower) ||
      aliasStrings.includes(nameLower) ||
      knownAliases.some((ka) => aliasStrings.includes(ka) || titleLower === ka)
    ) {
      return true
    }
  }

  return false
}

const PERIODIC_TABLE_Z_MAP: Record<string, number> = {
  h: 1, he: 2, li: 3, be: 4, b: 5, c: 6, n: 7, o: 8, f: 9, ne: 10,
  na: 11, mg: 12, al: 13, si: 14, p: 15, s: 16, cl: 17, ar: 18,
  k: 19, ca: 20, sc: 21, ti: 22, v: 23, cr: 24, mn: 25, fe: 26,
  co: 27, ni: 28, cu: 29, zn: 30, ga: 31, ge: 32, as: 33, se: 34,
  br: 35, kr: 36, rb: 37, sr: 38, y: 39, zr: 40, ag: 47, sn: 50,
  ba: 56, au: 79, hg: 80, pb: 82, u: 92
}

interface DynamicMoleculeMeta {
  title: string
  symbol: string
  formula: string
  smiles: string
  color: string
  category: string
  mw: string
  isElement: boolean
  atomicNumber: number
}

function resolveDynamicMetadata(): DynamicMoleculeMeta {
  const body = document.body
  const path = window.location.pathname.toLowerCase()

  // Clean page title from frontmatter attribute or DOM, removing leading emoji icons
  const rawTitle = (
    body.dataset.chemTitle ||
    document.querySelector("article h1")?.textContent ||
    document.querySelector(".markdown-rendered h1")?.textContent ||
    document.querySelector("h1")?.textContent ||
    document.title.split("|")[0] ||
    ""
  ).trim()
  const pageTitle = rawTitle.replace(/^[^\w\s(]+/, "").trim()

  // Find fallback key with strict matching (path slug -> symbol -> title & aliases)
  let fallbackKey = ""
  const pathClean = path.replace(/\.[^/.]+$/, "")
  const pathSlug = pathClean.split("/").pop() || ""
  const titleLower = pageTitle.toLowerCase().trim()

  if (FALLBACK_ELEMENTS[pathSlug]) {
    fallbackKey = pathSlug
  } else if (body.dataset.chemSymbol && FALLBACK_ELEMENTS[body.dataset.chemSymbol.toLowerCase().trim()]) {
    fallbackKey = body.dataset.chemSymbol.toLowerCase().trim()
  } else {
    for (const [key, fb] of Object.entries(FALLBACK_ELEMENTS)) {
      const symLower = fb.symbol.toLowerCase()
      const nameLower = fb.name.toLowerCase()
      const knownAliases = (fb.aliases || []).map((a) => a.toLowerCase())

      if (
        titleLower === key ||
        titleLower === symLower ||
        titleLower === nameLower ||
        titleLower.includes(`(${key})`) ||
        titleLower.includes(`(${symLower})`) ||
        knownAliases.some((ka) => titleLower === ka || titleLower.includes(`(${ka})`))
      ) {
        fallbackKey = key
        break
      }
    }
  }

  const fb = FALLBACK_ELEMENTS[fallbackKey] || {
    symbol: (body.dataset.chemSymbol || pageTitle.slice(0, 3)).toUpperCase(),
    name: pageTitle || "Senyawa",
    smiles: body.dataset.chemSmiles || "[H]",
    color: "#059669",
    category: "Kimia",
    mw: 0,
  }

  // Priority: Frontmatter attributes on body -> Fallback
  const color = resolveDynamicColor(fallbackKey)
  const smiles = body.dataset.chemSmiles || fb.smiles
  const symbol = body.dataset.chemSymbol || fb.symbol
  const formula = body.dataset.chemFormula || symbol
  const category = body.dataset.chemCategory || fb.category
  const mw = body.dataset.chemMw || (fb.mw ? String(fb.mw) : "")

  // Check if current note represents a single chemical element (unsur)
  const catLower = category.toLowerCase().trim()
  const isElement =
    path.includes("/unsur/") ||
    catLower.endsWith("-metal") ||
    catLower === "reactive-nonmetal" ||
    catLower === "metalloid" ||
    catLower === "noble-gas" ||
    catLower === "halogen" ||
    catLower === "lanthanide-actinide" ||
    (Boolean(FALLBACK_ELEMENTS[fallbackKey]) && fallbackKey !== "h2o" && fallbackKey !== "co2")

  // Resolve atomic number Z
  let atomicNumber = 0
  if (body.dataset.chemZ) {
    atomicNumber = parseInt(body.dataset.chemZ, 10) || 0
  }
  if (!atomicNumber && PERIODIC_TABLE_Z_MAP[symbol.toLowerCase()]) {
    atomicNumber = PERIODIC_TABLE_Z_MAP[symbol.toLowerCase()]
  }
  if (!atomicNumber && fallbackKey && PERIODIC_TABLE_Z_MAP[fallbackKey]) {
    atomicNumber = PERIODIC_TABLE_Z_MAP[fallbackKey]
  }
  if (!atomicNumber) {
    atomicNumber = 6 // Carbon default
  }

  return {
    title: pageTitle || fb.name,
    symbol,
    formula,
    smiles,
    color,
    category,
    mw,
    isElement,
    atomicNumber,
  }
}

interface OrbitalDef {
  name: string
  n: number
  l: number
  cap: number
  diag: number
}

const AUFBAU_SEQUENCE: OrbitalDef[] = [
  { name: "1s", n: 1, l: 0, cap: 2, diag: 1 },
  { name: "2s", n: 2, l: 0, cap: 2, diag: 2 },
  { name: "2p", n: 2, l: 1, cap: 6, diag: 3 },
  { name: "3s", n: 3, l: 0, cap: 2, diag: 3 },
  { name: "3p", n: 3, l: 1, cap: 6, diag: 4 },
  { name: "4s", n: 4, l: 0, cap: 2, diag: 4 },
  { name: "3d", n: 3, l: 2, cap: 10, diag: 5 },
  { name: "4p", n: 4, l: 1, cap: 6, diag: 5 },
  { name: "5s", n: 5, l: 0, cap: 2, diag: 5 },
  { name: "4d", n: 4, l: 2, cap: 10, diag: 6 },
  { name: "5p", n: 5, l: 1, cap: 6, diag: 6 },
  { name: "6s", n: 6, l: 0, cap: 2, diag: 6 },
  { name: "4f", n: 4, l: 3, cap: 14, diag: 7 },
  { name: "5d", n: 5, l: 2, cap: 10, diag: 7 },
  { name: "6p", n: 6, l: 1, cap: 6, diag: 7 },
  { name: "7s", n: 7, l: 0, cap: 2, diag: 7 },
  { name: "5f", n: 5, l: 3, cap: 14, diag: 8 },
  { name: "6d", n: 6, l: 2, cap: 10, diag: 8 },
  { name: "7p", n: 7, l: 1, cap: 6, diag: 8 },
]

function toSuperscript(num: number): string {
  const map: Record<string, string> = {
    "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
    "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹"
  }
  return String(num).split("").map((c) => map[c] || c).join("")
}

function computeElectronFilling(z: number): {
  orbitalStates: Map<string, { filled: number; cap: number; state: "full" | "partial" | "empty" }>
  configString: string
  activeDiagonals: Set<number>
  currentOrbital: { name: string; filled: number; cap: number } | null
} {
  const orbitalStates = new Map<string, { filled: number; cap: number; state: "full" | "partial" | "empty" }>()
  const activeDiagonals = new Set<number>()
  let remaining = Math.max(0, z)
  const configParts: string[] = []
  let currentOrbital: { name: string; filled: number; cap: number } | null = null

  for (const orb of AUFBAU_SEQUENCE) {
    if (remaining >= orb.cap) {
      orbitalStates.set(orb.name, { filled: orb.cap, cap: orb.cap, state: "full" })
      configParts.push(`${orb.name}${toSuperscript(orb.cap)}`)
      activeDiagonals.add(orb.diag)
      remaining -= orb.cap
      if (remaining === 0 && !currentOrbital) {
        currentOrbital = { name: orb.name, filled: orb.cap, cap: orb.cap }
      }
    } else if (remaining > 0) {
      orbitalStates.set(orb.name, { filled: remaining, cap: orb.cap, state: "partial" })
      configParts.push(`${orb.name}${toSuperscript(remaining)}`)
      activeDiagonals.add(orb.diag)
      currentOrbital = { name: orb.name, filled: remaining, cap: orb.cap }
      remaining = 0
    } else {
      orbitalStates.set(orb.name, { filled: 0, cap: orb.cap, state: "empty" })
    }
  }

  return {
    orbitalStates,
    configString: configParts.join(" "),
    activeDiagonals,
    currentOrbital,
  }
}

/**
 * Generate Aufbau Diagonal Rule Electron Configuration Diagram SVG
 * Replicates the Madelung Energy Diagonal Diagram
 */
interface CheckpointStep {
  index: number
  orbitalName: string
  orbitalCap: number
  electronsInOrbital: number
  totalElectrons: number
  diagId: number
  configString: string
  configParts: string[]
}

function getCheckpointsForZ(totalZ: number): CheckpointStep[] {
  const steps: CheckpointStep[] = []
  let remaining = Math.max(1, totalZ)
  let accumulated = 0
  const configParts: string[] = []

  for (let i = 0; i < AUFBAU_SEQUENCE.length; i++) {
    if (remaining <= 0) break
    const orb = AUFBAU_SEQUENCE[i]
    const fill = Math.min(remaining, orb.cap)
    accumulated += fill
    remaining -= fill
    configParts.push(`${orb.name}${toSuperscript(fill)}`)

    steps.push({
      index: i + 1,
      orbitalName: orb.name,
      orbitalCap: orb.cap,
      electronsInOrbital: fill,
      totalElectrons: accumulated,
      diagId: orb.diag,
      configString: configParts.join(" "),
      configParts: [...configParts],
    })
  }
  return steps
}

/**
 * Generate Aufbau Diagonal Rule Electron Configuration Diagram SVG
 * Replicates the Madelung Energy Diagonal Diagram with Solid Thick Highway Paths
 */
function renderAufbauDiagramSVG(z: number, color: string): string {
  const filling = computeElectronFilling(z)
  const activeColor = color || "#ef4444"

  const cols = [
    { l: 0, label: "l = 0", sub: "s", x: 105 },
    { l: 1, label: "l = 1", sub: "p", x: 155 },
    { l: 2, label: "l = 2", sub: "d", x: 205 },
    { l: 3, label: "l = 3", sub: "f", x: 255 },
  ]

  const rows = [
    { n: 1, y: 48 },
    { n: 2, y: 86 },
    { n: 3, y: 124 },
    { n: 4, y: 162 },
    { n: 5, y: 200 },
    { n: 6, y: 238 },
    { n: 7, y: 276 },
  ]

  const gridOrbitals: { name: string; n: number; l: number; x: number; y: number }[] = [
    { name: "1s", n: 1, l: 0, x: 105, y: 48 },
    { name: "2s", n: 2, l: 0, x: 105, y: 86 },
    { name: "2p", n: 2, l: 1, x: 155, y: 86 },
    { name: "3s", n: 3, l: 0, x: 105, y: 124 },
    { name: "3p", n: 3, l: 1, x: 155, y: 124 },
    { name: "3d", n: 3, l: 2, x: 205, y: 124 },
    { name: "4s", n: 4, l: 0, x: 105, y: 162 },
    { name: "4p", n: 4, l: 1, x: 155, y: 162 },
    { name: "4d", n: 4, l: 2, x: 205, y: 162 },
    { name: "4f", n: 4, l: 3, x: 255, y: 162 },
    { name: "5s", n: 5, l: 0, x: 105, y: 200 },
    { name: "5p", n: 5, l: 1, x: 155, y: 200 },
    { name: "5d", n: 5, l: 2, x: 205, y: 200 },
    { name: "5f", n: 5, l: 3, x: 255, y: 200 },
    { name: "6s", n: 6, l: 0, x: 105, y: 238 },
    { name: "6p", n: 6, l: 1, x: 155, y: 238 },
    { name: "6d", n: 6, l: 2, x: 205, y: 238 },
    { name: "7s", n: 7, l: 0, x: 105, y: 276 },
    { name: "7p", n: 7, l: 1, x: 155, y: 276 },
  ]

  const diagonals = [
    { id: 1, x1: 126, y1: 30, x2: 84, y2: 66 },
    { id: 2, x1: 126, y1: 68, x2: 84, y2: 104 },
    { id: 3, x1: 176, y1: 68, x2: 84, y2: 142 },
    { id: 4, x1: 176, y1: 106, x2: 84, y2: 180 },
    { id: 5, x1: 226, y1: 106, x2: 84, y2: 218 },
    { id: 6, x1: 226, y1: 144, x2: 84, y2: 256 },
    { id: 7, x1: 276, y1: 144, x2: 84, y2: 294 },
    { id: 8, x1: 276, y1: 182, x2: 134, y2: 294 },
  ]

  const returnLoops = [
    { id: 1, toDiag: 2, d: "M 88 56 C 70 72, 95 94, 122 72" },
    { id: 2, toDiag: 3, d: "M 88 94 C 70 106, 100 84, 140 60 C 160 48, 185 56, 174 72" },
    { id: 3, toDiag: 4, d: "M 88 132 C 70 144, 100 122, 140 98 C 160 86, 185 94, 174 110" },
    { id: 4, toDiag: 5, d: "M 88 170 C 70 182, 130 134, 180 98 C 210 76, 235 94, 224 110" },
    { id: 5, toDiag: 6, d: "M 88 208 C 70 220, 130 172, 180 136 C 210 114, 235 132, 224 148" },
    { id: 6, toDiag: 7, d: "M 88 246 C 70 258, 150 190, 220 138 C 255 114, 285 132, 274 148" },
    { id: 7, toDiag: 8, d: "M 88 284 C 70 296, 150 228, 220 176 C 255 152, 285 170, 274 186" },
  ]

  // Upward return circuit loops connecting row to row
  let upwardMarkup = ""
  for (const r of returnLoops) {
    upwardMarkup += `
      <path class="aufbau-upward-line dim" data-return="${r.id}" data-todiag="${r.toDiag}" d="${r.d}" stroke="${activeColor}" />
    `
  }

  // Thick solid capsule lines matching circle styling (no premature lines!)
  let diagMarkup = ""
  for (const d of diagonals) {
    diagMarkup += `
      <g class="aufbau-diag-group" data-diag="${d.id}">
        <line class="aufbau-diag-line dim" data-diag="${d.id}" x1="${d.x1}" y1="${d.y1}" x2="${d.x2}" y2="${d.y2}" stroke="${activeColor}" stroke-width="18" stroke-linecap="round" opacity="0" />
      </g>
    `
  }

  let colHeaderMarkup = ""
  for (const c of cols) {
    colHeaderMarkup += `
      <text x="${c.x}" y="13" class="aufbau-col-title" text-anchor="middle" font-size="11.5px" font-weight="700">${c.label}</text>
      <text x="${c.x}" y="27" class="aufbau-col-sub" text-anchor="middle" font-size="11px" font-weight="800">(${c.sub})</text>
    `
  }

  let rowHeaderMarkup = ""
  for (const r of rows) {
    rowHeaderMarkup += `
      <text x="48" y="${r.y}" class="aufbau-row-title" text-anchor="middle" dominant-baseline="central" font-size="12px" font-weight="800">n = ${r.n}</text>
    `
  }

  // Bigger, prominent ENERGY vertical axis indicator on the left
  const energyArrowMarkup = `
    <line x1="22" y1="36" x2="22" y2="284" stroke="#ef4444" stroke-width="4.5" stroke-linecap="round" marker-end="url(#aufbau-energy-arrow)" />
    <text x="10" y="160" class="aufbau-energy-text" transform="rotate(-90 10 160)" text-anchor="middle" dominant-baseline="central">ENERGY</text>
  `

  let orbMarkup = ""
  for (const orb of gridOrbitals) {
    const st = filling.orbitalStates.get(orb.name) || { filled: 0, cap: 2, state: "empty" }
    const radius = 16.5
    const isFilled = st.state === "full" || st.state === "partial"
    const sup = toSuperscript(st.filled)
    const label = isFilled ? `${orb.name}${sup}` : orb.name
    const fontSize = isFilled && label.length >= 4 ? "12px" : "13.5px"
    const stateClass = isFilled ? "active" : "dim"
    const fillAttr = isFilled ? `fill="${activeColor}" stroke="none"` : `stroke="rgba(148, 163, 184, 0.45)" stroke-width="1.8"`

    orbMarkup += `
      <g class="aufbau-node-group" data-orb="${orb.name}" title="Klik checkpoint ${orb.name}">
        <circle cx="${orb.x}" cy="${orb.y}" r="${radius}" ${fillAttr} class="aufbau-orb-node ${stateClass}" data-orb="${orb.name}" />
        <text x="${orb.x}" y="${orb.y}" font-size="${fontSize}" class="aufbau-orb-text ${stateClass}" text-anchor="middle" dominant-baseline="central" data-orb="${orb.name}">${label}</text>
      </g>
    `
  }

  return `
    <div class="aufbau-card">
      <div class="aufbau-viewport">
        <svg viewBox="0 0 310 320" width="100%" height="100%" class="aufbau-diagram-svg">
          <defs>
            <marker id="aufbau-arrow-active" viewBox="0 0 14 18" refX="0" refY="9" markerWidth="11" markerHeight="18" markerUnits="userSpaceOnUse" orient="auto">
              <path d="M 0 1 L 13 9 L 0 17 z" fill="${activeColor}" />
            </marker>
            <marker id="aufbau-arrow-dim" viewBox="0 0 14 18" refX="0" refY="9" markerWidth="11" markerHeight="18" markerUnits="userSpaceOnUse" orient="auto">
              <path d="M 0 1 L 13 9 L 0 17 z" fill="rgba(148, 163, 184, 0.35)" />
            </marker>
            <marker id="aufbau-energy-arrow" viewBox="0 0 14 16" refX="0" refY="8" markerWidth="11" markerHeight="14" markerUnits="userSpaceOnUse" orient="auto">
              <path d="M 0 1 L 13 8 L 0 15 z" fill="#ef4444" />
            </marker>
          </defs>
          <g class="aufbau-headers">${colHeaderMarkup}${rowHeaderMarkup}${energyArrowMarkup}</g>
          <g class="aufbau-diagonals">${upwardMarkup}${diagMarkup}</g>
          <g class="aufbau-nodes">${orbMarkup}</g>
        </svg>
        <div class="aufbau-cp-floating-badge" title="Checkpoint Status">CP 0/0</div>
      </div>
    </div>
  `
}

function triggerDiagLineDraw(line: SVGLineElement, delayMs = 0, durationMs = 360) {
  const x1 = parseFloat(line.getAttribute("x1") || "0")
  const y1 = parseFloat(line.getAttribute("y1") || "0")
  const x2 = parseFloat(line.getAttribute("x2") || "0")
  const y2 = parseFloat(line.getAttribute("y2") || "0")
  const len = Math.hypot(x2 - x1, y2 - y1) || 200

  // Top-right start: offset = len hides the line
  line.style.strokeDasharray = `${len} ${len}`
  line.style.strokeDashoffset = `${len}`

  const startAnim = () => {
    if (typeof line.animate === "function") {
      const anim = line.animate(
        [
          { strokeDashoffset: `${len}px` },
          { strokeDashoffset: "0px" }
        ],
        {
          duration: durationMs,
          easing: "cubic-bezier(0.25, 1, 0.5, 1)",
          fill: "forwards"
        }
      )
      anim.onfinish = () => {
        line.style.strokeDashoffset = "0"
        line.style.strokeDasharray = "none"
      }
    } else {
      line.style.transition = `stroke-dashoffset ${durationMs}ms cubic-bezier(0.25, 1, 0.5, 1)`
      requestAnimationFrame(() => {
        line.style.strokeDashoffset = "0"
      })
    }
  }

  if (delayMs > 0) {
    setTimeout(startAnim, delayMs)
  } else {
    startAnim()
  }
}

const DIAG_ORBITALS: Record<number, string[]> = {
  1: ["1s"],
  2: ["2s"],
  3: ["2p", "3s"],
  4: ["3p", "4s"],
  5: ["3d", "4p", "5s"],
  6: ["4d", "5p", "6s"],
  7: ["4f", "5d", "6p", "7s"],
  8: ["5f", "6d", "7p"],
}

const ORBITAL_COORDS: Record<string, { x: number; y: number }> = {
  "1s": { x: 105, y: 48 },
  "2s": { x: 105, y: 86 },
  "2p": { x: 155, y: 86 },
  "3s": { x: 105, y: 124 },
  "3p": { x: 155, y: 124 },
  "3d": { x: 205, y: 124 },
  "4s": { x: 105, y: 162 },
  "4p": { x: 155, y: 162 },
  "4d": { x: 205, y: 162 },
  "4f": { x: 255, y: 162 },
  "5s": { x: 105, y: 200 },
  "5p": { x: 155, y: 200 },
  "5d": { x: 205, y: 200 },
  "5f": { x: 255, y: 200 },
  "6s": { x: 105, y: 238 },
  "6p": { x: 155, y: 238 },
  "6d": { x: 205, y: 238 },
  "7s": { x: 105, y: 276 },
  "7p": { x: 155, y: 276 },
}

function updateAufbauDOM(
  aufbauContainer: HTMLElement,
  checkpointIdx: number,
  checkpoints: CheckpointStep[],
  totalZ: number,
  activeColor: string,
) {
  const svgEl = aufbauContainer.querySelector(".aufbau-diagram-svg") as SVGElement
  if (!svgEl) return

  const totalSteps = checkpoints.length
  const currentCP = checkpointIdx > 0 ? checkpoints[Math.min(checkpointIdx - 1, totalSteps - 1)] : null
  const currentElectrons = currentCP ? currentCP.totalElectrons : 0

  // 1. Update marker color
  const markerPath = svgEl.querySelector("#aufbau-arrow-active path")
  if (markerPath) markerPath.setAttribute("fill", activeColor)

  // 2. Compute electron filling state for each orbital at this checkpoint first
  const filling = computeElectronFilling(currentElectrons)

  // 3. Update Diagonals (Lines only span across currently calculated/filled orbitals!)
  const lines = svgEl.querySelectorAll<SVGLineElement>(".aufbau-diag-line")
  const isInitialMount = lines.length > 0 && Array.from(lines).every((l) => !l.classList.contains("active"))

  lines.forEach((line) => {
    const id = parseInt(line.dataset.diag || "0", 10)
    const orbsOnDiag = DIAG_ORBITALS[id] || []

    // Find all orbitals on this diagonal that currently have electrons > 0
    const filledOrbs = orbsOnDiag.filter((name) => {
      const st = filling.orbitalStates.get(name)
      return st && st.filled > 0
    })

    if (filledOrbs.length > 0) {
      const firstOrbName = orbsOnDiag[0]
      const lastFilledName = filledOrbs[filledOrbs.length - 1]
      const firstCoord = ORBITAL_COORDS[firstOrbName]
      const lastCoord = ORBITAL_COORDS[lastFilledName]

      // When only 1 node is filled: stays within the node circle
      // When 2+ nodes are filled: connects from first node to current checkpoint node (o = o)
      // Never sticks out after the current checkpoint: "o = o  no lines here after the current checkpoint   o"
      const isSingleNode = firstOrbName === lastFilledName
      const startX = isSingleNode ? firstCoord.x + 8 : firstCoord.x
      const startY = isSingleNode ? firstCoord.y - 6 : firstCoord.y
      const targetX2 = isSingleNode ? lastCoord.x - 8 : lastCoord.x
      const targetY2 = isSingleNode ? lastCoord.y + 6 : lastCoord.y

      const prevX2 = parseFloat(line.getAttribute("x2") || "0")
      const wasActive = line.classList.contains("active")
      const needsDraw = !wasActive || prevX2 !== targetX2

      line.setAttribute("x1", String(startX))
      line.setAttribute("y1", String(startY))
      line.setAttribute("x2", String(targetX2))
      line.setAttribute("y2", String(targetY2))
      line.setAttribute("stroke", activeColor)
      line.setAttribute("stroke-width", "18")
      line.setAttribute("opacity", "1")
      line.removeAttribute("marker-end")
      line.classList.remove("dim")
      line.classList.add("active")

      if (needsDraw) {
        const delay = isInitialMount ? (id - 1) * 75 : 0
        triggerDiagLineDraw(line, delay, 360)
      }
    } else {
      line.setAttribute("opacity", "0")
      line.classList.remove("active")
      line.classList.add("dim")
      line.style.strokeDasharray = "none"
      line.style.strokeDashoffset = "0"
    }
  })

  // 4. Update Upward Return Circuit Lines (same style, slightly less saturated, only between reached rows)
  const returnPaths = svgEl.querySelectorAll<SVGPathElement>(".aufbau-upward-line")
  returnPaths.forEach((p) => {
    const toDiag = parseInt(p.dataset.todiag || "0", 10)
    const orbsOnTarget = DIAG_ORBITALS[toDiag] || []
    const isTargetStarted = orbsOnTarget.some((name) => {
      const st = filling.orbitalStates.get(name)
      return st && st.filled > 0
    })

    if (isTargetStarted) {
      p.setAttribute("stroke", activeColor)
      p.classList.remove("dim")
      p.classList.add("active")
    } else {
      p.classList.remove("active")
      p.classList.add("dim")
    }
  })

  // 5. Update Orbitals
  const orbNodes = svgEl.querySelectorAll<SVGCircleElement>(".aufbau-orb-node")
  orbNodes.forEach((node) => {
    const name = node.dataset.orb || ""
    const textEl = svgEl.querySelector<SVGTextElement>(`.aufbau-orb-text[data-orb="${name}"]`)
    const st = filling.orbitalStates.get(name) || { filled: 0, cap: 2, state: "empty" }
    const isCurrentActive = currentCP?.orbitalName === name

    if (st.state === "full" || st.state === "partial") {
      node.setAttribute("fill", activeColor)
      node.setAttribute("stroke", "none")
      node.classList.remove("dim")
      node.classList.add("active")

      if (textEl) {
        const sup = toSuperscript(st.filled)
        const label = `${name}${sup}`
        textEl.textContent = label
        textEl.setAttribute("font-size", label.length >= 4 ? "12px" : "13.5px")
        textEl.classList.remove("dim")
        textEl.classList.add("active")
      }
    } else {
      node.removeAttribute("fill")
      node.setAttribute("stroke", "rgba(148, 163, 184, 0.45)")
      node.classList.remove("active")
      node.classList.add("dim")

      if (textEl) {
        textEl.textContent = name
        textEl.setAttribute("font-size", "13px")
        textEl.classList.remove("active")
        textEl.classList.add("dim")
      }
    }
  })
}

function updateAufbauHUDInfo(
  hudFooter: HTMLElement,
  checkpointIdx: number,
  checkpoints: CheckpointStep[],
  totalZ: number,
  molColor: string,
  aufbauContainer?: HTMLElement,
) {
  const totalSteps = checkpoints.length
  const currentCP = checkpointIdx > 0 ? checkpoints[Math.min(checkpointIdx - 1, totalSteps - 1)] : null
  const currentE = currentCP ? currentCP.totalElectrons : 0
  const configStr = currentCP ? currentCP.configString : "(Mulai)"

  // 1. Electron Counter (Row 2)
  const counterEl = hudFooter.querySelector(".aufbau-e-counter strong") as HTMLElement
  if (counterEl) {
    counterEl.textContent = String(currentE)
    counterEl.style.color = molColor
  }

  // 2. Orbital Aktif (Row 2)
  const orbEl = hudFooter.querySelector(".aufbau-active-orbital")
  if (orbEl) {
    if (checkpointIdx === 0) {
      orbEl.innerHTML = `<code>Mulai</code>`
    } else if (checkpointIdx >= totalSteps) {
      orbEl.innerHTML = `<code>${currentCP?.orbitalName}${toSuperscript(currentCP?.electronsInOrbital || 0)}</code> ✓`
    } else {
      orbEl.innerHTML = `<code>${currentCP?.orbitalName}${toSuperscript(currentCP?.electronsInOrbital || 0)}</code>`
    }
  }

  // 3. Konfigurasi Elektron (Row 3, 5 octets per row max, multiple rows, no horizontal scroll)
  const codeEl = hudFooter.querySelector(".aufbau-config-code")
  if (codeEl) {
    const configParts = currentCP ? currentCP.configParts || [] : []
    if (configParts.length === 0) {
      codeEl.innerHTML = `<span class="aufbau-config-line">(Mulai)</span>`
    } else {
      const rows: string[] = []
      for (let i = 0; i < configParts.length; i += 5) {
        rows.push(configParts.slice(i, i + 5).join(" "))
      }
      codeEl.innerHTML = rows.map((r) => `<span class="aufbau-config-line">${r}</span>`).join("")
    }
  }

  // 4. Floating Checkpoint Status inside graph frame (corner bottom right)
  const container = aufbauContainer || (document.querySelector(".graph-aufbau-container") as HTMLElement)
  if (container) {
    const cpBadge = container.querySelector(".aufbau-cp-floating-badge")
    if (cpBadge) {
      cpBadge.textContent = `CP ${checkpointIdx}/${totalSteps}`
    }
  }
}

interface ChemNode {
  id: number
  symbol: string
  x: number
  y: number
  color: string
  radius?: number
}

interface ChemBond {
  source: number
  target: number
  order: 1 | 2 | 3
}

function resolveAtomColor(symbol: string, defaultColor: string): string {
  const s = symbol.trim()
  if (s === "O" || s === "OH" || s === "HO") return "#ef4444" // Oxygen Red
  if (s === "N") return "#3b82f6" // Nitrogen Blue
  if (s === "H") return "#06b6d4" // Hydrogen Cyan
  if (s === "Cl") return "#84cc16" // Chlorine Lime
  if (s === "Na") return "#f97316" // Sodium Orange
  if (s === "S") return "#eab308" // Sulfur Yellow
  if (s === "Mg") return "#f59e0b" // Magnesium Amber
  if (s === "Fe") return "#ea580c" // Iron Orange-Red
  if (s === "C") return defaultColor || "#10b981" // Carbon Theme Accent
  return defaultColor || "#64748b"
}

function renderNodeLinkGraph(nodes: ChemNode[], bonds: ChemBond[], extraSvg?: string): string {
  // 1. Render Chemical Bond Lines (rendered under nodes so circles cleanly mask endpoints)
  let bondMarkup = ""
  for (const b of bonds) {
    const n1 = nodes[b.source]
    const n2 = nodes[b.target]
    if (!n1 || !n2) continue

    const dx = n2.x - n1.x
    const dy = n2.y - n1.y
    const len = Math.hypot(dx, dy) || 1
    const nx = -dy / len
    const ny = dx / len

    if (b.order === 2) {
      // Double bond: two crisp parallel lines
      const off = 3.5
      bondMarkup += `
        <line x1="${(n1.x + nx * off).toFixed(1)}" y1="${(n1.y + ny * off).toFixed(1)}" x2="${(n2.x + nx * off).toFixed(1)}" y2="${(n2.y + ny * off).toFixed(1)}" stroke="var(--chem-bond, #64748b)" stroke-width="3" stroke-linecap="round" />
        <line x1="${(n1.x - nx * off).toFixed(1)}" y1="${(n1.y - ny * off).toFixed(1)}" x2="${(n2.x - nx * off).toFixed(1)}" y2="${(n2.y - ny * off).toFixed(1)}" stroke="var(--chem-bond, #64748b)" stroke-width="3" stroke-linecap="round" />
      `
    } else if (b.order === 3) {
      // Triple bond: three parallel lines
      const off = 5
      bondMarkup += `
        <line x1="${n1.x.toFixed(1)}" y1="${n1.y.toFixed(1)}" x2="${n2.x.toFixed(1)}" y2="${n2.y.toFixed(1)}" stroke="var(--chem-bond, #64748b)" stroke-width="2.5" stroke-linecap="round" />
        <line x1="${(n1.x + nx * off).toFixed(1)}" y1="${(n1.y + ny * off).toFixed(1)}" x2="${(n2.x + nx * off).toFixed(1)}" y2="${(n2.y + ny * off).toFixed(1)}" stroke="var(--chem-bond, #64748b)" stroke-width="2.5" stroke-linecap="round" />
        <line x1="${(n1.x - nx * off).toFixed(1)}" y1="${(n1.y - ny * off).toFixed(1)}" x2="${(n2.x - nx * off).toFixed(1)}" y2="${(n2.y - ny * off).toFixed(1)}" stroke="var(--chem-bond, #64748b)" stroke-width="2.5" stroke-linecap="round" />
      `
    } else {
      // Single bond: clean solid line
      bondMarkup += `
        <line x1="${n1.x.toFixed(1)}" y1="${n1.y.toFixed(1)}" x2="${n2.x.toFixed(1)}" y2="${n2.y.toFixed(1)}" stroke="var(--chem-bond, #64748b)" stroke-width="3.5" stroke-linecap="round" />
      `
    }
  }

  // 2. Render Atom Circular Nodes
  let nodeMarkup = ""
  for (const n of nodes) {
    const r = n.radius || 18
    const fontSize = n.symbol.length > 2 ? 11 : n.symbol.length > 1 ? 13 : 15
    nodeMarkup += `
      <circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${r}" fill="${n.color}" />
      <text x="${n.x.toFixed(1)}" y="${n.y.toFixed(1)}" class="chem-atom-text" style="font-size: ${fontSize}px;">${n.symbol}</text>
    `
  }

  return `
    <svg viewBox="0 0 240 160" width="100%" height="100%" class="chem-structure-svg">
      ${extraSvg || ""}
      <g class="chem-bonds">${bondMarkup}</g>
      <g class="chem-nodes">${nodeMarkup}</g>
    </svg>
  `
}

/**
 * Generalized SMILES 2D Graph Parser & Auto-Layout Engine
 * Parses arbitrary SMILES into an interconnected node-link structure diagram!
 */
function parseSMILESToGraph(smiles: string, defaultColor: string): { nodes: ChemNode[]; bonds: ChemBond[] } {
  const nodes: ChemNode[] = []
  const bonds: ChemBond[] = []

  // Tokenize atoms and bonds
  const regex = /(\[[^\]]+\]|[A-Z][a-z]?|=|-|#|\(|\))/g
  let match: RegExpExecArray | null
  const tokens: string[] = []
  while ((match = regex.exec(smiles)) !== null) {
    tokens.push(match[1])
  }

  const stack: number[] = []
  let prevNodeIndex = -1
  let nextBondOrder: 1 | 2 | 3 = 1

  for (const token of tokens) {
    if (token === "=") {
      nextBondOrder = 2
    } else if (token === "#") {
      nextBondOrder = 3
    } else if (token === "-") {
      nextBondOrder = 1
    } else if (token === "(") {
      if (prevNodeIndex !== -1) stack.push(prevNodeIndex)
    } else if (token === ")") {
      if (stack.length > 0) prevNodeIndex = stack.pop()!
    } else {
      const rawSym = token.replace(/[\[\]\+\-\d]/g, "")
      const sym = rawSym || token.replace(/[\[\]]/g, "")
      const atomColor = resolveAtomColor(sym, defaultColor)
      const newNodeIndex = nodes.length

      nodes.push({
        id: newNodeIndex,
        symbol: sym,
        x: 0,
        y: 0,
        color: atomColor,
      })

      if (prevNodeIndex !== -1) {
        bonds.push({
          source: prevNodeIndex,
          target: newNodeIndex,
          order: nextBondOrder,
        })
      }

      nextBondOrder = 1
      prevNodeIndex = newNodeIndex
    }
  }

  // 2D Coordinates Auto-Calculation
  if (nodes.length === 1) {
    nodes[0].x = 120
    nodes[0].y = 80
    nodes[0].radius = 36
  } else if (nodes.length > 1) {
    const visited = new Set<number>()
    nodes[0].x = 40
    nodes[0].y = 80
    visited.add(0)

    const queue: { id: number; angle: number; depth: number }[] = [{ id: 0, angle: 0, depth: 0 }]
    while (queue.length > 0) {
      const cur = queue.shift()!
      const neighbors = bonds
        .filter((b) => b.source === cur.id || b.target === cur.id)
        .map((b) => (b.source === cur.id ? b.target : b.source))
        .filter((nbr) => !visited.has(nbr))

      neighbors.forEach((nbr, i) => {
        visited.add(nbr)
        const stepDist = 45
        const branchAngle = cur.angle + (i === 0 ? (cur.depth % 2 === 0 ? -0.5 : 0.5) : (i === 1 ? -1.2 : 1.2))
        const nx = nodes[cur.id].x + Math.cos(branchAngle) * stepDist
        const ny = nodes[cur.id].y + Math.sin(branchAngle) * stepDist
        nodes[nbr].x = nx
        nodes[nbr].y = ny
        queue.push({ id: nbr, angle: branchAngle, depth: cur.depth + 1 })
      })
    }

    // Normalize coordinates into SVG ViewBox (240 x 160)
    const xs = nodes.map((n) => n.x)
    const ys = nodes.map((n) => n.y)
    const minX = Math.min(...xs), maxX = Math.max(...xs)
    const minY = Math.min(...ys), maxY = Math.max(...ys)
    const spanX = maxX - minX || 1
    const spanY = maxY - minY || 1

    const padX = 35
    const padY = 30
    const availW = 240 - padX * 2
    const availH = 160 - padY * 2
    const scale = Math.min(availW / spanX, availH / spanY, 1.2)

    const midX = (minX + maxX) / 2
    const midY = (minY + maxY) / 2

    for (const n of nodes) {
      n.x = 120 + (n.x - midX) * scale
      n.y = 80 + (n.y - midY) * scale
      n.radius = Math.max(14, Math.min(20, 22 - nodes.length * 0.4))
    }
  }

  return { nodes, bonds }
}

/**
 * Generate 2D Vector Structure Diagram
 * STRICT INVARIANT: Always use connected, simple circular atom nodes!
 * Zero single-blob text fallback. Every molecule is rendered as real connected atom nodes.
 */
function renderChemicalStructureSVG(mol: DynamicMoleculeMeta): string {
  const clean = mol.smiles.trim()
  const color = mol.color
  const form = (mol.formula || "").toUpperCase().trim()

  // 1. Single Chemical Element (Unsur) -> Solid circular element node
  if (mol.isElement || (clean.startsWith("[") && clean.endsWith("]")) || (clean.length <= 2 && !clean.includes("="))) {
    const displaySymbol = mol.symbol || mol.formula || clean.replace(/[\[\]]/g, "") || "X"
    return `
      <svg viewBox="0 0 240 160" width="100%" height="100%" class="chem-structure-svg">
        <circle cx="120" cy="80" r="36" fill="${color}" />
        <text x="120" y="80" class="chem-atom-text" style="font-size: ${displaySymbol.length > 2 ? "17px" : "22px"};">${displaySymbol}</text>
      </svg>
    `
  }

  // 2. Acetic Acid / Cuka Makan (CH₃COOH / CC(=O)O)
  if (clean === "CC(=O)O" || form === "CH3COOH") {
    const nodes: ChemNode[] = [
      { id: 0, symbol: "C", x: 65, y: 92, color: color, radius: 19 },
      { id: 1, symbol: "C", x: 120, y: 78, color: color, radius: 19 },
      { id: 2, symbol: "O", x: 148, y: 36, color: "#ef4444", radius: 18 },
      { id: 3, symbol: "OH", x: 172, y: 118, color: "#ef4444", radius: 19 },
    ]
    const bonds: ChemBond[] = [
      { source: 0, target: 1, order: 1 },
      { source: 1, target: 2, order: 2 }, // Carbonyl double bond C=O
      { source: 1, target: 3, order: 1 }, // Hydroxyl single bond C-OH
    ]
    return renderNodeLinkGraph(nodes, bonds)
  }

  // 3. Water Molecule (H₂O / O)
  if (clean === "O" || clean === "[OH2]" || clean === "H2O" || form === "H2O") {
    const nodes: ChemNode[] = [
      { id: 0, symbol: "O", x: 120, y: 65, color: color, radius: 24 },
      { id: 1, symbol: "H", x: 65, y: 120, color: "#06b6d4", radius: 18 },
      { id: 2, symbol: "H", x: 175, y: 120, color: "#06b6d4", radius: 18 },
    ]
    const bonds: ChemBond[] = [
      { source: 0, target: 1, order: 1 },
      { source: 0, target: 2, order: 1 },
    ]
    const extraSvg = `
      <path d="M 96 88 A 32 32 0 0 0 144 88" fill="none" stroke="#64748b" stroke-width="1.5" opacity="0.6" class="chem-angle-arc" />
      <rect x="100" y="96" width="40" height="18" rx="4" fill="var(--lightgray)" opacity="0.9" />
      <text x="120" y="109" class="chem-angle-text">104.5°</text>
    `
    return renderNodeLinkGraph(nodes, bonds, extraSvg)
  }

  // 4. Carbon Dioxide (CO₂ / O=C=O)
  if (clean === "O=C=O" || clean.includes("C(=O)=O") || form === "CO2") {
    const nodes: ChemNode[] = [
      { id: 0, symbol: "O", x: 65, y: 75, color: "#ef4444", radius: 21 },
      { id: 1, symbol: "C", x: 125, y: 75, color: color, radius: 23 },
      { id: 2, symbol: "O", x: 185, y: 75, color: "#ef4444", radius: 21 },
    ]
    const bonds: ChemBond[] = [
      { source: 0, target: 1, order: 2 },
      { source: 1, target: 2, order: 2 },
    ]
    return renderNodeLinkGraph(nodes, bonds)
  }

  // 5. Ethanol / Alkohol Antiseptik (C₂H₅OH / CCO)
  if (clean === "CCO" || form === "C2H5OH") {
    const nodes: ChemNode[] = [
      { id: 0, symbol: "C", x: 65, y: 92, color: color, radius: 20 },
      { id: 1, symbol: "C", x: 120, y: 68, color: color, radius: 20 },
      { id: 2, symbol: "OH", x: 175, y: 92, color: "#ef4444", radius: 20 },
    ]
    const bonds: ChemBond[] = [
      { source: 0, target: 1, order: 1 },
      { source: 1, target: 2, order: 1 },
    ]
    return renderNodeLinkGraph(nodes, bonds)
  }

  // 6. Sodium Chloride / Garam Dapur (NaCl / [Na+].[Cl-])
  if (clean.includes("[Na+]") && clean.includes("[Cl-]") || form === "NACL") {
    const nodes: ChemNode[] = [
      { id: 0, symbol: "Na", x: 75, y: 80, color: "#f97316", radius: 25 },
      { id: 1, symbol: "Cl", x: 165, y: 80, color: "#84cc16", radius: 25 },
    ]
    const bonds: ChemBond[] = [{ source: 0, target: 1, order: 1 }]
    return renderNodeLinkGraph(nodes, bonds)
  }

  // 7. Methane / Gas Metana (CH₄)
  if (form === "CH4" || (clean === "C" && mol.title.toLowerCase().includes("metana"))) {
    const nodes: ChemNode[] = [
      { id: 0, symbol: "C", x: 120, y: 80, color: color, radius: 24 },
      { id: 1, symbol: "H", x: 120, y: 35, color: "#06b6d4", radius: 16 },
      { id: 2, symbol: "H", x: 120, y: 125, color: "#06b6d4", radius: 16 },
      { id: 3, symbol: "H", x: 72, y: 80, color: "#06b6d4", radius: 16 },
      { id: 4, symbol: "H", x: 168, y: 80, color: "#06b6d4", radius: 16 },
    ]
    const bonds: ChemBond[] = [
      { source: 0, target: 1, order: 1 },
      { source: 0, target: 2, order: 1 },
      { source: 0, target: 3, order: 1 },
      { source: 0, target: 4, order: 1 },
    ]
    return renderNodeLinkGraph(nodes, bonds)
  }

  // 8. Propane / Gas Elpiji (C₃H₈ / CCC)
  if (clean === "CCC" || form === "C3H8") {
    const nodes: ChemNode[] = [
      { id: 0, symbol: "C", x: 65, y: 92, color: color, radius: 20 },
      { id: 1, symbol: "C", x: 120, y: 65, color: color, radius: 20 },
      { id: 2, symbol: "C", x: 175, y: 92, color: color, radius: 20 },
    ]
    const bonds: ChemBond[] = [
      { source: 0, target: 1, order: 1 },
      { source: 1, target: 2, order: 1 },
    ]
    return renderNodeLinkGraph(nodes, bonds)
  }

  // 9. Butane / Gas Portabel (C₄H₁₀ / CCCC)
  if (clean === "CCCC" || form === "C4H10") {
    const nodes: ChemNode[] = [
      { id: 0, symbol: "C", x: 50, y: 92, color: color, radius: 19 },
      { id: 1, symbol: "C", x: 95, y: 65, color: color, radius: 19 },
      { id: 2, symbol: "C", x: 145, y: 92, color: color, radius: 19 },
      { id: 3, symbol: "C", x: 190, y: 65, color: color, radius: 19 },
    ]
    const bonds: ChemBond[] = [
      { source: 0, target: 1, order: 1 },
      { source: 1, target: 2, order: 1 },
      { source: 2, target: 3, order: 1 },
    ]
    return renderNodeLinkGraph(nodes, bonds)
  }

  // 10. Sodium Bicarbonate / Soda Kue (NaHCO₃)
  if (clean.includes("OC(=O)[O-]") || form === "NAHCO3") {
    const nodes: ChemNode[] = [
      { id: 0, symbol: "Na", x: 45, y: 80, color: "#f97316", radius: 18 },
      { id: 1, symbol: "O", x: 88, y: 80, color: "#ef4444", radius: 17 },
      { id: 2, symbol: "C", x: 130, y: 80, color: color, radius: 18 },
      { id: 3, symbol: "O", x: 130, y: 36, color: "#ef4444", radius: 17 },
      { id: 4, symbol: "OH", x: 175, y: 114, color: "#ef4444", radius: 18 },
    ]
    const bonds: ChemBond[] = [
      { source: 0, target: 1, order: 1 },
      { source: 1, target: 2, order: 1 },
      { source: 2, target: 3, order: 2 },
      { source: 2, target: 4, order: 1 },
    ]
    return renderNodeLinkGraph(nodes, bonds)
  }

  // 11. Sodium Hypochlorite / Pemutih Pakaian (NaClO)
  if (clean.includes("[O-]Cl") || form === "NACLO") {
    const nodes: ChemNode[] = [
      { id: 0, symbol: "Na", x: 60, y: 80, color: "#f97316", radius: 21 },
      { id: 1, symbol: "O", x: 120, y: 80, color: "#ef4444", radius: 20 },
      { id: 2, symbol: "Cl", x: 180, y: 80, color: "#84cc16", radius: 21 },
    ]
    const bonds: ChemBond[] = [
      { source: 0, target: 1, order: 1 },
      { source: 1, target: 2, order: 1 },
    ]
    return renderNodeLinkGraph(nodes, bonds)
  }

  // 12. Magnesium Hydroxide / Obat Maag (Mg(OH)₂)
  if (form === "MG(OH)2" || clean.includes("[Mg+2]")) {
    const nodes: ChemNode[] = [
      { id: 0, symbol: "OH", x: 60, y: 80, color: "#ef4444", radius: 20 },
      { id: 1, symbol: "Mg", x: 120, y: 80, color: "#f59e0b", radius: 23 },
      { id: 2, symbol: "OH", x: 180, y: 80, color: "#ef4444", radius: 20 },
    ]
    const bonds: ChemBond[] = [
      { source: 0, target: 1, order: 1 },
      { source: 1, target: 2, order: 1 },
    ]
    return renderNodeLinkGraph(nodes, bonds)
  }

  // 13. Sulfuric Acid / Air Aki (H₂SO₄ / OS(=O)(=O)O)
  if (clean === "OS(=O)(=O)O" || form === "H2SO4") {
    const nodes: ChemNode[] = [
      { id: 0, symbol: "S", x: 120, y: 80, color: "#eab308", radius: 24 },
      { id: 1, symbol: "O", x: 120, y: 34, color: "#ef4444", radius: 18 },
      { id: 2, symbol: "O", x: 120, y: 126, color: "#ef4444", radius: 18 },
      { id: 3, symbol: "HO", x: 62, y: 80, color: "#ef4444", radius: 19 },
      { id: 4, symbol: "OH", x: 178, y: 80, color: "#ef4444", radius: 19 },
    ]
    const bonds: ChemBond[] = [
      { source: 0, target: 1, order: 2 },
      { source: 0, target: 2, order: 2 },
      { source: 0, target: 3, order: 1 },
      { source: 0, target: 4, order: 1 },
    ]
    return renderNodeLinkGraph(nodes, bonds)
  }

  // 14. Sucrose / Sukrosa (C₁₂H₂₂O₁₁) -> Connected Disaccharide Rings with Oxygen Bridge
  if (form === "C12H22O11" || clean.length > 25) {
    const nodes: ChemNode[] = [
      // Glucose Ring (Left)
      { id: 0, symbol: "O", x: 65, y: 55, color: "#ef4444", radius: 13 },
      { id: 1, symbol: "C", x: 92, y: 68, color: color, radius: 13 },
      { id: 2, symbol: "C", x: 92, y: 98, color: color, radius: 13 },
      { id: 3, symbol: "C", x: 65, y: 112, color: color, radius: 13 },
      { id: 4, symbol: "C", x: 40, y: 98, color: color, radius: 13 },
      { id: 5, symbol: "C", x: 40, y: 68, color: color, radius: 13 },
      // Oxygen Bridge
      { id: 6, symbol: "O", x: 120, y: 80, color: "#ef4444", radius: 14 },
      // Fructose Ring (Right)
      { id: 7, symbol: "C", x: 146, y: 68, color: color, radius: 13 },
      { id: 8, symbol: "O", x: 175, y: 56, color: "#ef4444", radius: 13 },
      { id: 9, symbol: "C", x: 200, y: 72, color: color, radius: 13 },
      { id: 10, symbol: "C", x: 188, y: 105, color: color, radius: 13 },
      { id: 11, symbol: "C", x: 154, y: 102, color: color, radius: 13 },
    ]
    const bonds: ChemBond[] = [
      { source: 0, target: 1, order: 1 },
      { source: 1, target: 2, order: 1 },
      { source: 2, target: 3, order: 1 },
      { source: 3, target: 4, order: 1 },
      { source: 4, target: 5, order: 1 },
      { source: 5, target: 0, order: 1 },
      // Glycosidic Bond Linkage
      { source: 1, target: 6, order: 1 },
      { source: 6, target: 7, order: 1 },
      // Fructose ring bonds
      { source: 7, target: 8, order: 1 },
      { source: 8, target: 9, order: 1 },
      { source: 9, target: 10, order: 1 },
      { source: 10, target: 11, order: 1 },
      { source: 11, target: 7, order: 1 },
    ]
    return renderNodeLinkGraph(nodes, bonds)
  }

  // 15. Dynamic Auto-Layout Calculation for Any Other Arbitrary SMILES
  const dynamicGraph = parseSMILESToGraph(clean, color)
  if (dynamicGraph.nodes.length > 0) {
    return renderNodeLinkGraph(dynamicGraph.nodes, dynamicGraph.bonds)
  }

  // Fallback (Single element node)
  const displayLabel = mol.formula || mol.symbol || clean.replace(/[\[\]]/g, "") || "X"
  return `
    <svg viewBox="0 0 240 160" width="100%" height="100%" class="chem-structure-svg">
      <circle cx="120" cy="80" r="36" fill="${color}" />
      <text x="120" y="80" class="chem-atom-text" style="font-size: ${displayLabel.length > 2 ? "17px" : "22px"};">${displayLabel}</text>
    </svg>
  `
}

const STORAGE_GRAPH_MODE = "quartz_graph_view_mode"

function getStoredGraphMode(): "network" | "aufbau" | "molecule" {
  try {
    const saved = localStorage.getItem(STORAGE_GRAPH_MODE)
    if (saved === "molecule" || saved === "aufbau" || saved === "network") return saved
  } catch (_) {}
  return "network"
}

function setStoredGraphMode(mode: "network" | "aufbau" | "molecule") {
  try {
    localStorage.setItem(STORAGE_GRAPH_MODE, mode)
  } catch (_) {}
}

let aufbauSimTimer: number | null = null
let aufbauIsPlaying = false
let aufbauCurrentE = 0
let aufbauTargetZ = 0

function stopAufbauSim() {
  if (aufbauSimTimer !== null) {
    window.clearInterval(aufbauSimTimer)
    aufbauSimTimer = null
  }
  aufbauIsPlaying = false
}

function updateGraphModeState(
  mode: "network" | "aufbau" | "molecule",
  toggleGroup: HTMLElement,
  graphContainer: HTMLElement,
  molContainer: HTMLElement,
  aufbauContainer: HTMLElement,
  hudFooter: HTMLElement,
  mol?: DynamicMoleculeMeta,
) {
  stopAufbauSim()

  const tabs = toggleGroup.querySelectorAll<HTMLButtonElement>(".graph-toggle-tab")
  tabs.forEach((tab) => {
    if (tab.dataset.view === mode) {
      tab.classList.add("active")
    } else {
      tab.classList.remove("active")
    }
  })

  const globalGraphBtn = graphContainer.parentElement?.querySelector(".global-graph-icon") as HTMLElement | null

  if (mode === "molecule" && mol) {
    graphContainer.style.visibility = "hidden"
    graphContainer.style.opacity = "0"
    graphContainer.style.pointerEvents = "none"
    graphContainer.style.position = "absolute"
    graphContainer.style.top = "0"
    graphContainer.style.left = "0"
    graphContainer.style.width = "100%"
    graphContainer.style.height = "100%"
    graphContainer.style.display = "block"

    aufbauContainer.style.display = "none"
    molContainer.style.display = "flex"
    hudFooter.style.display = "block"
    if (globalGraphBtn) globalGraphBtn.style.display = "none"
    hudFooter.innerHTML = `
      <div class="graph-hud-card">
        <div class="graph-hud-title">
          <span>${mol.title}</span>
          <span class="graph-hud-badge" style="background: ${mol.color};">${mol.formula}</span>
        </div>
        <div class="graph-hud-detail">
          <span>SMILES: <code>${mol.smiles}</code></span>
          ${mol.mw ? `<span>BM: ${mol.mw} g/mol</span>` : ""}
        </div>
      </div>
    `
  } else if (mode === "aufbau" && mol) {
    stopAufbauSim()
    graphContainer.style.visibility = "hidden"
    graphContainer.style.opacity = "0"
    graphContainer.style.pointerEvents = "none"
    graphContainer.style.position = "absolute"
    graphContainer.style.top = "0"
    graphContainer.style.left = "0"
    graphContainer.style.width = "100%"
    graphContainer.style.height = "100%"
    graphContainer.style.display = "block"

    molContainer.style.display = "none"
    aufbauContainer.style.display = "flex"
    hudFooter.style.display = "block"
    if (globalGraphBtn) globalGraphBtn.style.display = "none"

    const checkpoints = getCheckpointsForZ(mol.atomicNumber)
    let currentStep = checkpoints.length // Start at complete checkpoint state
    let isPlaying = false

    hudFooter.innerHTML = `
      <div class="graph-hud-card aufbau-hud-card">
        <!-- Row 1: Nama Unsur dan Buttons Control -->
        <div class="aufbau-hud-row aufbau-hud-row-1">
          <span class="graph-hud-name">${mol.title}</span>
          <div class="aufbau-ctrl-group">
            <button type="button" class="aufbau-btn aufbau-prev-btn" title="Checkpoint Sebelumnya" aria-label="Previous">
              <span class="aufbau-btn-icon">⏮</span>
            </button>
            <button type="button" class="aufbau-btn aufbau-play-btn" title="Play / Pause Simulasi" aria-label="Play/Pause">
              <span class="aufbau-btn-icon">▶</span>
            </button>
            <button type="button" class="aufbau-btn aufbau-next-btn" title="Checkpoint Berikutnya" aria-label="Next">
              <span class="aufbau-btn-icon">⏭</span>
            </button>
            <button type="button" class="aufbau-btn aufbau-restart-btn" title="Restart Simulasi" aria-label="Restart">
              <span class="aufbau-btn-icon">🔄</span>
            </button>
            <button type="button" class="aufbau-btn aufbau-autoplay-btn" title="Autoplay Loop (Putar Berulang)" aria-label="Autoplay Loop">
              <span class="aufbau-btn-icon">🔁</span>
            </button>
          </div>
        </div>

        <!-- Row 2: Badge, Electron Counter, dan Orbital Aktif -->
        <div class="aufbau-hud-row aufbau-hud-row-2">
          <span class="graph-hud-badge" style="background: ${mol.color};">Z = ${mol.atomicNumber} (${mol.symbol})</span>
          <span class="aufbau-e-counter">e⁻: <strong style="color: ${mol.color};">${mol.atomicNumber}</strong> / ${mol.atomicNumber}</span>
          <span class="aufbau-active-orbital"><code>-</code></span>
        </div>

        <!-- Row 3: Konfigurasi Elektron -->
        <div class="aufbau-hud-row aufbau-hud-row-3">
          <code class="aufbau-config-code"></code>
        </div>
      </div>
    `

    // Initial mount of the diagram
    aufbauContainer.innerHTML = renderAufbauDiagramSVG(mol.atomicNumber, mol.color)
    updateAufbauDOM(aufbauContainer, currentStep, checkpoints, mol.atomicNumber, mol.color)
    updateAufbauHUDInfo(hudFooter, currentStep, checkpoints, mol.atomicNumber, mol.color, aufbauContainer)

    const applyStep = (stepIdx: number) => {
      currentStep = Math.max(0, Math.min(stepIdx, checkpoints.length))
      updateAufbauDOM(aufbauContainer, currentStep, checkpoints, mol.atomicNumber, mol.color)
      updateAufbauHUDInfo(hudFooter, currentStep, checkpoints, mol.atomicNumber, mol.color, aufbauContainer)
    }

    const playBtn = hudFooter.querySelector(".aufbau-play-btn") as HTMLButtonElement
    const prevBtn = hudFooter.querySelector(".aufbau-prev-btn") as HTMLButtonElement
    const nextBtn = hudFooter.querySelector(".aufbau-next-btn") as HTMLButtonElement
    const restartBtn = hudFooter.querySelector(".aufbau-restart-btn") as HTMLButtonElement
    const autoplayBtn = hudFooter.querySelector(".aufbau-autoplay-btn") as HTMLButtonElement

    let isAutoloop = false

    const updatePlayBtnUI = (playing: boolean) => {
      if (!playBtn) return
      const icon = playBtn.querySelector(".aufbau-btn-icon")
      if (icon) icon.textContent = playing ? "⏸" : "▶"
      playBtn.title = playing ? "Pause Simulasi" : "Play Simulasi"
      if (playing) {
        playBtn.classList.add("playing")
      } else {
        playBtn.classList.remove("playing")
      }
    }

    const updateAutoplayBtnUI = (active: boolean) => {
      if (!autoplayBtn) return
      if (active) {
        autoplayBtn.classList.add("active-loop")
        autoplayBtn.title = "Matikan Autoplay Loop"
      } else {
        autoplayBtn.classList.remove("active-loop")
        autoplayBtn.title = "Autoplay Loop (Putar Berulang)"
      }
    }

    const stepIntervalMs = 550

    const runAutoPlay = () => {
      if (currentStep < checkpoints.length) {
        applyStep(currentStep + 1)
        if (currentStep >= checkpoints.length) {
          if (isAutoloop) {
            if (aufbauSimTimer !== null) window.clearInterval(aufbauSimTimer)
            aufbauSimTimer = window.setTimeout(() => {
              if (isAutoloop) {
                applyStep(0)
                if (aufbauSimTimer !== null) window.clearInterval(aufbauSimTimer)
                aufbauSimTimer = window.setInterval(runAutoPlay, stepIntervalMs)
              }
            }, 1000)
          } else {
            stopAufbauSim()
            isPlaying = false
            updatePlayBtnUI(false)
          }
        }
      } else {
        if (isAutoloop) {
          applyStep(0)
        } else {
          stopAufbauSim()
          isPlaying = false
          updatePlayBtnUI(false)
        }
      }
    }

    if (playBtn) {
      playBtn.addEventListener("click", () => {
        if (isPlaying) {
          stopAufbauSim()
          isPlaying = false
          isAutoloop = false
          updatePlayBtnUI(false)
          updateAutoplayBtnUI(false)
        } else {
          if (currentStep >= checkpoints.length) {
            applyStep(0)
          }
          isPlaying = true
          updatePlayBtnUI(true)
          if (aufbauSimTimer !== null) window.clearInterval(aufbauSimTimer)
          aufbauSimTimer = window.setInterval(runAutoPlay, stepIntervalMs)
        }
      })
    }

    if (autoplayBtn) {
      autoplayBtn.addEventListener("click", () => {
        if (isAutoloop) {
          isAutoloop = false
          updateAutoplayBtnUI(false)
          stopAufbauSim()
          isPlaying = false
          updatePlayBtnUI(false)
        } else {
          isAutoloop = true
          updateAutoplayBtnUI(true)
          if (currentStep >= checkpoints.length) {
            applyStep(0)
          }
          isPlaying = true
          updatePlayBtnUI(true)
          if (aufbauSimTimer !== null) window.clearInterval(aufbauSimTimer)
          aufbauSimTimer = window.setInterval(runAutoPlay, stepIntervalMs)
        }
      })
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        stopAufbauSim()
        isPlaying = false
        isAutoloop = false
        updatePlayBtnUI(false)
        updateAutoplayBtnUI(false)
        applyStep(currentStep - 1)
      })
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        stopAufbauSim()
        isPlaying = false
        isAutoloop = false
        updatePlayBtnUI(false)
        updateAutoplayBtnUI(false)
        applyStep(currentStep + 1)
      })
    }

    if (restartBtn) {
      restartBtn.addEventListener("click", () => {
        stopAufbauSim()
        applyStep(0)
        isPlaying = true
        updatePlayBtnUI(true)
        if (aufbauSimTimer !== null) window.clearInterval(aufbauSimTimer)
        aufbauSimTimer = window.setInterval(runAutoPlay, stepIntervalMs)
      })
    }

    // Interactive Checkpoint Node Click
    const nodeGroups = aufbauContainer.querySelectorAll<SVGGElement>(".aufbau-node-group")
    nodeGroups.forEach((group) => {
      const orbName = group.dataset.orb
      if (!orbName) return
      group.style.cursor = "pointer"
      group.addEventListener("click", () => {
        const foundIdx = checkpoints.findIndex((cp) => cp.orbitalName === orbName)
        if (foundIdx !== -1) {
          stopAufbauSim()
          isPlaying = false
          isAutoloop = false
          updatePlayBtnUI(false)
          updateAutoplayBtnUI(false)
          applyStep(foundIdx + 1)
        }
      })
    })
  } else {
    graphContainer.style.visibility = "visible"
    graphContainer.style.opacity = "1"
    graphContainer.style.pointerEvents = "auto"
    graphContainer.style.position = ""
    graphContainer.style.top = ""
    graphContainer.style.left = ""
    graphContainer.style.width = "100%"
    graphContainer.style.height = "100%"
    graphContainer.style.display = "block"

    molContainer.style.display = "none"
    aufbauContainer.style.display = "none"
    hudFooter.style.display = "none"
    if (globalGraphBtn) globalGraphBtn.style.display = ""

    // Force Quartz relational graph redraw & layout reflow
    const triggerGraphRender = () => {
      try {
        document.dispatchEvent(new CustomEvent("render"))
        window.dispatchEvent(new Event("resize"))
      } catch (err) {
        console.warn("[chemistryGraph] Error re-rendering network graph:", err)
      }
    }
    triggerGraphRender()
    requestAnimationFrame(triggerGraphRender)
  }
}

/**
 * Initialize Multi-Mode Sidebar Graph:
 * [ 🌐 Relasi ] (Force-directed network) <---> [ ⚡ Aufbau ] (Diagonal orbital rule) <---> [ 🧪 Molekul ] (2D Chemical Structure)
 * Persists selected tab across page switching via localStorage!
 */
function initSidebarDualModeGraph() {
  const graphEl = document.querySelector(".graph")
  if (!graphEl) return

  const h3 = graphEl.querySelector("h3")
  const graphOuter = graphEl.querySelector(".graph-outer") as HTMLElement
  const graphContainer = graphEl.querySelector(".graph-container") as HTMLElement
  if (!h3 || !graphOuter || !graphContainer) return

  // 1. Ensure Header Segmented Tab Bar exists
  let toggleGroup = graphEl.querySelector(".graph-view-toggle") as HTMLElement
  if (!toggleGroup) {
    const headerBar = document.createElement("div")
    headerBar.className = "graph-header"
    h3.parentNode?.insertBefore(headerBar, h3)
    headerBar.appendChild(h3)

    toggleGroup = document.createElement("div")
    toggleGroup.className = "graph-view-toggle"
    toggleGroup.innerHTML = `
      <button type="button" class="graph-toggle-tab" data-view="network" title="Relational Force Network">🌐 Relasi</button>
      <button type="button" class="graph-toggle-tab" data-view="aufbau" title="Aufbau Orbital Filling Rule">⚡ Aufbau</button>
      <button type="button" class="graph-toggle-tab" data-view="molecule" title="2D Chemical Structure Formula">🧪 Molekul</button>
    `
    headerBar.appendChild(toggleGroup)

    // Bind tab clicks once
    const tabs = toggleGroup.querySelectorAll<HTMLButtonElement>(".graph-toggle-tab")
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const view = (tab.dataset.view as "network" | "aufbau" | "molecule") || "network"
        setStoredGraphMode(view)
        const currentMolContainer = graphOuter.querySelector(".graph-molecule-container") as HTMLElement
        const currentAufbauContainer = graphOuter.querySelector(".graph-aufbau-container") as HTMLElement
        const currentHudFooter = graphEl.querySelector(".graph-hud-footer") as HTMLElement
        const currentMol = resolveDynamicMetadata()
        if (currentMolContainer && currentAufbauContainer && currentHudFooter) {
          updateGraphModeState(view, toggleGroup, graphContainer, currentMolContainer, currentAufbauContainer, currentHudFooter, currentMol)
        }
      })
    })
  }

  // 2. Ensure Molecule Container exists inside graphOuter
  let molContainer = graphOuter.querySelector(".graph-molecule-container") as HTMLElement
  if (!molContainer) {
    molContainer = document.createElement("div")
    molContainer.className = "graph-molecule-container"
    molContainer.style.display = "none"
    graphOuter.appendChild(molContainer)
  }

  // 3. Ensure Aufbau Container exists inside graphOuter
  let aufbauContainer = graphOuter.querySelector(".graph-aufbau-container") as HTMLElement
  if (!aufbauContainer) {
    aufbauContainer = document.createElement("div")
    aufbauContainer.className = "graph-aufbau-container"
    aufbauContainer.style.display = "none"
    graphOuter.appendChild(aufbauContainer)
  }

  // 4. Ensure Dedicated HUD Footer exists outside graphOuter (spawned strictly BELOW graph frame)
  let hudFooter = graphEl.querySelector(".graph-hud-footer") as HTMLElement
  if (!hudFooter) {
    hudFooter = document.createElement("div")
    hudFooter.className = "graph-hud-footer"
    hudFooter.style.display = "none"
    graphOuter.parentNode?.insertBefore(hudFooter, graphOuter.nextSibling)
  }

  const path = window.location.pathname.toLowerCase()
  const pageTitle = (document.querySelector("h1.article-title")?.textContent || "").trim()
  const isChemical = isChemicalEntity(path, pageTitle, document.body)

  // If page is NOT an element, compound, or alias:
  // Revert graph frame strictly to default relational graph!
  if (!isChemical) {
    graphContainer.style.visibility = "visible"
    graphContainer.style.opacity = "1"
    graphContainer.style.pointerEvents = "auto"
    graphContainer.style.position = ""
    graphContainer.style.top = ""
    graphContainer.style.left = ""
    graphContainer.style.width = "100%"
    graphContainer.style.height = "100%"
    graphContainer.style.display = "block"
    molContainer.style.display = "none"
    aufbauContainer.style.display = "none"
    toggleGroup.style.display = "none"
    hudFooter.style.display = "none"
    const globalGraphBtn = graphContainer.parentElement?.querySelector(".global-graph-icon") as HTMLElement | null
    if (globalGraphBtn) globalGraphBtn.style.display = ""
    return
  }

  // Active chemistry note: show toggle bar
  toggleGroup.style.display = "inline-flex"

  // 5. Always refresh molecule card content dynamically for current active page
  const mol = resolveDynamicMetadata()
  molContainer.innerHTML = `
    <div class="chem-molecule-card">
      <div class="chem-molecule-viewport">
        ${renderChemicalStructureSVG(mol)}
      </div>
    </div>
  `

  // 6. Restore and apply the persistent graph view mode across page switching!
  const activeMode = getStoredGraphMode()
  updateGraphModeState(activeMode, toggleGroup, graphContainer, molContainer, aufbauContainer, hudFooter, mol)
}

// Lifecycle Hooks
document.addEventListener("nav", () => {
  stopAufbauSim()
  initSidebarDualModeGraph()
})
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSidebarDualModeGraph)
} else {
  initSidebarDualModeGraph()
}
