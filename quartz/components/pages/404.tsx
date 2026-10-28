import fs from "fs"
import path from "path"
import { i18n } from "../../i18n"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { componentRegistry } from "../registry"

const NotFound: QuartzComponent = (props: QuartzComponentProps) => {
  const { cfg, ctx } = props
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = ctx.argv.serve ? "/" : url.pathname

  const isPathTextbox =
    cfg.notFoundStyle === "pathtextbox" || cfg.notFoundStyle === "pathtexbox"

  // Discover vault logo: 1. explicit config, 2. auto-discover from vault assets
  let vaultLogo = cfg.logo
  if (!vaultLogo && ctx?.argv?.directory) {
    const candidates = [
      "assets/logo.svg",
      "assets/logo.png",
      "assets/icon.png",
      "logo.svg",
      "logo.png",
    ]
    for (const cand of candidates) {
      if (fs.existsSync(path.join(ctx.argv.directory, cand))) {
        vaultLogo = "/" + cand.replace(/\\/g, "/")
        break
      }
    }
  }

  // Check if Search component is available in component registry
  const searchEntry = componentRegistry.get("Search") ?? componentRegistry.get("search")
  let SearchComp: QuartzComponent | null = null
  if (searchEntry) {
    if (typeof searchEntry.component === "function") {
      try {
        SearchComp = componentRegistry.instantiate(
          searchEntry.component as QuartzComponentConstructor,
        )
      } catch {
        SearchComp = searchEntry.component as QuartzComponent
      }
    } else {
      SearchComp = searchEntry.component
    }
  }

  const redirectScript = `
    if (typeof fetchData !== "undefined") {
      fetchData.then(function(index) {
        var basePath = document.body.dataset.basepath || "";
        if (basePath.length > 1 && basePath.endsWith("/")) {
          basePath = basePath.slice(0, -1);
        }
        var pathname = window.location.pathname;
        var hasBasePrefix = basePath.length > 1 && pathname.startsWith(basePath);
        if (hasBasePrefix) {
          pathname = pathname.slice(basePath.length);
        }
        if (pathname.startsWith("/")) {
          pathname = pathname.slice(1);
        }
        if (pathname.endsWith("/")) {
          pathname = pathname.slice(0, -1);
        }
        if (pathname.endsWith(".html")) {
          pathname = pathname.slice(0, -5);
        }
        if (pathname.endsWith("/index")) {
          pathname = pathname.slice(0, -6);
        }
        var lowered = pathname.toLowerCase();
        if (lowered !== pathname && index[lowered] != null) {
          var prefix = hasBasePrefix ? basePath : "";
          var target = prefix + (prefix.endsWith("/") ? "" : "/") + lowered;
          window.location.replace(target);
        }
      });
    }
  `

  const pathtextboxScript = `
    (function() {
      function sync404Path() {
        var pathEl = document.getElementById("not-found-dynamic-path");
        if (pathEl) {
          var pathname = window.location.pathname || "/";
          var search = window.location.search || "";
          pathEl.textContent = pathname + search;
        }
      }
      sync404Path();
      document.addEventListener("nav", sync404Path);

      function triggerSearch() {
        var hostBtn = document.querySelector(".not-found-search-host .search-button");
        var globalBtn = document.querySelector(".search-button");
        var targetBtn = hostBtn || globalBtn;

        if (targetBtn) {
          targetBtn.click();
        } else {
          var container = document.querySelector(".search-container");
          if (container) {
            container.classList.add("active");
            var input = container.querySelector("input");
            if (input) input.focus();
          }
        }

        window.setTimeout(function() {
          var input = document.querySelector(".search-container input");
          if (input && !input.value) {
            var segments = (window.location.pathname || "").split("/").filter(Boolean);
            var lastSegment = segments.pop() || "";
            lastSegment = decodeURIComponent(lastSegment).replace(/\\.html$/, "").replace(/[-_]/g, " ");
            if (lastSegment && lastSegment !== "404") {
              input.value = lastSegment;
              input.dispatchEvent(new Event("input", { bubbles: true }));
            }
          }
        }, 150);
      }

      document.addEventListener("click", function(e) {
        var target = e.target;
        if (target && target.closest && target.closest("#not-found-search-trigger")) {
          e.preventDefault();
          triggerSearch();
        }
      });
    })();
  `

  if (!isPathTextbox) {
    return (
      <article class="popover-hint">
        <h1>404</h1>
        <p>{i18n(cfg.locale).pages.error.notFound}</p>
        <a href={baseDir}>{i18n(cfg.locale).pages.error.home}</a>
        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      </article>
    )
  }

  return (
    <article class="popover-hint not-found-article">
      <div class="not-found-card">
        {/* 1. Logo */}
        <div class="not-found-logo-container">
          {vaultLogo ? (
            <img class="not-found-custom-logo" src={vaultLogo} alt="Vault Logo" />
          ) : (
            <svg
              class="not-found-logo-svg"
              viewBox="0 0 100 110"
              width="80"
              height="88"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Application Logo"
            >
              <path
                d="M50 8 C50 8 32 38 24 64 C20 77 24 82 28 80 C34 77 40 70 50 70 C60 70 66 77 72 80 C76 82 80 77 76 64 C68 38 50 8 50 8 Z"
                fill="currentColor"
              />
              <path
                d="M50 38 L62 65 C58 63 54 62 50 62 C46 62 42 63 38 65 Z"
                fill="var(--light)"
              />
              <path
                d="M42 72 C42 72 45 82 45 88 C45 95 50 102 50 102 C50 102 55 95 55 88 C55 82 58 72 58 72 C54 75 46 75 42 72 Z"
                fill="url(#not-found-flame-grad)"
              />
              <defs>
                <linearGradient
                  id="not-found-flame-grad"
                  x1="50"
                  y1="72"
                  x2="50"
                  y2="102"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0%" stop-color="var(--secondary)" />
                  <stop offset="100%" stop-color="var(--tertiary)" />
                </linearGradient>
              </defs>
            </svg>
          )}
        </div>

        {/* 2. 404 & Not found */}
        <h1 class="not-found-headline">
          <span class="not-found-code">404:</span>{" "}
          <span class="not-found-message">Not found</span>
        </h1>

        {/* 3. Path Textbox + Search Button Row */}
        <div class="not-found-path-row">
          <div class="not-found-path-box">
            <span class="not-found-path-label">Path:</span>
            <code class="not-found-path-value" id="not-found-dynamic-path">
              /
            </code>
          </div>
          <button
            type="button"
            class="not-found-search-button"
            id="not-found-search-trigger"
            title="Search documentation for this path"
            aria-label="Open search dialog"
          >
            <svg
              class="not-found-search-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              stroke-width="2.2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span class="not-found-search-text">Search</span>
          </button>
        </div>

        {/* 4. Back to home */}
        <div class="not-found-home-wrap">
          <a href={baseDir} class="not-found-home-link">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>{i18n(cfg.locale).pages.error.home}</span>
          </a>
        </div>
      </div>

      {/* Embedded Search Host to ensure search dialog is mounted */}
      <div class="not-found-search-host">
        {SearchComp && <SearchComp {...props} />}
      </div>

      <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      <script dangerouslySetInnerHTML={{ __html: pathtextboxScript }} />
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
