---
title: Complete Operational Guide - Quartz v5 Decoupled Runner
category: user-guide
tags: [quartz, v5, decoupled, guide, how-to, setup, tutorial]
---

# 📖 Complete Operational Guide: Quartz v5 Decoupled Runner

> **Target Audience**: Developers, Note-takers, and Operators.  
> **Master Architectural Brief**: [[brief/v01-01_quartzv5-decoupled-runner.md|Master Brief (v01-01)]]  
> **Official Engine Repo**: `https://github.com/pakcli/quartz` (`v5-decoupled-content-architecture`)

[English](#-english) | [Bahasa Indonesia](#-bahasa-indonesia)

---

<a id="english"></a>
## 🇬🇧 English

### 📑 Table of Contents
1. [1. Prerequisites](#1-prerequisites)
2. [2. Quickstart (60 Seconds)](#2-quickstart-60-seconds)
3. [3. The 3 Execution Modes Runbook](#3-the-3-execution-modes-runbook)
   * [3.1 Mode 1: Local ➔ Local (Pure Offline Preview)](#31-mode-1-local--local-pure-offline-preview)
   * [3.2 Mode 2: Local ➔ Remote GitHub Cloud Staging](#32-mode-2-local--remote-github-cloud-staging)
   * [3.3 Mode 3: Repo Markdown ➔ GitHub Pages (Native CI/CD)](#33-mode-3-repo-markdown--github-pages-native-cicd)
4. [4. Theming & Environment Variables](#4-theming--environment-variables)
5. [5. Troubleshooting & FAQ](#5-troubleshooting--faq)

---

### 1. Prerequisites

Before starting, ensure your system has the following tools installed:

| Tool | Minimum Version | Purpose | Check Command |
| :--- | :---: | :--- | :--- |
| **Node.js** | `>= 22.0.0 LTS` | Quartz v5 compiler & runtime engine | `node -v` |
| **npm** / **pnpm** | `>= 10.0.0` | Package manager | `npm -v` |
| **Git** | `>= 2.40.0` | Repository & submodule management | `git --version` |
| **GitHub CLI (`gh`)** *(Optional)* | `>= 2.40.0` | Remote dispatch & workflow monitoring (Mode 2) | `gh --version` |

[⬆️ Back to Table of Contents](#-english)

---

### 2. Quickstart (60 Seconds)

To immediately launch an offline preview of your notes vault:

```bash
# 1. Navigate to the decoupled engine
cd framework-quartz/quartz

# 2. Install dependencies (first time only)
npm install

# 3. Launch live preview pointing to your notes vault
npx quartz build --serve -d "../../framework-quartz-example-chemistry-library"
```

Open your browser at **`http://localhost:8080`**. Any edits saved in Obsidian will hot-reload automatically!

[⬆️ Back to Table of Contents](#-english)

---

### 3. The 3 Execution Modes Runbook

#### 3.1 Mode 1: Local $\longrightarrow$ Local (Pure Offline Preview)

* **Use Case**: 100% offline note-taking, fast local drafting, zero cloud or internet connection needed.
* **Procedure**:
  1. Open a terminal in `framework-quartz/quartz`.
  2. Start the local server with the `-d` flag pointing to your markdown vault:
     ```bash
     npx quartz build --serve -d "<relative-or-absolute-path-to-your-notes-vault>"
     ```
  3. Custom Port *(optional)*:
     ```bash
     npx quartz build --serve --port 8085 -d "<path-to-vault>"
     ```
  4. View the result in your desktop browser or Obsidian Web Viewer at `http://localhost:8080`.

---

#### 3.2 Mode 2: Local $\longrightarrow$ Remote GitHub Cloud Staging

* **Use Case**: Test the full compilation build on GitHub Actions cloud infrastructure without consuming local RAM or battery.
* **Procedure**:
  1. Ensure you have authenticated with the GitHub CLI:
     ```bash
     gh auth status
     ```
  2. Dispatch the runner manually, optionally passing a theme parameter:
     ```bash
     gh workflow run deploy.yml --repo username/my-notes-repo -f custom_theme="emerald-science"
     ```
  3. Watch live runner logs directly in your terminal:
     ```bash
     gh run watch --repo username/my-notes-repo
     ```

---

#### 3.3 Mode 3: Repo Markdown $\longrightarrow$ GitHub Pages (Native CI/CD)

* **Use Case**: Fully automated production deployment. Every `git push` to your notes repository triggers an automatic compilation and publishes your site to GitHub Pages.
* **Procedure**:
  1. **Configure Your Vault**:
     Ensure your vault contains:
     - `.github/workflows/deploy.yml` (The Decoupled Native Runner)
     - `.github/quartz.config.yaml` (Native Quartz v5 configuration overrides)
  2. **Activate GitHub Pages (One-Time Setup)**:
     - Open your repository on GitHub in a browser.
     - Go to **Settings > Pages**.
     - Under **Build and deployment > Source**, choose: **`GitHub Actions`**.
  3. **Write and Push Notes**:
     ```bash
     git add .
     git commit -m "docs: add new research notes"
     git push origin main
     ```
  4. **Automatic Deployment**:
     - The workflow pulls the engine from `https://github.com/pakcli/quartz` (`v5-decoupled-content-architecture`).
     - Injects your markdown files, assets, and theme.
     - Compiles and publishes directly to `https://<username>.github.io/<repo-name>/`.

[⬆️ Back to Table of Contents](#-english)

---

### 4. Theming & Environment Variables

The decoupled engine dynamically configures themes and features at build time via satellite vault configuration (`quartz.config.yaml`) or environment variables.

#### Declarative Build Controls (`quartz.config.yaml`)

Each satellite vault controls its presentation and feature set declaratively:

```yaml
configuration:
  # 1. Feature toggles
  enableChemistryGraph: true # true | false (Dual-Mode 2D Molecule & Structure Viewer)

  # 2. Display mode locking
  displayMode: "both"        # "both" (toggleable) | "darkOnly" (forces dark) | "lightOnly" (forces light)

  # 3. Theme Preset selection (with graceful fallback to default)
  themePreset: "emerald-science" # "emerald-science" | "cyber-matrix" | "ocean-blue" | "academic-paper" | "sunset-amber" | "default"
```

#### Supported Theme Presets

| Theme Identifier | Description | Light Accent | Dark Accent | Fallback Behavior |
| :--- | :--- | :--- | :--- | :--- |
| `emerald-science` | High-contrast emerald & mint green for science / chemistry vaults | `#059669` | `#10b981` | Preset Active |
| `cyber-matrix` | Dark terminal neon green on onyx black for engineering / DevOps | `#00aa44` | `#00ff66` | Preset Active |
| `ocean-blue` | Calm sky blue and deep navy for research & documentation | `#0284c7` | `#38bdf8` | Preset Active |
| `academic-paper` | Warm sepia, deep umber, and parchment for humanities & essays | `#78350f` | `#d97706` | Preset Active |
| `sunset-amber` | Warm terracotta and radiant golden amber | `#ea580c` | `#f97316` | Preset Active |
| `default` / *empty* | Original Quartz v5 clean slate palette | `#284b63` | `#7b97aa` | Standard Default |

> [!NOTE]
> If `themePreset` is omitted, set to `"default"`, or an unknown name is provided, the engine safely and gracefully falls back to the default Quartz theme without build interruption.

#### How to Apply Controls & Themes

* **Via Satellite Config (Recommended)**:
  Set `themePreset`, `displayMode`, and `enableChemistryGraph` in `.github/quartz.config.yaml` of your satellite notes vault. The engine detects it automatically during build.
* **Via Environment Variable (CLI / CI override)**:
  ```bash
  # Windows PowerShell
  $env:QUARTZ_THEME="cyber-matrix"; npx quartz build --serve -d "<path-to-vault>"

  # Linux / macOS
  QUARTZ_THEME="cyber-matrix" npx quartz build --serve -d "<path-to-vault>"
  ```

[⬆️ Back to Table of Contents](#-english)

---

### 5. Troubleshooting & FAQ

#### Q1: `Error: listen EADDRINUSE: address already in use :::8080`
* **Cause**: Another service or prior Quartz instance is occupying port 8080.
* **Fix**: Run Quartz on an alternate port:
  ```bash
  npx quartz build --serve --port 8088 -d "<path-to-vault>"
  ```

#### Q2: Why is the `brief/` folder not appearing on the website?
* **Answer**: This is by design! All files inside `brief/` are quarantined engineering specifications. They are filtered out by `.github/quartz.config.yaml` (`ignorePatterns: ["brief"]`) so internal documents never leak into public static sites.

#### Q3: My site shows a 404 error after deploying to GitHub Pages.
* **Fix**: Ensure that in your GitHub repository settings, **Settings > Pages > Source** is set to **`GitHub Actions`**, NOT `Deploy from a branch`.

[⬆️ Back to Table of Contents](#-english)

---

<a id="bahasa-indonesia"></a>
## 🇮🇩 Bahasa Indonesia

### 📑 Daftar Isi
1. [1. Prasyarat Sistem](#1-prasyarat-sistem)
2. [2. Mulai Cepat (60 Detik)](#2-mulai-cepat-60-detik)
3. [3. Petunjuk Eksekusi 3 Mode](#3-petunjuk-eksekusi-3-mode)
   * [3.1 Mode 1: Lokal ➔ Lokal (Offline Murni)](#31-mode-1-lokal--lokal-offline-murni)
   * [3.2 Mode 2: Lokal ➔ Remote GitHub Cloud Staging](#32-mode-2-lokal--remote-github-cloud-staging)
   * [3.3 Mode 3: Repo Catatan ➔ GitHub Pages (CI/CD Otomatis)](#33-mode-3-repo-catatan--github-pages-cicd-otomatis)
4. [4. Pengaturan Tema & Variabel Lingkungan](#4-pengaturan-tema--variabel-lingkungan)
5. [5. Pemecahan Masalah & FAQ](#5-pemecahan-masalah--faq)

---

### 1. Prasyarat Sistem

Sebelum memulai, pastikan sistem Anda memiliki perkakas berikut:

| Perkakas | Versi Minimal | Kegunaan | Perintah Cek |
| :--- | :---: | :--- | :--- |
| **Node.js** | `>= 22.0.0 LTS` | Compiler & runtime Quartz v5 | `node -v` |
| **npm** / **pnpm** | `>= 10.0.0` | Package manager | `npm -v` |
| **Git** | `>= 2.40.0` | Manajemen repositori & submodule | `git --version` |
| **GitHub CLI (`gh`)** *(Opsional)* | `>= 2.40.0` | Remote trigger & pemantauan workflow (Mode 2) | `gh --version` |

[⬆️ Kembali ke Daftar Isi](#-bahasa-indonesia)

---

### 2. Mulai Cepat (60 Detik)

Untuk langsung menjalankan preview offline dari vault catatan Anda:

```bash
# 1. Buka folder engine compiler
cd framework-quartz/quartz

# 2. Install dependensi (hanya saat pertama kali)
npm install

# 3. Jalankan server lokal mengarah ke vault catatan
npx quartz build --serve -d "../../framework-quartz-example-chemistry-library"
```

Buka peramban di **`http://localhost:8080`**. Setiap perubahan catatan di Obsidian akan otomatis ter-update secara instan!

[⬆️ Kembali ke Daftar Isi](#-bahasa-indonesia)

---

### 3. Petunjuk Eksekusi 3 Mode

#### 3.1 Mode 1: Lokal $\longrightarrow$ Lokal (Offline Murni)

* **Kegunaan**: Menulis catatan 100% offline tanpa perlu koneksi internet atau cloud token.
* **Prosedur**:
  1. Buka terminal di folder `framework-quartz/quartz`.
  2. Jalankan server dengan argumen `-d` mengarah ke folder catatan Anda:
     ```bash
     npx quartz build --serve -d "<path-ke-folder-catatan>"
     ```
  3. Ganti port *(opsional jika 8080 terpakai)*:
     ```bash
     npx quartz build --serve --port 8085 -d "<path-ke-folder-catatan>"
     ```
  4. Buka di browser desktop pada alamat `http://localhost:8080`.

---

#### 3.2 Mode 2: Lokal $\longrightarrow$ Remote GitHub Cloud Staging

* **Kegunaan**: Menguji hasil build di server cloud GitHub Actions tanpa menguras RAM atau baterai laptop.
* **Prosedur**:
  1. Pastikan Anda sudah login GitHub CLI:
     ```bash
     gh auth status
     ```
  2. Picu runner dari terminal secara manual:
     ```bash
     gh workflow run deploy.yml --repo username/my-notes-repo -f custom_theme="emerald-science"
     ```
  3. Pantau log proses build langsung di terminal:
     ```bash
     gh run watch --repo username/my-notes-repo
     ```

---

#### 3.3 Mode 3: Repo Catatan $\longrightarrow$ GitHub Pages (CI/CD Otomatis)

* **Kegunaan**: Publikasi otomatis penuh. Setiap `git push` ke repositori catatan akan memicu build otomatis dan merilis situs ke GitHub Pages.
* **Prosedur**:
  1. **Konfigurasi Vault**:
     Pastikan vault Anda memiliki:
     - `.github/workflows/deploy.yml` (CI/CD Decoupled Runner)
     - `.github/quartz.config.yaml` (Konfigurasi tema & pengaturan Quartz v5)
  2. **Aktifkan GitHub Pages (1x Setup)**:
     - Buka repositori catatan di GitHub melalui browser.
     - Buka menu **Settings > Pages**.
     - Di bagian **Build and deployment > Source**, pilih: **`GitHub Actions`**.
  3. **Tulis & Push Catatan**:
     ```bash
     git add .
     git commit -m "docs: tambah catatan senyawa baru"
     git push origin main
     ```
  4. **Penerbitan Otomatis**:
     - Workflow akan mengklon engine dari `https://github.com/pakcli/quartz` (`v5-decoupled-content-architecture`).
     - Menyuntikkan catatan, gambar, dan tema.
     - Mengompilasi dan menerbitkan langsung ke `https://<username>.github.io/<repo-name>/`.

[⬆️ Kembali ke Daftar Isi](#-bahasa-indonesia)

---

### 4. Pengaturan Tema & Variabel Lingkungan

Engine decoupled mengatur tema dan fitur secara dinamis saat build melalui konfigurasi satellite vault (`quartz.config.yaml`) atau variabel lingkungan:

#### Kontrol Build Deklaratif (`quartz.config.yaml`)

Setiap satellite vault dapat mengontrol fitur tampilan secara deklaratif:

```yaml
configuration:
  # 1. Toggle fitur
  enableChemistryGraph: true # true | false (Viewer Struktur Molekul 2D & Dual-Mode)

  # 2. Penguncian mode tampilan
  displayMode: "both"        # "both" (bisa switch) | "darkOnly" (kunci darkmode) | "lightOnly" (kunci lightmode)

  # 3. Pemilihan Preset Tema (dengan fallback otomatis ke tema standar jika kosong)
  themePreset: "emerald-science" # "emerald-science" | "cyber-matrix" | "ocean-blue" | "academic-paper" | "sunset-amber" | "default"
```

#### Preset Tema yang Didukung

| Preset Tema | Deskripsi | Aksen Terang | Aksen Gelap | Perilaku Fallback |
| :--- | :--- | :--- | :--- | :--- |
| `emerald-science` | Hijau zamrud sains dengan kontras tinggi untuk vault kimia/biologi | `#059669` | `#10b981` | Preset Aktif |
| `cyber-matrix` | Tampilan dark cyberpunk dengan aksen hijau neon untuk wikis sistem/DevOps | `#00aa44` | `#00ff66` | Preset Aktif |
| `ocean-blue` | Tampilan biru laut yang tenang untuk dokumentasi riset | `#0284c7` | `#38bdf8` | Preset Aktif |
| `academic-paper` | Nuansa sepia, umber, dan kertas perkamen untuk karya akademis/esai | `#78350f` | `#d97706` | Preset Aktif |
| `sunset-amber` | Warna hangat terakota dan amber keemasan | `#ea580c` | `#f97316` | Preset Aktif |
| `default` / *kosong* | Palet slate bersih bawaan Quartz v5 | `#284b63` | `#7b97aa` | Default Standar |

> [!NOTE]
> Jika `themePreset` tidak diisi, diisi `"default"`, atau nama tema tidak dikenal, engine akan otomatis beralih ke tema default Quartz secara anggun (*graceful fallback*) tanpa menghentikan build.

#### Cara Mengganti Tema & Kontrol

* **Melalui Konfigurasi Vault (Direkomendasikan)**:
  Atur `themePreset`, `displayMode`, dan `enableChemistryGraph` di `.github/quartz.config.yaml` pada satellite notes vault Anda. Engine akan mendeteksinya secara otomatis.
* **Melalui Variabel Lingkungan (CLI / CI override)**:
  ```bash
  # Windows PowerShell
  $env:QUARTZ_THEME="cyber-matrix"; npx quartz build --serve -d "<path-ke-vault>"

  # Linux / macOS
  QUARTZ_THEME="cyber-matrix" npx quartz build --serve -d "<path-ke-vault>"
  ```

[⬆️ Kembali ke Daftar Isi](#-bahasa-indonesia)

---

### 5. Pemecahan Masalah & FAQ

#### Q1: Muncul error `listen EADDRINUSE: address already in use :::8080`
* **Penyebab**: Port 8080 sedang digunakan oleh aplikasi lain atau proses Quartz sebelumnya.
* **Solusi**: Jalankan pada port alternatif:
  ```bash
  npx quartz build --serve --port 8088 -d "<path-ke-vault>"
  ```

#### Q2: Mengapa folder `brief/` tidak muncul di website publik?
* **Jawaban**: Ini memang disengaja! Seluruh file di folder `brief/` adalah dokumen rancangan teknis internal. Folder ini diabaikan oleh `.github/quartz.config.yaml` (`ignorePatterns: ["brief"]`) agar dokumen internal tidak bocor ke publik.

#### Q3: Muncul error 404 setelah deploy ke GitHub Pages
* **Solusi**: Pastikan di pengaturan GitHub Anda, **Settings > Pages > Source** dipilih **`GitHub Actions`**, BUKAN `Deploy from a branch`.

[⬆️ Kembali ke Daftar Isi](#-bahasa-indonesia)
