# 云服务器容器化部署

本章节介绍如何在公网云服务器（Cloud Server，如阿里云、腾讯云、AWS 等）环境下部署 ScrcpyOverWebRTC。相比于局域网，云服务器部署面临公网复杂的 NAT 环境、网络抖动、丢包，以及浏览器对公网 HTTPS 安全上下文的严格限制。

我们将通过 **Docker 一键自动化部署（集成 coturn 中转）** 方案，为您提供高可用、零配置的云端投屏部署指引。

---

## 🔐 1. 部署前的准备工作

在云服务器部署前，有两项非常关键的准备工作：

### 云服务器安全组（防火墙）端口放行
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
### 下载或更新镜像
```bash
  docker pull buutuu/scrcpy-over-webrtc:latest
```

### Host 网络模式 (推荐)
如果您的 Linux 宿主机有独立的公网 IP 或是纯内网环境，且没有端口占用冲突，**首选 Host 模式**。

*   **启动命令**:
    ```bash
    docker run -d \
      --name cp-aio \
      --net=host \
      -v ./data:/app/data \
      -e TURN_USER="test" \
      -e TURN_PASSWORD="test123" \
      -e PUBLIC_IP=<云服务器的公网IP> \
      buutuu/scrcpy-over-webrtc:latest
    ```

*(注：挂载 `-v ./data:/app/data` 后，容器会把所有的持久化资产包括用户账号 users.json、设备标签及下载的文件保存在宿主机本地的 `./data` 目录下，保证升级时不被覆盖。)*
* **`TURN_USER` 与 `TURN_PASSWORD：`** 是TURN中转服务的凭证，不指定时默认
* **PUBLIC_IP：** 当有公网IP时填入公网IP，当局域网内使用内填入宿主机IP

### 🔑 默认连接地址与账户凭证
服务拉起成功后，在同局域网的电脑/手机浏览器中即可打开管理仪表盘大盘：

访问地址：https://<您的宿主机IP>:8443 (信令与 Web 默认以 HTTPS 模式运行)
默认管理员账号：admin
默认管理员密码：admin123

---

## 🐳 3. 基于官方发布包本地编译部署 (高级自定)

> [!IMPORTANT]
> **发布包依赖**：本开源仓库的源码版不直接附带 `docker/` 部署脚本文件夹。请先前往项目的 [Releases](https://github.com/hqw700/ScrcpyOverWebRTC/releases) 页面下载官方打包好的完整发布包（如 `cloudphone-v0.2.6.zip`），解压后即可获得 `docker/` 目录并运行以下部署脚本。

### 部署步骤：

1. **下载并解压官方完整发布包**：
   在 Release 页面下载最新的发布包并解压，在本地终端进入解压后的 `docker/` 目录：
   ```bash
   cd cloudphone-v0.2.6/docker
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

