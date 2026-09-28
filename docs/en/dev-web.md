# Web Console Secondary Development

The ScrcpyOverWebRTC web console (located at `webrtc-operator/web-app/` in the source repository) is built with **Vue 3, Vite, and Pinia**.  
The frontend is fully open-source, allowing developers to customize dashboard layouts, apply bespoke brand logos and UI themes, extend interactive controls, and integrate the console into their proprietary portals.

---

## 🛠️ 1. Local Development Setup

Prerequisites: Node.js 18+ or 20+:

```bash
# 1. Clone repository and navigate to web-app directory
git clone https://github.com/hqw700/ScrcpyOverWebRTC.git
cd ScrcpyOverWebRTC/webrtc-operator/web-app

# 2. Install dependencies
npm install
```

---

## 🔌 2. Hot-Reload with Vite Proxy

To enjoy **sub-second Hot Module Replacement (HMR)** without rebuilding and redeploying the Go signaling server on every change, use Vite's proxy mechanism to forward API and WebSocket traffic to an active backend:

### Launch Commands:

#### Linux / macOS:
```bash
VITE_PROXY_TARGET=http://192.168.1.100:8443 npm run dev
```

#### Windows PowerShell:
```powershell
$env:VITE_PROXY_TARGET="http://192.168.1.100:8443"; npm run dev
```

### Development Experience:
- Open `http://localhost:5173/` in your browser;
- Editing Vue components or CSS triggers instant browser HMR updates, while WebRTC media streaming and touch inputs continue interacting live with remote cloud phones.

---

## 📁 3. Core Frontend Directory Structure

| File Path | Component | Key Responsibilities |
| :--- | :--- | :--- |
| **`src/views/DeviceList.vue`** | Device Matrix & Fleet View | Grid card rendering, search filtering, quick-deploy modals, and WebUSB browser onboarding guide |
| **`src/components/DeviceConsole.vue`** | Direct Control Console | Streaming canvas viewport, floating toolbar, interactive shell terminal drawer, and keymap launcher |
| **`src/composables/useWebRTC.js`** | WebRTC Core Engine | SDP/ICE candidate negotiation, HW-PTS clock alignment, multi-touch event packing, and silent auto-healing |
| **`src/components/KeymapEditor.vue`** | Visual Keymapping Editor | Drag-and-drop key placement, physical key binding, joystick D-pad tuning, and JSON schema persistence |
| **`src/components/UserDetailDrawer.vue`** | Admin User Detail Drawer | User profile edits, password resets, bulk device assignment, stream quality locks, and session eviction |
| **`src/views/ShareView.vue`** | Guest Passcode Player | Standalone lightweight player designed for guest share links and temporary passcodes |

---

## 📦 4. Production Build & Deployment

### 1. Build Production Bundle:
```bash
npm run build
```
Compiled production assets output to `webrtc-operator/web-app/dist/`.

### 2. Deploy:
- **Standalone Binary**: Copy files from `dist/` into the `assets/` directory specified by your signaling server, then restart the server.
- **Docker**: Mount your custom directory to `/app/assets` using `-v /path/to/dist:/app/assets`.
