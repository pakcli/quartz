import type { FilePath, FullSlug } from "@quartz-community/utils"
import { slugifyFilePath } from "@quartz-community/utils"

// Re-export shared path utilities from @quartz-community/utils
export {
  isFilePath,
  isFullSlug,
  isSimpleSlug,
  isRelativeURL,
  isAbsoluteURL,
  getFullSlug,
  slugifyFilePath,
  simplifySlug,
  joinSegments,
  endsWith,
  trimSuffix,
  stripSlashes,
  getFileExtension,
  isFolderPath,
  getAllSegmentPrefixes,
  pathToRoot,
  resolveRelative,
  splitAnchor,
  slugTag,
  transformInternalLink,
  transformLink,
  normalizeHastElement,
} from "@quartz-community/utils"

export type {
  FilePath,
  FullSlug,
  SimpleSlug,
  RelativeURL,
  TransformOptions,
} from "@quartz-community/utils"

// --- v5-specific exports below ---

export const QUARTZ = "quartz"

function getDirName(p: string): string {
  const normalized = p.replace(/\\/g, "/")
  const idx = normalized.lastIndexOf("/")
  return idx === -1 ? "." : normalized.slice(0, idx)
}

function getBaseName(p: string): string {
  const normalized = p.replace(/\\/g, "/")
  const idx = normalized.lastIndexOf("/")
  return (idx === -1 ? normalized : normalized.slice(idx + 1)).toLowerCase()
}

/**
 * Resolves the destination FullSlug for an input markdown file.
 * Dynamic Homepage Resolution Rule:
 * 1. If a directory contains `index.md`, it becomes `<dir>/index` (or `index` at root).
 *    Any `README.md` in that directory remains `<dir>/readme` (or `readme`).
 * 2. If a directory DOES NOT contain `index.md` but DOES contain `README.md` (and is not ignored),
 *    `README.md` is dynamically promoted to `<dir>/index` (or `index` at root) as the home page.
 */
export function resolveFileSlug(relativePath: string, allFiles: string[] = []): FullSlug {
  const dir = getDirName(relativePath)
  const base = getBaseName(relativePath)

  if (base === "readme.md") {
    const hasIndexInDir = allFiles.some((f) => {
      return getDirName(f) === dir && getBaseName(f) === "index.md"
    })

    if (!hasIndexInDir) {
      return (dir === "." ? "index" : `${dir}/index`) as FullSlug
    }
  }

  return slugifyFilePath(relativePath as FilePath)
}

// from micromorph/src/utils.ts
// https://github.com/natemoo-re/micromorph/blob/main/src/utils.ts#L5
const _rebaseHtmlElement = (el: Element, attr: string, newBase: string | URL) => {
  const rebased = new URL(el.getAttribute(attr)!, newBase)
  el.setAttribute(attr, rebased.pathname + rebased.hash)
}
export function normalizeRelativeURLs(el: Element | Document, destination: string | URL) {
  el.querySelectorAll('[href=""], [href^="./"], [href^="../"]').forEach((item) => {
    _rebaseHtmlElement(item, "href", destination)
  })
  el.querySelectorAll('[src=""], [src^="./"], [src^="../"]').forEach((item) => {
    _rebaseHtmlElement(item, "src", destination)
  })
}
