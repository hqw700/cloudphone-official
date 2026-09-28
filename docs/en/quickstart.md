# Hardware Requirements & Sizing Guide

Before deploying ScrcpyOverWebRTC, review this page to understand minimum hardware specifications and select the optimal setup path for your scenario.

> [!IMPORTANT]
> **Concept Clarification: ScrcpyOverWebRTC is a central management and remote control system, NOT a VM hypervisor.**  
> It connects your existing physical Android devices, local emulators, redroid containers, or third-party cloud phones into one unified dashboard with responsive WebRTC control and batch operations.

---

## 💻 Hardware Requirements

The system consists of two primary components: the **Management Server** and the **Target Android Devices**.

### 1. Management Server (Signaling & Web Console)

Because video encoding happens inside the Android devices and traffic streams directly to the browser, the server does not transcode media, resulting in **exceptionally low hardware requirements**:

| Deployment Type | Minimum Specs | Recommended Specs | Target Scenario |
| :--- | :--- | :--- | :--- |
| **LAN NAS / Desktop PC** | 1 Core CPU / 1GB RAM | 2 Cores CPU / 2GB RAM | Synology, QNAP, fnOS, Windows/Mac development machines. |
| **Cloud VPS / Server** | 1 Core CPU / 1GB RAM / 1Mbps | 2 Cores CPU / 2GB RAM / 3Mbps | AWS, DigitalOcean, Aliyun (2c2g3M handles 100 devices and concurrent streaming). |
| **Standalone Mobile Mode** | Runs inside Android | Android 11+ / 4GB RAM | Zero server, runs self-contained on a single phone. |

### 2. Target Device (Agent & Android System)

Target devices capture display buffers and encode them via hardware MediaCodec:

| Device Type | Requirements | Recommended Method |
| :--- | :--- | :--- |
| **Physical Phone (Rooted)** | Android 7.0+ (10+ recommended), Magisk / KernelSU / APatch | Magisk Module or Deploy Script |
| **Physical Phone (Non-Root)** | Android 7.0+, USB Debugging enabled | WebUSB Browser Onboarding or Desktop Script |
| **Docker Redroid Container** | Host with KVM support, Android 11/12 images | Container Port Mapping & Multiple instances |
| **Android Emulators** | LDPlayer, MuMu, Nox, Genymotion | Desktop Script |

---

## 🚀 Quick Deployment Decision Matrix

1. **Want to test quickly on your PC?**  
   Run the desktop one-click script `agent-deploy.zip` or plug your phone via USB and open the WebUSB deployment page.
2. **Want to manage dozens of devices?**  
   Run the Docker AIO image on your server:  
   `docker run -d --name scrcpy-webrtc -p 8000:8000 buutuu/scrcpy-over-webrtc:latest`
3. **Need devices to reconnect after reboot automatically?**  
   Install the Magisk module on rooted devices for automated system-service persistence.
