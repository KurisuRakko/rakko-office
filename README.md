<p align="center">
  <img src="./public/logo.svg" width="120" height="120" alt="Office App Logo">
</p>

<h1 align="center">Rakko Office</h1>

<p align="center">
  <strong>A modern, local-first Office document preview and editing solution.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/framework-Next.js%2015-black.svg" alt="Framework">
  <img src="https://img.shields.io/badge/license-AGPL%20v3-orange.svg" alt="License">
</p>

<p align="center">
  <a href="README.zh-CN.md">中文版</a> | <span>English</span>
</p>

---

## 🚀 Overview

**Rakko Office** is a powerful web application designed to provide a seamless experience for viewing and editing Office documents (Word, Excel, PowerPoint) directly in your browser. Built with a "local-first" philosophy, it ensures your documents remain private and secure while providing a desktop-class editing experience.

This project is a fork of [baotlake/office-website](https://github.com/baotlake/office-website), rebranded and adapted for self-hosted Docker deployment. It ships no public instance — see [Deployment](#-deployment) to run your own.

## ✨ Key Features

- **📂 Multi-Format Support**: Open and edit `.docx`, `.xlsx`, and `.pptx` files.
- **🔒 Local-First**: Files are processed locally in your browser, ensuring data privacy.
- **⚡ Fast & Responsive**: Built with Next.js and optimized for performance.
- **🛠️ Rich Tools**: Integrated with advanced editing capabilities.
- **📦 Persistent Storage**: Uses IndexedDB for local file management.

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Lucide Icons](https://lucide.dev/)
- **Database**: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) (via `idb`)
- **Deployment**: Docker + Caddy (self-hosted static export — see below)

## 🛠️ Getting Started

### Prerequisites

- Node.js 22+
- pnpm (recommended)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd rakko-office
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧩 Local Development (OnlyOffice Assets)

OnlyOffice runtime assets (the `sdkjs` engine, `web-apps` frontend, and fonts) are **not checked into this repository** — they are pulled from the official `onlyoffice/documentserver` Docker image at build/dev time (see the `/public/v*-*/` rule in `.gitignore` and `.dockerignore`). Running `pnpm dev` on a fresh clone without these assets will not produce a working editor.

Bootstrap them locally (requires Docker):

```bash
pnpm install
bash scripts/fetch-assets.sh   # pulls assets into public/v9.3.1-1/ (defaults: DS_VERSION=9.3.1, HASH=1)
cp .env.example .env.local     # NEXT_PUBLIC_APP_ROOT must match the version/hash above
pnpm dev
```

See `scripts/fetch-assets.sh` for the version/hash arguments, and `Dockerfile` for the equivalent production build flow.

## 🚢 Deployment

This project has no managed cloud deployment — it ships as a self-hosted Docker image. The build produces a Next.js static export with the OnlyOffice DocumentServer assets baked in, served by Caddy.

```bash
./build.sh                                                  # builds rakko-office:latest (defaults: DS_VERSION=9.3.1, HASH=1, SITE_URL=http://localhost:3000, GA_ID unset)
./build.sh 9.3.1 1 https://office.example.com               # bake in your real domain
./build.sh 9.3.1 1 https://office.example.com G-XXXXXXXXXX  # optionally enable Google Analytics
docker run -p 80:80 rakko-office:latest
```

`build.sh` takes four optional positional arguments — `DS_VERSION`, `HASH`, `SITE_URL`, and `GA_ID` — followed by any extra `docker build` flags; see the script header for the full list and `Dockerfile` / `Caddyfile` for the build and serving setup. Pass your actual domain as the third argument so canonical links, the sitemap, and Open Graph metadata point somewhere real instead of the `http://localhost:3000` default (this maps to the `NEXT_PUBLIC_SITE_URL` build variable — see `.env.example`).

Google Analytics is optional and off by default: unless you pass a GA4 property ID as the fourth argument (or set `NEXT_PUBLIC_GA_ID` before building — see `.env.example`), the built site loads no analytics script and sends no request to Google, consistent with this project's "data never leaves your browser" privacy stance.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue.

## 📜 License

This project is licensed under the **GNU Affero General Public License Version 3 (AGPL v3)**. See [NOTICE.md](./NOTICE.md) for third-party attributions.

## 🙏 Acknowledgments

Special thanks to the following projects that made this possible:

- [ONLYOFFICE Web Apps](https://github.com/ONLYOFFICE/web-apps)
- [OnlyOffice x2t WASM](https://github.com/cryptpad/onlyoffice-x2t-wasm) - High-performance document conversion in the browser.
- [ONLYOFFICE SDKJS](https://github.com/ONLYOFFICE/sdkjs)
- [Office Converters](https://github.com/cryptpad/office-converters)

---

<p align="center">
  Built with ❤️ for a better office experience.
</p>
