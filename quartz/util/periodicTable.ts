/**
 * Periodic Table & Cheminformatics Color Topology SSOT
 * Compliant with IUPAC Element Families & CPK (Corey-Pauling-Koltun) Standard
 */

export interface ElementInfo {
  symbol: string
  name: string
  atomicNumber: number
  mass: number
  category: ElementCategory
  smiles: string
  color: string
}

export type ElementCategory =
  | "reactive-nonmetal"
  | "alkali-metal"
  | "alkaline-earth"
  | "transition-metal"
  | "post-transition"
  | "metalloid"
  | "halogen"
  | "noble-gas"
  | "lanthanide-actinide"
  | "covalent-compound"

export const CATEGORY_COLORS: Record<ElementCategory, { primary: string; glow: string; label: string }> = {
  "reactive-nonmetal": { primary: "#06b6d4", glow: "rgba(6, 182, 212, 0.4)", label: "Non-Logam Reaktif" },
  "alkali-metal": { primary: "#f97316", glow: "rgba(249, 115, 22, 0.4)", label: "Logam Alkali" },
  "alkaline-earth": { primary: "#f59e0b", glow: "rgba(245, 158, 11, 0.4)", label: "Logam Alkali Tanah" },
  "transition-metal": { primary: "#ea580c", glow: "rgba(234, 88, 12, 0.4)", label: "Logam Transisi" },
  "post-transition": { primary: "#10b981", glow: "rgba(16, 185, 129, 0.4)", label: "Logam Pasca-Transisi" },
  "metalloid": { primary: "#14b8a6", glow: "rgba(20, 184, 166, 0.4)", label: "Metaloid" },
  "halogen": { primary: "#84cc16", glow: "rgba(132, 204, 22, 0.4)", label: "Halogen" },
  "noble-gas": { primary: "#a855f7", glow: "rgba(168, 85, 247, 0.4)", label: "Gas Mulia" },
  "lanthanide-actinide": { primary: "#6366f1", glow: "rgba(99, 102, 241, 0.4)", label: "Lantanida & Aktinida" },
  "covalent-compound": { primary: "#0284c7", glow: "rgba(2, 132, 199, 0.4)", label: "Senyawa Kimia" },
}

export const PERIODIC_TABLE_MAP: Record<string, ElementInfo> = {
  h: { symbol: "H", name: "Hydrogen", atomicNumber: 1, mass: 1.008, category: "reactive-nonmetal", smiles: "[H]", color: "#06b6d4" },
  he: { symbol: "He", name: "Helium", atomicNumber: 2, mass: 4.003, category: "noble-gas", smiles: "[He]", color: "#a855f7" },
  li: { symbol: "Li", name: "Lithium", atomicNumber: 3, mass: 6.94, category: "alkali-metal", smiles: "[Li]", color: "#f97316" },
  be: { symbol: "Be", name: "Beryllium", atomicNumber: 4, mass: 9.012, category: "alkaline-earth", smiles: "[Be]", color: "#f59e0b" },
  b: { symbol: "B", name: "Boron", atomicNumber: 5, mass: 10.81, category: "metalloid", smiles: "[B]", color: "#14b8a6" },
  c: { symbol: "C", name: "Carbon", atomicNumber: 6, mass: 12.011, category: "reactive-nonmetal", smiles: "[C]", color: "#8b5cf6" },
  n: { symbol: "N", name: "Nitrogen", atomicNumber: 7, mass: 14.007, category: "reactive-nonmetal", smiles: "[N]", color: "#3b82f6" },
  o: { symbol: "O", name: "Oxygen", atomicNumber: 8, mass: 15.999, category: "reactive-nonmetal", smiles: "[O]", color: "#ef4444" },
  f: { symbol: "F", name: "Fluorine", atomicNumber: 9, mass: 18.998, category: "halogen", smiles: "[F]", color: "#84cc16" },
  ne: { symbol: "Ne", name: "Neon", atomicNumber: 10, mass: 20.180, category: "noble-gas", smiles: "[Ne]", color: "#a855f7" },
  na: { symbol: "Na", name: "Sodium", atomicNumber: 11, mass: 22.990, category: "alkali-metal", smiles: "[Na]", color: "#f97316" },
  mg: { symbol: "Mg", name: "Magnesium", atomicNumber: 12, mass: 24.305, category: "alkaline-earth", smiles: "[Mg]", color: "#f59e0b" },
  al: { symbol: "Al", name: "Aluminium", atomicNumber: 13, mass: 26.982, category: "post-transition", smiles: "[Al]", color: "#10b981" },
  si: { symbol: "Si", name: "Silicon", atomicNumber: 14, mass: 28.085, category: "metalloid", smiles: "[Si]", color: "#14b8a6" },
  p: { symbol: "P", name: "Phosphorus", atomicNumber: 15, mass: 30.974, category: "reactive-nonmetal", smiles: "[P]", color: "#f97316" },
  s: { symbol: "S", name: "Sulfur", atomicNumber: 16, mass: 32.06, category: "reactive-nonmetal", smiles: "[S]", color: "#eab308" },
  cl: { symbol: "Cl", name: "Chlorine", atomicNumber: 17, mass: 35.45, category: "halogen", smiles: "[Cl]", color: "#84cc16" },
  ar: { symbol: "Ar", name: "Argon", atomicNumber: 18, mass: 39.948, category: "noble-gas", smiles: "[Ar]", color: "#a855f7" },
  k: { symbol: "K", name: "Potassium", atomicNumber: 19, mass: 39.098, category: "alkali-metal", smiles: "[K]", color: "#f97316" },
  ca: { symbol: "Ca", name: "Calcium", atomicNumber: 20, mass: 40.078, category: "alkaline-earth", smiles: "[Ca]", color: "#f59e0b" },
  fe: { symbol: "Fe", name: "Iron", atomicNumber: 26, mass: 55.845, category: "transition-metal", smiles: "[Fe]", color: "#ea580c" },
  cu: { symbol: "Cu", name: "Copper", atomicNumber: 29, mass: 63.546, category: "transition-metal", smiles: "[Cu]", color: "#ea580c" },
  zn: { symbol: "Zn", name: "Zinc", atomicNumber: 30, mass: 65.38, category: "transition-metal", smiles: "[Zn]", color: "#64748b" },
  ag: { symbol: "Ag", name: "Silver", atomicNumber: 47, mass: 107.87, category: "transition-metal", smiles: "[Ag]", color: "#94a3b8" },
  au: { symbol: "Au", name: "Gold", atomicNumber: 79, mass: 196.97, category: "transition-metal", smiles: "[Au]", color: "#f59e0b" },
}

/**
 * 4-Tier Color Resolution Fallback
 */
export function resolveElementColor(meta?: {
  color?: string
  category?: string
  symbol?: string
  atomicNumber?: number
  path?: string
}): string {
  // Tier 1: Explicit Frontmatter `color`
  if (meta?.color && meta.color.trim()) {
    return meta.color.trim()
  }

  // Tier 2: Explicit Frontmatter `category`
  if (meta?.category) {
    const cat = meta.category.toLowerCase().trim() as ElementCategory
    if (CATEGORY_COLORS[cat]) {
      return CATEGORY_COLORS[cat].primary
    }
  }

  // Tier 3: Lookup by symbol or atomic number
  if (meta?.symbol) {
    const sym = meta.symbol.toLowerCase().trim()
    if (PERIODIC_TABLE_MAP[sym]) {
      return PERIODIC_TABLE_MAP[sym].color
    }
  }

  if (meta?.atomicNumber) {
    const found = Object.values(PERIODIC_TABLE_MAP).find((e) => e.atomicNumber === meta.atomicNumber)
    if (found) return found.color
  }

  // Path heuristic lookup (e.g. /unsur/fe.md)
  if (meta?.path) {
    const clean = meta.path.toLowerCase()
    for (const [key, val] of Object.entries(PERIODIC_TABLE_MAP)) {
      if (clean.includes(`/${key}.`) || clean.endsWith(`/${key}`) || clean.includes(`-${key}.`)) {
        return val.color
      }
    }
  }

  // Tier 4: Default theme accent
  return "#059669"
}
