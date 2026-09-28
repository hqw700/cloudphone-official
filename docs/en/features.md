# Core Feature Matrix

This document provides a comprehensive overview of all core capabilities in **ScrcpyOverWebRTC**. Every feature has been tested in production environments across physical hardware, emulators, and containerized virtualization.

---

## 📊 Feature Matrix Overview

| Category | Key Capabilities | Use Cases & Benefits |
| :--- | :--- | :--- |
| **Streaming & Latency** | WebRTC P2P direct, IPv6 direct, TURN fallback, HW-PTS passthrough, Opus audio capture, Baseline Profile enforcement | Ultra-low interactive latency (15~40ms), jitter-free touch response, guaranteed codec compatibility. |
| **Matrix Dashboard & Group Control** | Low-bitrate H.264 preview, WebCodecs GPU decoding, viewport visibility throttling, direct preview touch, synchronized group input | Matrix surveillance across hundreds of devices simultaneously with direct canvas touch. |
| **Multi-Tenant & Security** | Administrator vs. Standard user roles, device-to-user assignment, streaming policy enforcement, operation audit logs (`admin_logs.json`) | Team isolation, secure asset allocation, audit trails for corporate compliance. |
| **Sharing & Card Passcode** | Time-limited links, 8-character card code (`CP-XXXX-XXXX`), Read-only vs. Full control, PIN password protection, standalone guest player | Zero-login guest demonstrations, temporary equipment leasing, accidental touch prevention. |
| **Input & Keymapping** | 100% full IME Chinese/text injection, silent two-way clipboard, visual keymapping editor (Tap/Joystick/Swipe/Command) | Mobile gaming on PC, smooth desktop IME typing directly on Android, cross-device copy-paste. |
| **Shell & File Management** | Multi-session xterm.js interactive terminal, batch command broadcast, WebADB P2P tunnel, DataChannel file center, silent APK distribution | Batch fleet maintenance, fast diagnostic inspection, instant APK installation and remote file browsing. |
| **AI Diagnosis Assistant** | Compatible with OpenAI, Claude, DeepSeek; streaming thinking logs; native Function Tool Calling (ADB, WebRTC stats, touch) | Automated latency and stream diagnostics with actionable suggestions. |
| **HAL Hardware Emulation** | Camera HAL injection (TCP 9001), GPS HAL mock location (TCP 9002), Sensors HAL gyro/accelerometer simulation (TCP 9003) | QR scanning simulation, LBS location mocking, sensor automated testing. |
| **Flexible Deployment** | Driverless WebUSB setup, PC one-click scripts, Magisk boot-persistence module, Android App client, Docker AIO container, Standalone offline mode | From 10-second casual onboarding to large-scale data-center server racks. |

---

## 🔍 Module Details

### 1. Media Streaming & Low-Latency Engine
- **Transport Architecture**: Built on Pion WebRTC (Go). Defaults to UDP P2P direct streaming. Automatically leverages IPv6 for direct zero-cost public traffic. Gracefully falls back to integrated coturn TURN relays on restrictive symmetric NATs.
- **Hardware Codec Compatibility**: Enforces Baseline Profile (`profile=1`) on physical devices, avoiding WASM/WebCodecs decoding black screens on high-end chipsets.
- **Hardware PTS Timing**: Microsecond timestamps (`ptsUs`) from Android's MediaCodec are directly forwarded into RTP packets, paired with a 10 FPS duplicate-frame keepalive to stop jitter buffer inflation during static scenes.
- **Audio Capture**: Captures internal Opus audio via local UDS and streams it through dedicated WebRTC audio tracks.

### 2. Matrix Dashboard & Synchronous Group Control
- **WebCodecs Hardware Acceleration**: Lightweight H.264 preview streams are decoded directly on the GPU using WebCodecs into HTML5 Canvas.
- **Viewport-Aware Throttling**: Real-time streams only play for cards currently visible in the browser viewport (5~10 FPS), dropping to lightweight static snapshots when scrolled out of view.
- **Direct Preview Control**: Touch events can be sent directly on the dashboard cards without establishing full WebRTC sessions.

### 3. Multi-Tenant Role & Asset Management
- **Role Hierarchy**: Super Administrator (`admin`) and Standard User (`user`), with customizable VIP privileges.
- **Device Isolation**: Administrators assign specific devices to designated users. Unassigned devices remain invisible to regular users.
- **Audit Logging**: All administrative actions (user edits, password resets, quota changes, device assignments) are atomically logged to `admin_logs.json` for corporate audit trails.

### 4. Temporary Sharing & Card Passcode System
- **Ephemeral Credentials**: Create expiring share links or 8-digit redemption codes (`CP-XXXX-XXXX`) valid from 30 minutes to permanent.
- **Read-Only Mode & PIN**: Toggle between full interactive control or read-only view mode, protected by optional PIN passwords.
- **Zero-Login Guest Player**: Clients access a dedicated, clean player interface without account registration.

### 5. Advanced Input & Keymapping Engine
- **Full Text & IME Composition**: A hidden 1px textarea captures composition sessions, automatically routing non-ASCII text through clipboard injection to ensure 100% accurate text entry.
- **Silent Bidirectional Clipboard**: Focus changes trigger seamless clipboard sync, complete with loopback-prevention hash matching.
- **Visual Keymapping Editor**: Easily configure Tap, 8-directional Joystick, Swipe, and Command shortcuts for mobile games and desktop productivity.
