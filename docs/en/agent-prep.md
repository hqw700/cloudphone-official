# Device Preparation & Developer Options

Before connecting physical Android smartphones or virtual machines to the ScrcpyOverWebRTC management platform, follow this guide to complete the prerequisite system configurations on your target devices.

---

## 📋 General Preparation Checklist for Physical Devices

### 1. Enable Developer Options
1. Open your device's **"Settings"** ➔ **"About Phone"** (found under "My Device" or "System Information" on certain brands).
2. Rapidly tap the **"Build Number"** 5 to 7 times.
3. Continue until a prompt appears: *"You are now a developer!"* or *"Developer options enabled"*.

### 2. Enable USB Debugging
1. Return to the main Settings menu and navigate to **"System & Updates"** (or "Additional Settings" / "Developer Options").
2. Locate and toggle on **"USB Debugging"**.
3. When the system security dialog pops up, acknowledge the warning and tap **OK**.

### 3. Grant Touch & Security Injection Permissions (OEM-Specific)
For brands such as Xiaomi (MIUI / HyperOS), OPPO, vivo, and Meizu, failure to enable security input permissions will result in **video mirroring functioning normally, but all mouse/touch inputs being completely ignored**.

| Brand / OS | Required Critical Toggle | Important Notes |
| :--- | :--- | :--- |
| **Xiaomi (MIUI / HyperOS)** | **"USB Debugging (Security settings)"** | Requires an active SIM card inserted and a logged-in Mi Account; you must confirm 3 consecutive security warnings. |
| **OPPO / OnePlus (ColorOS)** | **"Disable Permission Monitoring"** | Prevents system dialog popups from interrupting automated touch events. |
| **vivo (OriginOS)** | **"USB Security Permissions"** | Must enable simulated input over USB inside Developer Options. |
| **Meizu (Flyme)** | **"Allow Simulated Clicks"** | Allows external ADB input events to inject touch coordinates onto the screen. |

### 4. Cable & Driver Verification
- **USB Cable Quality**: Use a high-quality physical USB data cable capable of high-speed transmission. Avoid cheap charge-only cables.
- **Connection Mode**: When plugged into a computer, select **"Charging Only"** or **"File Transfer (MTP)"** in the dropdown notification shade.
- **Authorization Prompt**: When connecting to a PC for the first time, an **"Allow USB Debugging?"** dialog will appear on your phone screen. Check **"Always allow from this computer"** and tap **OK**.

---

## 🔍 Verify Basic Connectivity

If you have the ADB command-line tool installed on your computer, verify device detection in your terminal:

```bash
adb devices
```

- **Normal Status**: Displays the device serial number with status `device`:
  ```text
  List of devices attached
  08151FDD40003P    device
  ```
- **Unauthorized Status** (shows `unauthorized`): An unconfirmed debugging prompt is pending on the phone screen. Wake up the phone and tap "Allow".
- **No Devices Listed**: Verify cable connection, try different USB ports, or reconnect the cable.

---

## 🐳 Docker / Redroid Cloud Phone Preparation Checklist

If you run **Redroid (Remote Android)** cloud phone container clusters via Docker, ensure the Linux host meets the following prerequisites before deployment:

### 1. Kernel Binder Driver Check & Mounting
Redroid relies on Android's IPC driver, Binder. Modern Linux kernels (5.0+) usually come with built-in or module support for `binder_linux`:
1. **Check Binder nodes**:
   ```bash
   ls -l /dev/binderfs /dev/binder
   ```
   - If `/dev/binder` or `/dev/binderfs/binder`, `hwbinder`, `vndbinder` exist, the driver is ready.
2. **If driver is not loaded** (Ubuntu / Debian / Proxmox VE):
   ```bash
   # Load binder module and enable binderfs
   sudo modprobe binder_linux devices="binder,hwbinder,vndbinder"
   ```
   If the module is missing, install your distribution's extra kernel package (e.g. `sudo apt install linux-modules-extra-$(uname -r)` on Ubuntu, or compile DKMS binder modules).

### 2. Loop Device Pre-allocation (Critical for High-Density Multi-Containers ⭐️)
> [!IMPORTANT]
> **Key fix for multi-instance crashes on the 2nd container (Exit Code 129)!**  
> In Android 10+ (specifically Android 14 & 15), core runtimes (Bionic libc, dynamic linker `linker64`, ART) are packaged inside APEX images. A single container instance mounts 20~30 `.apex` images as Loop devices.  
> Standard Linux hosts only pre-create **8 Loop device nodes** (`/dev/loop0` ~ `/dev/loop7`). Once the first container uses them up, subsequent containers fail to mount the dynamic linker, triggering `vold` emergency shutdowns.

Run this one-time command on the host to create up to 256 loop nodes:
```bash
sudo bash -c 'for i in $(seq 8 255); do [ ! -e /dev/loop$i ] && mknod -m 660 /dev/loop$i b 7 $i; done'
```
*💡 We recommend persisting this via a systemd startup unit (e.g. `/etc/systemd/system/redroid-loop.service`) to survive host reboots.*

### 3. Network Isolation Policy (Strictly Prohibit `--net=host`)
> [!CAUTION]
> **Never launch Redroid containers with `--net=host` under privileged mode!**  
> Redroid is a full Android OS. Android's internal `netd` daemon assumes exclusive ownership of the host network stack: on boot, it will flush host default routing tables (`lookup main`), force disable `net.ipv4.ip_forward=0`, and inject restrictive iptables DROP rules, **completely severing network bridging across all host containers**!  
> **Always run Redroid containers in standard Docker Bridge mode.**

### 4. GPU Hardware Acceleration & Rendering Choice
* **Host with Intel/AMD iGPU or Discrete GPU**:
  Pass through the GPU render node `-v /dev/dri:/dev/dri` and configure boot parameter `androidboot.redroid_gpu_mode=host` for zero-copy hardware acceleration.
* **CPU-Only Cloud VPS or Headless Servers**:
  Configure `androidboot.redroid_gpu_mode=guest` for software Mesa CPU rendering.

---

## ⚖️ Device Onboarding Method Comparison

Select the most appropriate onboarding method based on your operating environment, scale, and access permissions:

1. **WebUSB Browser Onboarding**:
   - **Auto-Reconnection after Reboot**: ❌ **Not supported** (Requires re-pairing in browser after device reboot or cable disconnection).
   - **Batch Deployment**: ❌ **Not supported** (Limited by browser WebUSB security specifications, devices must be selected one by one).
   - **Target Audience**: Beginners with zero setup; plug in via USB and click to deploy without installing local ADB drivers.

2. **Terminal ADB (Desktop Script)**:
   - **Auto-Reconnection after Reboot**: ❌ **Not supported** (Requires running script again after reboot).
   - **Batch Deployment**: ✅ **Supported** (Concurrent batch deployment scripts push to all USB/Wi-Fi connected devices simultaneously).
   - **Target Audience**: Fleet management for non-rooted physical devices in testing labs.

3. **Magisk Module**:
   - **Auto-Reconnection after Reboot**: ✅ **Supported** (Registered as background system service, boots up and connects upon network availability).
   - **Batch Deployment**: ✅ **Supported** (Pre-configure `config.json` inside the module package and flash across devices silently via Recovery or Magisk CLI).
   - **Target Audience**: Unattended server racks, 24/7 cloud phone farms, and rooted production devices.

4. **App ADB Mode (Shizuku)**:
   - **Auto-Reconnection after Reboot**: ❌ **Not supported** (Shizuku process terminates upon device reboot).
   - **Batch Deployment**: ❌ **Not supported** (Manual tap required per device).
   - **Target Audience**: Computer-free quick testing using Android 11+ Wireless Debugging.

5. **App Root Permission Mode**:
   - **Auto-Reconnection after Reboot**: ✅ **Supported** (Starts automatically with Root `su` background daemon).
   - **Batch Deployment**: ✅ **Supported** (Built-in one-click configuration recovery & repair interface).
   - **Target Audience**: Rooted devices requiring an intuitive GUI without flashing Magisk modules.

6. **Docker / Redroid All-in-One (AIO) Container & Custom ROM** <span style="color: #10b981; font-size: 13px; font-weight: bold;">(✅ Supported)</span>:
   - **Auto-Reconnection after Reboot**: ✅ **Natively supported** (Built into standard container image, boots up immediately on launch).
   - **Batch Deployment**: ✅ **Supported** (Instantly scale dozens of instances; auto-generates unique Device IDs from the last 4 bytes of MAC address).
   - **Target Audience**: Standardized server virtualization, automated cloud phone farms, and custom Android ROMs.

7. **Linux Host Agent (Host Supervisor Daemon)** <span style="color: #38bdf8; font-size: 13px; font-weight: bold;">(🚀 Upcoming)</span>:
   - **Auto-Reconnection after Reboot**: ✅ **Supported** (Persistent systemd service on Linux host).
   - **Host-Level VM Life Cycle & Power Control**: ✅ **Unified VM power management** (Manage all local Redroid containers; execute batch boot, shutdown, and reboot via remote signaling).
   - **Target Audience**: High-density datacenter clusters and large-scale cloud phone compute nodes.

### 📋 Feature Comparison Table

| Method | Auto-Boot Persistence | Batch Operations | Permissions | Best For | Detailed Guide / Status |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **1. WebUSB** | ❌ No | ❌ No | USB Debugging Only | Driver-free browser pairing, zero setup | [View Guide](/en/agent-webusb) |
| **2. PC Script** | ❌ No | ✅ Yes (Batch Script) | USB Debugging Only | Non-rooted multi-device concurrent deployment | [View Guide](/en/agent-script) |
| **3. Magisk Module** | ✅ Yes | ✅ Yes (Pre-configured Package) | Root (Magisk/KSU/APatch) | 24/7 unattended device racks & automated farms | [View Guide](/en/agent-magisk) |
| **4. App (Shizuku)** | ❌ No | ❌ No | Non-Root (Shizuku) | PC-free standalone testing via Wireless Debugging | [View Guide](/en/app-guide) |
| **5. App (Root Mode)** | ✅ Yes | ✅ Yes (Config Auto-Repair) | Root (`su`) | Rooted devices wanting a simple graphical app | [View Guide](/en/app-guide) |
| **6. Docker Redroid AIO** | ✅ Yes | ✅ Yes (1-Click Multi-Instance) | Docker / Privileged | Instant container builds, auto MAC deduplication | [View Guide](/en/agent-docker) |
| **7. Linux Host Agent** | ✅ Yes | ✅ Yes (Host Power Control) | Host Root | Lifecycle supervision & remote power cycling | 🚀 **Upcoming** |

---

## ➡️ Next Steps: Select Your Onboarding Guide

Once device prerequisites are satisfied, continue to the dedicated guide for your target platform:

1. **[Method 1: WebUSB Browser Setup](/en/agent-webusb)**: Zero-driver one-click setup inside your web browser.
2. **[Method 2: PC Script One-Click Deployment](/en/agent-script)**: Push via desktop scripts (USB, wired, or wireless ADB).
3. **[Method 3: Magisk / Root Auto-Start Module](/en/agent-magisk)**: Persistent background system service for unattended environments.
4. **[Method 4: Android App Native Client](/en/app-guide)**: Native Android app for both host control and agent streaming.
5. **[Method 5: Docker / Redroid Cloud Phone](/en/agent-docker)**: Server-side Redroid virtualization with pre-configured AIO toolkits.
