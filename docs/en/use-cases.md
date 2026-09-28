# Industry Use Cases & Hardware Requirements

> [!IMPORTANT]
> **Conceptual Clarification: This system builds a cloud phone management platform; it does not replace or create virtual Android OS hypervisors.**  
> ScrcpyOverWebRTC acts as the **signaling hub, control center, stream distributor, and device matrix dashboard**. It consolidates your existing physical smartphones, local emulators, or pre-launched Redroid containers into a responsive, browser-accessible fleet with group control and remote diagnostics.

---

## 💻 Baseline Hardware & System Requirements

To deploy this architecture, you only need to provide two infrastructure components:

| Component | Hardware / OS Requirements | Description |
| :--- | :--- | :--- |
| **1. Central Management Server** | NAS (fnOS / Synology) Docker / Standard PC (Win / Mac / Linux) / Cloud VPS (2C / 2GB / 3Mbps) | Runs the `webrtc-signaling` service and serves the web frontend console. |
| **2. Target Android Devices** | Android physical phone / Emulator / `redroid` container with **ADB Debugging** or **Root** | Runs the background `cloudphone-agent` daemon with shell or root privileges; does not require permanent USB tethering. |

---

## 🚀 Core Application Scenarios

ScrcpyOverWebRTC supports local networks, public cloud VPS instances, and standalone direct connections, serving scenarios from personal hobbies to commercial device fleets.

### 1. LAN NAS / Local PC Deployment Scenarios
Best suited for tech enthusiasts and studios with always-on NAS devices or dedicated local workstations.

* **1.1 Lightweight Device Roaming**:  
  Connect idle Android devices to your internal network; open the console in Safari, Chrome, or Edge on your Mac, iPad, or Windows PC to immediately interact with full touch fidelity.
* **1.2 High-Density Fleet & Group Control**:  
  Real-time preview matrix, tag-based device clustering, synchronized touch broadcasting, and concurrent silent APK distribution.
* **1.3 High-Performance Wireless Mirroring for Office Productivity**:  
  Silent bidirectional clipboard synchronization, full desktop IME Chinese/text injection, and peer-to-peer file drag-and-drop file transfers.
* **1.4 Mobile Gaming on PC (Cloud Game Botting)**:  
  Visual keymapping engine supporting Tap, Swipe, and 8-axis Joystick movement. Supports high frame rates (up to 120 FPS) and ultra-low latency (<50ms).
* **1.5 Developer & DevOps Remote Debugging**:  
  Native interactive terminal (`xterm.js`) supporting shell or root access, coupled with AI diagnostic tools and performance telemetry.
* **1.6 Repurposing Idle Phones as Surveillance Cameras**:  
  Configure camera streaming on retired smartphones. If your local broadband has public IPv6 addresses, access real-time video surveillance securely from anywhere.

---

### 2. Public Cloud VPS Deployment Scenarios
Best suited for distributed teams and commercial operations hosting services on public cloud servers.

* **2.1 Global Remote Control & Fleet Maintenance**:  
  With the server deployed in the cloud, control devices across disparate remote networks. When devices and clients share local subnets, WebRTC automatically routes via LAN direct connections.
* **2.2 Centralizing Third-Party Cloud Phones**:  
  Aggregate purchased cloud phone instances (Redfinger, LDCloud, Duoduo) into your single unified management matrix.
* **2.3 Commercial Multi-Tenant Device Leasing**:  
  Built-in multi-user management and lease model allows assigning dedicated devices to customers for secure, isolated remote access.

---

### 3. Phone-to-Phone Direct Scenarios
* **3.1 Phone-to-Phone Direct Remote Control**:  
  > [!WARNING]
  > **Not Recommended for Production**: While Standalone Mode enables running both server and agent directly on mobile devices for phone-to-phone control, mobile battery management and OS network limits make it suitable primarily as a Proof of Concept (PoC).
