# 无服务器部署（Android 手机内独立运行）

本章节介绍 ScrcpyOverWebRTC 独有的 **Standalone（全功能独立运行）** 部署模式。在该模式下，您无需借助任何外部 PC 或云服务器。整个服务体系——包括**网页前端静态资源、信令服务器（基于 Go 交叉编译的 Android ARM64 原生程序）和 Agent 控制代理**——都将直接运行在被控制的 Android 手机内部。

这使得**手机本身既是服务器，也是被控制端**。您只需用 USB 线进行一次初始化推送，此后便可拔掉数据线，在同局域网的任意浏览器中输入手机的 IP 即可直接流畅操控它。

---

## 💡 Standalone 模式的核心优势

* **零硬件依赖**：完全摆脱对 Windows 电脑、Mac 或是云服务器的依赖，仅需一部 Android 手机即可自成体系。
* **物理脱机运行**：初始化完成后，拔掉 USB 连接线，服务仍能在 Android 后台脱离终端持续健康运行。
* **极致低延迟**：由于信令与 Agent 在 Android 环回网卡（`127.0.0.1`）下极速通信，极大地减少了信令传输开销。

---

## 🛠️ 1. 部署前的准备工作

1. **Android 设备一架**：
   * 推荐系统版本为 Android 11 及以上。
   * 需在“开发者选项”中开启 **USB 调试** 并在连接电脑时授予调试授权。
2. **电脑端 ADB 环境**（仅用于初始化的文件推送与拉起）。
3. **获取解压好的项目完整包**（包含 `android/` 和 `assets/` 目录）。

---

## 🚀 2. 部署操作指南

### 选项 A：Windows 电脑用户（一键全自动部署）

1. 使用 USB 线连接目标 Android 手机到您的 Windows 电脑。
2. 进入解压后的 `android/` 目录。
3. 双击运行 `setup.bat` 脚本：
   * *提示：若电脑上连接了多台设备，请在 CMD 终端下附带序列号运行：`setup.bat <您的设备ADB序列号>`。*
4. 脚本将自动识别并推送 ARM64 交叉编译二进制、`libsys_core.so`（scrcpy-server 核心包）及前端静态 assets 资源，并在手机后台一键拉起所有服务。

---

### 选项 B：macOS / Linux 电脑用户（手动推送与拉起）

如果您在 macOS 或 Linux 系统下，请打开终端并执行以下命令：

1. **推送 Android 可执行二进制及组件包**：
   ```bash
   # 确保处于项目根目录，将整个 android 部署夹推送至手机临时空间
   adb push android /data/local/tmp/
   ```
2. **推送前端网页静态资产**：
   ```bash
   # 将官网与控制后台资源推送至手机独立路径下
   adb push assets /data/local/tmp/android/assets
   ```
3. **进入手机 Shell 一键启动服务**：
   ```bash
   adb shell sh /data/local/tmp/android/setup.sh
   ```

---

## 🔍 3. 局域网访问与连接

1. 在脚本运行完毕后，终端会自动输出该 Android 设备在当前局域网（Wi-Fi）下的真实 IP 地址与端口，例如：
   ```text
   Services started. Connect via https://192.168.1.120:8443
   ```
2. 确保您的控制端设备（如您的 PC 电脑、另一部手机或 iPad）连接在**同一个局域网 Wi-Fi** 下。
3. 在控制端打开浏览器，输入输出的地址：`https://<手机局域网IP>:8443`。
4. 页面将直接展现控制仪表盘，且列表中已自动注册了名为 `local-android` 的本机设备，直接点击即可**在网页里操控手机自身**。

---

## ⚙️ 4. 运行原理与保活清理

### 内部工作原理
当运行 `setup.sh` 后，设备内部发生了以下流程：
1. **信令服务器运行**：交叉编译出的原生程序 `webrtc-signaling` 被以后台（`nohup`）模式拉起，监听手机本地的 `8443` 端口，并将中央静态路径指向刚刚推送的 `/data/local/tmp/android/assets`。
2. **控制端 Agent 运行**：Go Agent 被以 `setsid nohup` 守护运行，自动读取本地的 `/data/local/tmp/android/libsys_core.so` 核心包，并将连接信令指向手机本地的 `wss://127.0.0.1:8443` 完成注册自连。
3. **脱离终端守护**：进程均被分配了独立的 Session ID（会话ID），从而能够安全绕过 adb 挂断信号，实现拔掉数据线后的后台持久运行。

### 停止并清理手机端服务
如果您希望完全停止手机后台运行的程序，只需在电脑终端运行以下 ADB 指令：
```bash
adb shell "pkill -f webrtc-signaling && pkill -f cloudphone-agent && pkill -f com.android.helper.CoreService"
```
*(这会强制回收信令服务器、Agent 代理以及正在运行的 scrcpy-server Java 伴生进程，释放手机的 CPU 与端口资源。)*
