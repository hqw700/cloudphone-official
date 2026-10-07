# Device Preparation & Onboarding Decision Matrix (Device Preparation)

Before connecting physical Android devices, virtual machines, or Docker containers to ScrcpyOverWebRTC, complete the prerequisite environment setup and choose the best onboarding path for your infrastructure.

---

## 🧭 1. Onboarding Mode Comparison Matrix

ScrcpyOverWebRTC supports physical devices, rooted hardware, non-root devices, Docker Redroid containers, and dual-mode Android apps. Compare their core capabilities below:

| Mode | Boot Auto-Start | Batch Fleet Control | Privilege Required | Target Scenarios & Positioning | Setup Guide |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **1. Web ADB (WebUSB)** | ❌ No | ❌ No | USB Debugging only | Zero-install, pure browser connectivity for single device trial and quick testing | [WebUSB Guide](/en/agent-webusb) |
| **2. PC ADB Script Deployment** | ❌ No | ✅ Yes (Batch Script) | USB Debugging only | Desktop CLI batch script for rapid non-root multi-device onboarding | [PC Script Guide](/en/agent-script) |
| **3. Magisk Auto-Start Module** | ✅ Yes | ✅ Yes (Pre-config Flash) | Root (Magisk/KSU/APatch) | Persistent boot daemon for automated server rack fleets and 24/7 stability | [Magisk Guide](/en/agent-magisk) |
| **4. App ADB Mode (Shizuku)** | ❌ No | ❌ No | Non-Root (via Shizuku) | Host mode directly launched on-device without a PC | [Android App Guide](/en/app-guide) |
| **5. App Root Mode** | ✅ Yes | ✅ Yes (Offline Config) | Root (`su`) required | Native app UI elevation with boot auto-start and `/data/local/tmp` config templates | [Android App Guide](/en/app-guide) |
| **6. Docker / Redroid Cloud Phone** | ✅ Yes (Built-in) | ✅ Yes (AIO Image Fleet) | Docker / Privileged Container | 1-sec AIO image builder, auto MAC anti-collision, best for cloud Android virtualization | [Docker Guide](/en/agent-docker) |
| **7. Linux Host Agent Daemon** | ✅ Yes (systemd) | ✅ Yes (Host Power Control) | Linux Host Root | Host daemon managing local VMs with remote batch power on/off/reboot | 🚀 **Coming Soon** |

---

## 📱 2. Physical Android Device Prerequisites

If you are onboarding **physical Android phones** (via WebUSB, PC Script, Magisk Module, or Android App), complete these system configurations before proceeding:

### 1. Enable Developer Options
1. Go to **Settings** ➔ **About Phone** (or "My Device" / "System Info");
2. Tap **Build Number** repeatedly 5 to 7 times;
3. A toast prompt appears: *"You are now in developer mode!"*.

### 2. Enable USB Debugging
1. Return to the main Settings menu ➔ **System** (or "Additional Settings" / "Developer Options");
2. Enable **USB Debugging**;
3. Check "I understand the risks" and tap **OK**.

### 3. Grant Security Input Permissions (OEM Devices Critical ⭐️)
For Xiaomi (MIUI/HyperOS), OPPO, vivo, and Meizu devices, touch input events will be blocked if security toggles are disabled, resulting in **visible video streams but completely unresponsive mouse clicks**:

| Brand / OS | Required Switch | Notes |
| :--- | :--- | :--- |
| **Xiaomi (MIUI / HyperOS)** | **"USB Debugging (Security settings)"** | Requires an active SIM card and Xiaomi account login; requires confirming 3 consecutive warning prompts |
| **OPPO / OnePlus (ColorOS)** | **"Disable Permission Monitoring"** | Prevents the system from interrupting automation with permission prompt popups |
| **vivo (OriginOS)** | **"USB Security Permissions"** | Enables touch event simulation over USB |
| **Meizu (Flyme)** | **"Allow Simulated Clicks"** | Allows external ADB input event injection |

### 4. OEM-Specific ADB Troubleshooting & Pitfalls 💡

Different Android manufacturers implement custom restrictions and quirks. Refer to the key points below:

* **Xiaomi / Redmi / POCO (MIUI / HyperOS)**:
  - **USB Debugging (Security settings)**: Must be enabled; separate from standard "USB Debugging". Without this, remote touch control will not work.
  - **Wireless Debugging Pairing Failure**: In system Settings ➔ "Notifications & status bar" ➔ "Notification style", switch to **"Android / Native style"** to allow the wireless pairing code dialog to pop up properly.
  - **Developer Options Randomly Disabled**: Avoid running the deep scan / clean-up tools in "Security Center" (手机管家), as some ROM versions automatically reset developer options and revoke authorizations during cleaning.
* **Huawei / Honor (EMUI / HarmonyOS / MagicOS)**:
  - **Disconnects in "Charge Only" Mode**: Must enable **"Allow ADB debugging in charge only mode"** in Developer Options; otherwise, disconnecting the cable or switching power status drops the connection immediately.
* **OPPO / OnePlus / Realme (ColorOS)**:
  - **Permission Prompt Interruption**: In Developer Options, disable **"Permission Monitoring"** (or enable **"Disable Permission Monitoring"**) to prevent background operations from being blocked.
* **Meizu (Flyme)**:
  - **Payment Protection Blocking**: In Developer Options, turn off **"Flyme Payment Protection"** and turn on **"Allow simulated clicks"**.
* **Sony (Sony Xperia)**:
  - Do not tap the USB mode switch dialog that pops up upon plugging in the USB cable, preventing the USB interface from resetting.
* **GrapheneOS (Hardened ROM)**:
  - Go to Settings ➔ "Security" ➔ turn off **"Secure app spawning"**.

### 5. Universal Anti-Timeout & Keep-Alive Settings (Highly Recommended)
- **Disable ADB Authorization Timeout (Android 11+)**: In Developer Options, enable **"Disable adb authorization timeout"** to prevent the ADB authorization from expiring when the device is locked/sleeping for extended periods;
- **Default USB Configuration**: In Developer Options, set "Default USB configuration" to **"No data transfer / Charging only"** to avoid protocol reconfiguration on cable plug/unplug;
- **Cables & Drivers**: Use a high-quality data cable; avoid charging-only cables. When prompted with "Allow USB debugging?", check **"Always allow from this computer"** and tap **OK**.

### 6. Verify Basic Connectivity
Run the following in your terminal to ensure ADB detects the device properly:
```bash
adb devices
```
- **Normal**: Device serial is listed with status `device`;
- **Unauthorized**: Tap "Allow" on the phone screen;
- **Empty**: Check USB cables, try a rear USB port, or re-plug the device.

---

## 🐳 3. Docker / Redroid Cloud Phone Host Prerequisites

If deploying **Redroid (Remote Android)** containers on Linux servers, ensure the host satisfies these kernel conditions:

### 1. Kernel Binder Driver Check
1. **Check Binder Nodes**:
   ```bash
   ls -l /dev/binderfs /dev/binder
   ```
   If `/dev/binder` or `/dev/binderfs/binder` exists, the driver is ready.
2. **Load Module if Missing** (Ubuntu / Debian / PVE):
   ```bash
   sudo modprobe binder_linux devices="binder,hwbinder,vndbinder"
   ```

### 2. Loop Device Node Pre-Allocation (Critical for High-Density ⭐️)
> [!IMPORTANT]
> **Key to Fixing 2nd Container Exit Code 129!**  
> Modern Android (Android 14/15) mounts 20-30 `.apex` images per container as loop devices. Standard Linux systems only pre-allocate 8 loop nodes (`/dev/loop0` ~ `/dev/loop7`). Once the first container exhausts them, the second container fails to mount runtimes and terminates (`vold` crash).

Pre-allocate 256 loop nodes on the host:
```bash
sudo bash -c 'for i in $(seq 8 255); do [ ! -e /dev/loop$i ] && mknod -m 660 /dev/loop$i b 7 $i; done'
```

### 3. Network Mode Safety Rule (Strictly Prohibit `--net=host`)
> [!CAUTION]
> **Never run privileged Redroid containers with `--net=host`!**  
> Android's internal `netd` daemon assumes exclusive ownership of the host routing table. It flushes `lookup main` routing rules, disables `net.ipv4.ip_forward`, and drops external traffic, **completely severing network access across all host containers**!  
> **Always run Redroid in Docker standard bridge mode.**

### 4. GPU Hardware Acceleration
* **Host with Intel/AMD GPU**: Pass `-v /dev/dri:/dev/dri` and append `androidboot.redroid_gpu_mode=host` for hardware encoding;
* **CPU-Only Cloud Servers**: Append `androidboot.redroid_gpu_mode=guest` for Mesa CPU software rendering.

---

## ➡️ 4. Proceed to Detailed Setup Guides

Select your preferred onboarding path below:

1. **[Method 1: WebUSB Browser Setup](/en/agent-webusb)**: Zero-driver browser deployment (recommended for beginner users).
2. **[Method 2: PC ADB Script Deployment](/en/agent-script)**: Command-line script deployment (USB, Wi-Fi ADB, batch fleet onboarding).
3. **[Method 3: Magisk / Root Auto-Start Module](/en/agent-magisk)**: Boot-persistent daemon for rooted devices and 24/7 racks.
4. **[Method 4: Android App Native Client](/en/app-guide)**: Mobile client supporting on-device host mode (Root auto-start & Shizuku non-root).
5. **[Method 5: Docker / Redroid Cloud Phone](/en/agent-docker)**: Server-side Redroid cluster setup using the 1-second AIO build kit.
