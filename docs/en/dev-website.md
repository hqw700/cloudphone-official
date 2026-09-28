# Website & Documentation Building Guide

This guide covers local development, site merging, and production Nginx deployment for the ScrcpyOverWebRTC **official website portal and VitePress documentation system** (located at `official-website/`).

---

## 🛠️ 1. Local Environment Setup

Navigate to the `official-website/` root directory:

```bash
cd official-website
npm install
```

### Start Local Dev Servers:
- **Landing Page Development**:
  ```bash
  npm run dev
  ```
  Preview landing page animations and styling at `http://localhost:5173`.
- **Documentation Development**:
  ```bash
  npm run docs:dev
  ```
  Preview VitePress documentation edits and live Mermaid chart rendering.

---

## 📦 2. Production Build & Static Site Merging

Run the full build pipeline to compile both the landing page and VitePress docs into the unified `dist/` production folder:

```bash
npm run build
```

Production output structure:
```text
dist/
├── index.html          # Official landing page
├── buy.html            # Commercial license portal
├── config.json         # Runtime configuration
├── assets/             # Main portal static assets
└── docs/               # Compiled VitePress static documentation
```

---

## 🚀 3. Production Deployment with Docker Nginx

Host static production files with high-performance Alpine Nginx:

```bash
docker run -d \
  --name website-nginx \
  -p 8080:80 \
  -v /data/website/dist:/usr/share/nginx/html \
  --restart always \
  nginx:alpine
```

---

## ⚙️ 4. Dynamic Runtime Configuration (`config.json`)

To update release download links, version tags, or cloud storage URLs without rebuilding the frontend, the portal employs asynchronous runtime rendering:

### Configuration File Paths:
- Source Tree: `official-website/public/config.json`
- Production Host: `/data/website/dist/config.json`

### Field Schema:
```json
{
  "latestVersion": "v0.3.5 (App v0.3.2)",
  "appVersion": "v0.3.2",
  "magiskVersion": "v0.3.5",
  "platformVersion": "v0.3.5",
  "appApkLink": "https://pan.quark.cn/s/...",
  "magiskModuleLink": "https://pan.quark.cn/s/...",
  "dockerPullCmd": "docker pull buutuu/scrcpy-over-webrtc:latest",
  "updateTime": "2026-09-05"
}
```

> 💡 **Instant Updates Without Rebuilding**: Edit this JSON file directly on your production server. Visitors see the latest download links and version numbers immediately upon page refresh.
