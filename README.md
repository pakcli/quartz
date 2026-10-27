# ⚡ Quartz v5 Central Engine (Decoupled Architecture)

> Central standalone compiler & engine hub powering decoupled satellite note vaults.

[English](#-english) | [Bahasa Indonesia](#-bahasa-indonesia)

---

<a id="english"></a>
## 🇬🇧 English

### 1. Overview

#### 🎯 Who Is It For? (Target Audience)
* **Digital Garden Architects & Maintainers**: Developers who manage and compile multiple note vaults or wikis from a single central engine.
* **Open-Source Communities & Research Teams**: Who want to update KaTeX plugins, layout components, and D3 visualizers once at the core, automatically propagating upgrades to all satellite vaults.
* **Obsidian & Markdown Enthusiasts**: Seeking complete separation between creative writing (notes) and web static compiler technologies.

#### 💡 Why Is It Great? (Value Proposition)
* **Single Source of Truth Compiler**: All Quartz v5 TypeScript core files, custom SCSS stylesheets, layout components, and transformer plugins reside here (`https://github.com/pakcli/quartz`).
* **Update Once, Upgrade Everywhere**: Updating a plugin or styling here propagates immediately to all connected note vaults on their next git push without touching individual note files.
* **Zero Dependency Vaults**: End-user personal vaults stay 100% clean, requiring zero `node_modules` or local npm configuration.

#### 🧪 Example Use Cases
1. **Multi-Vault Publishing Hub**: Powering chemistry dictionaries ([`framework-quartz-example-chemistry-library`](../framework-quartz-example-chemistry-library)), IT & DevOps handbooks, and personal encyclopedias.
2. **Offline Desktop Development (Mode 1)**: Mounting the central local engine against any local vault path via the `-d` flag for instant live-preview.
3. **Automated Cloud CI/CD (Mode 3)**: Acting as the remote git clone target for GitHub Actions cloud runners across separate satellite vaults.

---

### 2. Features

* ⚡ **Decoupled Architecture Hub**: Standalone compiler engine accepting dynamic external vault directories via `-d <vault-path>`.
* 🧪 **Dual-Mode Graph Physics**: Interactive graph engine supporting organic relational networks (Force-Directed) and scientific Bohr atomic orbital structures (Concentric Radial Shells).
* 🎨 **Build-Time Theming Engine**: Evaluates `QUARTZ_THEME` (`emerald-science`, `cyber-matrix`, `ocean-blue`) at build time without modifying code.
* 🚀 **Zero-Branch Native Deployment**: Fully compatible with GitHub Pages Artifacts (`actions/deploy-pages@v4`), eliminating `gh-pages` branch clutter.
* 🛡️ **Quarantined Architecture Brief**: Stores engineering blueprints (`brief/v01-01_*.md`) that are automatically excluded from public static HTML output.

---

### 3. How It Works

The engine acts as a pure compiler receiving dynamic content injection from satellite vaults:

```text
┌────────────────────────────────────────────────────────┐
│ Satellite Vaults (Notes & Assets Only)                 │
│ • chem-garden/      (Notes + Assets + .github/config)  │
│ • it-library/       (Notes + Assets + .github/config)  │
└───────────────────────────┬────────────────────────────┘
                            │ (Trigger Git Push)
                            ▼
┌────────────────────────────────────────────────────────┐
│ Cloud Runner / Local Compiler Engine                   │
│ 1. Engine Repo: https://github.com/pakcli/quartz       │
│ 2. Injects satellite notes into /content               │
│ 3. Executes build: npx quartz build                    │
│ 4. Publishes static bundle to GitHub Pages / Localhost │
└────────────────────────────────────────────────────────┘
```

> 📖 **Complete Operational Guide**:  
> For full step-by-step instructions (Mode 1: Offline Local, Mode 2: Remote Dispatch, Mode 3: CI/CD Deployment):  
> 👉 **[Open Operational Guide (GUIDE.md)](./GUIDE.md)**  
> 👉 **[Open Master Architectural Brief (brief/v01-01_quartzv5-decoupled-runner.md)](./brief/v01-01_quartzv5-decoupled-runner.md)**

---

### 4. License

Distributed under the **MIT License**. Open-source for personal and educational use.

---

<a id="bahasa-indonesia"></a>
## 🇮🇩 Bahasa Indonesia

### 1. Ringkasan (Overview)

#### 🎯 Untuk Siapa (Target Audience)
* **Digital Garden Architects & Maintainers**: Pengembang yang mengelola beberapa repositori catatan Obsidian sekaligus dari satu engine pusat.
* **Komunitas Sains & Tim Riset**: Yang membutuhkan visualisasi khusus (seperti diagram orbital atom Bohr atau KaTeX) yang otomatis terintegrasi.
* **Pengembang Obsidian / Markdown**: Yang menginginkan pemisahan total antara konten pemikiran dan teknologi web compiler.

#### 💡 Bagus Kenapa (Value Proposition)
* **Single Source of Truth Compiler**: Seluruh kode TypeScript Quartz v5, custom styling SCSS, layout komponen, dan transformer plugins tersentralisasi di sini (`https://github.com/pakcli/quartz`).
* **Update Sekali, Wariskan ke Semua Vault**: Saat Anda menambahkan plugin baru atau memperbarui tema, Anda cukup memperbarui repositori engine ini. Seluruh repositori satelit (vault notes) otomatis mewarisi upgrade pada git push berikutnya tanpa perlu menyentuh file catatan.
* **Bebas Dependensi di Vault Catatan**: Vault catatan pengguna tetap bersih 100% tanpa folder `node_modules` atau script build berat.

#### 🧪 Case Contoh (Example Use Cases)
1. **Multi-Vault Publishing Hub**: Mentenagai kompilasi kamus kimia ([`framework-quartz-example-chemistry-library`](../framework-quartz-example-chemistry-library)), repositori IT & DevOps, hingga ensiklopedia personal.
2. **Offline Desktop Development (Mode 1)**: Menghubungkan engine lokal ke folder catatan manapun di komputer secara instan menggunakan flag `-d`.
3. **Automated Cloud CI/CD (Mode 3)**: Menjadi target clone otomatis bagi GitHub Actions runner di repositori catatan eksternal.

---

### 2. Fitur Utama (Features)

* ⚡ **Decoupled Architecture Hub**: Compiler mandiri yang menerima input folder catatan dinamis via `-d <vault-path>`.
* 🧪 **Dual-Mode Graph Physics**: Komponen visual interaktif yang mendukung jaringan konseptual (force-directed) dan model orbital atom Bohr saintifik (radial shell).
* 🎨 **Build-Time Theming Engine**: Membaca variabel `QUARTZ_THEME` (`emerald-science`, `cyber-matrix`, `ocean-blue`) secara dinamis saat kompilasi.
* 🚀 **Zero-Branch Native Deployment**: Kompatibel penuh dengan GitHub Pages Artifacts (`actions/deploy-pages@v4`).
* 🛡️ **Quarantined Architecture Brief**: Memuat dokumen spesifikasi teknis (`brief/v01-01_*.md`) yang otomatis terisolasi dari output static HTML publik.

---

### 3. Cara Kerja (How It Works)

Engine ini bertindak sebagai kompilator murni yang menerima injeksi konten dari luar:
1. Repositori satelit memicu Git push.
2. Runner mengklon engine pusat ini (`https://github.com/pakcli/quartz`).
3. Catatan satelit diinjeksi ke folder `/content` dan dikompilasi via `npx quartz build`.
4. Hasil statis diterbitkan ke GitHub Pages tanpa branch `gh-pages`.

> 📖 **Panduan Lengkap Instalasi & Cara Pakai**:  
> Untuk panduan langkah demi langkah (Mode 1: Offline Local, Mode 2: Remote Dispatch, Mode 3: CI/CD Otomatis):  
> 👉 **[Buka Panduan Lengkap (GUIDE.md)](./GUIDE.md)**  
> 👉 **[Buka Spesifikasi Master Brief (brief/v01-01_quartzv5-decoupled-runner.md)](./brief/v01-01_quartzv5-decoupled-runner.md)**

---

### 4. Lisensi (License)

Didistribusikan di bawah lisensi **MIT License**.
