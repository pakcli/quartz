import { QuartzComponent, QuartzComponentProps } from "./types"

export const ShareActions: QuartzComponent = (props: QuartzComponentProps) => {
  const cfg = props.cfg ?? props.ctx?.cfg?.configuration
  if (!cfg?.enableShareActions) return null

  const slug = props.fileData?.slug ?? ""
  const isIndex = slug === "index" || slug === ""
  const frontmatter = props.fileData?.frontmatter

  const isExplicitlyFalse = (val: unknown) => val === false || val === "false"

  // 1. Page-level toolbar disable (via config or frontmatter)
  const enabledOnIndex = cfg.shareActionsOnIndex ?? true
  const pageToolbarDisabled =
    isExplicitlyFalse(frontmatter?.shareActions) ||
    isExplicitlyFalse(frontmatter?.enableShareActions) ||
    (isIndex && !enabledOnIndex)

  if (pageToolbarDisabled) return null

  // 2. Granular function-level disable (hide specific buttons)
  const printDisabled =
    isExplicitlyFalse(frontmatter?.printable) ||
    isExplicitlyFalse(frontmatter?.print) ||
    isExplicitlyFalse(frontmatter?.enablePrint)

  const scopeDisabled =
    isExplicitlyFalse(frontmatter?.scope) ||
    isExplicitlyFalse(frontmatter?.shareScope) ||
    isExplicitlyFalse(frontmatter?.enableScope)

  const linkDisabled =
    isExplicitlyFalse(frontmatter?.link) ||
    isExplicitlyFalse(frontmatter?.shareLink) ||
    isExplicitlyFalse(frontmatter?.enableLink)

  const copyDisabled =
    isExplicitlyFalse(frontmatter?.copy) ||
    isExplicitlyFalse(frontmatter?.copyMarkdown) ||
    isExplicitlyFalse(frontmatter?.enableCopy)

  // If all functions are disabled, hide the entire toolbar
  if (printDisabled && scopeDisabled && linkDisabled && copyDisabled) return null

  const style = cfg.shareActionsStyle ?? "icon"

  return (
    <>
      <div class="share-actions-desktop" data-style={style} aria-label="Share and Export Options">
        <div class="share-actions-cluster">
          {/* 1. Scope Dropdown Selector */}
          {!scopeDisabled && (
            <div class="share-dropdown-wrap share-scope-wrap">
              <button
                type="button"
                class="share-btn share-scope-btn"
                aria-expanded="false"
                title="Pilih Cakupan Dokumen"
              >
                <span class="share-btn-icon">🎯</span>
                <span class="share-scope-label">Active Only</span>
                <span class="share-caret">▾</span>
              </button>
              <div class="share-dropdown-menu share-scope-menu">
                <div class="share-menu-header">Cakupan Konten (Scope)</div>
                <button type="button" class="share-menu-item active" data-scope="active">
                  <span class="share-radio">●</span>
                  <span class="share-menu-text">
                    <strong>Active Only</strong>
                    <small>Halaman yang sedang dibuka saja</small>
                  </span>
                </button>
                <button type="button" class="share-menu-item" data-scope="wiki">
                  <span class="share-radio">○</span>
                  <span class="share-menu-text">
                    <strong>Active with Wikilink</strong>
                    <small>Halaman aktif + semua catatan terkait (A–Z)</small>
                  </span>
                </button>
                <button type="button" class="share-menu-item" data-scope="relation">
                  <span class="share-radio">○</span>
                  <span class="share-menu-text">
                    <strong>Active all Relation</strong>
                    <small>Seluruh jejaring relasi graf terhubung (A–Z)</small>
                  </span>
                </button>
                <button type="button" class="share-menu-item" data-scope="all">
                  <span class="share-radio">○</span>
                  <span class="share-menu-text">
                    <strong>All Pages</strong>
                    <small>Seluruh catatan dalam pustaka (A–Z)</small>
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* 2. Share Link Button */}
          {!linkDisabled && (
            <button
              type="button"
              class="share-btn share-link-btn"
              title="Salin Tautan Halaman"
              aria-label="Copy Page Link"
            >
              <span class="share-btn-icon">🔗</span>
              <span class="share-btn-text">Link</span>
            </button>
          )}

          {/* 3. Copy Markdown Button */}
          {!copyDisabled && (
            <button
              type="button"
              class="share-btn share-copy-btn"
              title="Salin Teks Markdown ke Clipboard (Folder Level & File Name A–Z)"
              aria-label="Copy Markdown Content"
            >
              <span class="share-btn-icon">📝</span>
              <span class="share-btn-text">Salin</span>
            </button>
          )}

          {/* 4. Print / Export Dropdown */}
          {!printDisabled && (
            <div class="share-dropdown-wrap share-print-wrap">
              <button
                type="button"
                class="share-btn share-print-btn"
                aria-expanded="false"
                title="Pilihan Cetak & Ekspor"
              >
                <span class="share-btn-icon">🖨️</span>
                <span class="share-btn-text">Cetak</span>
                <span class="share-caret">▾</span>
              </button>
              <div class="share-dropdown-menu share-print-menu">
                <div class="share-menu-header">Pilih Metode Ekspor</div>
                <button type="button" class="share-menu-item" data-action="print-pdf">
                  <span class="share-item-icon">🖨️</span>
                  <span class="share-menu-text">
                    <strong>Cetak PDF A4</strong>
                    <small>Vektor presisi KaTeX & SVG sesuai cakupan aktif</small>
                  </span>
                </button>
                <button type="button" class="share-menu-item" data-action="print-all">
                  <span class="share-item-icon">📑</span>
                  <span class="share-menu-text">
                    <strong>Cetak Seluruh Pustaka (All Pages)</strong>
                    <small>Kompilasi semua dokumen sekaligus ke PDF A4</small>
                  </span>
                </button>
                <button type="button" class="share-menu-item" data-action="download-md">
                  <span class="share-item-icon">📥</span>
                  <span class="share-menu-text">
                    <strong>Unduh Berkas Markdown (.md)</strong>
                    <small>Tersusun rapi Folder Depth ➔ A–Z</small>
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sticky Bottom Navigation Bar */}
      <nav class="share-actions-mobile" aria-label="Mobile Navigation and Export">
        {!scopeDisabled && (
          <button type="button" class="share-mobile-btn share-mobile-scope" aria-label="Pilih Scope Konten">
            <span class="share-mobile-icon">🎯</span>
            <span class="share-mobile-label">Scope</span>
          </button>
        )}
        {!linkDisabled && (
          <button type="button" class="share-mobile-btn share-mobile-link" aria-label="Salin Tautan">
            <span class="share-mobile-icon">🔗</span>
            <span class="share-mobile-label">Link</span>
          </button>
        )}
        {!copyDisabled && (
          <button type="button" class="share-mobile-btn share-mobile-copy" aria-label="Salin Markdown">
            <span class="share-mobile-icon">📝</span>
            <span class="share-mobile-label">Salin</span>
          </button>
        )}
        {!printDisabled && (
          <button type="button" class="share-mobile-btn share-mobile-print" aria-label="Cetak & Ekspor">
            <span class="share-mobile-icon">🖨️</span>
            <span class="share-mobile-label">Cetak</span>
          </button>
        )}
      </nav>

      {/* Mobile Modal Backdrop & Bottom Sheets */}
      <div class="share-modal-backdrop" style="display: none;"></div>

      {!scopeDisabled && (
        <div class="share-bottom-sheet share-sheet-scope" style="display: none;">
          <div class="share-sheet-handle"></div>
          <div class="share-sheet-header">Pilih Cakupan Konten (Scope)</div>
          <div class="share-sheet-body">
            <button type="button" class="share-sheet-item active" data-scope="active">
              <span class="share-radio">●</span>
              <div>
                <strong>1. Active Only</strong>
                <small>Halaman yang sedang dibuka saja</small>
              </div>
            </button>
            <button type="button" class="share-sheet-item" data-scope="wiki">
              <span class="share-radio">○</span>
              <div>
                <strong>2. Active with Wikilink</strong>
                <small>Halaman aktif + semua catatan terkait (A–Z)</small>
              </div>
            </button>
            <button type="button" class="share-sheet-item" data-scope="relation">
              <span class="share-radio">○</span>
              <div>
                <strong>3. Active all Relation</strong>
                <small>Seluruh jejaring relasi graf terhubung (A–Z)</small>
              </div>
            </button>
            <button type="button" class="share-sheet-item" data-scope="all">
              <span class="share-radio">○</span>
              <div>
                <strong>4. All Pages</strong>
                <small>Seluruh catatan dalam pustaka (A–Z)</small>
              </div>
            </button>
          </div>
          <button type="button" class="share-sheet-close">Tutup</button>
        </div>
      )}

      {!printDisabled && (
        <div class="share-bottom-sheet share-sheet-print" style="display: none;">
          <div class="share-sheet-handle"></div>
          <div class="share-sheet-header">Format Cetak & Ekspor</div>
          <div class="share-sheet-body">
            <button type="button" class="share-sheet-item" data-action="print-pdf">
              <span class="share-item-icon">🖨️</span>
              <div>
                <strong>Cetak PDF A4</strong>
                <small>Format cetak A4 sesuai cakupan aktif</small>
              </div>
            </button>
            <button type="button" class="share-sheet-item" data-action="print-all">
              <span class="share-item-icon">📑</span>
              <div>
                <strong>Cetak Seluruh Pustaka (All Pages)</strong>
                <small>Kompilasi semua dokumen sekaligus ke PDF A4</small>
              </div>
            </button>
            <button type="button" class="share-sheet-item" data-action="download-md">
              <span class="share-item-icon">📥</span>
              <div>
                <strong>Unduh Berkas Markdown (.md)</strong>
                <small>Dokumen terkompilasi tersusun rapi A–Z</small>
              </div>
            </button>
          </div>
          <button type="button" class="share-sheet-close">Batal</button>
        </div>
      )}
    </>
  )
}

export default (() => ShareActions) as unknown as QuartzComponent
