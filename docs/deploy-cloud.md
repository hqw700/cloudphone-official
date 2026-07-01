# 云服务器容器化部署与中转调试指南

本章节介绍如何在公网云服务器（Cloud Server，如阿里云、腾讯云、AWS 等）环境下部署 ScrcpyOverWebRTC。相比于局域网，云服务器部署面临公网复杂的 NAT 环境、网络抖动、丢包，以及浏览器对公网 HTTPS 安全上下文的严格限制。

我们将通过 **Docker 一键自动化部署（集成 coturn 中转）** 方案，为您提供高可用、零配置的云端投屏部署指引。

---

## 🔐 1. 部署前的准备工作

在云服务器部署前，有两项非常关键的准备工作：

### A. SSL 证书准备 (开启 HTTPS)
根据现代浏览器安全规范，诸如 **WebUSB（网页一键部署）**、**WebADB（网页终端）**、**DataChannel 剪切板同步**等高级 API，**在公网（非 localhost）环境下必须要求 HTTPS 传输安全上下文**。如果使用普通的 HTTP 协议访问，浏览器将直接阻断这些 API 的运行。

* **获取证书**：请为您的云服务器 IP 或解析域名申请 SSL 证书（如 Let's Encrypt 免费证书）。
* **放置证书**：在项目根目录下创建 `certs/` 文件夹（如果不存在），并将您的证书重命名并放置如下：
  * `certs/server.crt` （证书文件）
  * `certs/server.key` （私钥文件）
* 运行部署脚本时，系统会自动将这两个证书挂载进容器，使信令与 Web 后台直接以安全 HTTPS 方式运行。

### B. 云服务器安全组（防火墙）端口放行
WebRTC 依赖多个特定端口建立网络打洞与媒体流传输。您必须在云服务器的管理后台（安全组 / 防火墙）放行以下端口：

| 端口号 | 协议类型 | 规则说明 | 必须性 |
| :--- | :--- | :--- | :--- |
| **`8443`** | `TCP` | 网页后台及 WebSocket 信令通信端口 | **必须** |
| **`3478`** | `TCP / UDP` | coturn STUN/TURN 中转控制与探测端口 | **必须** |
| **`49152-65535`** | `UDP` | WebRTC 音视频媒体流中转大段动态 UDP 端口 | **必须** |

> [!WARNING]
> 请务必完整放行 `49152-65535` 段的 UDP 端口。当 P2P 直连因为公网对称型 NAT（Symmetric NAT）打洞失败时，WebRTC 会随机从该段端口中选择通道进行 TURN 流量中转。如果该段端口被封禁，将会导致“连接成功但无视频画面”的问题。

---

## 🐳 2. 从 Docker Hub 直接拉取部署 (推荐 - 零编译/超轻量)

如果您身处 1核1G 或 2核2G 等低配云服务器环境，**强烈推荐直接从 Docker Hub 拉取我们已编译好的官方预构建镜像进行部署**。这能完全避开在服务器本地执行 `docker build` 时所产生的极高 CPU 与内存开销。

### 方式 A：Docker CLI 命令行一键拉起
```bash
docker run -d --name cp-aio \
  -p 8443:8443 \
  -p 3478:3478/tcp \
  -p 3478:3478/udp \
  -p 55000-55100:55000-55100/udp \
  -v ./data:/app/data \
  -e PUBLIC_IP=<您的服务器真实公网IP> \
  -e COTURN_MIN_PORT=55000 \
  -e COTURN_MAX_PORT=55100 \
  buutuu/scrcpy-over-webrtc:latest
```
*(注：挂载 `-v ./data:/app/data` 后，容器会把所有的持久化资产包括用户账号 users.json、设备标签及下载的文件保存在宿主机本地的 `./data` 目录下，保证升级时不被覆盖。)*

### 方式 B：使用 Docker Compose 极速拉起
在您的服务器上任意新建一个空白目录，并在同目录下创建一个 `docker-compose.yml` 配置文件：

```yaml
version: '3.8'

services:
  cloudphone:
    image: buutuu/scrcpy-over-webrtc:latest
    container_name: cp-aio
    network_mode: host  # 首选 Host 网络模式，消除大段端口 NAT 转发的内存与性能开销
    restart: always
    environment:
      - PUBLIC_IP=<您的服务器真实公网IP>
      - DATA_DIR=/app/data
      - NO_AUTH=true    # [可选] 开启后跳过登录鉴权，实现快速免密测试
    volumes:
      - ./data:/app/data
```
在同目录下直接执行以下指令拉起：
```bash
docker compose up -d
```

---

## 🐳 3. 基于官方发布包本地编译部署 (高级自定)

> [!IMPORTANT]
> **发布包依赖**：本开源仓库的源码版不直接附带 `docker/` 部署脚本文件夹。请先前往项目的 [Releases](https://github.com/hqw700/ScrcpyOverWebRTC/releases) 页面下载官方打包好的完整发布包（如 `cloudphone-v0.2.4.zip`），解压后即可获得 `docker/` 目录并运行以下部署脚本。

### 部署步骤：

1. **下载并解压官方完整发布包**：
   在 Release 页面下载最新的发布包并解压，在本地终端进入解压后的 `docker/` 目录：
   ```bash
   cd cloudphone-v0.2.4/docker
   ```
2. **运行部署脚本**：
   ```bash
   chmod +x deploy_cloud.sh
   ./deploy_cloud.sh deploy
   ```
4. **交互指引与自动渲染**：
   * **IP 探测**：脚本会自动请求 `ifconfig.me` 获取服务器的公网 IP，并提示您确认。如果探测无误，按回车即可；如果服务器绑定了特定弹性 IP，请输入您真实的公网 IP。
   * **中转凭证生成**：系统将自动生成随机且高强度安全凭证（`TURN_USER` 与 `TURN_PASSWORD`），并写入自动生成的环境文件 `.env`。
   * **容器配置渲染**：根据公网 IP 及凭证自动将配置文件 `coturn/turnserver.conf.template` 渲染为 `coturn/turnserver.conf`，并将证书挂载进配置。
   * **自动构建与拉起**：自动构建信令镜像 `cloudphone-all-in-one`，并运行 `docker-compose up -d` 启动集群。

5. **获取接入与配置参数**：
   部署完成后，脚本将在终端打印访问信息，并将其保存到本地的 `connection_info.txt` 中。
   ```bash
   cat connection_info.txt
   ```
   记录的内容包含：
   * **管理后台访问 URL**（如 `https://<您的公网IP>:8443`）。
   * **Android 设备 Agent 接入指令**（预置了您的公网 IP、端口和中转 ICE 凭证参数，供您直接在物理机/容器中拷贝运行）。

---

## ⚙️ 4. 运维管理指令

进入 `docker/` 目录下，您可以执行以下指令进行运维管理：

* **停止并清理容器服务**：
  ```bash
  ./deploy_cloud.sh uninstall
  ```
  *(这会安全停止正在运行的容器，删除相关镜像缓存，并清理生成的本地临时连接凭证。)*

* **回滚到上一个部署的版本**：
  ```bash
  ./deploy_cloud.sh rollback
  ```
  *(当新版本镜像或配置构建后出现非预期异常，运行此指令可自动将服务和镜像回滚至上一次部署前的状态。)*

* **标准容器日志查看**：
  ```bash
  # 查看信令服务及 Web 访问日志
  docker logs -f cloudphone-signaling
  
  # 查看 coturn 穿透中转状态日志
  docker logs -f cloudphone-coturn
  ```

---

## 📈 5. 公网传输性能优化推荐（高级调优）

公网环境容易受到跨运营商、高丢包、多重 NAT 的影响。为了获得最佳流畅度，建议在 Android 端启动 Agent（`cloudphone-agent`）时配置以下参数：

### 1) 启用拥塞控制 (BWE 弱网自适应)
加挂 `-bwe true` 参数，强制启用 Pion 拦截器自带的 GCC/TWCC 拥塞评估算法。该算法能实时计算公网的网络吞吐状态，并在网络变差时动态通知 Android 编码器热调低码率，防止因持续丢包产生 UDP 爆发风暴而导致的画面卡死：
```bash
./run.sh -id phone-01 -signaling wss://<公网IP>:8443 -bwe true
```

### 2) 限制帧率与合理限制分辨率
在公网传输中，过高的分辨率与帧率会消耗大量上行带宽。建议通过限制最大最长边为 `1280`，最高帧率为 `30`，来平滑码率输出：
```bash
./run.sh -id phone-01 -signaling wss://<公网IP>:8443 -max-size 1280 -max-fps 30
```

### 3) 调整视频默认码率
默认码率为 4Mbps。如果公网出口带宽有限（例如云服务器上行带宽仅有 5M~10M），建议手动调低默认码率至 `1.5M - 2.5Mbps`：
```bash
./run.sh -id phone-01 -signaling wss://<公网IP>:8443 -bitrate 2000000
```
