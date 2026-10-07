# Core Feature Matrix

This document provides a comprehensive overview of all core capabilities in **ScrcpyOverWebRTC**. Every feature has been tested and verified in production environments across physical hardware, emulators, and containerized virtualization (Docker Redroid).

---

## 📊 Feature Matrix Overview

| Category | Key Capabilities | Use Cases & Core Benefits |
| :--- | :--- | :--- |
| **🚀 Streaming & Dual-Track Connectivity** | WebRTC P2P direct (15~40ms), WebSocket streaming (100% TCP traversal), IPv6 zero-cost direct, TURN fallback, microsecond timing alignment, Opus audio capture, all-profile H.264 compatibility | Balances ultra-low interactive latency with strict enterprise firewall traversal; zero-delay seamless mode switching. |
| **📺 Matrix Dashboard & Fleet Control** | H.264 preview streaming (WebCodecs hardware decoding), Pub/Sub targeted dispatching, 4-tier streaming scopes (visible/all/selected/tag), direct canvas touch, 200+ device concurrent group control | Low-power, low-bandwidth matrix monitoring across 100+ devices; millisecond event dispatch; zero-leak multi-tenant isolation. |
| **📷 Camera Surveillance Mode** | Hardware-direct camera streaming (screen-off / zero CPU copy), physical multi-camera hardware zoom (ultra-wide/main/telephoto), PTZ digital panning, professional OSD watermark, 4K/1080P/720P switching, Camera Eco Mode | Turns idle physical Android phones into ultra-low-latency professional surveillance nodes with ambient audio listening, snapshots, and local video recording. |
| **◫ Multi-Device Workspace** | Multi-device concurrent control, Grid tiling layout, Keep-Alive multi-tabs layout, Floating windows workspace, Audio focus & neon focus borders, mobile-native single device mode | Adapts to single-device debugging, dual-phone comparison, 4-grid monitoring, and multi-device matrix workflows. |
| **💬 Batch Text & Quick Phrase Library** | Batch text broadcast (single/tag/all), 100% Chinese/text injection (atomic clipboard paste), optional Enter appending, single-device quick phrase popover, server + local dual-track persistence | Fast multi-account login, batch form filling, instant canned responses with zero typing effort. |
| **📦 Maintenance Terminal & Batch Distribution** | Execute Command (batch Shell broadcast with high-risk intercept), ADB interactive terminal (xterm.js PTY relay), Target device drawer, HTTP Range resumable downloads, silent APK installation & live progress | Enterprise fleet maintenance, stable large-package downloads over weak networks, bottom-aligned terminal without input obscuration. |
| **⌨️ Advanced Input & Keymapping** | Desktop IME Pinyin injection, silent two-way clipboard (anti-loop focus sync), visual keymapping editor (Tap/Joystick/Swipe/Command) | Mobile gaming on PC, smooth desktop IME typing directly on Android, cross-device copy-paste. |
| **👥 Multi-Tenant & Lease Management** | Administrator vs. Standard user roles, device-to-user assignment with time-based leases, streaming policy enforcement, all-in-one management drawer, audit logs (`admin_logs.json`) | Commercial device rentals, corporate multi-team asset isolation, regulatory compliance and audit trails. |
| **🔑 Sharing & Card Passcode Access** | Time-limited links, 8-character card code (`CP-XXXX-XXXX`), Read-only vs. Full control, PIN password protection, standalone guest player, auto-disconnect on expiration | Zero-login guest demonstrations, temporary equipment leasing, accidental touch prevention. |
| **🤖 AI Troubleshooting Assistant** | Compatible with OpenAI, Claude, DeepSeek; streaming thinking logs; native Function Tool Calling (Shell/ADB/WebRTC metrics/touch) | Automated latency and stream diagnostics with actionable suggestions. |
| **🧩 Virtual Hardware HAL Simulation** | Camera HAL injection (TCP 9001), GPS HAL mock location (TCP 9002), Sensors HAL gyro/accelerometer simulation (TCP 9003) | QR scanning simulation, LBS location mocking, sensor automated testing. |
| **📱 Multi-Platform Deployment Ecosystem** | Driverless WebUSB setup, PC one-click scripts, Magisk boot-persistence module & offline configurator, Non-Root Shizuku native Android host app, Docker AIO container | From 10-second casual onboarding to large-scale data-center server racks and standalone phones. |
| **🌐 Mobile Optimization & Global i18n** | Mobile 2.5s touch auto-dimming FAB, iOS Safari PWA fullscreen guide, 100% i18n across all 48 components, strict bilingual CI/CD check | Seamless experience across all devices; ready for global deployment. |

---

## 🔍 Module Details

### 1. Streaming & Dual-Track Connectivity
* **WebRTC P2P Direct & Smart Fallback**: Built on Pion WebRTC (Go). Defaults to UDP P2P direct streaming. Automatically leverages IPv6 for direct zero-cost public traffic. Gracefully falls back to integrated coturn TURN relays on restrictive symmetric NATs.
* **WebSocket Streaming Mode (100% TCP Traversal)**: Designed for restricted enterprise firewalls, campus networks, or networks blocking UDP. Multiplexes 1080P/30fps/4Mbps H.264 streams over HTTP/HTTPS ports via signaling server proxy.
* **Full H.264 Profile Compatibility Ladder**: Implements a complete compatibility hierarchy spanning Constrained Baseline (PT 102), Baseline (PT 104), Native SPS (PT 106), Main (PT 108), and High Profile (PT 110), completely eliminating `m=video 0` rejection on iOS Safari / WebKit.
* **Low-Latency Timing Alignment**: Customized stream clock alignment to eliminate jitter buffer lag and first-touch delay during static scenes.
* **Opus Audio Capture**: Captures internal Opus audio via local UDS and streams it through dedicated WebRTC audio tracks, with a direct audio bypass for high-fidelity playback in the browser.

### 2. Matrix Dashboard & Fleet Control
* **WebCodecs Hardware Acceleration**: Lightweight raw H.264 preview streams are decoded directly on the GPU using modern WebCodecs API into HTML5 Canvas, maintaining minimal CPU and memory footprints even with 100+ simultaneous screen sessions.
* **Pub/Sub Targeted Dispatcher**: Replaces broadcast models with a thread-safe publish-subscribe dispatcher that routes video frames exclusively to authorized subscribers, ensuring zero multi-tenant data leaks.
* **4-Tier Streaming Scopes**: Supports "Visible in Viewport (`visible`)", "All Online (`all`)", "Selected Devices (`selected`)", and "Tag Matching (`tag`)", slashing downstream bandwidth usage by 80%~95% in large matrices.
* **Direct Dashboard Touch**: Full touch interaction directly on dashboard cards without establishing full WebRTC sessions, with automatic letterbox/pillarbox removal and native landscape screen adaptation.
* **Concurrent Group Control Engine**: Goroutine-based event dispatcher capable of delivering touch and keyboard events to 200+ devices with ~2.1ms latency at 6,000 dispatches/second.

### 3. Camera Surveillance Mode
* **Hardware Direct Camera Streaming**: Direct hardware camera streaming without turning on the physical phone screen (`CP_POWER_ON=false`), launching camera apps, or incurring CPU memory copies.
* **Logical Multi-Camera Hardware Zoom**: Automatically detects physical cameras (ultra-wide 0.5x/0.6x, main 1.0x, optical telephoto 3.2x/5.0x, and front selfie), triggering genuine optical FOV transitions via underlying camera drivers.
* **Professional Surveillance OSD & Control Console**: Persistent on-screen display showing device ID, active lens, current resolution, real-time bitrate/FPS, battery level with high-temp alerts (>45°C), running clock, and recording indicators; offers 4K/1080P/720P/480P switching and 1.0x~10.0x stepless PTZ digital zoom and pan.
* **Camera Eco Mode**: Actively disables OIS/EIS floating coils, locks autofocus to hyperfocal infinity to cut VCM coil power, switches off heavy temporal noise reduction (TNR/GDC), and negotiates optimal 15 FPS exposure ranges to dramatically curtail device heat and power draw.
* **Forensic Evidence & Audio Monitoring**: High-fidelity Opus ambient audio monitoring via the phone's microphone; one-click lossless raw frame capture (JPG) and local real-time video recording (WebM/MP4).

### 4. Multi-Device Workspace & Layouts
* **Concurrent Multi-Device Control**: Connect and control 1 to N devices simultaneously with isolated sessions.
* **4 Interconnected Workspace Layouts**:
  1. **Grid Tiling**: Dynamically adapts from 1x2 dual-column to 2x2 four-grid and 3x3 matrices, with double-click maximize;
  2. **Multi-Tabs Layout**: Chrome-style tabs with background channel keep-alive for instant switching; supports horizontal/vertical split screens;
  3. **Floating Windows**: Freely resizable and draggable floating windows with safe viewport boundary clamping;
  4. **Mobile Single Device Mode**: Mobile browsers automatically enforce full-screen single-device mode, eliminating clutter.
* **Input Isolation & Audio Focus**: Clicking any screen activates a neon border; keyboard inputs, IME Pinyin, and clipboards strictly route to the focused device; audio plays solely from the active device to prevent crosstalk.

### 5. Batch Text & Quick Phrase Library
* **Multi-Target Broadcast**: Dispatch text to single devices, tag groups, or all online devices simultaneously.
* **100% Chinese & Emoji Text Injection**: Broadcasts text events over WebSockets; Agent routes non-ASCII strings through atomic clipboard paste channels, supporting multi-line text and optional automatic Enter appending (Keycode 66).
* **Single-Device Quick Phrase Menu**: A dedicated "Quick Phrase" button in desktop sidebars and mobile FAB menus opens a frosted glass popover for one-click canned text injection.
* **Dual-Track Persistence**: Phrases are stored server-side under `quick_texts.json` per user via `/api/quick_texts` while caching locally in `localStorage` for instant offline responsiveness.

### 6. Maintenance Terminal & Batch Distribution
* **Execute Command (Batch Shell)**: Concurrently dispatch non-interactive shell commands with real-time status badges (⏳ Running, ✅ Success, ❌ Failed) and safety interception for high-risk commands (`reboot`, `rm -rf`, `pm clear`).
* **ADB Interactive Terminal (xterm.js PTY Relay)**: Full ANSI escape code support in-browser for interactive CLI tools like `top`, `vi`, and `logcat`, with bottom-aligned scrolling.
* **Target Device Picker Drawer**: A 38px compact summary strip expands into a fuzzy-search drawer with tag categorization, handling 100~500+ device fleets effortlessly.
* **HTTP Range Resumable Downloads**: RFC 7233 chunked streaming downloads with `If-Range` header verification and automatic retries, ensuring stable multi-hundred megabyte APK distributions.

### 7. Advanced Input & Keymapping
* **Desktop IME Text Injection**: Transparent 1px textarea captures desktop IME composition, injecting full Chinese characters and emojis via clipboard bypassing ASCII limitations.
* **Silent Two-Way Clipboard Sync**: Synchronizes clipboards bi-directionally on focus bounce with anti-loop deduplication.
* **Visual Keymapping Editor**: Custom mapping for Tap, 8-way Joystick, Swipe, and hardware System Commands cached locally.

### 8. Multi-Tenant & Lease Management
* **Role & Tenant Isolation**: Administrator and standard user roles; access granted through time-based leases with non-assigned devices strictly invisible.
* **All-in-One Management Drawer**: Centralized management for credentials, device allocations, lease durations (minutes/hours/days/permanent), and video/audio policy locks.
* **Audit Trails (`admin_logs.json`)**: Automatic logging of all administrative actions with atomic file writes (up to 3,000 entries) and rapid keyword search.

### 9. Sharing & Card Passcode Access
* **Temporary Access Tokens**: Generate share links or 8-character card passcodes (`CP-XXXX-XXXX`) valid from 30 minutes to permanent.
* **Permission & Password Protection**: Choose between Full Control and Read-Only mode with optional PIN passwords; visitors are automatically kicked on expiry.
* **Independent Guest Player**: Dedicated player without authentication requirements that operates with isolated preferences.

### 10. AI Troubleshooting Assistant
* **Model Compatibility**: Supports OpenAI, Claude, and OpenAI-compatible endpoints (such as DeepSeek).
* **Automated Diagnostic Tools**: Built-in Tool Calling for Shell execution, hardware spec gathering, WebRTC packet loss/RTT/jitter collection, and touch simulation with transparent reasoning logs.

### 11. Virtual Hardware HAL Simulation
* **Camera HAL (TCP 9001)**: Injects desktop webcam or local video streams directly into the Android Camera HAL for QR scanning and face simulation.
* **GPS HAL (TCP 9002)**: Injects latitude and longitude coordinates into the GPS HAL for location mocking.
* **Sensors HAL (TCP 9003)**: Injects accelerometer, gyroscope, and fold-angle data in real-time.

### 12. Multi-Platform Deployment Ecosystem
* **Driverless WebUSB Setup**: Direct USB deployment from browser without pre-installing ADB, with auto CPU architecture detection (`arm64`, `arm`, `amd64`).
* **PC ADB Batch Scripts**: `agent-deploy.zip` includes `run.sh` / `run.bat` and `batch_start.sh` / `batch_start.bat` for concurrent fleet bootstrapping.
* **Magisk Offline Configurator**: Command-free parameter injector (`magisk-config-tools.zip`) allows dragging ROM zips onto batch icons to pre-configure signaling addresses and ICE configs.
* **Non-Root Shizuku Native Android Host App**: Modern pure-Kotlin host app pairing with Shizuku (UID 2000) over Wi-Fi, featuring Android 14+ foreground services and watchdog self-healing.
* **Docker / Redroid Cloud Phones**: 1-second AIO container packaging supporting Binder device nodes, pre-allocated loop devices, and GPU hardware acceleration.

### 13. Mobile Optimization & Global i18n
* **Mobile-Native UX**: Floating action buttons (FAB) and fullscreen toggles automatically dim after 2.5 seconds of inactivity; iOS Safari displays PWA "Add to Home Screen" instructions for an address-bar-free experience.
* **100% Internationalization**: All 48 web components stripped of hardcoded text; 1,682 translation keys enforced with strict CI/CD build blocking.

---

## ➡️ Next Steps

- [Hardware Requirements & Architecture](/en/quickstart)
- [Device Preparation & Decision Matrix](/en/agent-deploy)
- [Server Deployment Guide](/en/deploy-config)
