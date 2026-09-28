# Remote Terminal: xterm.js & Macro Commands

ScrcpyOverWebRTC provides dual terminal capabilities for developers and system operators: **an interactive multi-session terminal powered by `xterm.js`**, and **a concurrent batch command dispatch system with customizable macro shortcuts**.

---

## 💻 1. Interactive Multi-Session Shell (xterm.js)

Traditional web-based command executors fail to handle ANSI escape sequences properly, corrupting interactive programs like `top` or `vi`.

### 1. Key Capabilities
- **Native xterm.js Rendering**: Integrates industry-standard `xterm.js`, supporting 256 ANSI colors, line buffering, and precise cursor positioning to seamlessly run `top`, `logcat`, `htop`, and `vi`;
- **Multi-Session Tabs**: Click `+` in the control panel to open multiple concurrent shell sessions, each isolated with its own status indicator and dedicated underlying UDS pipeline;
- **Zero ADB Driver Requirement**: Communicates directly through WebRTC DataChannels with the device-side Agent shell daemon, requiring zero ADB installation on the client.

### 2. Usage
In the direct control panel bottom drawer, select **"Shell Terminal (ADB)"** to access an interactive terminal for immediate debugging.

---

## ⚡ 2. Concurrent Batch Dispatch & Custom Macro Shortcuts

For fleet operations—such as gathering device telemetry or clearing app caches across dozens of devices—the platform includes an automated batch command center.

### 1. Concurrent Batch Execution
- **Target Selection**: Quickly select all devices, clear selections, or filter target cohorts by **Device Tags**;
- **Real-Time Result Aggregation**: Commands dispatch concurrently across selected agents. Real-time statuses (⏳ In Progress, ✅ Succeeded, ❌ Failed) appear in the summary matrix; click any card to inspect full `stdout` and `stderr` logs.

### 2. Preset & Custom Shortcuts (`shortcuts.json`)
- **Built-in Presets**:
  - **Foreground Activity**: `dumpsys window | grep mCurrentFocus` to inspect running activities;
  - **Third-Party Packages**: `pm list packages -3` to list installed user apps;
  - **Device Model**: `getprop ro.product.model`;
  - **Pointer Location**: Toggle `settings put system pointer_location 1/0`.
- **Custom Macros & Cloud Sync**:
  - Click **"⚙️ Custom Shortcuts"** in the console to create, update, or remove repetitive maintenance scripts;
  - Configurations persist securely in `data/shortcuts.json` on the signaling server, isolated per user for synchronized roaming across browsers.
