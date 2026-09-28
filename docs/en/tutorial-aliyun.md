# Tutorial 2: Alibaba Cloud ECS Setup

This tutorial takes a budget-friendly **Alibaba Cloud ECS (2-Core CPU / 2GB RAM / 3Mbps Fixed Bandwidth)** instance as an example, guiding you through security group port configuration, Docker AIO deployment with mirror acceleration, and remote device management across the public internet.

---

## 🎯 Objectives & Prerequisites

* **Objective**: Host the ScrcpyOverWebRTC central signaling and Web Console on a public cloud VPS, onboard remote Android devices across the internet, and achieve low-bandwidth concurrent multi-user control.
* **Prerequisites**:
  1. An Alibaba Cloud ECS instance (Ubuntu 22.04 / Debian 11 / Alibaba Cloud Linux 3 recommended);
  2. Docker engine installed (`curl -fsSL https://get.docker.com | bash`);
  3. An Android phone or Redroid container;
  4. Chrome or Edge browser.

---

## 🔐 Step 1: Security Group Port Rules

Log in to the [Alibaba Cloud ECS Console](https://ecs.console.aliyun.com/) and add the following three inbound rules to your instance's Security Group:

| Policy | Protocol | Port Range | Source | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Allow** | `TCP` | `8443` | `0.0.0.0/0` | Web Console & signaling |
| **Allow** | `TCP+UDP` | `3478` | `0.0.0.0/0` | coturn STUN/TURN listener |
| **Allow** | `UDP` | `50000/50100` | `0.0.0.0/0` | TURN media relay UDP pool (Mandatory) |

> [!WARNING]
> Blocking `50000/50100` UDP will prevent TURN media relay fallback when clients and mobile devices are behind symmetric NATs, resulting in signaling success but black screen video streams.

---

## 🐳 Step 2: Configure Mirror & Launch Container

SSH into your ECS instance and execute:

```bash
# 1. (Optional) Configure registry mirror
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://docker.m.daocloud.io"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker

# 2. Pull official image
docker pull buutuu/scrcpy-over-webrtc:latest

# 3. Launch container in Host mode (replace PUBLIC_IP with your ECS public IP)
docker run -d \
  --restart=always \
  --name cp-aio \
  --net=host \
  -v ./data:/app/data \
  -e PUBLIC_IP=<YOUR-ECS-PUBLIC-IP> \
  -e TURN_USER=admin \
  -e TURN_PASSWORD=MySecurePassword123 \
  buutuu/scrcpy-over-webrtc:latest
```

Verify that the container is running:
```bash
docker ps
```
The status `Up` indicates successful startup.

---

## 🌐 Step 3: Access Console via Public Internet

1. Open in your web browser:
   ```text
   https://<YOUR-ECS-PUBLIC-IP>:8443
   ```
2. When prompted with self-signed certificate warnings, click **"Advanced" ➔ "Proceed"**.
3. Sign in with default administrator credentials:
   - **Username**: `admin`
   - **Password**: `admin123`

---

## 📱 Step 4: Connect Android Phones Across Internet

### Method A: Desktop Script (Standard)
1. On the web console, navigate to **"One-Click Deploy" ➔ "Download Desktop Script"**;
2. Connect your phone to your PC via USB with USB Debugging enabled and run the script;
3. Unplug the cable; the phone connects to your ECS instance across the internet!

### Method B: Magisk Module (Rooted Devices 24/7)
In a terminal on the rooted phone, run:
```bash
su
cpctl set CP_AGENT_SIGNALING "wss://<YOUR-ECS-PUBLIC-IP>:8443"
cpctl set CP_AGENT_ICE_SERVERS '["turn:admin:MySecurePassword123@<YOUR-ECS-PUBLIC-IP>:3478?transport=udp","stun:<YOUR-ECS-PUBLIC-IP>:3478"]'
cpctl restart
```

---

## ⚡ Step 5: Bitrate Optimization for Low-Bandwidth Concurrency

Under a 3Mbps bandwidth cap:
1. Open the device streaming window;
2. Open **"Settings" ➔ "Video"** in the sidebar;
3. Tune the **Video Bitrate** to **`0.3 Mbps` (300 kbps)** and maintain Baseline Profile;
4. **Result**: On a 3Mbps bandwidth connection, **2 to 4 concurrent users can simultaneously control different devices** with smooth responsiveness and low latency (50ms ~ 80ms).
