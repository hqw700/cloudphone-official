# Device Onboarding & Agent Setup Overview

This document serves as the unified navigation portal for device onboarding. ScrcpyOverWebRTC supports physical Android smartphones, rooted devices, non-rooted devices, Docker Redroid cloud containers, and Android app dual-mode access.

Select the guide tailored to your hardware and infrastructure environment:

---

## 🧭 Onboarding Methods Decision Matrix

| Method | Scenario | Prerequisites | Guide |
| :--- | :--- | :--- | :--- |
| **Method 1: WebUSB Browser Setup** | Best for quick individual physical tests | Chrome / Edge browser, USB cable | [View WebUSB Guide](/en/agent-webusb) |
| **Method 2: PC Script One-Click Deployment** | Developers, LAN testing, Wireless ADB | Host machine with ADB (USB or Wi-Fi) | [View Desktop Script Guide](/en/agent-script) |
| **Method 3: Magisk Module Auto-Start** | 24/7 unattended fleet farms | Rooted device with Magisk / KSU / APatch | [View Magisk Module Guide](/en/agent-magisk) |
| **Method 4: Android App Native Client** | Device acts as Controller or Agent | Android device (Root or Shizuku Non-Root) | [View Android App Guide](/en/app-guide) |
| **Method 5: Docker / Redroid Cloud Phone** | Scalable multi-instance virtualization | Linux host with KVM & Docker | [View Redroid Container Guide](/en/agent-docker) |
| **Method 6: Custom ROM / Image Integration** | Firmware-level integration, zero-push boot | Android source compilation / Dockerfile | 🚀 Upcoming |
| **Method 7: Linux Host Agent Supervisor** | Host daemon managing local VMs & power | Bare-metal Linux host server | 🚀 Upcoming |

---

> 💡 Before connecting any physical device for the first time, review [Device Preparation & Developer Options](/en/agent-prep) to configure USB debugging and vendor security permissions.
