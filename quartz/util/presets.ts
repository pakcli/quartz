import { ColorScheme } from "./theme"

export interface PresetPalette {
  name: string
  description: string
  lightMode: ColorScheme
  darkMode: ColorScheme
}

/**
 * Predefined Thematic Presets Library for Quartz v5 Central Engine
 */
export const THEME_PRESETS: Record<string, PresetPalette> = {
  "emerald-science": {
    name: "Emerald Science",
    description: "Vibrant emerald and mint green palette for chemistry, biology, and life sciences.",
    lightMode: {
      light: "#faf8f8",
      lightgray: "#e5e5e5",
      gray: "#b8b8b8",
      darkgray: "#4e4e4e",
      dark: "#2b2b2b",
      secondary: "#059669",
      tertiary: "#10b981",
      highlight: "rgba(5, 150, 105, 0.15)",
      textHighlight: "#fff23688",
    },
    darkMode: {
      light: "#161618",
      lightgray: "#393639",
      gray: "#646464",
      darkgray: "#d4d4d4",
      dark: "#ebebec",
      secondary: "#10b981",
      tertiary: "#059669",
      highlight: "rgba(16, 185, 129, 0.15)",
      textHighlight: "#b3aa0288",
    },
  },
  "cyber-matrix": {
    name: "Cyber Matrix",
    description: "High-contrast dark terminal neon green aesthetics for systems and engineering wikis.",
    lightMode: {
      light: "#f4f4f5",
      lightgray: "#e4e4e7",
      gray: "#a1a1aa",
      darkgray: "#3f3f46",
      dark: "#18181b",
      secondary: "#00aa44",
      tertiary: "#008833",
      highlight: "rgba(0, 170, 68, 0.15)",
      textHighlight: "#00ff6644",
    },
    darkMode: {
      light: "#0a0e0c",
      lightgray: "#1b241e",
      gray: "#385240",
      darkgray: "#9cd4ac",
      dark: "#e2f5e8",
      secondary: "#00ff66",
      tertiary: "#00cc55",
      highlight: "rgba(0, 255, 102, 0.15)",
      textHighlight: "#00ff6666",
    },
  },
  "ocean-blue": {
    name: "Ocean Blue",
    description: "Deep oceanic marine and sky-blue tones for technical documentation and research.",
    lightMode: {
      light: "#f8fafc",
      lightgray: "#e2e8f0",
      gray: "#94a3b8",
      darkgray: "#334155",
      dark: "#0f172a",
      secondary: "#0284c7",
      tertiary: "#38bdf8",
      highlight: "rgba(2, 132, 199, 0.15)",
      textHighlight: "#7dd3fc88",
    },
    darkMode: {
      light: "#0b132b",
      lightgray: "#1c2541",
      gray: "#475569",
      darkgray: "#cbd5e1",
      dark: "#f1f5f9",
      secondary: "#38bdf8",
      tertiary: "#0284c7",
      highlight: "rgba(56, 189, 248, 0.15)",
      textHighlight: "#0284c788",
    },
  },
  "academic-paper": {
    name: "Academic Paper",
    description: "Warm sepia, deep umber, and parchment tones for scholarly publications and humanities.",
    lightMode: {
      light: "#fbfbf9",
      lightgray: "#e8e6e1",
      gray: "#a09c95",
      darkgray: "#4a4742",
      dark: "#1a1917",
      secondary: "#78350f",
      tertiary: "#92400e",
      highlight: "rgba(120, 53, 15, 0.12)",
      textHighlight: "#fef08a88",
    },
    darkMode: {
      light: "#1a1918",
      lightgray: "#2d2b28",
      gray: "#6b665f",
      darkgray: "#d5d0c8",
      dark: "#f5f2ec",
      secondary: "#d97706",
      tertiary: "#f59e0b",
      highlight: "rgba(217, 119, 6, 0.15)",
      textHighlight: "#d9770666",
    },
  },
  "sunset-amber": {
    name: "Sunset Amber",
    description: "Terracotta and radiant golden amber palette for creative personal gardens.",
    lightMode: {
      light: "#fffaf5",
      lightgray: "#fed7aa",
      gray: "#9a7b62",
      darkgray: "#43302b",
      dark: "#231714",
      secondary: "#ea580c",
      tertiary: "#f97316",
      highlight: "rgba(234, 88, 12, 0.15)",
      textHighlight: "#fdba7488",
    },
    darkMode: {
      light: "#18110e",
      lightgray: "#33221b",
      gray: "#684d43",
      darkgray: "#e4d3cc",
      dark: "#faede8",
      secondary: "#f97316",
      tertiary: "#ea580c",
      highlight: "rgba(249, 115, 22, 0.15)",
      textHighlight: "#ea580c66",
    },
  },
}

/**
 * Resolves a theme preset by name.
 * If empty, 'default', 'quartz', or unregistered, returns null to trigger graceful fallback to standard theme.
 */
export function resolveThemePreset(presetName?: string): PresetPalette | null {
  if (!presetName) return null
  const normalized = presetName.toLowerCase().trim()
  if (normalized === "default" || normalized === "quartz" || normalized === "") {
    return null
  }
  return THEME_PRESETS[normalized] ?? null
}
