/**
 * Quartz v5 Multi-Scope Share, Export & Print Engine
 * Supported Scopes:
 *  - Active Only
 *  - Active with Wikilink
 *  - Active all Relation
 * Sorting Invariant:
 *  1. Folder level depth (Root = 0 -> Subfolder = 1 -> Child = 2)
 *  2. Folder path A–Z
 *  3. File name / Title A–Z
 */

interface ContentEntry {
  slug: string
  filePath: string
  title: string
  links?: string[]
  tags?: string[]
  content: string
}

type ShareScope = "active" | "wiki" | "relation" | "all"

let currentScope: ShareScope = "active"

function getStoredScope(): ShareScope {
  try {
    const s = localStorage.getItem("quartz-share-scope") as ShareScope
    if (s === "active" || s === "wiki" || s === "relation" || s === "all") return s
  } catch {}
  return "active"
}

function setStoredScope(s: ShareScope) {
  currentScope = s
  try {
    localStorage.setItem("quartz-share-scope", s)
  } catch {}
}

function showToast(message: string) {
  let toast = document.querySelector(".share-toast") as HTMLElement
  if (!toast) {
    toast = document.createElement("div")
    toast.className = "share-toast"
    document.body.appendChild(toast)
  }
  toast.textContent = message
  toast.classList.add("visible")
  window.setTimeout(() => {
    toast.classList.remove("visible")
  }, 2400)
}

function getFolderDepth(filePath: string): number {
  const clean = (filePath || "").replace(/\\/g, "/")
  const parts = clean.split("/").filter(Boolean)
  return Math.max(0, parts.length - 1)
}

function getFolderPath(filePath: string): string {
  const clean = (filePath || "").replace(/\\/g, "/")
  const parts = clean.split("/").filter(Boolean)
  return parts.slice(0, -1).join("/")
}

function sortDocuments(docs: ContentEntry[]): ContentEntry[] {
  return [...docs].sort((a, b) => {
    const pathA = a.filePath || a.slug
    const pathB = b.filePath || b.slug

    // 1. Folder level depth (Root 0 -> Subfolder 1 -> Child 2)
    const depthA = getFolderDepth(pathA)
    const depthB = getFolderDepth(pathB)
    if (depthA !== depthB) return depthA - depthB

    // 2. Folder path alphabetical (A-Z)
    const folderA = getFolderPath(pathA)
    const folderB = getFolderPath(pathB)
    if (folderA !== folderB) return folderA.localeCompare(folderB)

    // 3. File name / Title alphabetical (A-Z)
    const nameA = (a.title || a.slug).toLowerCase()
    const nameB = (b.title || b.slug).toLowerCase()
    return nameA.localeCompare(nameB)
  })
}

async function resolveScopedDocuments(scope: ShareScope): Promise<ContentEntry[]> {
  const currentSlug = (document.body.dataset.slug || "").replace(/\/$/, "")

  // Access Quartz static content index cache safely without crashing on rejected promise
  // @ts-ignore
  let rawData: Record<string, ContentEntry> = {}
  try {
    if (typeof fetchData !== "undefined") {
      rawData = await fetchData
    }
  } catch (err) {
    console.warn("[shareActions] fetchData unavailable:", err)
  }
  const entries = Object.values(rawData)

  let currentEntry = entries.find(
    (e) =>
      e.slug === currentSlug ||
      e.slug.replace(/\/index$/, "") === currentSlug ||
      ((currentSlug === "index" || currentSlug === "") && (e.slug === "index" || e.slug === "")),
  )

  if (!currentEntry) {
    // Fallback: construct from DOM if not in cache
    const domTitle =
      document.querySelector("h1.article-title")?.textContent?.trim() ||
      document.title.split("|")[0].trim() ||
      "Main Menu"
    const domArticle = document.querySelector("article.popover-hint") || document.querySelector("article")
    currentEntry = {
      slug: currentSlug || "index",
      filePath: currentSlug === "index" || currentSlug === "" ? "index.md" : `${currentSlug}.md`,
      title: domTitle,
      content: domArticle?.textContent?.trim() || "",
    }
  }

  if (scope === "all") {
    const valid = entries.filter((e) => e.slug && e.slug !== "tags/index")
    return sortDocuments(valid.length > 0 ? valid : [currentEntry])
  }

  if (scope === "active") {
    return [currentEntry]
  }

  if (scope === "wiki") {
    const targetSlugs = new Set<string>([
      currentEntry.slug,
      currentEntry.slug.replace(/\/index$/, ""),
    ])

    // Direct outgoing wikilinks
    if (Array.isArray(currentEntry.links)) {
      currentEntry.links.forEach((l) => {
        const clean = l.replace(/\/$/, "")
        targetSlugs.add(clean)
        targetSlugs.add(`${clean}/index`)
      })
    }

    // Direct incoming wikilinks
    entries.forEach((e) => {
      if (
        e.links &&
        e.links.some((l) => {
          const clean = l.replace(/\/$/, "")
          return (
            clean === currentEntry!.slug ||
            clean === currentEntry!.slug.replace(/\/index$/, "") ||
            ((currentEntry!.slug === "index" || currentEntry!.slug === "") && (clean === "index" || clean === ""))
          )
        })
      ) {
        targetSlugs.add(e.slug)
        targetSlugs.add(e.slug.replace(/\/index$/, ""))
      }
    })

    const matched = entries.filter(
      (e) => targetSlugs.has(e.slug) || targetSlugs.has(e.slug.replace(/\/index$/, "")),
    )
    return sortDocuments(matched.length > 0 ? matched : [currentEntry])
  }

  if (scope === "relation") {
    // Transitive Graph Traversal (BFS)
    const visited = new Set<string>([
      currentEntry.slug,
      currentEntry.slug.replace(/\/index$/, ""),
    ])
    const queue = [currentEntry.slug]
    const maxDepth = 2
    let depth = 0

    while (queue.length > 0 && depth < maxDepth) {
      const levelSize = queue.length
      for (let i = 0; i < levelSize; i++) {
        const nodeSlug = queue.shift()!
        const node = entries.find(
          (e) =>
            e.slug === nodeSlug ||
            e.slug.replace(/\/index$/, "") === nodeSlug ||
            ((nodeSlug === "index" || nodeSlug === "") && (e.slug === "index" || e.slug === "")),
        )
        if (!node) continue

        // Outgoing links
        if (node.links) {
          node.links.forEach((link) => {
            const clean = link.replace(/\/$/, "")
            if (!visited.has(clean)) {
              visited.add(clean)
              visited.add(`${clean}/index`)
              queue.push(clean)
            }
          })
        }

        // Incoming links
        entries.forEach((e) => {
          if (
            e.links &&
            e.links.some((l) => {
              const clean = l.replace(/\/$/, "")
              return clean === nodeSlug || clean === nodeSlug.replace(/\/index$/, "")
            })
          ) {
            if (!visited.has(e.slug)) {
              visited.add(e.slug)
              visited.add(e.slug.replace(/\/index$/, ""))
              queue.push(e.slug)
            }
          }
        })
      }
      depth++
    }

    const matched = entries.filter(
      (e) => visited.has(e.slug) || visited.has(e.slug.replace(/\/index$/, "")),
    )
    return sortDocuments(matched.length > 0 ? matched : [currentEntry])
  }

  return [currentEntry]
}

function compileMarkdownBundle(docs: ContentEntry[], scopeName: string): string {
  if (docs.length === 1) {
    const single = docs[0]
    return `# ${single.title}\n\n${single.content.trim()}\n`
  }

  const tocLines = docs.map((d, idx) => {
    const folder = getFolderPath(d.filePath || d.slug) || "root"
    return `${idx + 1}. [[${d.slug}|${d.title}]] _(${folder})_`
  })

  const siteTitle =
    document.querySelector(".page-title a")?.textContent?.trim() ||
    document.title.split("|")[0].trim() ||
    "Dossier Ekspor"

  let output = `# 📚 ${siteTitle} - Dossier Ekspor\n`
  output += `> **Cakupan (Scope)**: ${scopeName} | **Total Catatan**: ${docs.length} dokumen\n`
  output += `> **Urutan Berkas**: Folder Level Depth ➔ Nama Folder A–Z ➔ Judul A–Z\n\n`
  output += `## 📑 Daftar Isi (Table of Contents)\n\n`
  output += tocLines.join("\n") + "\n\n---\n\n"

  docs.forEach((d, idx) => {
    output += `<!-- Bagian ${idx + 1}: ${d.filePath} -->\n`
    output += `# ${d.title}\n\n`
    output += `${d.content.trim()}\n\n---\n\n`
  })

  return output
}

function getScopeDisplayName(scope: ShareScope): string {
  if (scope === "all") return "All Pages"
  if (scope === "wiki") return "Active with Wikilink"
  if (scope === "relation") return "Active all Relation"
  return "Active Only"
}

function updateScopeUI(scope: ShareScope) {
  // Desktop UI Update
  const scopeLabel = document.querySelector(".share-scope-label")
  if (scopeLabel) scopeLabel.textContent = getScopeDisplayName(scope)

  const scopeBtn = document.querySelector(".share-scope-btn")
  if (scopeBtn) scopeBtn.setAttribute("title", `Cakupan: ${getScopeDisplayName(scope)}`)

  const menuItems = document.querySelectorAll<HTMLElement>(".share-scope-menu .share-menu-item")
  menuItems.forEach((item) => {
    const s = item.dataset.scope
    const radio = item.querySelector(".share-radio")
    if (s === scope) {
      item.classList.add("active")
      if (radio) radio.textContent = "●"
    } else {
      item.classList.remove("active")
      if (radio) radio.textContent = "○"
    }
  })

  // Mobile Sheet Update
  const sheetItems = document.querySelectorAll<HTMLElement>(".share-sheet-scope .share-sheet-item")
  sheetItems.forEach((item) => {
    const s = item.dataset.scope
    const radio = item.querySelector(".share-radio")
    if (s === scope) {
      item.classList.add("active")
      if (radio) radio.textContent = "●"
    } else {
      item.classList.remove("active")
      if (radio) radio.textContent = "○"
    }
  })
}

function closeAllDropdowns() {
  document.querySelectorAll(".share-dropdown-wrap").forEach((wrap) => {
    wrap.classList.remove("open")
    wrap.querySelector(".share-btn")?.setAttribute("aria-expanded", "false")
  })
}

function closeMobileSheets() {
  const backdrop = document.querySelector(".share-modal-backdrop") as HTMLElement
  if (backdrop) backdrop.style.display = "none"
  document.querySelectorAll<HTMLElement>(".share-bottom-sheet").forEach((sheet) => {
    sheet.style.display = "none"
  })
}

function openMobileSheet(selector: string) {
  closeMobileSheets()
  const backdrop = document.querySelector(".share-modal-backdrop") as HTMLElement
  const sheet = document.querySelector(selector) as HTMLElement
  if (backdrop) backdrop.style.display = "block"
  if (sheet) sheet.style.display = "flex"
}

async function handleCopyLink() {
  try {
    const url = new URL(window.location.href)
    if (currentScope !== "active") {
      url.searchParams.set("scope", currentScope)
    } else {
      url.searchParams.delete("scope")
    }
    await navigator.clipboard.writeText(url.toString())
    showToast(`Tautan halaman tersalin (${getScopeDisplayName(currentScope)})! ✓`)
  } catch {
    showToast("Gagal menyalin tautan.")
  }
}

async function handleCopyMarkdown() {
  try {
    const docs = await resolveScopedDocuments(currentScope)
    const compiled = compileMarkdownBundle(docs, getScopeDisplayName(currentScope))
    await navigator.clipboard.writeText(compiled)
    showToast(`Markdown tersalin (${docs.length} dokumen, A–Z)! ✓`)
  } catch (err) {
    console.error("[shareActions] Error copying markdown:", err)
    showToast("Gagal menyalin Markdown.")
  }
}

async function handleDownloadMarkdown() {
  try {
    const docs = await resolveScopedDocuments(currentScope)
    const compiled = compileMarkdownBundle(docs, getScopeDisplayName(currentScope))
    const blob = new Blob([compiled], { type: "text/markdown;charset=utf-8" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    const baseSlug = (document.body.dataset.slug || "document").replace(/\//g, "-")
    link.download = `${baseSlug}-${currentScope}-bundle.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
    showToast(`Berkas Markdown (${docs.length} catatan) terunduh! ✓`)
  } catch (err) {
    console.error("[shareActions] Error downloading markdown:", err)
    showToast("Gagal mengunduh berkas Markdown.")
  }
}

async function handlePrintPDF(overrideScope?: ShareScope) {
  const scopeToPrint = overrideScope || currentScope
  if (scopeToPrint === "active") {
    window.print()
    return
  }

  // Multi-document bundle print: construct temporary isolated printable container
  try {
    const docs = await resolveScopedDocuments(scopeToPrint)
    let printContainer = document.getElementById("quartz-bundle-print-container")
    if (!printContainer) {
      printContainer = document.createElement("div")
      printContainer.id = "quartz-bundle-print-container"
      document.body.appendChild(printContainer)
    }

    const siteTitle =
      document.querySelector(".page-title a")?.textContent?.trim() ||
      document.title.split("|")[0].trim() ||
      "Pustaka Catatan"

    const currentSlug = (document.body.dataset.slug || "").replace(/\/$/, "")

    let bundleHTML = `
      <div class="print-bundle-cover">
        <h1 class="print-bundle-title">📚 ${siteTitle} - Berkas Cetak Dokumen</h1>
        <p class="print-bundle-meta">Cakupan: <strong>${getScopeDisplayName(scopeToPrint)}</strong> | Total Dokumen: <strong>${docs.length}</strong> | Tanggal: ${new Date().toLocaleDateString("id-ID")}</p>
        <div class="print-bundle-toc">
          <h2>📑 Daftar Isi</h2>
          <ol>
            ${docs.map((d) => `<li>${d.title} <span class="print-toc-path">(${getFolderPath(d.filePath || d.slug) || "root"})</span></li>`).join("")}
          </ol>
        </div>
      </div>
    `

    docs.forEach((doc, idx) => {
      const isCurrent = doc.slug === currentSlug || doc.slug.replace(/\/index$/, "") === currentSlug
      const articleEl = isCurrent ? document.querySelector("article.popover-hint") || document.querySelector("article") : null
      const contentHtml = articleEl
        ? articleEl.innerHTML
        : `<pre style="white-space: pre-wrap; font-family: var(--bodyFont); font-size: 0.95rem; line-height: 1.6; color: var(--dark);">${doc.content}</pre>`

      bundleHTML += `
        <section class="print-bundle-page">
          <div class="print-page-header">
            <span class="print-page-num">Dokumen ${idx + 1} dari ${docs.length}</span>
            <span class="print-page-path">${doc.filePath || doc.slug}</span>
          </div>
          <h1 class="print-article-title">${doc.title}</h1>
          <div class="print-article-content">
            ${contentHtml}
          </div>
        </section>
      `
    })

    printContainer.innerHTML = bundleHTML
    document.body.setAttribute("data-printing-bundle", "true")

    window.print()

    window.setTimeout(() => {
      document.body.removeAttribute("data-printing-bundle")
      printContainer?.remove()
    }, 1500)
  } catch (err) {
    console.error("[shareActions] Error constructing bundle print:", err)
    window.print()
  }
}

function syncShareActionsUI() {
  currentScope = getStoredScope()
  updateScopeUI(currentScope)
  closeAllDropdowns()
  closeMobileSheets()
}

function bindGlobalShareEvents() {
  // @ts-ignore
  if (window.__shareActionsBound) return
  // @ts-ignore
  window.__shareActionsBound = true

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement | null
    if (!target) return

    // 1. Scope Dropdown Toggle Button
    const scopeBtn = target.closest<HTMLButtonElement>(".share-scope-btn")
    if (scopeBtn) {
      e.stopPropagation()
      const wrap = scopeBtn.closest<HTMLElement>(".share-scope-wrap")
      if (wrap) {
        const isOpen = wrap.classList.contains("open")
        closeAllDropdowns()
        if (!isOpen) {
          wrap.classList.add("open")
          scopeBtn.setAttribute("aria-expanded", "true")
        }
      }
      return
    }

    // 2. Print Dropdown Toggle Button
    const printBtn = target.closest<HTMLButtonElement>(".share-print-btn")
    if (printBtn) {
      e.stopPropagation()
      const wrap = printBtn.closest<HTMLElement>(".share-print-wrap")
      if (wrap) {
        const isOpen = wrap.classList.contains("open")
        closeAllDropdowns()
        if (!isOpen) {
          wrap.classList.add("open")
          printBtn.setAttribute("aria-expanded", "true")
        }
      }
      return
    }

    // 3. Desktop Scope Menu Item Click
    const scopeItem = target.closest<HTMLElement>(".share-scope-menu .share-menu-item")
    if (scopeItem) {
      e.stopPropagation()
      const scope = scopeItem.dataset.scope as ShareScope
      if (scope) {
        setStoredScope(scope)
        updateScopeUI(scope)
        closeAllDropdowns()
        showToast(`Cakupan diubah ke: ${getScopeDisplayName(scope)}`)
      }
      return
    }

    // 4. Desktop Print Menu Item Click
    const printItem = target.closest<HTMLElement>(".share-print-menu .share-menu-item")
    if (printItem) {
      e.stopPropagation()
      closeAllDropdowns()
      const action = printItem.dataset.action
      if (action === "print-pdf") {
        handlePrintPDF()
      } else if (action === "print-all") {
        handlePrintPDF("all")
      } else if (action === "download-md") {
        handleDownloadMarkdown()
      }
      return
    }

    // 5. Desktop Share Link Button
    const linkBtn = target.closest<HTMLButtonElement>(".share-link-btn")
    if (linkBtn) {
      e.stopPropagation()
      handleCopyLink()
      return
    }

    // 6. Desktop Copy Markdown Button
    const copyBtn = target.closest<HTMLButtonElement>(".share-copy-btn")
    if (copyBtn) {
      e.stopPropagation()
      handleCopyMarkdown()
      return
    }

    // 7. Mobile Navbar Triggers
    const mobileScopeBtn = target.closest<HTMLButtonElement>(".share-mobile-scope")
    if (mobileScopeBtn) {
      e.stopPropagation()
      openMobileSheet(".share-sheet-scope")
      return
    }

    const mobileLinkBtn = target.closest<HTMLButtonElement>(".share-mobile-link")
    if (mobileLinkBtn) {
      e.stopPropagation()
      handleCopyLink()
      return
    }

    const mobileCopyBtn = target.closest<HTMLButtonElement>(".share-mobile-copy")
    if (mobileCopyBtn) {
      e.stopPropagation()
      handleCopyMarkdown()
      return
    }

    const mobilePrintBtn = target.closest<HTMLButtonElement>(".share-mobile-print")
    if (mobilePrintBtn) {
      e.stopPropagation()
      openMobileSheet(".share-sheet-print")
      return
    }

    // 8. Mobile Sheet Scope Item Clicks
    const sheetScopeItem = target.closest<HTMLElement>(".share-sheet-scope .share-sheet-item")
    if (sheetScopeItem) {
      e.stopPropagation()
      const scope = sheetScopeItem.dataset.scope as ShareScope
      if (scope) {
        setStoredScope(scope)
        updateScopeUI(scope)
        closeMobileSheets()
        showToast(`Cakupan: ${getScopeDisplayName(scope)}`)
      }
      return
    }

    // 9. Mobile Sheet Print Item Clicks
    const sheetPrintItem = target.closest<HTMLElement>(".share-sheet-print .share-sheet-item")
    if (sheetPrintItem) {
      e.stopPropagation()
      const action = sheetPrintItem.dataset.action
      closeMobileSheets()
      if (action === "print-pdf") {
        handlePrintPDF()
      } else if (action === "print-all") {
        handlePrintPDF("all")
      } else if (action === "download-md") {
        handleDownloadMarkdown()
      }
      return
    }

    // 10. Close Sheets & Dropdowns
    if (target.closest(".share-sheet-close") || target.classList.contains("share-modal-backdrop")) {
      closeMobileSheets()
      return
    }

    // Click outside any dropdown
    if (!target.closest(".share-dropdown-wrap")) {
      closeAllDropdowns()
    }
  })

  // Esc key dismiss
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllDropdowns()
      closeMobileSheets()
    }
  })
}

// Lifecycle Hooks
bindGlobalShareEvents()
document.addEventListener("nav", syncShareActionsUI)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", syncShareActionsUI)
} else {
  syncShareActionsUI()
}
