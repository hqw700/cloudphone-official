# Method 4: Android App Native Client

The official native Android client (code-named `WebrtcTest`) combines both **Controller (Master)** and **Agent Host (Managed)** capabilities into a single application, allowing you to manage and control devices directly from Android phones and tablets, or turn any phone into a remote cloud phone without a computer.

* **Controller Mode**: Sign in to the signaling center from your mobile device to inspect matrix overviews and operate remote devices with responsive low-latency controls; supports passcode quick access.
* **Agent Host Mode**: Launch the Agent daemon directly on the device using either **Root elevation** or **Shizuku (Non-Root ADB)** without needing a PC. Enabling Standalone Mode runs the signaling server and web console directly inside the phone itself.

---

## 📥 App Installation

Download the latest CloudPhone App (`.apk`) from the [Releases](https://github.com/hqw700/ScrcpyOverWebRTC/releases) page and install it on your Android device.

> 💡 **Zero External Dependencies**: The app bundles precompiled native Agent binaries and screen mirroring components for all architectures (`arm64`, `armeabi-v7a`, `x86_64`). No files need to be pushed from a PC.

---

## 🎮 1. Controller Mode: Operate Remote Devices from Android

### 1. Login & Connection
1. Open the app, and on the login page enter:
   - **Server Address**: Include the protocol scheme, e.g. `https://192.168.1.100:8443`;
   - **Credentials**: Defaults to `admin` / `admin123` (shared with the Web Console);
   - *(Or tap **"🔑 Passcode Direct Access"** at the bottom to enter an 8-character passcode `CP-XXXX-XXXX` for password-free login)*.
2. After authentication, the device matrix appears, supporting both **Vertical List** and **Full-Screen Carousel Card** layouts.

### 2. Low-Latency Controls
Tap any online device card to establish an immediate WebRTC peer connection:
- **Multi-Touch & Coordinate Inversion**: Responsive pinch-to-zoom and multi-finger gestures. Dynamic display rotation triggers OpenGL 90° orientation adjustment with inverse coordinate mapping.
- **Latency Indicator Pill**: Calculates end-to-end latency dynamically based on RTT, Jitter Buffer delay, and decoding time, color-coded as `<50ms` (green), `<100ms` (yellow), and `>100ms` (red).
- **Navigation & Hardware Keys**: Floating controls provide Back, Home, and Recents navigation, alongside Power and Volume buttons.
- **IME Text Injection**: Characters are injected atomically upon word completion; virtual physical keyboard registration suppresses annoying remote software keyboards from covering the screen.
- **Camera Passthrough**: Send your mobile device's camera stream back to the cloud phone via WebRTC for virtual camera drivers.

### 3. Background Keepalive & Auto-Healing
When minimizing the controller app, the singleton connection manager maintains a 10-minute keepalive session. Video decoding is paused in the background and resumes immediately upon returning to the foreground; network disconnections trigger silent auto-reconnects.

---

## 📲 2. Agent Host Mode: Turn Phone into a Remote Cloud Device

Tap **"Switch to Host Mode"** on the login or dashboard page to register the current phone as a managed device.

### Step 1: Select Execution Engine

| Engine | Target Devices | Architecture & Permissions |
| :--- | :--- | :--- |
| **Root Mode** | Rooted devices (Magisk / KernelSU / APatch) | Elevated via `su` with maximum system privileges |
| **ADB Mode (Shizuku)** | **Unrooted standard devices** | Runs via Shizuku as `shell` (UID 2000), natively equipped with screen recording and touch injection **without Root** |

#### Shizuku Mode Setup:
1. Install and activate [Shizuku](https://shizuku.rikka.app/):
   - **Android 11+**: Pair and activate via "Developer Options" ➔ "Wireless Debugging" directly on the phone without a PC;
   - **Android 10 and below**: Activate once via PC ADB.
2. Return to the app, select **"ADB Mode (Shizuku)"**, tap **"Request Shizuku Permission"**, and allow.

### Step 2: Configure Signaling & Start
1. **Signaling Server URL**: Enter your signaling server address (e.g. `wss://192.168.1.100:8443`).
2. **Device ID**: Custom display name (auto-generated from model if left blank).
3. Tap **"Start Agent"**.

The status panel displays the **Agent PID** and real-time streaming logs (polled every 2 seconds). Refresh the PC Web Console to see your device online and controllable.

---

## 🏠 3. Standalone Mode: Self-Contained Server on Phone

Check **"Standalone Mode"** in the Host interface to run the signaling server (`webrtc-signaling`) and web console directly inside the phone:

1. Connect the phone to local Wi-Fi, then tap **"Start Server & Agent"**;
2. The UI displays the local IP and **HTTPS Web URL** (e.g. `https://192.168.1.120:8443`);
3. Any computer, tablet, or phone on the same Wi-Fi network can open that URL in a browser to control this phone, **requiring zero external servers or PCs**.

---

## ❓ Troubleshooting

**Q: Agent disconnects when the app is placed in the background?**
Aggressive battery optimizations in certain Android ROMs may kill background services. Add CloudPhone to your device's **"Battery Optimization Whitelist"** and enable **"Allow Background Autostart"**. For 24/7 unattended operation, the [Magisk Module](/en/agent-magisk) is strongly recommended.

**Q: Are there security notifications while remotely controlled?**
Per Android security guidelines, a persistent screen recording indicator appears in the system notification shade during mirroring sessions.
