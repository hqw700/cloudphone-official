# 云服务器容器化部署

本章节介绍如何在公网云服务器（如阿里云、腾讯云、AWS 等）环境下部署 ScrcpyOverWebRTC。相比于局域网，云服务器部署面临公网复杂的 NAT 环境、网络抖动、丢包，以及浏览器对公网 HTTPS 安全上下文的严格限制。

我们提供 **Docker Hub 一体化镜像 (AIO，推荐)** 与 **发布包本地编译 (compose 双容器)** 两种部署方式。

---

## 🔐 1. 部署前的准备工作：安全组端口放行

WebRTC 依赖特定端口建立打洞与媒体流传输。以 AIO 镜像默认配置为例，您必须在云服务器管理后台（安全组 / 防火墙）放行以下端口：

| 端口号 | 协议类型 | 规则说明 |
| :--- | :--- | :--- |
| **`8443`** | `TCP` | 网页后台及 WebSocket 信令通信端口 |
| **`3478`** | `TCP / UDP` | coturn STUN/TURN 中转监听端口 |
| **`50000-50100`** | `UDP` | TURN 媒体中转 UDP 端口段（`COTURN_MIN_PORT` / `COTURN_MAX_PORT` 默认值） |

> [!WARNING]
> 早期文档要求放行整个 `49152-65535` UDP 段——那是 compose 方案中 coturn 的默认中转区间。**AIO 镜像已默认收窄为 `50000-50100`**，您还可以通过 `COTURN_MIN_PORT` / `COTURN_MAX_PORT` 进一步调整；若使用方式二的 compose 方案，请按 `coturn/turnserver.conf` 中 `min-port` / `max-port` 的实际配置放行。当中转段被封禁时，P2P 打洞失败的连接将无法降级中转，导致“连接成功但无视频画面”。

---

## 🐳 2. 方式一：Docker Hub 一体化镜像部署 (推荐)

零编译、开箱即用，镜像内置信令、Web 前端与 coturn 中转服务。

### 下载或更新镜像
```bash
docker pull buutuu/scrcpy-over-webrtc:latest
```

### Host 网络模式 (推荐)

如果您的云主机有独立公网 IP 且没有端口占用冲突，**首选 Host 模式**：

```bash
docker run -d \
  --name cp-aio \
  --net=host \
  -v ./data:/app/data \
  -e PUBLIC_IP=<云服务器的公网IP> \
  -e TURN_USER=<自定义TURN用户名> \
  -e TURN_PASSWORD=<自定义强密码> \
  buutuu/scrcpy-over-webrtc:latest
```

* **PUBLIC_IP**：填写云服务器的公网 IP，用于发布 WebRTC ICE 候选地址。
* **TURN_USER / TURN_PASSWORD**：TURN 中转服务的认证凭据。不指定时使用默认凭据 `cloudphone_user` / `cloudphone_secure_password`——**公网环境务必修改**，否则任何人都可以借用您的服务器中转流量。
* **数据持久化**：挂载 `-v ./data:/app/data` 后，容器会把用户账号、设备标签及下载的文件保存在宿主机 `./data` 目录下，升级镜像时数据不受影响。

### Bridge 网络模式 (端口被占用时)

当宿主机的 `8443` / `3478` 被其他服务占用，只能映射为其他外部端口时，**必须**通过 `EXTERNAL_SIGNALING_PORT` 与 `EXTERNAL_TURN_PORT` 告知容器外部实际端口，否则前端会按默认端口连接 TURN 导致黑屏：

```bash
docker run -d --name cp-aio \
  -p 18443:8443 \
  -p 13478:3478/tcp \
  -p 13478:3478/udp \
  -p 55000-55100:55000-55100/udp \
  -e PUBLIC_IP=<云服务器的公网IP> \
  -e COTURN_MIN_PORT=55000 \
  -e COTURN_MAX_PORT=55100 \
  -e EXTERNAL_SIGNALING_PORT=18443 \
  -e EXTERNAL_TURN_PORT=13478 \
  buutuu/scrcpy-over-webrtc:latest
```

> 💡 全部环境变量（`USE_TLS`、`NO_AUTH`、`DEFAULT_SETTINGS` 等）与非对称映射原理，请参阅 [服务端配置参考](/deploy-config)。

### 🔑 默认连接地址与账户凭证

服务拉起成功后，浏览器打开 `https://<云服务器公网IP>:8443` 即可进入管理大盘（默认以 HTTPS 模式运行，自签名证书首次访问需确认放行）：
* **默认管理员账号**：`admin`
* **默认管理员密码**：`admin123`

---

## 🛠️ 3. 方式二：基于官方发布包本地编译部署 (compose 双容器)

> [!IMPORTANT]
> **发布包依赖**：开源仓库的源码版不直接附带 `docker/` 部署脚本文件夹。请先前往 [Releases](https://github.com/hqw700/ScrcpyOverWebRTC/releases) 页面下载官方完整发布包（如 `cloudphone-vX.Y.Z.zip`），解压后进入 `docker/` 目录。

该方案将 `coturn`（host 网络）与信令服务拆分为两个容器，支持交互式配置、版本回滚，适合需要深度定制 coturn 参数的场景。

### 部署步骤

1. **下载并解压官方完整发布包**，进入解压后的 `docker/` 目录：
   ```bash
   cd cloudphone-vX.Y.Z/docker
   ```
2. **运行部署脚本**：
   ```bash
   chmod +x deploy_cloud.sh
   ./deploy_cloud.sh deploy
   ```
3. **交互指引与自动渲染**：
   * **IP 探测**：脚本会自动请求 `ifconfig.me` 获取服务器的公网 IP，并提示您确认。如果服务器绑定了特定弹性 IP，请输入真实的公网 IP。
   * **中转凭证生成**：自动生成随机高强度凭证（`TURN_USER` 与 `TURN_PASSWORD`），写入 `.env` 文件。
   * **容器配置渲染**：根据公网 IP 及凭证自动将 `coturn/turnserver.conf.template` 渲染为 `coturn/turnserver.conf`。
   * **自动构建与拉起**：自动构建信令镜像 `cloudphone-all-in-one`，并运行 `docker compose up -d` 启动集群。
4. **获取接入与配置参数**：
   部署完成后，脚本将在终端打印访问信息，并保存到 `connection_info.txt`：
   ```bash
   cat connection_info.txt
   ```
   内容包含**管理后台访问 URL** 与 **Android Agent 接入指令**（预置公网 IP、端口和中转 ICE 凭证参数，可直接拷贝运行）。

### 运维管理指令

* **停止并清理容器服务**：
  ```bash
  ./deploy_cloud.sh uninstall
  ```
  *(安全停止运行中的容器，删除相关镜像缓存，并清理生成的本地临时连接凭证。)*

* **回滚到上一个部署的版本**：
  ```bash
  ./deploy_cloud.sh rollback
  ```
  *(当新版本镜像或配置构建后出现非预期异常，自动将服务和镜像回滚至部署前状态。)*

* **标准容器日志查看**：
  ```bash
  # 查看信令服务及 Web 访问日志
  docker logs -f cloudphone-signaling

  # 查看 coturn 穿透中转状态日志
  docker logs -f cloudphone-coturn
  ```

---

## ➡️ 下一步

服务端启动后，请前往 [真机与容器 Agent 部署](/agent-deploy) 将您的 Android 设备接入大盘。
