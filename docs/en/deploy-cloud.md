# Public Cloud Server Deployment & NAT Traversal (Cloud Deployment)

This guide explains how to deploy ScrcpyOverWebRTC on public cloud virtual servers (VPS) across providers like AWS, DigitalOcean, Alibaba Cloud, Tencent Cloud, and Huawei Cloud.  
On public networks, the system leverages a dual-track architecture of **zero-cost IPv6 direct P2P connections** and **built-in coturn TURN media relays** to ensure seamless low-latency streaming across restrictive symmetric NATs.

---

## 💻 Hardware Sizing & Recommended Specifications

| Scale | Recommended Specs | Managed Capacity & Concurrency Notes |
| :--- | :--- | :--- |
| **Entry / Small Labs** | **2 Cores CPU / 2GB RAM / 3Mbps Fixed Bandwidth** | Manages up to **100 devices** (snapshot interval at 30s); supports **2~4 concurrent remote operators** (bitrate tuned to 0.2~0.5Mbps) |
| **Multi-Operator Studio** | 4 Cores CPU / 4GB RAM / 10Mbps~20Mbps Bandwidth | Supports 5~10 concurrent operators at HD resolution; smoother batch distribution |
| **Commercial Scale** | 8+ Cores / 8GB+ / Dedicated Relay Nodes | Distributed multi-datacenter clusters with external coturn media relays |

### Capacity Benchmarks:

Testing on a cost-effective **2-Core / 2GB RAM / 3Mbps VPS**:
- 1. **100 Managed Devices for Matrix Overview**: When not actively controlled, devices only submit low-frequency thumbnail snapshots (intervals configurable to **30s** or longer). Server bandwidth consumption is negligible, easily handling 100 devices.
- 2. **2 to 4 Concurrent Remote Control Sessions**: When traversing symmetric NATs that require TURN relaying through the server, lowering the video bitrate to **`0.2Mbps ~ 0.5Mbps`** in the web console maintains legible visual quality and enables **2 to 4 concurrent streaming sessions** on a 3Mbps link without packet loss.
- 3. **Zero-Bandwidth Direct Streaming via LAN or IPv6**: Whenever the browser and mobile device share a LAN or both possess public IPv6 addresses, WebRTC establishes end-to-end direct connections, **completely bypassing the cloud server and consuming zero server bandwidth**.
- 4. **Scalable On-Demand Expansion**: As concurrency demands grow, upgrade server bandwidth or provision standalone lightweight VPS instances as dedicated TURN relays.

---

## 🔐 1. Firewall & Security Group Configuration

Open the following ports in your cloud provider's firewall / security group console:

| Port | Protocol | Purpose |
| :--- | :--- | :--- |
| **`8443`** | `TCP` | Web Console access & WebSocket signaling |
| **`3478`** | `TCP + UDP` | coturn STUN/TURN listener |
| **`50000-50100`** | `UDP` | TURN media relay UDP pool |

> [!WARNING]
> If `50000-50100/UDP` is blocked, TURN relay fallback fails whenever devices and clients are behind symmetric NATs, resulting in signaling success but black screen video streams.

---

## 🐳 2. Option 1: Docker All-in-One Deployment (AIO, Recommended)

On Linux cloud VPS instances, Host networking mode is recommended:

```bash
docker run -d \
  --pull=always \
  --restart=always \
  --name cp-aio \
  --net=host \
  -v ./data:/app/data \
  -e PUBLIC_IP=<YOUR-CLOUD-PUBLIC-IP> \
  -e TURN_USER=my_secure_user \
  -e TURN_PASSWORD=my_secure_password \
  buutuu/scrcpy-over-webrtc:latest
```

- **`PUBLIC_IP`**: Enter the public IPv4 address of your cloud server.
- **`TURN_USER` / `TURN_PASSWORD`**: Use strong customized credentials in production.

---

## ⚡ 3. Zero-Cost IPv6 Direct Routing

The system automatically collects and negotiates IPv6 ICE candidates:
- **Zero Relay Bandwidth**: Because mobile cellular networks (4G/5G) natively assign public IPv6 addresses, endpoints with IPv6 automatically negotiate end-to-end direct P2P connections.
- **Benefits**: Media packets flow directly between phone and browser, bypassing server relay bandwidth entirely for **zero bandwidth costs and reduced latency**.

---

## 🛠️ 4. Option 2: Docker Compose Multi-Container Deployment

If you downloaded the full release bundle, the `docker/` directory contains automation scripts for decoupled coturn and signaling containers:

```bash
cd cloudphone-vX.Y.Z/docker
chmod +x deploy_cloud.sh
./deploy_cloud.sh deploy
```

The script guides public IP detection, generates secure passwords, and launches container clusters.

### Maintenance Commands:
- **Inspect Logs**: `docker logs -f cloudphone-signaling`
- **Rollback Version**: `./deploy_cloud.sh rollback`
- **Uninstall Services**: `./deploy_cloud.sh uninstall`

---

## 🔑 5. Access Console

Navigate to: `https://<YOUR-CLOUD-PUBLIC-IP>:8443`
- **Default Username**: `admin`
- **Default Password**: `admin123`

*(Change the default password immediately after your initial login).*
