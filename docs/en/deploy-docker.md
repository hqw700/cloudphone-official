# Docker All-in-One Deployment (AIO Setup)

An out-of-the-box **Docker All-in-One (AIO) Image** is available at: `buutuu/scrcpy-over-webrtc:latest`.  
The container bundles the signaling server (`webrtc-signaling`), the web management console, and a built-in `coturn` STUN/TURN media relay service to guarantee 100% traversal reliability across disparate network environments.

---

## ⚡ Image Pulling & Mirror Acceleration

Official image identifier: `buutuu/scrcpy-over-webrtc:latest`.

In standard overseas or unthrottled environments, pull using standard Docker CLI:
```bash
docker pull buutuu/scrcpy-over-webrtc:latest
```

### ⚡ Mainland China Registry Mirror Acceleration (Optional)

If experiencing network timeouts due to registry blocks, configure a domestic mirror in `/etc/docker/daemon.json`:

```json
{
  "registry-mirrors": ["https://docker.m.daocloud.io"]
}
```

Reload and restart Docker:
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
docker pull buutuu/scrcpy-over-webrtc:latest
```

---

## 🚀 Option 1: Host Network Mode (Recommended First Choice)

If your Linux host has an unshared network interface and ports `8443` and `3478` are available, **Host network mode is strongly recommended**:

### Launch Command:
```bash
docker run -d \
  --pull=always \
  --restart=always \
  --name cp-aio \
  --net=host \
  -v ./data:/app/data \
  -e PUBLIC_IP=<HOST-REAL-IP> \
  buutuu/scrcpy-over-webrtc:latest
```

### Core Advantages & Parameter Notes:
- **`--net=host`**: Directly shares the host network namespace with zero NAT overhead, avoiding manual UDP port mapping and achieving optimal streaming throughput.
- **`-v ./data:/app/data`**: Mounts persistent assets (user credentials `users.json`, audit logs `admin_logs.json`, device tags, and cached APKs) to `./data` on the host.
- **`PUBLIC_IP`**: Use your public IP on cloud VPS; use your host LAN IP in internal network setups.

---

## 🔀 Option 2: Bridge Port Forwarding Mode (Narrowed UDP Pool)

If deploying on macOS/Windows Docker Desktop VMs or restricted network environments where `-p` port binding is mandatory, use this narrowed port pool configuration:

```bash
docker run -d \
  --pull=always \
  --restart=always \
  --name cp-aio \
  -p 8443:8443 \
  -p 3478:3478/tcp \
  -p 3478:3478/udp \
  -p 55000-55100:55000-55100/udp \
  -v ./data:/app/data \
  -e PUBLIC_IP=<HOST-IP> \
  -e COTURN_MIN_PORT=55000 \
  -e COTURN_MAX_PORT=55100 \
  buutuu/scrcpy-over-webrtc:latest
```

> [!WARNING]
> **Strictly avoid mapping the entire `49152-65535` UDP range!**  
> Mapping tens of thousands of individual ports in Docker causes immediate host memory exhaustion (OOM). Narrow the relay range using `COTURN_MIN_PORT` and `COTURN_MAX_PORT` to 50~100 UDP ports.

---

## ⚠️ Important: Asymmetric Port Forwarding (Prevent Black Screens)

When default ports `8443` or `3478` on the host are already occupied by other services and must be remapped to non-standard external ports (e.g. host `18443` ➔ container `8443`, host `13478` ➔ container `3478`):

> [!IMPORTANT]
> **Root Cause**: Without explicit notification, the container's internal signaling service will continue broadcasting the internal `3478` port to web browsers as the TURN candidate, causing connection timeouts.  
> **Solution**: Explicitly set `EXTERNAL_SIGNALING_PORT` and `EXTERNAL_TURN_PORT`!

### Asymmetric Port Mapping Launch Command:
```bash
docker run -d \
  --pull=always \
  --restart=always \
  --name cp-aio \
  -p 18443:8443 \
  -p 13478:3478/tcp \
  -p 13478:3478/udp \
  -p 55000-55100:55000-55100/udp \
  -v ./data:/app/data \
  -e PUBLIC_IP=<HOST-IP> \
  -e COTURN_MIN_PORT=55000 \
  -e COTURN_MAX_PORT=55100 \
  -e EXTERNAL_SIGNALING_PORT=18443 \
  -e EXTERNAL_TURN_PORT=13478 \
  buutuu/scrcpy-over-webrtc:latest
```

---

## 🔄 Upgrades & Maintenance

Because persistent data is mounted to `./data`, container upgrades are clean and seamless:

```bash
# 1. Stop and remove existing container
docker stop cp-aio && docker rm cp-aio

# 2. Pull latest image and restart
docker run -d \
  --pull=always \
  --restart=always \
  --name cp-aio \
  --net=host \
  -v ./data:/app/data \
  -e PUBLIC_IP=<HOST-IP> \
  buutuu/scrcpy-over-webrtc:latest
```

---

## 🔑 Console Access & Credentials

Navigate to `https://<HOST-IP>:8443` (or your mapped external port):
- **Default Username**: `admin`
- **Default Password**: `admin123`
