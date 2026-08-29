# 方式二：电脑脚本一键包接入 (Script Setup)

如果您熟悉命令行操作、需要在内网开发机批量接入多台手机，或者希望通过**无线网络 ADB (TCP/IP)** 接入设备，推荐使用官方的一键部署资源包 `agent-deploy.zip`。

---

## 📋 适用场景与前提条件

| 项目 | 要求说明 |
| :--- | :--- |
| **适用系统** | Windows (10/11)、macOS (Intel/Apple Silicon)、Linux (Ubuntu/Debian/CentOS 等) |
| **环境要求** | 电脑上已安装 ADB 命令行工具（终端输入 `adb version` 正常输出） |
| **连接方式** | 支持 USB 有线连接，或通过 `adb connect <手机IP>:5555` 建立的无线网络连接 |

---

## ⚡ 详细操作步骤

### 第 1 步：下载一键部署包
1. 打开 Web 控制大盘（如 `https://<您的服务器IP>:8443`）。
2. 进入 **“部署新设备”** 页面，点击下载 **`agent-deploy.zip`** 一键部署资源包。
3. 将 ZIP 包解压至本地电脑任意英文路径下。

包内文件结构如下：
```text
agent-deploy/
├── cloudphone-agent-arm64       # Android 64位 Agent 原生二进制
├── cloudphone-agent-arm32       # Android 32位 Agent 原生二进制
├── cloudphone-agent-amd64       # Android x86_64 容器/模拟器 Agent
├── libsys_core.so               # 深度定制的 scrcpy-server 投屏核心
├── run.sh                       # Linux / macOS 一键自动化脚本
└── run.bat                      # Windows CMD 一键自动化脚本
```

### 第 2 步：连接手机并核实 ADB 状态
在电脑终端中执行：
```bash
adb devices
```
确认列表中已列出目标设备，且状态为 `device`。

*(如果使用无线 ADB，请先执行 `adb connect <手机IP>:5555`)*

### 第 3 步：运行一键脚本接入

控制台部署页会根据您当前服务端的地址与配置，**动态生成完整的一键执行命令**，您可直接复制执行：

#### Linux / macOS 用户：
```bash
chmod +x run.sh
./run.sh -id <自定义设备ID> -signaling wss://<您的服务器IP>:8443
```

#### Windows 用户 (CMD 或 PowerShell)：
```cmd
run.bat -id <自定义设备ID> -signaling wss://<您的服务器IP>:8443
```

> 💡 **参数说明**：
> - `-id <设备名称>`：自定义该设备在控制台大盘中显示的唯一标识（如 `my-phone-01`），留空则按系统默认的「型号-序列号」生成。
> - `-signaling <信令地址>`：指向您的服务端信令地址。服务端启用 HTTPS（默认）时使用 `wss://`，关闭时使用 `ws://`。
> - `-ice-servers <STUN/TURN>`：可选。如果存在跨网段或公网复杂 NAT，可传入中转凭证（例如 `turn:user:pass@ip:3478`）。

### 第 4 步：脚本自动化流程与验证

脚本运行时会自动完成：
1. 探测手机 CPU 架构并推送匹配的二进制文件至 `/data/local/tmp/`；
2. 赋予可执行权限并以 `setsid nohup` 后台守护模式拉起；
3. 输出启动成功的 PID 并断开临时 ADB 依赖。

此时在电脑终端运行以下命令，可观察 Agent 是否在后台健康保活：
```bash
adb shell "ps -A | grep cloudphone-agent"
```

拔掉 USB 数据线，刷新 Web 控制台设备列表，即可看到该手机已在线上线，点击卡片直接开控。

---

## 🛑 停止与断开 Agent 服务

* **方式一（手机内直接断开）**：
  在手机自带浏览器中直接打开：
  ```text
  http://127.0.0.1:12345/d
  ```
  即可一键切断当前远程画面（保持 Agent 待命），或点击彻底退出 Agent 进程。
* **方式二（电脑 ADB 命令）**：
  在电脑终端运行以下命令强制清理后台进程：
  ```bash
  adb shell "pkill -f cloudphone-agent && pkill -f libsys_core.so"
  ```

---

## ➡️ 其他接入方式

- [方式一：网页端 WebUSB 一键部署 (免装 ADB)](/agent-webusb)
- [方式三：Magisk / Root 模块开机自启 (长期无人值守)](/agent-magisk)
- [方式四：Android App 原生客户端 (手机直接运行)](/app-guide)
