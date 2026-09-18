# 手机脱机独立运行指南 (Standalone Mode)

ScrcpyOverWebRTC 支持独特的 **Standalone（手机脱机单端口独立直连）** 模式。  
在该模式下，您无需准备任何外部 PC 电脑或云服务器。**Web 控制台单页应用已通过 Go 内嵌机制直接打包在 Agent 二进制程序中**，手机内部仅运行单个轻量级 Agent 进程，通过单个 TCP 端口（默认 `8080`）实现全功能网页直控。

---

## 💡 Standalone 模式的工作原理

1. **单进程单端口服务**：手机内部仅运行单个 `cloudphone-agent` 二进制进程，监听本地 `8080` 端口。同一端口既作为 HTTP 静态网页托管，又作为全双工 WebSocket 音视频裸流与触控通信信道。
2. **零外部文件依赖**：不再需要解压信令服务器、证书和数百个 Web 静态文件，内存占用由原本的 >100MB 骤降至 20~30MB，极度省电且不会被系统杀后台。
3. **极速网页直连**：在同一局域网下的任意电脑、平板或手机浏览器中输入 `http://<手机IP>:8080`，即可秒开秒控，尽享低延迟多点触控与硬件加速。

---

## 🛠️ 1. 运行方式

### 方式一：Magisk / KernelSU 模块（最推荐，免电脑开机自启）
1. 刷入项目提供的 `cloudphone-agent-magisk.zip` 模块。
2. 模块默认即以 **Standalone 模式** 自启运行。
3. 手机连接局域网 Wi-Fi 后，终端/Termux 输入 `su -c cloudphone-ctl status` 即可看到直连访问地址：
   ```text
   Mode: Standalone (http://192.168.1.120:8080)
   ```
4. 在同 Wi-Fi 下的任意设备浏览器打开该地址即可直接控制。

### 方式二：Android App (WebrtcTest) 一键启动
1. 在手机上安装 App 并打开「Agent 部署」页面。
2. 勾选开启「**独立单机模式 (Standalone Mode)**」。
3. 点击「**启动 Agent 直控服务**」。
4. 界面会显示当前手机的局域网 IP 与访问入口 `http://<手机IP>:8080`，支持一键复制或在浏览器打开。

### 方式三：电脑初始化推送（单次推送后脱机拔线）

#### Windows 用户：
1. 手机开启 USB 调试连接电脑。
2. 双击运行解压后 `android/` 目录下的 `setup.bat`。
3. 部署完成后拔掉 USB 数据线即可。

#### macOS / Linux 用户：
```bash
# 1. 一次性推送 android 原生目录
adb push android /data/local/tmp/

# 2. 启动单端口独立直连服务
adb shell sh /data/local/tmp/android/setup.sh
```

---

## 🔍 2. 从局域网访问

1. 启动完成后，终端会打印手机的局域网 IP 与访问地址，例如：
   ```text
   Services started. Connect via http://192.168.1.120:8080
   ```
2. **拔掉 USB 数据线**。
3. 将您的电脑、iPad、平板或其他手机连接到同一局域网 Wi-Fi 下。
4. 打开浏览器，直接输入 `http://<手机局域网IP>:8080`，即可直接获得全屏低延迟触控体验。

---

## 🛑 3. 停止与清理手机内部服务

若需停止手机后台运行的服务，通过 ADB 或终端执行：

```bash
adb shell "pkill -f cloudphone-agent && pkill -f libsys_core.so"
```
