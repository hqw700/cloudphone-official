# Frequently Asked Questions & Troubleshooting (FAQ)

This guide addresses network connections, WebRTC streaming, touch input, audio pipelines, video decoding compatibility, and hardware optimization issues across LAN, cloud, and physical device environments.

---

## 🔍 Issue 1: Device is online with matrix preview visible, but clicking to control times out or shows a black screen?

This is the most common confusion for first-time users.

### 📌 Core Architecture Difference:
* **Matrix Preview (Works)**: Transports over **WebSocket binary TCP on port 8443**. As long as HTTP/WebSocket ports are reachable, preview streaming works. This proves that **scrcpy-server video capture and hardware H.264 encoding are 100% operational on Android**!
* **Interactive Direct Control (Fails)**: Transports over **WebRTC P2P (UDP protocol)**. Connection failures are therefore **100% focused on WebRTC UDP routing, ICE candidate negotiation, and NAT traversal/relay**.

```mermaid
graph TD
    classDef ok fill:#22c55e,stroke:#15803d,stroke-width:2px,color:#fff;
    classDef fail fill:#ef4444,stroke:#b91c1c,stroke-width:2px,color:#fff;
    classDef check fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;

    Preview[🟢 Preview Works (TCP :8443)]:::ok --> Conclusion[Android Capture & Encoding are OK]:::ok
    Direct[🔴 Control Fails / Timeout (WebRTC UDP)]:::fail --> CauseRoot[Inspect WebRTC UDP Link]:::check

    CauseRoot --> R1[1. Cloud Security Group blocks UDP media ports]
    CauseRoot --> R2[2. Docker asymmetric port mapping mismatch]
    CauseRoot --> R3[3. Redroid container missing -external-addr]
    CauseRoot --> R4[4. Symmetric NAT without TURN fallback]
    CauseRoot --> R5[5. High Profile hardware codec incompatibility]
```

### 🛠️ Diagnostic Steps & Solutions:

#### 1. Cloud Firewall / Security Group blocks UDP ports (Most Common)
- **Symptom**: Signaling completes, but ICE status stays stuck at `checking` and ultimately `failed`.
- **Cause**: Cloud providers often only open TCP port `8443`, leaving WebRTC UDP ports blocked.
- **Fix**: Open the following UDP ports in your firewall / cloud security group:
  - `3478` (TCP+UDP for coturn);
  - `50000-50100` (UDP for coturn media relay pool).

#### 2. Docker Asymmetric Port Mapping (Port Mismatch)
- **Symptom**: Docker runs in bridge mode with asymmetric host port mapping (e.g. host `18443` -> container `8443`).
- **Cause**: The container signaling service does not know the external host port mapping and broadcasts internal port `3478` to browsers.
- **Fix**: Pass explicit environment variables:
  `-e EXTERNAL_SIGNALING_PORT=18443 -e EXTERNAL_TURN_PORT=13478` (see [Configuration Reference](/en/deploy-config)).

#### 3. Redroid / Virtual Machine missing `-external-addr`
- **Symptom**: Redroid runs in a bridge network, browser gets stuck at `connecting`.
- **Cause**: Agent auto-detects internal container IP (`172.17.0.2`), which external browsers cannot route to.
- **Fix**: Start the agent with `-external-addr <Host-Public-IP> -webrtc-port <Mapped-UDP-Port>` (see [Redroid Container Guide](/en/agent-docker)).

#### 4. Symmetric NAT without TURN Fallback
- **Symptom**: Phone is on cellular data or corporate intranet; controller is on home broadband.
- **Cause**: Endpoints are behind symmetric NATs where direct P2P hole-punching is mathematically impossible.
- **Fix**: Run the coturn relay service (bundled in the official AIO container) and specify `-ice-servers "turn:user:pass@IP:3478"`.

#### 5. High Profile Codec Incompatibility on Physical Devices
- **Symptom**: WebRTC state shows `connected`, audio plays or touch responds, but display remains completely black.
- **Cause**: High-end flagship devices (Snapdragon / Dimensity) default to H.264 High Profile, which some browsers struggle to decode in software mode.
- **Fix**: In Stream Settings, enforce **Baseline Profile (`profile=1`)**, which forces standard baseline AVC stream output.

---

## 🔍 Issue 2: WebUSB Deployment displays "The device is already in use by another program" or "Unable to claim interface"?

### 📌 Cause:
WebUSB requires exclusive hardware access to the phone's physical USB endpoint. If an active local `adb server` is running on your host computer (e.g. Android Studio, VS Code debuggers, emulator assistants, third-party phone suites), it locks the USB interface.

### 🛠️ Solution:
1. Open a terminal on your computer (Windows: `Win+R` ➔ `cmd`; macOS: `Terminal`);
2. Terminate the local ADB process:
   ```bash
   adb kill-server
   ```
3. Close any third-party phone assistants in your system tray;
4. Return to your browser and click **"Connect & Authorize Device"** again.

---

## 🔍 Issue 3: Screen mirrors smoothly, but mouse clicks and keybindings do not work?

### 📌 Troubleshooting Steps:
1. **Check OEM "USB Debugging (Security settings)"**
   - Brands like Xiaomi (MIUI / HyperOS), Meizu, and OPPO enforce restrictions on simulated touch injection.
   - You **MUST** enable **"USB Debugging (Security settings - Allow granting permissions and simulating input via USB)"** in Developer Options. Otherwise, Android drops injected touch events silently.
2. **Determine "Zero Touch" vs "Offset Coordinates"**
   - In Developer Options, enable **"Show taps"** and **"Pointer location"**;
   - Click the web screen and observe the white touch indicators on the physical device:
     - **No indicators appear**: System blocked simulated inputs. Check security toggles or restart Agent;
     - **Indicator appears away from cursor**: Touch coordinates are misaligned. Update web console and Agent to the latest version.
3. **Check Device "View-Only" State**
   - If connected via a temporary share link or passcode, verify that the session is not set to "View-Only".

---

## 🔍 Issue 4: Browser displays "Your connection is not private / Certificate untrusted" on first visit?

### 📌 Cause & Solution:
- **Cause**: The server operates over HTTPS using an auto-generated self-signed certificate, triggering browser security warnings.
- **Solution**: On the warning screen, click **"Advanced" ➔ "Proceed to ... (unsafe)"** to access the dashboard.
- **Production SSL Certificates**: To use a valid CA certificate (e.g. Let's Encrypt), place your `.crt` and `.key` files in the server's `certs/` directory.

---

## 🔍 Issue 5: Phone overheats or screen stays awake during long-term mirroring?

### 📌 Solution:
- **Enable "Power Off Screen"**:
  In the stream control sidebar under Settings, check **"Power Off Screen"**.
- **Result**: Upon establishing WebRTC streaming, the system powers off the physical screen backlight (screen goes dark), while the web stream continues operating smoothly.
- **Benefits**: Drastically reduces heat and power consumption, prevents screen burn-in, and provides physical privacy.

---

## 🔍 Issue 6: Can I type Chinese characters or use desktop IME?

**Yes, 100% supported out of the box.**  
Unlike basic scrcpy which only accepts standard ASCII characters via keyboard injection, ScrcpyOverWebRTC features a hidden 1px composition session layer. Whenever non-ASCII text (Chinese, Japanese, emoji) is detected, it is seamlessly routed through Android's system clipboard and pasted atomically without manual user intervention.

---

## 🔍 Issue 7: How do I collect underlying logs for deep troubleshooting?

1. In the console, navigate to "Settings" ➔ "Advanced", and enable **Agent Debug Logs**;
2. Reproduce the unexpected behavior;
3. Extract device logs via ADB:
   ```bash
   adb shell "cat /data/local/tmp/cloudphone-agent.log"
   ```
4. Attach logs, device model, and Android OS version to a [GitHub Issue](https://github.com/hqw700/ScrcpyOverWebRTC/issues).

---

## 🔍 Issue 8: How do I disconnect or stop the Agent directly from the phone?

If you do not have access to your PC and wish to sever connections directly on the phone:
* **Mobile Management Portal**:
  Open the following URL in the phone's mobile browser:
  ```text
  http://127.0.0.1:12345/d
  ```
* **Supported Actions**:
  1. **Disconnect Active Stream**: Click the green button to sever active WebRTC streams while keeping the Agent active for future sessions;
  2. **Terminate Agent Process**: Click Stop to terminate the background daemon completely.

---

## 🔍 Issue 9: Docker pull timeouts, TLS handshake timeouts, or registry errors?

### 📌 Cause & Solution:
In restricted network environments, accessing Docker Hub directly can be throttled or fail. Configure an active registry mirror:

```bash
# 1. Write mirror configuration
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://docker.m.daocloud.io"]
}
EOF

# 2. Reload and restart Docker
sudo systemctl daemon-reload
sudo systemctl restart docker

# 3. Pull image
docker pull buutuu/scrcpy-over-webrtc:latest
```

---

## 🔍 Issue 10: Is Root required on physical Android devices?

**No, Root is optional.**
- **Non-Root (Standard)**: Connect via standard USB Debugging or WiFi ADB. The WebUSB one-click onboarding tool can deploy and start the Agent without installing ADB drivers on your PC.
- **Root (Magisk Module)**: If you need devices to automatically boot up and reconnect to the cloud after rebooting or power cycles, install the Magisk module for background system-service persistence.
