# 通过 ADB 部署添加设备

本章节介绍如何使用本地电脑的 **ADB（Android Debug Bridge）** 命令行工具，将 Agent 控制代理部署到 Android 物理手机或虚拟设备中，使其接入 ScrcpyOverWebRTC 的信令控制中心。

这是最通用、对开发运维最友好且可定制性极强的设备接入方式，支持对局域网内的任意真机、开发板或 Redroid 容器进行批量部署。

---

## 🛠️ 1. 部署前的准备工作

在开始部署前，请确保满足以下条件：

1. **电脑端已配置 ADB 环境**：
   * 在控制终端（CMD/PowerShell/Terminal）运行 `adb devices` 能够正常看到已连入的设备列表及其序列号（Serial Number）。
2. **手机端开启 USB 调试**：
   * 在手机的“开发者选项”中开启 **USB 调试**（部分深度定制系统如小米 MIUI 还需要开启“USB 调试（安全设置）”以允许模拟点击）。
3. **获取 Agent 部署文件夹**：
   * 确保您的本地路径下有项目预编译完整包中的 `agentd/` 目录，且其中包含：
     * `cloudphone-agent-amd64` (x86_64 架构代理)
     * `cloudphone-agent-arm64` (ARM64 架构代理)
     * `cloudphone-agent-armeabi-v7a` (32位 ARM 架构代理)
     * `libsys_core.so` (即 scrcpy-server 伴生核心包)
     * 部署脚本 `run.sh` (Mac/Linux) 与 `run.bat` (Windows)

---

## 🚀 2. 部署命令行指引

请根据您的电脑操作系统，进入 `agentd/` 文件夹中执行以下部署命令。

### 1) 单台设备部署 (默认)

当您的电脑仅连接了一部 Android 手机时，根据您的信令服务器协议，执行以下命令：

#### A. 如果信令服务器以 HTTP 模式运行 (ws://)
* **macOS / Linux 用户**：
  ```bash
  cd agentd/
  chmod +x run.sh
  ./run.sh -id phone-01 -signaling ws://<服务器局域网IP>:8443
  ```
* **Windows 用户**：
  ```cmd
  cd agentd
  run.bat -id phone-01 -signaling ws://<服务器局域网IP>:8443
  ```

#### B. 如果信令服务器以 HTTPS 模式运行 (wss://)
* **macOS / Linux 用户**：
  ```bash
  cd agentd/
  chmod +x run.sh
  ./run.sh -id phone-01 -signaling wss://<服务器局域网IP>:8443
  ```
* **Windows 用户**：
  ```cmd
  cd agentd
  run.bat -id phone-01 -signaling wss://<服务器局域网IP>:8443
  ```

---

### 2) 多设备选择部署

如果您的电脑同时连入了多台手机，必须在命令的**最前端指定设备的 ADB 序列号**，并根据协议指定信令地址：

* **HTTP 模式 (ws://)**：
  ```bash
  # macOS / Linux 平台
  ./run.sh 9c8ef782 -id phone-01 -signaling ws://192.168.1.100:8443

  # Windows 平台
  run.bat 9c8ef782 -id phone-01 -signaling ws://192.168.1.100:8443
  ```
* **HTTPS 模式 (wss://)**：
  ```bash
  # macOS / Linux 平台
  ./run.sh 9c8ef782 -id phone-01 -signaling wss://192.168.1.100:8443

  # Windows 平台
  run.bat 9c8ef782 -id phone-01 -signaling wss://192.168.1.100:8443
  ```

> [!IMPORTANT]
> **关于云端（如阿里云）或跨网段部署时的中转配置：**
> 如果您的信令服务器部署在公网云端，或者被控设备与控制浏览器处于不同的物理子网中，设备与网页端往往无法直接打洞连接。此时，启动 Agent 时**必须加挂 `-ice-servers` 参数**以指定 TURN/STUN 服务器。
> * **参数值示例**：
>   ```bash
>   -ice-servers "turn:user:pass@192.168.1.100:3478?transport=udp,stun:192.168.1.100:3478"
>   ```
> * *(若采用云端一键 Docker 部署，在启动成功生成的 `connection_info.txt` 记录中会直接提供该参数的拼接字符串，直接拷贝使用即可。)*

---

## 🔒 3. HTTPS 部署与 WebSocket 协议配对指南

当您的 Web 控制后台和信令服务器运行在 **HTTPS** 安全协议下时，为了保证浏览器能顺利发起连接并正常渲染音视频流，必须注意以下协议配对与证书信任机制：

### 1) 浏览器的 Mixed Content（混合内容）限制与协议配对
现代浏览器（如 Chrome, Edge 等）对 HTTPS 页面有极严苛的安全控制。
- **强制双轨配对规则**：
  | 控制台网页的访问协议 | 命令行 `-signaling` 必须填写的协议前缀 | 说明 |
  | :--- | :--- | :--- |
  | **`https://`** (例如 `https://yourdomain:8443`) | **`wss://`** (例如 `wss://yourdomain:8443`) | 必须使用加密的安全 WebSocket 连接，否则会被浏览器直接拦截。 |
  | **`http://`** (例如 `http://localhost:8443`) | **`ws://`** (例如 `ws://127.0.0.1:8443`) | 本地 HTTP 环回环境或非加密测试环境，使用普通不加密 WebSocket。 |

- **警告**：如果您在 HTTPS 网页上尝试通过非加密的 `ws://` 协议接入 Agent，浏览器控制台会报错 `Mixed Content: The page at 'https://...' was loaded over HTTPS, but attempted to connect to the insecure WebSocket endpoint 'ws://...'. This request has been blocked; the content must be served over WSS.`，导致画面永远处于加载或黑屏状态。

### 2) 自签名证书（Self-signed Certificate）下的连接对策
在测试或内网部署时，开发者通常会使用自签名证书来启用信令服务器的 HTTPS。此时会面临以下两种情况：

* **Agent 控制端（已默认豁免校验）**：
  为免去配置正式证书的繁琐，`cloudphone-agent` 的 Go 底层通信模块**已默认配置了跳过 TLS 证书合法性校验 (`InsecureSkipVerify: true`)**。
  - 这意味着：即便您在命令行指定了 `wss://`，且信令服务器使用的是自签证书，Agent 也能 100% 成功地向信令进行连接注册，而**不会**因为 `x509: certificate signed by unknown authority` 的 TLS 握手错误而中断退出。

* **Web 浏览器端（需要手动临时授权）**：
  与 Agent 端的豁免不同，**现代浏览器不会容忍任何未受信任的自签证书**。如果您的 HTTPS 证书不是权威 CA 签发的，浏览器在发起 WebRTC 信令和 WSS 握手时，会**在后台静默拒绝连接**，在页面上表现为“连接超时”或“连接断开”，而没有任何明显的弹窗提示。
  
  **自签名证书的授权激活方法**：
  1. 在浏览器地址栏中，**手动输入一次信令服务器的 HTTPS 注册地址**，例如：`https://<您的服务器IP>:8443`。
  2. 此时浏览器会弹出一个安全警告：“您的连接不是私密连接” 或 “证书不受信任”。
  3. 点击下方的 **“高级”** 或 **“详细信息”**。
  4. 点击 **“继续前往/接受此不安全连接 (Proceed / Accept)”**。
  5. 待页面展示出信令服务器的默认响应（或空白页/报错404但有SSL锁标志）后，说明浏览器已成功将该自签证书列入当前会话的“受信任白名单”。
  6. 此时重新回到您的云手机 Web 控制台主页，刷新页面，音视频与控制通道即可成功建立连接。

---

## 🛠️ 4. 常见问题与调试技巧

### 1) 如何查看手机端的 Agent 实时运行日志？
如果设备在后台没有成功连接，或者页面有画面却无法操控，您可以直接通过 ADB 读取 Agent 的本地日志文件：
```bash
adb shell cat /data/local/tmp/cloudphone-agent.log
```
*如果需要实时追踪日志，可以运行：*
```bash
adb shell tail -f /data/local/tmp/cloudphone-agent.log
```
### 2) 拔掉 USB 线后服务自动挂掉？
这通常是由于部分手机（如华为、OPPO）的后台电量策略极其严格，或者是 ADB 的 `nohup` 权限被系统限制。
* **解决办法**：
  1. 在手机系统的“电池管理/应用启动管理”中，将 `cloudphone-agent`（或 ADB shell 启动的后台应用）设置为**允许后台活动**与**手动管理**。
  2. 如果手机已经 root，可以在脚本中加入 `-root` 参数启动以获取更高的守护权限。

### 3) 报错：无法找到 adb 设备
* 检查 USB 数据线是否接触良好。
* 检查是否已在手机开发者选项中开启“USB 调试”，并在连接弹窗中勾选“始终允许这台电脑进行调试”。
