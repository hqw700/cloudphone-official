# Monitoring Dashboard, Live Direct Control & Group Control

ScrcpyOverWebRTC's Monitoring Dashboard is designed for high-density device matrix supervision, minimal-overhead inspection, and synchronized multi-device group control. It features **high-frequency H.264 preview streaming, WebCodecs GPU hardware decoding, viewport-aware on-demand activation, standalone preview direct control, and multi-device group synchronization**.

---

## ⚡ Architecture & Design Principles

### 1. Raw H.264 Stream Distribution + WebCodecs GPU Decoding
- **Eliminates High-CPU JPEG Compression**: Traditional multi-device monitoring compresses JPEG frames on Android CPUs, causing thermal throttling. Our system reuses the low-bitrate H.264 stream output from `scrcpy-server` transported across a dedicated WebSocket tunnel.
- **GPU Hardware Accelerated Rendering**: Browsers leverage the modern **WebCodecs API (`VideoDecoder`)** to decode video directly on local GPUs and render straight to `<canvas>`, reducing RAM consumption by over 80%.

### 2. Viewport-Aware On-Demand Activation (IntersectionObserver)
- While scrolling the matrix, `IntersectionObserver` tracks card visibility:
  - **Cards in Viewport**: Automatically sends `start_preview` to trigger 5~10 FPS smooth live preview streams;
  - **Cards Offscreen**: Automatically issues `stop_preview`, suspending active video pipelines and falling back to low-frequency static snapshots (consuming 0 bandwidth and 0 encoding CPU).

### 3. Standalone Preview Direct Control
- Interact directly without waiting for WebRTC P2P ICE negotiation by toggling **"Preview Direct Control"** on any card.
- Mouse clicks, swipes, and drag gestures on the Canvas are transmitted instantly via WebSocket down to Android.
- **Adaptive Coordinate Mapping**: Strips away letterbox bars from `object-fit: contain` and natively handles landscape displays (automotive consoles, tablets) with 100% pixel-accurate inverse coordinate mapping.

---

## 🎮 Step-by-Step Operations

### 1. Matrix Browsing & Responsive Resizing
- Open the **"Dashboard"** page to observe all online devices simultaneously.
- Use the **card size slider** in the top toolbar to adjust column density (responsive grid dynamically scaling from 1 to 6 columns).

### 2. Live Preview Direct Control
1. At the bottom of the target device card, toggle on **"Preview Direct Control"**.
2. The card's canvas highlights to receive mouse inputs:
   - **Left-Click / Drag**: Simulates finger taps and swipe gestures;
   - **Right-Click**: Injects Android Back button;
   - **Middle-Click / Bottom Bar**: Injects Android Home button.

### 3. Multi-Device Group Control
1. In the top toolbar, activate **"Group Control Mode"**.
2. Select a device as the **Master Controller** (or check multiple target replicas).
3. Any tap, swipe, text entry, or navigation command executed on the master is broadcast and executed concurrently across all checked replicas within milliseconds.

---

## ⚙️ Preview Parameter Optimization

Navigate to **"Settings" ➔ "Matrix Preview"** in the top-right corner:
- **Preview Bitrate**: Constrains bandwidth consumption for preview streams (recommended `500kbps ~ 1Mbps`);
- **Max Preview Resolution**: Bounds max dimension length (e.g. `480px` or `720px`) to minimize network load during dense multi-device viewing;
- **Decoder Preference**:
  - `WebCodecs GPU Decoding` (Recommended): Decodes on GPU, saving CPU cycles;
  - `WASM Software Decoding`: Maximum compatibility across older browsers without hardware decoder session limits.
