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

## 🐳 2. 基于 Docker Compose 一键部署

项目在 `docker/` 目录下提供了一套一键自动化部署脚本，可自动识别服务器架构、探测公网 IP，并一键拉起包括信令服务器与 coturn 中转在内的双容器服务。

### 部署步骤：

1. **克隆项目源码**：
   ```bash
   git clone https://github.com/hqw700/ScrcpyOverWebRTC.git
   cd ScrcpyOverWebRTC
   ```
2. **进入 Docker 部署工作目录**：
   ```bash
   cd docker/
   ```
3. **运行部署脚本**：
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

## ⚙️ 3. 运维管理指令

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

## 📈 4. 公网传输性能优化推荐（高级调优）

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
