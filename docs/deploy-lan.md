# 局域网与绿色免 Docker 部署 (LAN Deployment)

本指南介绍如何在本地局域网（LAN）或私有开发机环境下以**绿色免 Docker 单二进制**形式部署 ScrcpyOverWebRTC。

局域网部署具备超高带宽和极低延迟（端到端交互延迟通常 `<40ms`），且不产生任何公网流量费用，非常适合本地开发调试、真机群控以及内网私有化体验。

---

## 💻 单二进制原生运行 (免 Docker 绿色包)

如果您不想在服务器或本地电脑上安装 Docker，可以直接运行官方发布包内的单二进制程序，零外部环境依赖，解压即用。

### 1. 下载并解压发布包
前往 [Releases](https://github.com/hqw700/ScrcpyOverWebRTC/releases) 页面下载完整发布包 `cloudphone-vX.Y.Z.zip` 并解压。

包内已包含 Linux / macOS / Windows（amd64 / arm64）全平台二进制、Web 前端静态资源与预置的自签名 HTTPS 证书。

### 2. 一键启动服务

#### Linux / macOS：
```bash
chmod +x start_server.sh
./start_server.sh
```
*脚本会自动探测当前系统的 CPU 架构（如 x86_64 或 aarch64/Apple Silicon），并自动拉起 `bin/` 下对应的二进制程序。*

#### Windows 系统：
进入解压后的 `bin\windows_amd64\` 目录，双击运行 `run.bat`。

### 3. 局域网内访问控制台

服务启动成功后，终端会打印出本机所有网卡对应的访问地址。同局域网内的任意电脑、手机或平板通过浏览器访问：

```text
https://<服务器局域网IP>:8443
```

- **默认管理员账号**：`admin`
- **默认初始密码**：`admin123`

> 🔐 **安全提示**：
> 默认保持 HTTPS 模式运行，可确保浏览器正常唤起 WebUSB / WebADB 一键部署等硬件接口（浏览器安全沙箱限制）；如果仅在本机 `localhost` 调试，可在启动参数中传入 `-tls=false` 切换为纯 HTTP 模式。

---

## ⚙️ 常用启动扩展参数

您可以直接在 `start_server.sh` 后面追加自定义参数（更多参数请参考 [服务端统一配置参考](/deploy-config)）：

```bash
# 指定自定义端口 (如 9443) 并关闭登录鉴权进行内网测试
./start_server.sh -port 9443 -no-auth

# 跨网段使用：指定外部 TURN 中继服务器
./start_server.sh -ice_servers "turn:user:pass@192.168.1.200:3478"
```

---

## ➡️ 下一步

服务端启动成功后，请前往 [设备接入与 Agent 部署](/agent-prep) 将您的 Android 手机接入大盘。
