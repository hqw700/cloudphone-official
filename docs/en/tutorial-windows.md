# Tutorial 1: Windows Local Setup & Physical Device Control

This step-by-step tutorial guides you through deploying the ScrcpyOverWebRTC central service on **Windows 10 / 11** in 5 minutes using portable binaries (Zero Docker), followed by onboarding a physical Android smartphone via browser WebUSB for ultra-low latency wireless control.

---

## 🎯 Objectives & Prerequisites

* **Objective**: Run the web console locally on Windows, deploy the Agent to an Android phone over USB with one click, disconnect the cable, and control the phone smoothly inside your browser.
* **Prerequisites**:
  1. A Windows PC running Windows 10 or 11;
  2. A physical Android smartphone with USB Debugging enabled (see [Device Preparation](/en/agent-prep));
  3. A USB data cable;
  4. Google Chrome or Microsoft Edge.

---

## 🛠️ Step 1: Download & Start Windows Server

1. Download the latest release package `cloudphone-vX.Y.Z.zip` from the [Releases](https://github.com/hqw700/ScrcpyOverWebRTC/releases) page and extract it locally (e.g. `D:\cloudphone\`).
2. Navigate into `bin\windows_amd64\`.
3. Double-click **`run.bat`**.
4. A console window appears and prints the following startup logs:
   ```text
   [INFO] Starting signaling server on :8443 (TLS enabled)
   [INFO] Static assets loaded from ../../assets
   [INFO] Listening on https://127.0.0.1:8443 and https://192.168.1.100:8443
   ```
   *(Keep this terminal window running in the background)*.

---

## 🌐 Step 2: Open Management Console in Browser

1. In Google Chrome or Microsoft Edge, navigate to:
   ```text
   https://localhost:8443
   ```
2. When the browser displays "Your connection is not private", click **"Advanced"** ➔ **"Proceed to localhost (unsafe)"**.
3. Log in with the default credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

---

## 🔌 Step 3: Connect Phone via One-Click WebUSB

1. Plug your Android phone into your PC via USB cable.
2. If "Allow USB debugging?" prompts on the phone screen, check **"Always allow"** and tap **OK**.
3. In the web console, click **"One-Click Deploy"** in the top-right corner.
4. Click the blue **"Connect & Authorize Device"** button, select your phone in the browser popup, and click "Connect".
   - *(💡 If you see "already in use", run `adb kill-server` in CMD and retry)*.
5. Click **"Push to Phone & Start"**.
6. After ~3 seconds, the progress bar reaches 100% and displays **"Deployed successfully! Agent is running in background"**.

---

## 🎮 Step 4: Disconnect Cable & Control Wirelessly!

1. **Unplug the USB cable from your phone**.
2. Return to the device list on the home page, click your phone card, and enter the control window:
   - Left-click and drag to swipe or tap;
   - Type Chinese characters or accented symbols natively;
   - Open the "Keymapping Editor" in the right toolbar to bind WASD keys for gaming.

> 💡 **Emergency Disconnect**: To disconnect mirroring directly on the phone, open `http://127.0.0.1:12345/d` in the phone's mobile browser.
