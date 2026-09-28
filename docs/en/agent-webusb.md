# Method 1: WebUSB Browser One-Click Setup

The web console includes a built-in automated onboarding pipeline based on the modern browser **WebUSB API and pure frontend WebADB**.  
Users **do not need to install Android SDK or configure any ADB drivers on their computer**. Simply open the web console in Google Chrome or Microsoft Edge, plug in the USB cable, and complete automatic device architecture detection, silent deployment, and background execution with a single click.

---

## 📋 Scenarios & Prerequisites

| Item | Requirement |
| :--- | :--- |
| **Supported Devices** | All Android physical devices with USB Debugging enabled (Non-Root supported) |
| **Browser Compatibility** | Google Chrome 89+, Microsoft Edge 89+, or Chromium-based browsers (Safari & Firefox do not support the WebUSB standard) |
| **Network Protocol** | Must access the web console via secure **`https://`** or local **`http://localhost`** (Browser Security Sandbox constraint) |
| **Local ADB Conflict** | Close any third-party Android helper tools, mobile assistants, or emulators running on your computer to avoid USB interface conflicts |

---

## ⚡ Step-by-Step Instructions

### Step 1: Connect Phone to Computer
1. Verify prerequisite device configuration as described in [Device Preparation](/en/agent-prep) (enable USB Debugging and brand security input options).
2. Connect your phone to your PC via a USB data cable.

### Step 2: Open Console Deployment Page
1. In your browser, open the management console (e.g. `https://<YOUR-SERVER-IP>:8443`).
2. Click **"One-Click Deploy"** in the top navigation bar (or **"Deploy Device"** in the device list).
3. Ensure the **"ADB One-Click Deployment (USB / Wireless)"** tab is active.

### Step 3: Connect & Authorize Device
1. Click the blue **"Connect & Authorize Device"** button.
2. A native browser USB device selector dialog appears at the top. Select your Android device and click **"Connect"**.
3. If an "Allow USB debugging?" dialog appears on your phone screen, check "Always allow" and tap **Allow**.

```
+--------------------------------------------------------+
| 🌐 https://your-server:8443 wants to connect to a USB  |
+--------------------------------------------------------+
|  📱 Pixel 7 Pro (Google Inc.)                          |
|  📱 Redmi K60 (Xiaomi)                                 |
+--------------------------------------------------------+
|                                  [ Cancel ]  [ Connect ]|
+--------------------------------------------------------+
```

### Step 4: One-Click Push & Launch
1. Upon authorization, the web console inspects the target device's CPU architecture (e.g. `arm64-v8a`, `armeabi-v7a`, or `x86_64`).
2. Click the **"Push to Phone & Start"** button.
3. The browser automatically performs the full onboarding sequence (taking ~3-5 seconds):
   - Downloads the matched `cloudphone-agent` binary and `libsys_core.so` screen mirroring core from the signaling server;
   - Transmits binaries directly into the device's `/data/local/tmp/` directory via WebUSB;
   - Sets executable permissions (`chmod 755`);
   - Executes `setsid nohup` to launch the Agent detached in the background and registers with the signaling server.

### Step 5: Disconnect Cable & Control Wirelessly
1. The web page displays: **"Deployed successfully! Agent is running in background"**.
2. You can now **unplug the physical USB cable**.
3. Return to the device list dashboard; your device card is active and ready for ultra-low latency direct control!

> 💡 **On-Device Emergency Disconnect**: After unplugging the cable, if you want to immediately sever the remote session directly on the phone, open `http://127.0.0.1:12345/d` in the phone's mobile browser to disconnect active sessions or terminate the Agent daemon.

---

## ❓ Troubleshooting

**Q: Error: "The device is already in use by another program" or "Unable to claim interface"?**
- **Cause**: WebUSB requires exclusive access to the device's physical USB endpoint. If an active local `adb server` process is running on your host machine (e.g., Android Studio, VS Code debugging tools, Android emulators, or OEM suites), it locks the USB interface.
- **Solution**:
  1. Open a terminal on your computer (Windows: `Win+R` -> `cmd`; macOS: `Terminal`);
  2. Kill the local ADB daemon:
     ```bash
     adb kill-server
     ```
  3. Close any third-party phone assistants in your system tray;
  4. Return to your browser and click **"Connect & Authorize Device"** again.

**Q: My phone is not listed in the browser USB popup?**
1. Check that the USB cable is firmly seated and try a different USB port (motherboard rear ports recommended for desktops).
2. Check if the phone prompted for authorization, and confirm Developer Options & USB Debugging are enabled.
3. Terminate local ADB daemons with `adb kill-server`.

**Q: Deployment succeeded, but the device never appears online?**
1. Ensure the phone's Wi-Fi network can reach the signaling server IP and port (`8443`).
2. Verify that no VPN or proxy on the phone is routing internal traffic away.
3. Xiaomi users: Confirm that **"USB Debugging (Security settings)"** is enabled.

---

## ➡️ Other Onboarding Options

- [Method 2: PC Script One-Click Deployment (Wired/Wireless ADB)](/en/agent-script)
- [Method 3: Magisk / Root Auto-Start Module (24/7 Unattended)](/en/agent-magisk)
