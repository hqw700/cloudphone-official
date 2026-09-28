# ScrcpyOverWebRTC Documentation

Welcome to the official developer documentation and user guide for **ScrcpyOverWebRTC**.  
This platform is built with **WebRTC P2P direct streaming, redroid virtualization, and deeply customized scrcpy-server**, designed for ultra-low latency, responsive touch interactions, and enterprise device fleet management.

---

## 📖 Documentation Sections

### 📖 1. Project Overview & Architecture
* **[Introduction & Architecture](/en/introduction)**: System topology, 3-channel UDS isolation, and hardware PTS passthrough mechanism.
* **[Core Feature Matrix](/en/features)**: Comprehensive breakdown of audio/video pipelines, dashboard matrix, touch input, audit logs, and web debugging tools.
* **[Hardware Requirements & Sizing](/en/quickstart)**: Server & device requirements, device capability matrix, and deployment recommendations.
* **[Industry Use Cases & Sizing](/en/use-cases)**: Real-world business scenarios, gaming botting, device leasing, and surveillance setups.

### 📱 2. Device Access & Agent Setup
* **[Onboarding Portal & Overview](/en/agent-deploy)**: Decision matrix for all available device onboarding pathways.
* **[Device Preparation & Developer Options](/en/agent-prep)**: USB debugging, security injection toggles, and OEM permissions.
* **[Method 1: WebUSB Browser Setup](/en/agent-webusb)**: Pair and deploy the Agent directly inside Chrome/Edge with zero driver installation.
* **[Method 2: PC Script One-Click Deployment](/en/agent-script)**: Deploy via desktop scripts with wired or wireless ADB.
* **[Method 3: Magisk / Root Auto-Start Module](/en/agent-magisk)**: 24/7 background system service persistence with `cpctl` CLI tooling.
* **[Method 4: Android App Native Client](/en/app-guide)**: Native Android app supporting both controller and managed agent modes.
* **[Method 5: Docker / Redroid Cloud Phone](/en/agent-docker)**: 1-second AIO image builder and container fleet management.

### 💻 3. Server Deployment & Operations
* **[Server Unified Configuration & Ports](/en/deploy-config)**: Environment variables, standalone CLI flags, and firewall rules.
* **[LAN & Standalone Green Deployment](/en/deploy-lan)**: Zero-Docker portable native binaries for local networks.
* **[Docker All-in-One Deployment (AIO)](/en/deploy-docker)**: Integrated container with coturn and signaling services.
* **[NAS & Router Deployment (fnOS / iStoreOS)](/en/deploy-nas)**: Private cloud NAS and OpenWrt gateway deployment.
* **[Public Cloud ECS & NAT Traversal](/en/deploy-cloud)**: ICE/STUN/TURN public internet streaming and IPv6 direct routing.
* **[Standalone Device Mode](/en/deploy-standalone)**: Run the signaling server and web console directly inside the phone.

### 🎮 4. Core Features User Manual
* **[Monitoring Matrix & Group Control](/en/feature-dashboard)**: H.264 preview streaming, WebCodecs GPU decoding, and multi-device sync.
* **[Multi-User, Leases & Audit Logs](/en/feature-users)**: RBAC roles, exclusive device leases, policy locks, and audit logging.
* **[Device Sharing & Access Passcodes](/en/feature-share)**: Temporary web share links and 8-character passcodes.
* **[Device Tag Management & Filtering](/en/feature-tags)**: Color-coded tags and responsive matrix filtering.
* **[Advanced Input: IME Text & Keymapping](/en/feature-inputs)**: 100% full-text IME injection, bidirectional clipboard sync, and visual keymapping.
* **[Remote Terminal: xterm.js & Macro Commands](/en/feature-terminal)**: Interactive multi-tab shell and concurrent batch dispatch.
* **[P2P File Manager & APK Distribution](/en/feature-files)**: Direct WebRTC DataChannel file transfer and silent APK installation.
* **[AI Troubleshooting Assistant](/en/feature-ai)**: Autonomous natural-language diagnostic agent with native tool calling.

### 🎯 5. Hands-On Tutorials
* **[Tutorial 1: Windows Local Setup](/en/tutorial-windows)**: Run locally on Windows 10/11 and control physical phones in 5 minutes.
* **[Tutorial 2: Alibaba Cloud ECS Setup](/en/tutorial-aliyun)**: Public cloud deployment, security groups, and low-bitrate concurrency.

### ⚙️ 6. Advanced Customization & Development
* **[Virtual HAL Injection (Camera/GPS/Sensors)](/en/rom-hal)**: Inject desktop webcams, mock GPS coordinates, and gyro telemetry into HAL.
* **[Web Console Secondary Development](/en/dev-web)**: Vue 3 / Vite architecture, component layout, and Vite proxy hot-reload.
* **[Website & Documentation Building](/en/dev-website)**: Build, merge, and host the official landing page and VitePress docs.

### 🛠️ 7. Troubleshooting & FAQ
* **[Frequently Asked Questions (FAQ)](/en/faq)**: Comprehensive 10-issue troubleshooting guide for black screens, WebUSB conflicts, and NAT routing.

---

> [!NOTE]
> This documentation is continuously updated with the latest releases. For bug reports or feature requests, visit [GitHub Issues](https://github.com/hqw700/ScrcpyOverWebRTC/issues).
