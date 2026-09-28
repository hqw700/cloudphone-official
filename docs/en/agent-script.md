# Method 2: PC Script One-Click Deployment

If you are comfortable with terminal commands, need to onboard multiple devices concurrently on a local network, or prefer connecting via **Wireless ADB over TCP/IP**, the official portable deployment package `agent-deploy.zip` provides an automated solution.

---

## 📋 Scenarios & Prerequisites

| Item | Requirement |
| :--- | :--- |
| **Supported OS** | Windows (10/11), macOS (Intel/Apple Silicon), Linux (Ubuntu, Debian, CentOS, etc.) |
| **Prerequisites** | ADB command-line tools installed and accessible via terminal (`adb version` returns valid output) |
| **Connection Type** | Physical USB cable or wireless network connection via `adb connect <PHONE-IP>:5555` |

---

## ⚡ Step-by-Step Instructions

### Step 1: Download Deployment Package
1. Open the Web Console (e.g. `https://<YOUR-SERVER-IP>:8443`).
2. Navigate to the **"Deploy Device"** page and download **`agent-deploy.zip`**.
3. Extract the archive into any local folder on your computer.

Archive directory structure:
```text
agent-deploy/
├── cloudphone-agent-arm64       # Android 64-bit native Agent binary
├── cloudphone-agent-armeabi-v7a # Android 32-bit native Agent binary
├── cloudphone-agent-amd64       # Android x86_64 container/emulator binary
├── libsys_core.so               # Customized scrcpy-server capture engine
├── run.sh                       # Linux / macOS single device deployment script
├── run.bat                      # Windows CMD single device deployment script
├── batch_start.sh               # Linux / macOS multi-device concurrent batch script
└── batch_start.bat              # Windows multi-device concurrent batch script
```

### Step 2: Connect Phone & Verify ADB Status
In your PC terminal, run:
```bash
adb devices
```
Confirm your device is listed with status `device`.

*(If using wireless ADB, connect first via `adb connect <PHONE-IP>:5555`)*

### Step 3: Run Deployment Script

The web console deployment page dynamically generates the exact execution commands based on your server settings:

#### Scenario A: Single Device Onboarding

* **Linux / macOS**:
  ```bash
  chmod +x run.sh
  ./run.sh -id <Custom-Device-ID> -signaling wss://<YOUR-SERVER-IP>:8443
  ```
* **Windows (CMD / PowerShell)**:
  ```cmd
  run.bat -id <Custom-Device-ID> -signaling wss://<YOUR-SERVER-IP>:8443
  ```

#### Scenario B: Multi-Device Concurrent Batch Onboarding

To push to all connected devices in parallel for fleet control:

* **Linux / macOS**:
  ```bash
  chmod +x batch_start.sh
  ./batch_start.sh -signaling wss://<YOUR-SERVER-IP>:8443 -ice-servers "<TURN-URL>"
  ```
* **Windows**:
  Double-click **`batch_start.bat`** to launch the interactive prompt wizard, or run in CMD:
  ```cmd
  batch_start.bat -signaling wss://<YOUR-SERVER-IP>:8443 -ice-servers "<TURN-URL>"
  ```

> 💡 **Parameter Details**:
> - `-id <Device-ID>`: Custom device identifier. If omitted, generated as `Model-SerialNumber`. In batch mode, each device receives a unique auto-generated ID.
> - `-signaling <URL>`: Required. Points to the signaling server (e.g. `wss://192.168.1.100:8443`).
> - `-ice-servers <STUN/TURN>`: Optional. Recommended when streaming across complex NATs or public cloud networks.

### Step 4: Verification & Disconnection

The script automatically:
1. Detects the device's CPU architecture and pushes matching binaries to `/data/local/tmp/`;
2. Grants execution permissions and launches the daemon detached via `setsid nohup`;
3. Outputs the background PID and releases the local ADB handle.

Verify that the Agent is running in the background:
```bash
adb shell "ps -A | grep cloudphone-agent"
```

Unplug the USB cable and refresh the web console device list. The device appears online and is ready for immediate streaming.

---

## 🛑 Stop & Terminate the Agent

* **Method 1 (On the device itself)**:
  Open `http://127.0.0.1:12345/d` in the phone's built-in browser to disconnect active sessions or completely kill the Agent process.
* **Method 2 (Via PC ADB command)**:
  Run the cleanup command in your computer's terminal:
  ```bash
  adb shell "pkill -f cloudphone-agent && pkill -f libsys_core.so"
  ```

---

## ➡️ Other Onboarding Options

- [Method 1: WebUSB Browser Setup (Zero Driver)](/en/agent-webusb)
- [Method 3: Magisk / Root Auto-Start Module (24/7 Unattended)](/en/agent-magisk)
- [Method 4: Android App Native Client (On-Device)](/en/app-guide)
