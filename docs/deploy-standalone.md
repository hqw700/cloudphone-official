# 手机脱机独立运行指南 (Standalone Mode)

ScrcpyOverWebRTC 支持独特的 **Standalone（手机脱机全功能独立运行）** 模式。  
在该模式下，您无需准备任何外部 PC 电脑或云服务器。**Web 前端静态网页、信令服务器（ARM64 原生 Go 程序）以及 Agent 控制代理** 全部直接运行在目标 Android 手机内部。

---

## 💡 Standalone 模式的工作原理

1. **服务下沉至手机内部**：手机内部运行 `webrtc-signaling` 监听本地 `8443` 端口并托管 Web 页面；同时手机内部的 Agent 连接本地 `wss://127.0.0.1:8443` 进行自注册。
2. **初始化即脱机**：通过 USB 数据线完成一次性推送与拉起后，即可拔掉数据线。手机在后台以独立 Session ID 保活运行。
3. **局域网直接开控**：在同一局域网下的任意电脑、平板或手机浏览器中输入目标手机的 IP 地址，即可直接打开控制台操控这部手机。

---

## 🛠️ 1. 初始化推送与拉起

### 前置条件：
- Android 手机一部（推荐 Android 11+，已开启 USB 调试并授权）。
- 电脑一台（仅用于首次初始化推送）。
- 从 [Releases](https://github.com/hqw700/ScrcpyOverWebRTC/releases) 下载完整发布包并解压。

### 选项 A：Windows 电脑用户（一键全自动）
1. 使用 USB 数据线连接手机至 Windows 电脑。
2. 进入解压后的 `android/` 目录。
3. 双击运行 `setup.bat`。

### 选项 B：macOS / Linux 用户（命令行推送）
打开终端，在发布包根目录下执行：
```bash
# 1. 推送 android 原生二进制及 scrcpy 组件
adb push android /data/local/tmp/

# 2. 推送 Web 前端静态 assets 资源
adb push assets /data/local/tmp/android/assets

# 3. 进入手机 Shell 启动全部服务
adb shell sh /data/local/tmp/android/setup.sh
```

---

## 🔍 2. 拔线并从局域网访问

1. 脚本启动完成后，终端会打印手机在当前 Wi-Fi 下的局域网 IP 与访问地址，例如：
   ```text
   Services started. Connect via https://192.168.1.120:8443
   ```
2. **拔掉 USB 数据线**。
3. 将您的电脑、iPad 或其他手机连接到同一局域网 Wi-Fi 下。
4. 打开浏览器，输入 `https://<手机局域网IP>:8443`。
5. 控制大盘会自动列出名为 `local-android` 的本机设备，点击即可直接在网页里控制手机。

---

## 🛑 3. 停止与清理手机内部服务

如果您希望完全停止手机后台运行的服务，通过 ADB 执行以下命令：

```bash
adb shell "pkill -f webrtc-signaling && pkill -f cloudphone-agent && pkill -f libsys_core.so"
```
*(该命令会安全回收信令服务器、Agent 代理以及正在运行的 scrcpy-server 伴生进程，完全释放 CPU 与端口资源。)*
