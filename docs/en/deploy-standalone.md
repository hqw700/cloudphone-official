# Standalone Device Mode

ScrcpyOverWebRTC features a unique **Standalone Mode (On-Device Direct Single-Port Streaming)**.  
In this mode, you don't need any external PC or cloud server. **The Web Console single-page app is directly embedded inside the Go Agent binary**, running a single lightweight process on the phone that serves the web console and bidirectional media stream over a single TCP port (default `8080`).

---

## 💡 How Standalone Mode Works

1. **Single-Process Single-Port Architecture**: Only one `cloudphone-agent` binary runs on the Android phone, listening on local port `8080`. This single port serves both HTTP static web assets and full-duplex WebSocket streaming and touch interactions.
2. **Zero External File Extraction**: Eliminates external server files, SSL certificates, or extracted web files; memory consumption drops from >100MB to just 20~30MB, conserving battery while preventing system OOM kills.
3. **Instant Browser Control**: Open `http://<PHONE-IP>:8080` in any browser on the same Wi-Fi network to immediately stream and interact with ultra-low latency and hardware acceleration.

---

## 🛠️ 1. Execution Methods

### Method 1: Magisk / KernelSU Module (Recommended, PC-Free Auto-Start)
1. Flash `cloudphone-agent-magisk.zip`.
2. The module runs in **Standalone Mode** by default.
3. Connect the phone to local Wi-Fi, run `su -c cloudphone-ctl status` in a terminal/Termux to inspect the direct URL:
   ```text
   Mode: Standalone (http://192.168.1.120:8080)
   ```
4. Open the displayed URL in any browser on the same Wi-Fi.

### Method 2: Android App (WebrtcTest) One-Click Launch
1. Install the app on the phone and open the "Agent Setup" page.
2. Check **"Standalone Mode"**.
3. Tap **"Start Agent Direct Service"**.
4. The screen shows the local LAN IP and web portal `http://<PHONE-IP>:8080`, with options to copy or open in browser.

### Method 3: Initial Setup via Computer (Push Once, Then Disconnect)

#### Windows:
1. Connect phone with USB Debugging enabled.
2. Double-click `setup.bat` under the extracted `android/` directory.
3. Once completed, disconnect the USB cable.

#### macOS / Linux:
```bash
# 1. Push native assets
adb push android /data/local/tmp/

# 2. Launch standalone service
adb shell sh /data/local/tmp/android/setup.sh
```

---

## 🔍 2. Access via LAN

1. When launched, the terminal outputs the phone's IP and direct URL, for example:
   ```text
   Services started. Connect via http://192.168.1.120:8080
   ```
2. **Unplug the USB cable**.
3. Connect your PC, iPad, tablet, or another phone to the same Wi-Fi network.
4. Open your browser and navigate to `http://<PHONE-LAN-IP>:8080` for a responsive, full-screen remote control experience.

---

## 🛑 3. Stop On-Device Service

To terminate the background process on the phone:

```bash
adb shell "pkill -f cloudphone-agent && pkill -f libsys_core.so"
```
