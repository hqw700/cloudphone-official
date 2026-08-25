# 云服务器部署与穿透指南

本章节介绍如何在公网云服务器（如阿里云、腾讯云、AWS 等）环境下部署 ScrcpyOverWebRTC。相比于局域网，云服务器部署面临复杂的公网 NAT 环境、网络抖动、丢包，以及浏览器对公网 HTTPS / WebRTC 媒体流安全上下文（Secure Context）的严格限制。

--- 
## 服务器推荐
阿里云2c2g3Mb固定宽带，一两个人使用基本够用。   
- 1，**设备不连接**：流量很少，只需要更新屏幕快照，快照间隔可以调整。  
- 2，**设备公网连接，没有直连条件**：走TURN转发时可以调整码率，根据带宽自适应。  
- 3，**设备在局域网**：本地连接不需要经过云服务器，不消耗流量。  
- 4，**业务增加**：可以另购服务器，同时配置多个TURN，不需要和管理台在同一服务器。   

**优惠链接**: [https://www.aliyun.com/product/ecs?userCode=dgnlczx1](https://www.aliyun.com/product/ecs?userCode=dgnlczx1)   
![](img/ali-ecs.png)  

#### 需要更大带宽的可以使用腾讯云  
**优惠链接**: [https://curl.qcloud.com/2635ZOSn](https://curl.qcloud.com/2635ZOSn)
![](img/tx-cloud.png)

---
> 💡 **部署模式选择提示**：
> * 本文档聚焦于**云服务器 Docker 容器化部署**（包含开箱即用一体镜像与 Compose 双容器方案）。
> * 如果您希望在服务器/物理机上直接以**绿色单二进制方式运行（免 Docker）**，请参阅 [内网与局域网部署 - 非 Docker 原生运行](/deploy-lan#方式一非-docker-原生运行-mac--windows--linux)。
> * 如果您希望让整个服务端直接运行在 Android 手机内部（无服务器脱机模式），请参阅 [Android 独立运行生态](/deploy-standalone)。


---

## 🔑 默认连接地址与账户凭证

服务拉起成功后，在浏览器中即可打开 Web 管理后台大盘：
* **访问地址**：`https://<您的服务器公网IP>:8443` *(信令与 Web 默认以 HTTPS 模式运行；浏览器提示自签名证书警告时，点击“高级 ->图形化继续访问”即可)*
* **默认管理员账号**：`admin`
* **默认管理员密码**：`admin123`

---

## 🔐 1. 部署前的准备工作：安全组端口放行

WebRTC 依赖特定端口建立打洞与媒体流传输。以 AIO 镜像默认配置为例，您必须在云服务器管理后台（安全组 / 防火墙）放行以下端口：

| 端口号 | 协议类型 | 规则说明 |
| :--- | :--- | :--- |
| **`8443`** | `TCP` | 网页后台及 WebSocket 信令通信端口 |
| **`3478`** | `TCP / UDP` | coturn STUN/TURN 中转服务监听端口 |
| **`50000-50100`** | `UDP` | TURN 媒体中转 UDP 端口段（`COTURN_MIN_PORT` / `COTURN_MAX_PORT` 默认区间） |

> [!WARNING]
> 早期文档要求放行整个 `49152-65535` UDP 段——那是 Compose 方案中 coturn 的默认中转区间。**AIO 镜像已默认收窄为 `50000-50100`**，您还可以通过 `COTURN_MIN_PORT` / `COTURN_MAX_PORT` 进一步调整。当中转段被封禁时，P2P 打洞失败的连接将无法降级中转，导致“连接成功但无视频画面”。

---

## 🐳 2. 方式一：Docker Hub 一体化镜像部署 (AIO，推荐)

零编译、开箱即用，镜像内置信令、Web 前端与 coturn 中转服务。

### 2.1 Host 网络模式 (推荐)
如果您的 Linux 宿主机有独立的公网 IP 或是纯内网环境，且没有端口占用冲突，**首选 Host 模式**。

* **启动命令**:
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
* **优势**: 容器直接使用宿主机网络，零 NAT 转发损耗，无需映射大量 UDP 端口段，网络吞吐量最高。
* **注意**: 必须确保宿主机上 `3478`（TURN）和 `8443`（信令）等端口未被其他服务占用。
* **用户数据目录挂载**: `-v ./data:/app/data` 容器会把所有的持久化资产（用户账号 `users.json`、设备标签及下载文件）保存在宿主机本地的 `./data` 目录下，保证升级时不丢失。
* **PUBLIC_IP**: 当有公网 IP 时填入公网 IP，当局域网内使用时填入宿主机内网 IP。

---

### 2.2 NAT / Bridge 网络模式 (常规)
如果运行在 macOS、Windows 等 Docker 虚拟化环境，或者出于安全考量必须使用 `-p` 映射端口，请务必遵循以下两条策略，**切忌映射整个 `49152-65535` 端口段（会导致宿主机 OOM 崩溃）**。

#### 策略 A：收窄 TURN UDP 端口段映射
在配置中指定一个极窄的中转 UDP 端口区间（如 100 个），并只放行此范围。

* **启动命令 (常规对称映射)**:
  ```bash
  docker run -d --name cp-aio \
    --pull=always \
    --restart=always \
    -p 8443:8443 \
    -p 3478:3478/tcp \
    -p 3478:3478/udp \
    -p 55000-55100:55000-55100/udp \
    -v ./data:/app/data \
    -e PUBLIC_IP=<宿主机物理IP> \
    -e COTURN_MIN_PORT=55000 \
    -e COTURN_MAX_PORT=55100 \
    buutuu/scrcpy-over-webrtc:latest
  ```

#### 策略 B：非对称端口映射（重点）
当宿主机的默认端口（如 8443、3478）被其他服务占用，导致您不得不将外部端口映射为非对称端口（如 8443 映射为 18443，3478 映射为 13478）时。

> [!WARNING]
> 如果直接启动，容器内部的信令服务由于不知道外部映射了什么端口，依然会将默认的 `3478` 作为 TURN 地址下发给前端。导致前端网页尝试连接 `宿主机:3478` 失败而黑屏。
> 
> **解决方案**：必须传入 `EXTERNAL_SIGNALING_PORT` 和 `EXTERNAL_TURN_PORT` 环境变量，明确告知容器外部映射的公开端口。

* **启动命令 (非对称端口映射)**:
  ```bash
  docker run -d --name cp-aio \
    --pull=always \
    --restart=always \
    -p 18443:8443 \
    -p 13478:3478/tcp \
    -p 13478:3478/udp \
    -p 55000-55100:55000-55100/udp \
    -v ./data:/app/data \
    -e PUBLIC_IP=192.168.100.242 \
    -e COTURN_MIN_PORT=55000 \
    -e COTURN_MAX_PORT=55100 \
    -e EXTERNAL_SIGNALING_PORT=18443 \
    -e EXTERNAL_TURN_PORT=13478 \
    buutuu/scrcpy-over-webrtc:latest
  ```

---

### 2.3 Docker 环境变量参数说明

无论是 Host 模式还是 NAT/Bridge 模式，都可以通过 `-e` 传入以下环境变量定制容器行为：

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `PUBLIC_IP` | `127.0.0.1` | 宿主机真实 IP，用于 WebRTC ICE 候选地址发布。有公网填公网 IP，纯局域网填宿主机内网 IP |
| `TURN_USER` | `cloudphone_user` | TURN 中转服务认证用户名，**生产环境务必修改** |
| `TURN_PASSWORD` | `cloudphone_secure_password` | TURN 中转服务认证密码，**生产环境务必修改** |
| `SIGNALING_PORT` | `8443` | 容器内部信令 / Web 服务监听端口 |
| `USE_TLS` | `true` | 是否启用 HTTPS，设为 `false` 后以 HTTP 模式运行 |
| `NO_AUTH` | - | 设为 `true` 时关闭登录认证，**仅限内网调试，公网环境严禁开启** |
| `DEFAULT_SETTINGS` | 见下方说明 | 新接入设备的默认画质参数 (JSON) |
| `EXTERNAL_SIGNALING_PORT` | 同 `SIGNALING_PORT` | 非对称端口映射时，外部实际暴露的信令端口 |
| `EXTERNAL_TURN_PORT` | `3478` | 非对称端口映射时，外部实际暴露的 TURN 端口 |
| `COTURN_MIN_PORT` / `COTURN_MAX_PORT` | `50000` / `50100` | TURN 媒体中转使用的 UDP 端口段，Bridge 模式下需与 `-p` 映射范围保持一致 |

* **DEFAULT_SETTINGS 示例**：`{"maxBitrate":4,"minBitrate":1,"fps":30,"size":1920,"bitrate":4}`，分别对应最高码率 (Mbps)、最低码率 (Mbps)、帧率、分辨率长边像素与默认码率。

---

### 🔄 2.4 Docker 镜像更新与平滑升级

由于持久化数据已通过 `-v ./data:/app/data` 挂载至宿主机，更新容器不会丢失账号及设备配置。执行以下命令即可平滑升级至最新版：

```bash
# 1. 停止并删除旧容器
docker stop cp-aio && docker rm cp-aio

# 2. 拉取最新镜像并重新启动（以 Host 模式为例）
docker run -d \
  --pull=always \
  --restart=always \
  --name cp-aio \
  --net=host \
  -v ./data:/app/data \
  -e PUBLIC_IP=<宿主机真实IP> \
  buutuu/scrcpy-over-webrtc:latest
```

---

## 🛠️ 3. 方式二：基于 Compose 脚本部署 (双容器分立)

> [!IMPORTANT]
> **发布包依赖**：开源仓库源码版不直接附带 `docker/` 部署脚本。请先前往 [Releases](https://github.com/hqw700/ScrcpyOverWebRTC/releases) 下载官方完整发布包（如 `cloudphone-vX.Y.Z.zip`），解压后进入 `docker/` 目录。

该方案将 `coturn`（Host 网络）与信令服务拆分为两个独立的容器，支持交互式 IP 自动探测、凭证自动生成及版本平滑回滚，适合需要深度定制 coturn 运行参数的场景。

### 部署步骤

1. 进入解压包后的 `docker/` 目录并运行部署脚本：
   ```bash
   cd cloudphone-vX.Y.Z/docker
   chmod +x deploy_cloud.sh
   ./deploy_cloud.sh deploy
   ```
2. 脚本会自动完成以下操作：
   * **IP 自动探测**：提示并确认云服务器真实的公网 IP。
   * **凭证生成**：随机生成高强度 `TURN_USER` 与 `TURN_PASSWORD` 并写入 `.env`。
   * **模板渲染与启动**：自动渲染 `coturn/turnserver.conf` 并启动 Compose 容器集群。
3. 部署完成后查看连接面板信息：
   ```bash
   cat connection_info.txt
   ```

### 运维管理指令

* **停止并清理服务**：`./deploy_cloud.sh uninstall`
* **一键回滚版本**：`./deploy_cloud.sh rollback`
* **查看运行日志**：`docker logs -f cloudphone-signaling` 或 `docker logs -f cloudphone-coturn`

---

## ➡️ 下一步

服务端启动成功后，请前往 [真机与容器 Agent 部署](/agent-deploy) 将您的 Android 设备接入大盘。
