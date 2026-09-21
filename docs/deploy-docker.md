# Docker 一体化镜像部署 (Docker AIO Setup)

官方提供了开箱即用的 **Docker 一体化镜像 (All-in-One)**：`buutuu/scrcpy-over-webrtc:latest`。  
镜像内部已预置信令服务器（`webrtc-signaling`）、Web 控制大盘前端以及 `coturn` STUN/TURN 媒体中转服务，支持在不同网络环境下保障 100% 连通率。

## ⚡ 镜像拉取与国内镜像加速站配置

官方一体化镜像名：`buutuu/scrcpy-over-webrtc:latest`。

在海外服务器或具备代理网络环境下，可直接执行标准命令拉取：
```bash
docker pull buutuu/scrcpy-over-webrtc:latest
```

### ⚡ 国内服务器 / NAS 极速加速配置（强烈推荐）

国内服务器因 Docker Hub 网络限制，通常会出现拉取超时或连接失败。**强烈推荐直接为 Docker 守护进程配置国内镜像加速站**，配置后即可原生极速拉取，无需繁琐的临时镜像改名与打标：

#### 1. 配置镜像加速站
编辑（若不存在则新建）`/etc/docker/daemon.json` 文件：
```json
{
  "registry-mirrors": ["https://docker.m.daocloud.io"]
}
```

> 💡 **Linux 一键写入命令**：
> ```bash
> sudo mkdir -p /etc/docker
> sudo tee /etc/docker/daemon.json <<-'EOF'
> {
>   "registry-mirrors": ["https://docker.m.daocloud.io"]
> }
> EOF
> ```

#### 2. 重启 Docker 服务生效
重新加载系统守护配置并重启 Docker 服务：
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```

#### 3. 原生极速拉取
重启完成后，直接使用官方标准命令即可自动通过加速镜像站极速拉取：
```bash
docker pull buutuu/scrcpy-over-webrtc:latest
```

---

## 🚀 方式一：Host 网络模式 (推荐，首选)

如果您的 Linux 宿主机有独立的 IP 地址，且宿主机的 `8443` 与 `3478` 端口未被其他服务占用，**强烈推荐使用 Host 网络模式**。

### 启动命令：
```bash
docker run -d \
  --pull=always \
  --restart=always \
  --name cp-aio \
  --net=host \
  -v ./data:/app/data \
  -e PUBLIC_IP=<宿主机真实IP> \
  buutuu/scrcpy-over-webrtc:latest
```

### 核心优势与参数说明：
- **`--net=host`**：容器直接共享宿主机网络命名空间，零 NAT 转发开销，无需繁琐映射大量 UDP 端口段，网络吞吐性能最佳。
- **`-v ./data:/app/data`**：将持久化资产（用户账号 `users.json`、操作审计 `admin_logs.json`、设备标签及下载文件）挂载到宿主机本地 `./data` 目录，升级容器不丢数据。
- **`PUBLIC_IP`**：公网服务器填公网 IP；纯局域网环境填宿主机局域网 IP。

---

## 🔀 方式二：Bridge 端口映射模式 (收窄 UDP 端口段)

如果您在 macOS / Windows 的 Docker Desktop 虚拟机中运行，或者出于安全策略必须使用 `-p` 映射端口，请务必使用以下收窄端口段方案：

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
  -e PUBLIC_IP=<宿主机IP> \
  -e COTURN_MIN_PORT=55000 \
  -e COTURN_MAX_PORT=55100 \
  buutuu/scrcpy-over-webrtc:latest
```

> [!WARNING]
> **绝对禁止映射整个 `49152-65535` 端口段**！  
> 在 Docker Bridge 模式下映射上万条端口会导致宿主机内存迅速耗尽并发生 OOM 崩溃。请通过 `COTURN_MIN_PORT` 和 `COTURN_MAX_PORT` 严格限制在 50~100 个 UDP 端口区间内。

---

## ⚠️ 关键防坑：非对称端口映射 (防连接黑屏)

当宿主机默认的 `8443` 或 `3478` 端口已被其他服务占用，导致您不得不将宿主机外部端口映射为不同端口（例如将外部 `18443` 映射给容器内部 `8443`，外部 `13478` 映射给容器内部 `3478`）时：

> [!IMPORTANT]
> **原因分析**：如果不传额外参数，容器内部的信令服务并不知道外部宿主机映射了什么端口，依然会将默认的 `3478` 作为 TURN 候选地址下发给浏览器前端，导致前端连接失败发生黑屏。  
> **解决方案**：必须传入 `EXTERNAL_SIGNALING_PORT` 与 `EXTERNAL_TURN_PORT` 显式通告外部映射端口！

### 非对称端口映射完整启动命令：
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
  -e PUBLIC_IP=<宿主机IP> \
  -e COTURN_MIN_PORT=55000 \
  -e COTURN_MAX_PORT=55100 \
  -e EXTERNAL_SIGNALING_PORT=18443 \
  -e EXTERNAL_TURN_PORT=13478 \
  buutuu/scrcpy-over-webrtc:latest
```

---

## 🔄 容器更新与平滑升级

由于数据已全部挂载至宿主机 `./data` 目录，更新版本极其安全便捷：

```bash
# 1. 停止并移除旧容器
docker stop cp-aio && docker rm cp-aio

# 2. 拉取最新镜像并重新启动
docker run -d \
  --pull=always \
  --restart=always \
  --name cp-aio \
  --net=host \
  -v ./data:/app/data \
  -e PUBLIC_IP=<宿主机IP> \
  buutuu/scrcpy-over-webrtc:latest
```

---

## 🔑 访问大盘与默认账号

启动成功后，在浏览器访问 `https://<宿主机IP>:8443`（若修改了端口请对应更改）：
- **默认管理员账号**：`admin`
- **默认初始密码**：`admin123`
