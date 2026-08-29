# 实操一：Windows 本地搭建与真机控制 (Windows Tutorial)

本教程带领您在 **Windows 10 / 11 电脑** 上，以纯绿色免 Docker 方式在 5 分钟内快速搭建 ScrcpyOverWebRTC 中心服务，并将一部 Android 物理真机通过网页端一键接入，实现超低延迟的无线控制体验。

---

## 🎯 实操目标与准备

* **目标**：在 Windows 本地运行控制台，插线一键部署手机后拔掉数据线，在浏览器中流畅操控 Android 手机；
* **准备工具**：
  1. Windows 电脑一台（Win10 或 Win11）；
  2. Android 物理手机一部（需开启 USB 调试与安全权限，详见 [设备准备](/agent-prep)）；
  3. USB 数据线一条；
  4. Chrome 或 Edge 浏览器。

---

## 🛠️ 第一步：下载并启动 Windows 服务端

1. 前往 [Releases](https://github.com/hqw700/ScrcpyOverWebRTC/releases) 页面，下载最新版发布包 `cloudphone-vX.Y.Z.zip` 并解压到本地（如 `D:\cloudphone\`）。
2. 进入解压后的 `bin\windows_amd64\` 目录。
3. 双击运行 **`run.bat`** 启动脚本。
4. 黑色控制台窗口弹出并输出如下日志，即表示信令服务器与 Web 服务启动成功：
   ```text
   [INFO] Starting signaling server on :8443 (TLS enabled)
   [INFO] Static assets loaded from ../../assets
   [INFO] Listening on https://127.0.0.1:8443 and https://192.168.1.100:8443
   ```
   *(请保持该窗口在后台运行，不要关闭)*。

---

## 🌐 第二步：在浏览器中打开管理大盘

1. 打开 Chrome 或 Edge 浏览器，访问：
   ```text
   https://localhost:8443
   ```
2. 浏览器弹出“您的连接不是私密连接”警告，点击 **“高级”** ➔ **“继续前往 localhost (不安全)”**。
3. 输入默认管理员凭据登录：
   - **用户名**：`admin`
   - **密码**：`admin123`

---

## 🔌 第三步：手机插线一键 WebUSB 接入

1. 将 Android 手机通过 USB 数据线连接到电脑。
2. 手机屏幕弹出“允许 USB 调试吗？”，勾选 **“一律允许”** 并点击 **确定**。
3. 在网页端点击右上角 **“一键部署”**。
4. 点击蓝色的 **“连接并授权设备”** 按钮，在浏览器顶部弹出的 USB 列表中选中您的手机并点击“连接”。
   - *(💡 若提示 "already in use"，请打开 CMD 终端执行 `adb kill-server` 后重试)*。
5. 点击 **“一键推送到手机并启动”**。
6. 约 3 秒后，进度条走满并提示 **“部署成功，Agent 正在运行中”**。

---

## 🎮 第四步：拔掉数据线，开始无线操控！

1. **拔掉手机 USB 数据线**。
2. 回到控制台首页设备列表，找到刚刚接入的手机卡片，点击画面直接进入控制视窗：
   - 鼠标左键点击/滑动屏幕；
   - 键盘输入法直接敲击汉字，100% 顺畅落屏；
   - 在右侧工具栏打开“按键映射编辑器”为手游配置 WASD 跑图键位。

> 💡 **断开与退出**：若需要临时切断远程画面或停止手机上的服务，只需在手机自带浏览器中访问 `http://127.0.0.1:12345/d` 即可。
