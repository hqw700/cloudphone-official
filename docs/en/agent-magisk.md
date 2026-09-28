# Method 3: Magisk / Root Auto-Start Module

This guide covers installing `cloudphone-agent` as a **Magisk / KernelSU / APatch module** on rooted Android devices.  
Once installed, the Agent operates as a persistent system-level daemon: **it launches automatically on device boot and recovers from unexpected process terminations**, requiring no computer connection. It is ideal for unattended device racks, server farms, and 24/7 automated mobile clusters.

---

## 📋 Prerequisites

1. **Rooted Device**: The phone has Magisk (v24+), KernelSU, or APatch installed and active.
2. **Signaling Server URL**: Your signaling server endpoint (e.g. `wss://192.168.1.100:8443`).
3. **Download Module**: Open the web console, navigate to **"One-Click Deploy"** ➔ **"Magisk / KSU Module"**, and download **`cloudphone-agent-magisk.zip`**.

---

## 🔥 Step 1: Flash the Module

1. Transfer `cloudphone-agent-magisk.zip` to the phone's internal storage (via USB, browser download, or local file sharing).
2. Open your **Magisk / KernelSU / APatch Manager** app.
3. Go to the **"Modules"** section, tap **"Install from storage"**, and select the ZIP file.
4. Once installation completes, tap **"Reboot"** in the lower-right corner.

During installation, the module automatically handles:
* **Architecture Detection**: Identifies device CPU architecture (`arm64`, `armeabi-v7a`, or `x86_64`) and installs the matching native binary.
* **System-Level Watchdog**: Installs an init boot script that launches the Agent upon network readiness and polls every 5 seconds to ensure health.
* **CLI Management**: Installs the `cpctl` (`cloudphone-ctl`) interactive command-line tool.
* **Seamless Backup**: Existing configurations are automatically preserved when flashing newer versions.

---

## ⚙️ Step 2: Configure Signaling URL & Device ID

After rebooting, the watchdog daemon runs in the background. On initial setup, point the Agent to your signaling server using one of the following methods:

### Method A: One-Line CLI Command (Recommended)

In a terminal app on the phone (Termux / MT Manager Terminal) or via PC `adb shell`:

```bash
su
cpctl set CP_AGENT_SIGNALING "wss://<YOUR-SERVER-IP>:8443"
cpctl set CP_AGENT_ID "<Custom-Device-ID>"

# 💡 Strongly Recommended: Configure TURN relay (guarantees traversal across cellular & symmetric NATs)
cpctl set CP_AGENT_ICE_SERVERS '["turn:cloudphone_user:cloudphone_secure_password@<YOUR-SERVER-IP>:3478?transport=udp","stun:<YOUR-SERVER-IP>:3478"]'

cpctl restart
```

> [!IMPORTANT]
> **ICE / TURN Relay Configuration Reminder**:  
> While devices on the same LAN or with public IPv6 addresses can establish direct P2P connections, devices operating over cellular data (4G/5G) or behind corporate symmetric NATs **may display matrix previews but fail or time out when establishing interactive direct WebRTC sessions if TURN is missing**. Configuring `CP_AGENT_ICE_SERVERS` with your server's TURN credentials ensures 100% traversal success.

> 💡 **Protocol Matching**: Use `wss://` when the server runs HTTPS (default), and `ws://` when TLS is disabled.

### Method B: Interactive Terminal Menu

Run `su` followed by `cpctl` to open the terminal management menu:

```bash
su
cpctl
```

The menu displays the current Agent status, PID, signaling endpoint, and device ID. Select **"4) Interactive Configuration"** to adjust settings, then select **"3) Restart Agent"** to apply changes.

### Method C: Offline Pre-Configuration on PC (Best for Batch Flashing)

If you are provisioning a batch of devices and want them to connect immediately upon first boot without typing commands:

1. **Download Configuration Tool**:
   On the web console "One-Click Deploy -> Magisk Module" page, download **`magisk-config-tools.zip`** (~15KB, zero Python dependency).
2. **Extract Tools**:
   Extract `magisk-config-tools.zip` into the same directory containing `cloudphone-agent-magisk.zip`.
3. **Customize Settings**:
   * **Windows**: Drag and drop `cloudphone-agent-magisk.zip` directly onto **`configure_magisk.bat`**, enter your signaling URL, and it instantly generates `cloudphone-agent-magisk-configured.zip`. Or run PowerShell:
     ```powershell
     .\configure_magisk.ps1 -Signaling "wss://<YOUR-SERVER-IP>:8443"
     ```
   * **macOS / Linux**:
     ```bash
     chmod +x configure_magisk.sh
     ./configure_magisk.sh -s "wss://<YOUR-SERVER-IP>:8443"
     ```
4. **Flash & Connect**:
   Flash the customized ZIP package. **Upon device boot, the phone will automatically connect to your server**, eliminating any manual on-device setup!

### Method D: Direct Configuration File Editing

Edit the configuration file directly using a root text editor:

```text
/data/adb/modules/cloudphone-agent/config.conf
```

After saving, toggle the module's Action button twice in Magisk Manager (stop, then start) to hot-reload without rebooting.

---

## 🛠️ cpctl CLI Command Reference

All `cpctl` commands require Root privileges (run `su` first):

| Command | Description |
| :--- | :--- |
| `cpctl start` | Enables watchdog and starts the Agent daemon immediately |
| `cpctl stop` | Disables watchdog and stops the Agent daemon |
| `cpctl restart` | Restarts the Agent daemon (applies new configurations) |
| `cpctl status` | Displays watchdog status, process PIDs, and recent logs |
| `cpctl log` | Follows real-time Agent log output (`Ctrl+C` to exit) |
| `cpctl set <KEY> <VALUE>` | Updates a configuration property (e.g. `cpctl set CP_AGENT_BITRATE 8000000`) |
| `cpctl config` | Prints all active configuration parameters |
| `cpctl` | Opens the interactive visual terminal menu |

---

## 📄 Configuration Parameters Reference (config.conf)

Path: `/data/adb/modules/cloudphone-agent/config.conf`

| Parameter | Default | Description |
| :--- | :--- | :--- |
| `ENABLED` | `true` | Master watchdog toggle. Set to `false` to disable auto-start |
| `CP_AGENT_SIGNALING` | - | **Required**. Signaling server URL (e.g. `wss://192.168.1.100:8443`) |
| `CP_AGENT_ID` | Auto | Unique device ID. Defaults to `Model-SerialNumber` |
| `CP_AGENT_BITRATE` | `4000000` | Default video bitrate (bps). E.g. `4000000` = 4 Mbps |
| `CP_AGENT_RESOLUTION` | Native | Max resolution limit (e.g. `1080`, `720`). Blank keeps native |
| `CP_AGENT_MAX_FPS` | `60` | Maximum encoding FPS limit (`60`, `30`) |
| `CP_AGENT_BWE` | `true` | Enable BWE dynamic congestion bitrate adaptation |
| `CP_AGENT_AUDIO` | `true` | Enable internal audio capture (Android 11+) |
| `CP_AGENT_ICE_SERVERS` | - | STUN/TURN relay server list in JSON format |
| `CP_AGENT_EXTERNAL_ADDR`| - | Public/host IP address for ICE candidate construction |
| `CP_AGENT_WEBRTC_PORT` | - | Fixed WebRTC UDP media port or range (e.g. `50000` or `50000-50010`) |
| `CP_AGENT_DEBUG` | `false` | Enable verbose debugging logs |

---

## 🔍 Verification

Run in terminal or via PC ADB:

```bash
adb shell "su -c cpctl status"
```

When the output indicates **Agent Process: RUNNING** and **Scrcpy Helper: RUNNING**, the daemon is operational. Open the web console to begin low-latency streaming.

---

## 🛑 On-Device Emergency Disconnect

To quickly sever the active mirroring session directly from the phone:
* **Option 1 (Browser)**: Open `http://127.0.0.1:12345/d` in the phone's mobile browser to disconnect sessions or shut down the Agent.
* **Option 2 (Terminal)**: Execute `su -c "cpctl stop"`.

---

## ♻️ Upgrade & Uninstallation

- **Seamless Upgrade**: Re-flash newer versions of `cloudphone-agent-magisk.zip` in Magisk/KSU and reboot; `config.conf` settings remain intact.
- **Uninstallation**: Tap "Remove" in the modules list and reboot to clean up all background services and binaries.
