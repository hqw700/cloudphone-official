# 真机与容器 Agent 部署指南

Android 设备端运行的 Agent (`cloudphone-agent`) 负责捕获视频裸流、处理 WebRTC 协商并执行交互控制。本项目支持物理真机、redroid 虚拟化容器等多终端部署方式。

---

## 📋 接入前准备工作

在尝试部署之前，请确保完成以下前置准备：
1. **开发者选项**：打开 Android 手机「设置」->「关于手机」，连续点击「版本号」5-7 次以解锁开发者选项。
2. **开启 USB 调试**：进入「开发者选项」，开启 **「USB 调试」** 按钮。
3. **触控与输入权限**：对于小米等部分特定国产品牌手机，还必须开启 **「USB 调试（安全设置）」**，否则网页端鼠标将只能看画面而无法点击操作。
4. **物理数据线连接**：请使用高带宽的 USB 数据线（避开充电专用线），将手机连接到电脑，确保命令行输入 `adb devices` 能够正常输出设备列表。

---

## ⚡ 方式一：网页一键 USB 自动部署 (最简单)

本项目内置了高集成的 **WebUSB + WebADB** 零依赖部署流水线，您无需在电脑上配置任何 ADB 物理环境：

1. **安全环境访问**：在电脑浏览器打开云手机 Web 仪表盘（强烈推荐使用 `https://` 加密协议或本机 `localhost`，以满足浏览器唤起 WebUSB API 的安全沙箱策略）。
2. **连接授权**：点击右上角或部署页的 **“部署新设备”** -> **“连接并授权设备”**。
3. **浏览器弹窗**：在浏览器弹出框中选择您已通过 USB 接入的 Android 物理设备。
4. **一键自动化安装**：网页 JS 会自动读取手机 CPU 架构（如 `arm64-v8a`），从信令服务器端静默拉取匹配的 Agent 包、推送并后台 `setsid nohup` 启动。
5. **物理限制**：本方式仅依赖 USB 直连协议，**不支持无线/网络 ADB 调试模式**。

---

## 💻 方式二：电脑端一键部署脚本 (推荐)

如果您在内网开发机或已有 ADB 配置的主机上，可以使用我们打包的一键部署包，适合远程调试或批量部署：

1. **下载一键包**：进入仪表盘部署页，点击下载 **`agent-deploy.zip`** 一键部署资源包。
2. **解压文件**：解压后，包内已包含各平台交叉编译的 Agent、核心投屏依赖库 `libsys_core.so`，以及启动脚本。
3. **一键执行**：
   * **Linux / macOS**:
     ```bash
     chmod +x run.sh
     ./run.sh -id <自定义设备ID> -signaling ws://<信令服务器IP>:8443
     ```
   * **Windows CMD**:
     ```cmd
     run.bat -id <自定义设备ID> -signaling ws://<信令服务器IP>:8443
     ```
4. **验证状态**：
   运行 `adb shell "ps -A | grep cloudphone-agent"` 观察进程是否在后台保活。

---

## 🐳 方式三：Docker / Redroid 容器云手机多开

如果您通过多开 Docker `redroid` 容器建立云手机机房，可以通过对容器映射不同的 WebRTC 对外 UDP 端口，避免网络冲突：

1. **运行 Redroid 容器**：
   ```bash
   docker run -d --privileged \
     --name redroid-01 \
     -p 5555:5555 \
     -p 50001:50001/udp \
     redroid/redroid:12.0.0-latest
   ```
2. **推送 Agent 入容器**：
   进入 `agent-deploy.zip` 目录，通过宿主机的 adb 端口将 Agent 推送入容器中运行：
   ```bash
   adb connect 127.0.0.1:5555
   adb -s 127.0.0.1:5555 push cloudphone-agent-amd64 /data/local/tmp/cloudphone-agent
   adb -s 127.0.0.1:5555 push libsys_core.so /data/local/tmp/
   ```
3. **针对性启动指定端口**：
   由于容器处于隔离的 NAT 网络下，启动 Agent 时，必须传入 `-external-addr`（外部宿主机的 IP）以及 `-webrtc-port`（映射的指定 UDP 端口段，例如 50001）：
   ```bash
   adb -s 127.0.0.1:5555 shell "chmod 755 /data/local/tmp/cloudphone-agent && nohup /data/local/tmp/cloudphone-agent -jar /data/local/tmp/libsys_core.so -signaling ws://<信令服务器IP>:8443 -id vm-01 -external-addr <宿主机公网或内网IP> -webrtc-port 50001 > /data/local/tmp/cloudphone-agent.log 2>&1 &"
   ```
4. **多开管理**：对于第二台虚机 `redroid-02`，只需将其对应的 UDP 映射和参数改为 `50002`，以此类推，即可在一台服务器上完美多开。

---

## 🔑 方式四：Root 模式免免 ADB 独立运行

本项目的 Agent 原生支持 **以 root 权限运行**。如果您的真机已获得 Root 权限，或是运行在默认开启 root 的模拟器/定制 ROM 内部，可以彻底丢弃 ADB：

1. **参数配置**：启动 Agent 时附加 `-root` 参数：
   ```bash
   ./cloudphone-agent -jar libsys_core.so -signaling ws://... -id root-phone-01 -root
   ```
2. **开机自启动配置**：
   由于加入了 `-root`，整个投屏 Agent 将以系统最高特权进程拉起，无需通过 PC 连接线建立 ADB 会话连接。您可以将此命令写入系统的 `/system/etc/init/` 或者是定制 ROM 的 `init.rc` 配置文件中，实现设备开机后自动联网注册上报，实现真正意义上的无人值守物理云手机。
