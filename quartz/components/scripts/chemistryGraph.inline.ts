/**
 * Quartz v5 Chemistry Diagram & Dual-Mode Graph View Explorer
 * Toggle between:
 *  - Mode Konteks (Contextual Network / Knowledge Graph)
 *  - Mode Ilmiah (Bohr Atomic Orbital & Covalent Electron Structure)
 */

interface ElementData {
  name: string
  symbol: string
  atomicNumber: number
  shells: number[] // electron count per shell: [K, L, M, N]
  color: string
}

const ATOMIC_DATABASE: Record<string, ElementData> = {
  h: { name: "Hydrogen", symbol: "H", atomicNumber: 1, shells: [1], color: "#2dd4bf" },
  o: { name: "Oxygen", symbol: "O", atomicNumber: 8, shells: [2, 6], color: "#38bdf8" },
  c: { name: "Carbon", symbol: "C", atomicNumber: 6, shells: [2, 4], color: "#a78bfa" },
  fe: { name: "Iron", symbol: "Fe", atomicNumber: 26, shells: [2, 8, 14, 2], color: "#fb923c" },
}

function initChemistryGraph() {
  // Prevent duplicate insertion
  if (document.querySelector(".chemistry-widget-container")) {
    return
  }

  const article = document.querySelector("article.popover-hint") || document.querySelector("article")
  if (!article) return

  const path = window.location.pathname.toLowerCase()
  const pageTitle = (document.querySelector("h1.article-title")?.textContent || "").toLowerCase()

  // Detect if current page is chemistry-related
  const isElement = path.includes("/unsur/") || path.includes("/h") || path.includes("/o") || path.includes("/c") || path.includes("/fe")
  const isCompound = path.includes("/senyawa-kimia/") || path.includes("/h2o") || path.includes("/co2") || pageTitle.includes("h2o") || pageTitle.includes("co2")

  if (!isElement && !isCompound) {
    return
  }

  // Create widget container
  const widget = document.createElement("div")
  widget.className = "chemistry-widget-container"

  // Header and Toggle Controls
  widget.innerHTML = `
    <div class="chem-widget-header">
      <div class="chem-widget-title">
        <span class="chem-badge">CHEM-V5</span>
        <span class="chem-label">Diagram Struktur Interaktif</span>
      </div>
      <div class="chem-toggle-group">
        <button type="button" class="chem-toggle-btn active" data-mode="ilmiah">
          ⚛️ Mode Ilmiah (Orbital)
        </button>
        <button type="button" class="chem-toggle-btn" data-mode="konteks">
          🌐 Mode Konteks (Jejaring)
        </button>
      </div>
    </div>
    <div class="chem-widget-body">
      <div class="chem-view-ilmiah active"></div>
      <div class="chem-view-konteks"></div>
    </div>
  `

  // Insert before article content
  const firstHeader = article.querySelector("h1")
  if (firstHeader && firstHeader.nextSibling) {
    article.insertBefore(widget, firstHeader.nextSibling)
  } else {
    article.prepend(widget)
  }

  const viewIlmiah = widget.querySelector(".chem-view-ilmiah") as HTMLElement
  const viewKonteks = widget.querySelector(".chem-view-konteks") as HTMLElement

  // Render Mode Ilmiah (Atomic / Covalent orbital visualization)
  if (isCompound) {
    renderCompoundOrbital(viewIlmiah, path)
  } else {
    renderAtomicOrbital(viewIlmiah, path)
  }

  // Render Mode Konteks (Relational Knowledge Graph)
  renderContextualGraph(viewKonteks, path, isCompound)

  // Setup toggle handlers
  const toggleBtns = widget.querySelectorAll(".chem-toggle-btn")
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      const mode = (btn as HTMLElement).dataset.mode
      if (mode === "ilmiah") {
        viewIlmiah.classList.add("active")
        viewKonteks.classList.remove("active")
      } else {
        viewKonteks.classList.add("active")
        viewIlmiah.classList.remove("active")
      }
    })
  })
}

function renderAtomicOrbital(container: HTMLElement, path: string) {
  let elementKey = "h"
  if (path.includes("/o") || path.endsWith("/o")) elementKey = "o"
  else if (path.includes("/c") || path.endsWith("/c")) elementKey = "c"
  else if (path.includes("/fe") || path.endsWith("/fe")) elementKey = "fe"

  const data = ATOMIC_DATABASE[elementKey] || ATOMIC_DATABASE.h
  const baseRadius = 45
  const shellStep = 32
  const maxRadius = baseRadius + data.shells.length * shellStep

  let shellsSvg = ""
  let electronsSvg = ""

  data.shells.forEach((electronCount, shellIndex) => {
    const r = baseRadius + shellIndex * shellStep
    const shellName = ["K", "L", "M", "N"][shellIndex] || `S${shellIndex + 1}`

    // Shell orbit circle
    shellsSvg += `
      <circle cx="160" cy="160" r="${r}" class="chem-orbit-ring" />
      <text x="${160 + r + 4}" y="156" class="chem-shell-label">${shellName} (${electronCount}e⁻)</text>
    `

    // Electron particles on this shell
    const angleStep = (2 * Math.PI) / electronCount
    for (let i = 0; i < electronCount; i++) {
      const angle = i * angleStep
      const ex = 160 + r * Math.cos(angle)
      const ey = 160 + r * Math.sin(angle)
      electronsSvg += `
        <g class="chem-electron-particle" style="animation: chem-pulse ${2 + shellIndex}s infinite ease-in-out;">
          <circle cx="${ex}" cy="${ey}" r="4.5" fill="${data.color}" />
          <circle cx="${ex}" cy="${ey}" r="7" fill="${data.color}" opacity="0.3" />
        </g>
      `
    }
  })

  container.innerHTML = `
    <div class="chem-orbital-wrapper">
      <svg viewBox="0 0 320 320" width="320" height="320" class="chem-orbital-svg">
        <defs>
          <radialGradient id="nucleus-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="${data.color}" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#0f172a" stop-opacity="0.1" />
          </radialGradient>
        </defs>

        <!-- Orbital Shells -->
        ${shellsSvg}

        <!-- Nucleus (Atomic Core) -->
        <circle cx="160" cy="160" r="26" fill="url(#nucleus-glow)" class="chem-nucleus" />
        <text x="160" y="165" class="chem-nucleus-text">${data.symbol}</text>

        <!-- Electrons -->
        ${electronsSvg}
      </svg>
      <div class="chem-meta-panel">
        <div class="chem-meta-item"><span>Nama:</span> <strong>${data.name}</strong></div>
        <div class="chem-meta-item"><span>Nomor Atom:</span> <strong>${data.atomicNumber}</strong></div>
        <div class="chem-meta-item"><span>Jumlah Kulit:</span> <strong>${data.shells.length} (${data.shells.join(", ")})</strong></div>
        <div class="chem-meta-item"><span>Elektron Valensi:</span> <strong>${data.shells[data.shells.length - 1]}</strong></div>
      </div>
    </div>
  `
}

function renderCompoundOrbital(container: HTMLElement, path: string) {
  const isCo2 = path.includes("co2")

  if (isCo2) {
    container.innerHTML = `
      <div class="chem-orbital-wrapper">
        <svg viewBox="0 0 380 200" width="380" height="200" class="chem-orbital-svg">
          <!-- Covalent Double Bond Lines -->
          <line x1="110" y1="95" x2="190" y2="95" stroke="#38bdf8" stroke-width="3" />
          <line x1="110" y1="105" x2="190" y2="105" stroke="#38bdf8" stroke-width="3" />
          <line x1="190" y1="95" x2="270" y2="95" stroke="#38bdf8" stroke-width="3" />
          <line x1="190" y1="105" x2="270" y2="105" stroke="#38bdf8" stroke-width="3" />

          <!-- Oxygen Left -->
          <circle cx="90" cy="100" r="24" fill="#38bdf8" opacity="0.8" />
          <text x="90" y="106" class="chem-nucleus-text">O</text>

          <!-- Carbon Center -->
          <circle cx="190" cy="100" r="26" fill="#a78bfa" opacity="0.9" />
          <text x="190" y="106" class="chem-nucleus-text">C</text>

          <!-- Oxygen Right -->
          <circle cx="290" cy="100" r="24" fill="#38bdf8" opacity="0.8" />
          <text x="290" y="106" class="chem-nucleus-text">O</text>

          <!-- Bond angle text -->
          <text x="190" y="150" class="chem-shell-label">Geometri Linear: 180°</text>
        </svg>
        <div class="chem-meta-panel">
          <div class="chem-meta-item"><span>Senyawa:</span> <strong>Karbon Dioksida (CO₂)</strong></div>
          <div class="chem-meta-item"><span>Jenis Ikatan:</span> <strong>Kovalen Rangkap Dua</strong></div>
          <div class="chem-meta-item"><span>Momen Dipol:</span> <strong>0 Debye (Non-polar simetris)</strong></div>
        </div>
      </div>
    `
  } else {
    // Water (H2O) Bent Polar Molecule
    container.innerHTML = `
      <div class="chem-orbital-wrapper">
        <svg viewBox="0 0 340 240" width="340" height="240" class="chem-orbital-svg">
          <!-- Covalent Polar Bonds -->
          <line x1="170" y1="90" x2="100" y2="170" stroke="#2dd4bf" stroke-width="3.5" stroke-dasharray="2,2" />
          <line x1="170" y1="90" x2="240" y2="170" stroke="#2dd4bf" stroke-width="3.5" stroke-dasharray="2,2" />

          <!-- Central Oxygen (Negative Dipole) -->
          <circle cx="170" cy="85" r="30" fill="#38bdf8" opacity="0.85" />
          <text x="170" y="92" class="chem-nucleus-text">O (δ⁻)</text>

          <!-- Hydrogen 1 (Positive Dipole) -->
          <circle cx="95" cy="175" r="18" fill="#2dd4bf" opacity="0.85" />
          <text x="95" y="180" class="chem-nucleus-text">H (δ⁺)</text>

          <!-- Hydrogen 2 (Positive Dipole) -->
          <circle cx="245" cy="175" r="18" fill="#2dd4bf" opacity="0.85" />
          <text x="245" y="180" class="chem-nucleus-text">H (δ⁺)</text>

          <!-- Bond Angle -->
          <path d="M 140 115 A 40 40 0 0 0 200 115" fill="none" stroke="#facc15" stroke-width="1.5" />
          <text x="170" y="135" class="chem-shell-label">Sudut: 104.5°</text>
        </svg>
        <div class="chem-meta-panel">
          <div class="chem-meta-item"><span>Senyawa:</span> <strong>Dihidrogen Monoksida (H₂O)</strong></div>
          <div class="chem-meta-item"><span>Geometri:</span> <strong>Bengkok (Bent) 104.5°</strong></div>
          <div class="chem-meta-item"><span>Karakter Ikatan:</span> <strong>Kovalen Polar & Ikatan Hidrogen</strong></div>
        </div>
      </div>
    `
  }
}

function renderContextualGraph(container: HTMLElement, path: string, isCompound: boolean) {
  container.innerHTML = `
    <div class="chem-context-network">
      <div class="chem-context-card">
        <div class="chem-context-badge">INTI PENGETAHUAN</div>
        <h4>${isCompound ? "Senyawa Ilmiah" : "Unsur Dasar"}</h4>
        <p>Catatan ini bertindak sebagai node fondasi kimia.</p>
      </div>
      <div class="chem-context-arrow">───►</div>
      <div class="chem-context-card">
        <div class="chem-context-badge">IKATAN KOVALEN</div>
        <h4>Molekul Terkait</h4>
        <p>Terhubung ke [[h2o|H2O]] dan [[co2|CO2]] melalui pembagian elektron valensi.</p>
      </div>
      <div class="chem-context-arrow">───►</div>
      <div class="chem-context-card">
        <div class="chem-context-badge">APLIKASI UMUM</div>
        <h4>Kamus & Penggunaan</h4>
        <p>Terhubung ke [[water|Water]] dan [[steel|Steel]] dalam kehidupan sehari-hari.</p>
      </div>
    </div>
  `
}

// Hook into Quartz lifecycle
document.addEventListener("nav", initChemistryGraph)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChemistryGraph)
} else {
  initChemistryGraph()
}
