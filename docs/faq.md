# 常见问题解答与故障排错 (FAQ)

本文档整理了在局域网部署、公网云化及真机/虚拟机纳管过程中最常遇到的网络连接、触控、编解码兼容性与音频问题，提供系统的排错步骤与底层技术原因。

---

## 🔍 问题一：设备已注册上线且能看到大盘预览，但点击控制连接失败/超时/黑屏？

这是很多用户初次部署时最容易产生困惑的问题。

### 📌 核心底层原理区别：
* **大盘预览（出流正常）**：走的是 **WebSocket 二进制流（基于 TCP 信令端口 8443）**。只要信令端口通信正常，大盘就能正常获取并解码 H.264 预览画面。这证明 **Android 端的 `scrcpy-server` 视频采集、H.264 硬件编码完全正常**！
* **点击直控（连接失败）**：走的是 **WebRTC P2P 媒体通道（基于 UDP 协议）**。因此连接失败的根本原因 **100% 聚焦在 WebRTC UDP 网络链路、ICE 候选地址协商与 NAT 穿透/中继上**。

```mermaid
graph TD
    classDef ok fill:#22c55e,stroke:#15803d,stroke-width:2px,color:#fff;
    classDef fail fill:#ef4444,stroke:#b91c1c,stroke-width:2px,color:#fff;
    classDef check fill:#3b82f6,stroke:#1d4ed8,stroke-width:2px,color:#fff;

    Preview[🟢 大盘预览成功 (TCP :8443)]:::ok --> Conclusion[Android 端采集与硬编 100% 正常]:::ok
    Direct[🔴 点击直控失败/黑屏 (WebRTC UDP)]:::fail --> CauseRoot[排查 WebRTC UDP 媒体链路]:::check

    CauseRoot --> R1[1. 安全组/防火墙未放行 UDP 媒体端口]
    CauseRoot --> R2[2. Docker 非对称端口映射导致 TURN 端口错误]
    CauseRoot --> R3[3. Redroid/NAT 容器未配置 -external-addr]
    CauseRoot --> R4[4. 严格对称 NAT 且无有效 TURN 中转保底]
    CauseRoot --> R5[5. 物理真机 High Profile 硬件编码流兼容问题]
```

### 🛠️ 逐一排查与解决方案：

#### 原因 1：云服务器或宿主机未放行 WebRTC / TURN UDP 端口（最高频）
- **现象**：网页信令握手成功（收到 Offer/Answer），但 ICE 状态一直卡在 `checking` 并最终 `failed`。
- **原因**：很多云服务器默认只放行了 TCP `8443`，而 WebRTC 依赖的 UDP 媒体端口被安全组拦截。
- **解决**：在云服务器控制台的安全组与本机防火墙中，**务必放行以下 UDP 端口**：
  - `3478` (TCP+UDP，coturn 监听端口)；
  - `50000-50100` (UDP，TURN 媒体中转端口段)。

#### 原因 2：Docker 容器非对称端口映射（端口错配导致连错地址）
- **现象**：Docker 运行在 Bridge 模式下，宿主机外部端口映射为了非对称端口（如外部映射为 `18443` 或 `13478`）。
- **原因**：容器内部信令服务不知道外部映射了什么端口，依然将默认的 `3478` 作为 TURN 候选下发给浏览器，浏览器尝试连接 `宿主机:3478` 失败。
- **解决**：在启动 Docker 容器时，必须显式传入环境变量：
  `-e EXTERNAL_SIGNALING_PORT=18443 -e EXTERNAL_TURN_PORT=13478`（详见 [服务端配置参考](/deploy-config)）。

#### 原因 3：Docker Redroid / 虚拟机 Agent 未指定 `-external-addr`
- **现象**：Redroid 运行在隔离网桥中，局域网或外部电脑点击控制时卡在 `connecting`。
- **原因**：Agent 自动探测到的是 Docker 容器内部的私有 IP（如 `172.17.0.2`），并将其上报为 ICE Candidate，外部浏览器无法直接路由到该私网 IP。
- **解决**：启动 Agent 时必须附加参数：`-external-addr <宿主机真实IP> -webrtc-port <映射的UDP端口>`（详见 [Redroid 容器部署](/agent-docker)）。

#### 原因 4：严格对称型 NAT 且未配置有效 TURN 中转
- **现象**：手机处于移动蜂窝网络或公司复杂企业内网，控制端处于家庭宽带。
- **原因**：两端处于严格 Symmetric NAT 之后，P2P 打洞在数学上无法直接穿透，必须依赖 TURN 中继中转流量。
- **解决**：确保服务端拉起了 `coturn` 服务（使用官方 AIO 镜像自带），并在 Agent 启动参数中配置 `-ice-servers "turn:user:pass@IP:3478"`。

#### 原因 5：部分高端物理真机 High Profile 编码兼容性问题
- **现象**：WebRTC 连接状态显示 `connected` 已连通，甚至能听到声音或有触控反应，但画面一片纯黑。
- **原因**：部分高通骁龙/天玑真机硬件编码器默认输出了 High Profile，而部分浏览器 WASM/WebCodecs 解码器无法正常渲染非基线流。
- **解决**：在控制面板右侧「设置」->「视频」中将 Profile 指定为 **Baseline Profile (`profile=1`)**，并确保环境变量 `CP_SEND_CODEC_META=true` 已开启。

---

## 🔍 问题二：网页端 USB 部署时提示“The device is already in use by another program”？

### 📌 原因分析：
WebUSB 协议要求浏览器独占访问 Android 手机的物理 USB 接口。  
如果您的电脑后台正在运行本地的 **`adb server` 进程**（例如 Android Studio、VSCode 调试器、各种安卓模拟器自带助手、360手机助手等），该后台进程会霸占 USB 端口，导致浏览器无法成功握手（抛出 `The device is already in use by another program` 或 `Unable to claim interface`）。

### 🛠️ 解决方案：
1. 打开本地电脑的终端（Windows 按 `Win+R` 输入 `cmd` 回车，macOS 打开“终端”）；
2. 执行以下命令强制杀死本地抢占 USB 的 ADB 守护进程：
   ```bash
   adb kill-server
   ```
3. 彻底退出电脑任务栏托盘中的其他第三方手机管家或模拟器助手；
4. 回到浏览器，重新点击 **“连接并授权设备”**，即可秒级识别并完成推送！

---

## 🔍 问题三：画面投屏流畅，但鼠标点击、键盘改键均无法操控？

### 📌 针对性排查步骤：
1. **检查国产品牌手机「USB 调试（安全设置）」**
   - 小米（MIUI/HyperOS）、魅族、OPPO 等国产品牌手机对触摸注入有严格限制。
   - **必须**在手机「开发者选项」中开启 **「USB 调试（安全设置 - 允许通过 USB 输入）」**。否则 Android 系统会直接丢弃外部注入的 Touch 事件。
2. **确认是“完全无触控”还是“坐标偏移”**
   - 在手机「开发者选项」中开启 **“显示点按操作反馈”** 与 **“指针位置”**；
   - 在网页上点击画面，观察手机物理屏幕上的白色触摸落点：
     - **完全无落点**：说明系统拦截了输入，请重新检查安全权限或重启 Agent；
     - **有落点但偏离鼠标**：说明触控坐标映射发生了偏移，请将控制台与 Agent 升级至最新版本（最新版已重构坐标逆映射算法）。
3. **检查设备是否处于“只读模式”**
   - 若您是通过卡密或分享链接接入的设备，请确认该分享是否被设置为「仅观看 (view_only)」模式。

---

## 🔍 问题四：首次打开网页提示“您的连接不是私密连接 / 证书不受信任”？

### 📌 原因与解决：
- **原因**：服务端默认以安全 HTTPS 协议运行，内置了自动生成的自签名 SSL 证书，因此现代浏览器会弹出安全警告。
- **解决方法**：在浏览器警告页面点击 **“高级”** ➔ **“继续前往 / 接受风险并继续”** 即可正常进入大盘。
- **替换正式证书**：如需使用正规 CA 证书（如 Let's Encrypt），只需将您的 `.crt` 和 `.key` 证书文件放置在服务端 `certs/` 目录下即可。

---

## 🔍 问题五：物理真机长时间连接导致屏幕发热、无法休眠怎么办？

### 📌 解决方案：
- **开启「息屏连接 (Power Off Screen)」**：
  在控制界面的右侧工具栏中点击「连接设置」，勾选 **“息屏连接”**。
- **运行效果**：系统在建立 WebRTC 传输后会自动切断手机的物理屏幕背光（手机处于全黑熄屏状态），但网页端仍可实时流畅观看与操控。
- **核心收益**：极大地降低真机发热与耗电，防止长时间亮屏造成烧屏老化，并具备物理防窥作用。

---

## 🔍 问题六：网页端如何向云手机输入中文汉字？

### 📌 技术原理与用法：
- **原理**：系统前端构建了 1px 全透明 textarea 会话管理，在检测到中文拼音输入合成完成时，自动走静默双向剪贴板通道将文本注入 Android 剪贴板并触发粘贴，实现 **100% 汉字落屏**。
- **用法**：点击云手机内的文本框，直接在电脑物理键盘上使用搜狗拼音、微软拼音等输入法正常打字即可。支持通过 `Ctrl+V`（Mac 下 `Cmd+V`）一键将电脑长文本粘贴至云手机。

---

## 🔍 问题七：如何提取底层调试日志以排查疑难故障？

1. 在控制台界面进入「设置」->「高级」，勾选开启 **Agent 调试日志**；
2. 再次复现异常现象；
3. 提取手机中的日志文件：
   ```bash
   adb shell "cat /data/local/tmp/cloudphone-agent.log"
   ```
4. 将日志、设备机型与 Android 系统版本提交至 [GitHub Issues](https://github.com/hqw700/ScrcpyOverWebRTC/issues) 获取协助。

---

## 🔍 问题八：如何直接在手机端主动切断远程控制或退出 Agent？

### 📌 解决方案：
当手机已被远程连接，若您手边没有电脑，想要在手机上直接主动切断连接或退出服务：
* **手机本地管理入口**：
  在手机自带浏览器中打开：
  ```text
  http://127.0.0.1:12345/d
  ```
* **支持的操作**：
  1. **切断当前远程画面**：点击绿色按钮，立即断开所有在线的 WebRTC 控制与观看连接，但保持 Agent 后台保活以备下次使用；
  2. **彻底退出 Agent 服务**：点击退出按钮，向后台进程发送中断信号彻底销毁退出。

---

## 🔍 问题九：Docker 镜像拉取超时、失败或提示 TLS handshake timeout 怎么办？

### 📌 原因分析：
国内服务器或家庭宽带在直接访问 Docker Hub 官方源时，常因国际网络阻断导致 `docker pull` 极度缓慢或直接报错：
`net/http: TLS handshake timeout` 或 `Error response from daemon: Get "...": dial tcp ...: i/o timeout`。

### 🛠️ 解决方案（国内极速镜像站）：

使用国内加速镜像源 **`m.daocloud.io`** 进行极速下载，并在本地打标为标准镜像名：

```bash
# 1. 使用国内加速镜像站拉取
docker pull m.daocloud.io/docker.io/buutuu/scrcpy-over-webrtc:latest

# 2. 重新打标为标准镜像名称（方便直接运行官方启动命令）
docker tag m.daocloud.io/docker.io/buutuu/scrcpy-over-webrtc:latest buutuu/scrcpy-over-webrtc:latest

# 3. 正常启动容器
docker run -d --name cp-aio --net=host -v ./data:/app/data -e PUBLIC_IP=<您的IP> buutuu/scrcpy-over-webrtc:latest
```
