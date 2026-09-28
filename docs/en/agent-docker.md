# Method 5: Docker / Redroid Cloud Phone

If you run cloud phone clusters using **`redroid` (Remote Android in Docker)** on cloud virtual servers or bare-metal Linux hosts, this guide explains how to connect multiple Redroid containers to the ScrcpyOverWebRTC management platform with automated startup.

> [!TIP]
> **Built-in Minimalist AIO Toolkit**: The official release bundle includes the lightweight `redroid/` build kit (only 36 KB). It generates an **All-in-One (AIO) image in 1 second without compiling AOSP**, enabling containers to auto-start and connect with automatic MAC-based collision-free device naming!

---

## 📋 Critical Network Concepts & Architecture

> [!WARNING]
> **Essential Concept: Docker containers reside inside an internal IPv4 bridge by default!**  
> While physical smartphones on cellular 4G/5G connections often receive public IPv6 addresses for direct peer routing, **Docker Redroid containers reside inside private IPv4 Docker bridges and cannot directly inherit host public IPv6 addresses**.  
> 
> Choose between the following two networking approaches:
> * **Option A (Relay Mode - Recommended)**: Configure a TURN relay server (`CP_AGENT_ICE_SERVERS`) in the Agent config. The coturn service handles NAT traversal and media relay, eliminating the need to expose complex port ranges for each container.
> * **Option B (Direct Mode)**: Map a dedicated UDP port per container, and launch with explicit flags: **`-external-addr <HOST-IP>`** and **`-webrtc-port <MAPPED-UDP-PORT>`**.

> [!CAUTION]
> **Never launch Redroid containers with `--net=host` under privileged mode!**  
> Android's internal `netd` daemon will flush the host default routing table (`lookup main`) and inject firewall drop rules, breaking host bridge networking across all containers. **Always run Redroid containers in standard Docker Bridge mode.**

---

## ⚡ Deployment Method 1: Using the AIO Image (Strongly Recommended ⭐️⭐️⭐️)

No need to download hundreds of gigabytes of AOSP source code. The release bundle provides a specialized `redroid/` toolkit to **generate an out-of-the-box self-starting image within 1 second**.

```text
cloudphone-vX.Y.Z/
├── agentd/                      # Centralized agent binaries
│   ├── cloudphone-agent-amd64
│   ├── cloudphone-agent-arm64
│   └── libsys_core.so
└── redroid/                     # Redroid AIO build toolkit (36 KB)
    ├── Dockerfile               # Image build definition
    ├── build_aio.sh             # One-click build script
    ├── cloudphone.conf.example  # Configuration template
    └── README.md                # Documentation
```

### Step 1: Prepare Host Loop Devices
Android 14/15 APEX modules consume loop devices heavily (20~30 nodes per container). Run this one-time command on the host to avoid Exit Code 129 crashes on subsequent containers:
```bash
sudo bash -c 'for i in $(seq 8 255); do [ ! -e /dev/loop$i ] && mknod -m 660 /dev/loop$i b 7 $i; done'
```

### Step 2: Edit Configuration File
Navigate to `redroid/` inside the extracted release directory, copy the template, and specify your signaling and STUN/TURN endpoints:
```bash
cd redroid/
cp cloudphone.conf.example cloudphone.conf
vim cloudphone.conf
```
*Sample configuration:*
```ini
# Signaling server URL (supports wss:// or ws://)
CP_AGENT_SIGNALING="wss://192.168.100.241:8443"

# TURN/STUN relay server list
CP_AGENT_ICE_SERVERS="turn:test:test123@192.168.5.178:3478?transport=udp,stun:192.168.5.178:3478"
```

### Step 3: Run One-Click Build
```bash
# Syntax: ./build_aio.sh [Base Image / Local Image / Offline tar] [Config File] [Target Tag]
./build_aio.sh redroid/redroid:13.0.0-latest cloudphone.conf cloudphone-aio:13.0
```
> **Intelligent Input Adaptation**:
> - **Official Registry Image**: Passing `redroid/redroid:13.0.0-latest` pulls and patches the image;
> - **Local Image**: Passing a locally cached image (e.g. `my-redroid:15`) finishes in 0.5s via layer caching;
> - **Offline Tar**: Passing `/path/to/redroid.tar` automatically differentiates between `docker load` for container saves and `docker import` with ENTRYPOINT for AOSP rootfs archives!

### Step 4: Launch Containers
Run containers using standard **Docker Bridge mode**:
```bash
# Launch container 1
docker run -itd --privileged \
    --name redroid-aio-01 \
    -v /data/redroid-01/data:/data \
    cloudphone-aio:13.0 \
    androidboot.redroid_gpu_mode=host \
    androidboot.use_redroid_c2=1 \
    androidboot.device_id=redroid-01

# Launch container 2 (device_id auto-assigned from MAC address suffix)
docker run -itd --privileged \
    --name redroid-aio-02 \
    -v /data/redroid-02/data:/data \
    cloudphone-aio:13.0 \
    androidboot.redroid_gpu_mode=host \
    androidboot.use_redroid_c2=1
```
*Upon container startup, the device initializes and connects to the dashboard within seconds!*

---

## 🛠️ Deployment Method 2: Dynamic Injection into Existing Containers

If you already have standard Redroid containers running and prefer not to rebuild images, inject the Agent via `docker exec`:

### Step 1: Copy Files into Container
```bash
docker cp agentd/cloudphone-agent-amd64 <CONTAINER_NAME>:/data/local/tmp/cloudphone-agent
docker cp agentd/libsys_core.so <CONTAINER_NAME>:/data/local/tmp/libsys_core.so
```

### Step 2: Launch in Background as Root
```bash
docker exec -d -u 0 <CONTAINER_NAME> sh -c \
  "chmod 755 /data/local/tmp/cloudphone-agent && \
   export CP_AGENT_JAR=/data/local/tmp/libsys_core.so && \
   nohup /data/local/tmp/cloudphone-agent \
     -signaling wss://<SIGNALING_IP>:8443 \
     -id <DEVICE_ID> \
     -ice-servers 'turn:user:pass@<TURN_IP>:3478?transport=udp' \
     > /data/local/tmp/agent.log 2>&1 &"
```

---

## 🔍 Verification & Troubleshooting

### 1. Check Status & Logs
```bash
# For AIO image containers: check init service status
docker exec -it <CONTAINER_NAME> getprop init.svc.cloudphone-agent
# Expected output: running

docker exec -it <CONTAINER_NAME> cat /data/vendor/cloudphone/cloudphone-agent.log
```

### 2. Issue: 2nd Container Crashes Immediately (Exit Code 129)?
* **Cause**: Standard host limits of 8 loop devices are exhausted by the first Android 14/15 container, causing APEX mount failures in subsequent instances.
* **Fix**: Run `sudo bash -c 'for i in $(seq 8 255); do [ ! -e /dev/loop$i ] && mknod -m 660 /dev/loop$i b 7 $i; done'` on the host.
