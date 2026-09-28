# LAN & Standalone Green Deployment

This guide explains how to deploy ScrcpyOverWebRTC on a local area network (LAN) or local development workstation using **standalone, portable native binaries (Zero Docker)**.

LAN deployment offers abundant local bandwidth and ultra-low latency (end-to-end interactive delay `<40ms`) with zero public bandwidth costs, making it ideal for local testing, device rack control, and private air-gapped environments.

---

## 💻 Standalone Native Binaries (Zero-Docker Portable)

If you prefer not to install Docker on your server or workstation, launch the standalone binary bundled in the official release package directly. It has zero external dependencies and runs immediately after extraction.

### 1. Download & Extract Release Archive
Download the full release package `cloudphone-vX.Y.Z.zip` from the [Releases](https://github.com/hqw700/ScrcpyOverWebRTC/releases) page and extract it.

The package contains precompiled binaries for Linux, macOS, and Windows (amd64 and arm64), along with static web console assets and self-signed HTTPS certificates.

### 2. Launch the Server

#### Linux / macOS:
```bash
chmod +x start_server.sh
./start_server.sh
```
*The script detects your host CPU architecture (x86_64, aarch64, or Apple Silicon) and executes the matching binary under `bin/`.*

#### Windows:
Navigate to the extracted `bin\windows_amd64\` directory and double-click `run.bat`.

### 3. Access Console on Your LAN

Upon launch, the terminal prints the reachable network addresses for each network interface. Open a browser on any PC, tablet, or phone on the same LAN:

```text
https://<SERVER-LAN-IP>:8443
```

- **Default Username**: `admin`
- **Default Password**: `admin123`

> 🔐 **Security & Hardware Access Note**:  
> Running in HTTPS mode (default) ensures the browser permits access to WebUSB and WebADB hardware APIs. If testing strictly on local machine `localhost`, you can append `-tls=false` to switch to plain HTTP.

---

## ⚙️ Common CLI Flags

You can append custom flags directly to `start_server.sh` (see [Server Configuration Reference](/en/deploy-config) for full details):

```bash
# Listen on custom port 9443 and disable authentication for local testing
./start_server.sh -port 9443 -no-auth

# Multi-subnet usage: specify external TURN relay server
./start_server.sh -ice_servers "turn:user:pass@192.168.1.200:3478"
```

---

## ➡️ Next Steps

Once the server is running, proceed to [Device Onboarding & Agent Setup](/en/agent-prep) to connect your Android devices to the console.
