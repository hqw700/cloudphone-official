# 内网与局域网部署指南

本章节介绍如何在局域网（LAN）及私有内网环境下部署 ScrcpyOverWebRTC 服务端系统。局域网内部署能够提供极高带宽和极低延迟（端到端交互延迟通常可低至 50ms 以内），且不产生任何公网流量费用，非常适合本地开发调试、真机群控以及内网私有化体验。

我们提供 **单二进制原生运行 (免 Docker 绿色包)** 与 **Docker 一体化容器 (AIO)** 两种部署方式，按需选择即可。

---

## 💻 方式一：单二进制原生运行 (绿色包免 Docker - Mac / Windows / Linux)

如果您不想在服务器或本地电脑上安装 Docker，可以直接运行发布包内的单二进制服务，零依赖、解压即用。

### 1. 下载并解压发布包

前往 [Releases](https://github.com/hqw700/ScrcpyOverWebRTC/releases) 页面下载完整发布包 `cloudphone-vX.Y.Z.zip` 并解压。包内已包含 Linux / macOS / Windows (amd64 / arm64) 全平台二进制、前端静态资源与自签名 HTTPS 证书。

> 🔐 保留默认的 HTTPS 模式，可确保浏览器正常唤起 WebUSB / WebADB 一键部署等硬件接口；如仅在本机 localhost 调试，可传入 `-tls=false` 切换为 HTTP 模式。

### 2. 启动服务

* **Linux / macOS**：
  ```bash
  chmod +x start_server.sh
  ./start_server.sh
  ```
  脚本会自动识别操作系统与 CPU 架构，拉起 `bin/` 下对应的二进制程序。

* **Windows**：进入 `bin\windows_amd64\` 目录，运行 `run.bat`。

### 3. 局域网内访问

启动成功后，终端会打印本机各网卡的访问地址。同局域网内的其他设备（PC、手机、平板）通过浏览器访问 `https://<服务器局域网IP>:8443` 即可打开管理大盘，默认账号 `admin` / `admin123`。

> 💡 常用启动参数（`-port`、`-tls=false`、`-no-auth`、`-ice_servers` 跨网段中转等）与数据目录说明，请参阅 [服务端配置参考](/deploy-config)。

---

## 🐳 方式二：Docker 一体化容器 (AIO)

如果您希望在局域网内获得“100% 连通率”保障，推荐使用 AIO 镜像——它内置 coturn 中转服务，在以下常见的局域网复杂拓扑中可有效避免黑屏：

1. **多网段 / 多 Wi-Fi 隔离**：在公司或复杂企业网络下，Android 设备连接的“设备 Wi-Fi”和电脑客户端连接的“办公 Wi-Fi”可能处于不同的网段或 VLAN，无法建立 P2P 直连通道。
2. **Docker 网桥隔离**：当 Android 容器（如 redroid）运行在宿主机的隔离 Docker Bridge 网桥中，浏览器无法与容器端口建立直接连接。
3. **打洞失败兜底**：STUN 打洞失败时，连接会自动无缝降级到 TURN 媒体中转通道。

### 启动命令 (Host 网络模式)

```bash
docker run -d \
  --name cp-aio \
  --net=host \
  -v ./data:/app/data \
  -e PUBLIC_IP=<服务器局域网IP> \
  buutuu/scrcpy-over-webrtc:latest
```

* **PUBLIC_IP**：局域网场景直接填服务器的内网 IP。
* **数据持久化**：`-v ./data:/app/data` 将用户账号、设备标签等数据保存在宿主机 `./data` 目录，升级镜像不丢失。
* **端口要求**：Host 模式下请确保宿主机的 `8443` 与 `3478` 未被其他服务占用；Bridge 模式与端口段收窄方法请参阅 [服务端配置参考](/deploy-config)。

> 📦 局域网同样可以使用发布包内 `docker/deploy_cloud.sh` 的 compose 双容器方案（本地编译镜像），其交互式部署流程与云服务器完全一致，请参见 [云服务器部署指南](/deploy-cloud) 的方式二。

---

## ➡️ 下一步

服务端启动后，请前往 [真机与容器 Agent 部署](/agent-deploy) 将您的 Android 设备接入大盘。
