# 项目简介 & 架构优势

CloudPhone 是一个面向商业及开发者的开源 WebRTC 云手机解决方案。系统支持直接在现代浏览器中对 Android 镜像或物理真机进行音视频串流和键鼠映射交互，而无需下载任何原生应用客户端。

---

## 🎯 为什么选择 CloudPhone?

传统的云手机流媒体（如很多商用云桌面）通常依赖重量级转码（如 Nginx RTMP）或简单的 VNC 画布推送。这在网络丢包或帧率抖动时会导致高达数秒的积压延迟。CloudPhone 重新设计了整个推流生命周期，直接从 AOSP 硬件层打通。

### 1. 硬件级时钟透传 (HW-PTS)
彻底抛弃服务端猜测或伪造时间戳的算法。通过开启 `send_frame_meta` 参数，Agent 直接透传 Android `MediaCodec` 产生的高精微秒级硬件时间戳（`ptsUs`）至 WebRTC 引擎，使浏览器 Jitter Buffer 降至毫秒级，实现“零抖动”的渲染。

### 2. 零扫描流解析 (Zero-Search Parsing)
视频循环由传统的“全字节搜索 H.264 起始码”重构为“固定帧头 (12-byte TLV) 解析”，极大降低了 CPU 占用并消除了因解析延迟导致的画面抖动，使其天然适用于大规模集群多开。

### 3. 三通道 UDS 隔离 (Reliable Tri-Channel)
视频裸流、控制指令与多点触控数据通过三路独立 Unix Domain Socket（UDS）通道收发：
* 🎥 **视频通道** (`@cloudphone_video`): Annex B 裸流读取。
* ⚙️ **控制通道** (`@cloudphone_control`): 键鼠事件、文件传输、ADB 封装。
* 👆 **触控通道** (`@cloudphone_touch`): 独占 32-byte 触控低延迟注入通道。

彻底消除高频鼠标滑动/多点拖拽对视频帧解析的资源竞争，响应速度低至毫秒级。

---

## 🏗️ 架构组件与技术栈

系统由以下四个独立模块紧密联动：

1. **信令服务器 (Signaling Server)**：由 Go 编写，用于建立 WebRTC 物理握手 SDP 协商与 ICE 穿透参数下发，支持静态页面托管。
2. **WebRTC 桥接端 (Go Bridge)**：将原始 H.264 Annex B 裸流实时打包封包为 RTP 封装，打入 Pion WebRTC 信道。
3. **安卓代理 (cloudphone-agent)**：运行在 Android 虚拟机或真机中，负责向信令保活、按需启停 scrcpy-server 以及 UDS 通道多路复用。
4. **Scrcpy-server**：在 Android 系统底层直接捕获 Surface 并提供 MediaCodec 硬编码流。

> [!TIP]
> 架构采用了 **Fat Agent (直连模式)**，在 WebRTC 建立握手之后，所有的音视频流和控制 DataChannel 将绕过信令服务器，实现浏览器与 Agent 之间的 P2P 直连，极致节约公网中转带宽。

---

## 📊 功能支持列表 (Feature Support Matrix)

为了提供更细致的技术全景，下表列出了当前版本支持的全部商业级功能以及未来的研发规划：

| 功能模块 | 功能特性 | 支持状态 | 技术实现与说明 |
| :--- | :--- | :--- | :--- |
| **视频传输** | WebRTC 裸流投屏 | 🟢 已支持 | 基于 H.264 Annex B 直通编码，配合 HW-PTS 时间戳，防画面抖动与回弹。 |
| **音频推流** | Opus 独立音轨 | 🟢 已支持 | Opus 裸流封装为 WebRTC 独立 AudioTrack (`audio_0`)，支持同步修正。 |
| **手势控制** | 多指触控与按键 | 🟢 已支持 | 独立 DataChannel 下发触控事件，支持原生级缩放（Pinch）等复杂手势。 |
| **键盘映射** | 可视化改键引擎 | 🟢 已支持 | 键盘按键映射至特定坐标，提供 Tap(单击)、Joystick(摇杆) 和 Swipe(滑动) 映射。 |
| **文件管理** | 分片流式大文件传输 | 🟢 已支持 | 支持 WebRTC 数据通道的多设备目录浏览、应用一键安装/卸载与可靠分片传输。 |
| **命令行** | WebADB 终端控制 | 🟢 已支持 | 浏览器内置 xterm.js，免 ADB 驱动直连 Android 5555 端口，响应在 10ms 内。 |
| **输入优化** | 中文输入与联想字 | 🟢 已支持 | 监控 IME Composition，将非 ASCII 字符转为剪贴板投射注入，完美支持中文输入。 |
| **网络穿透** | P2P 混合端口打洞 | 🟢 已支持 | UPnP 自动开门映射、IPv6 全球单播直连、公网自定义 STUN/TURN 中继。 |
| **一键部署** | WebUSB 免驱推送 | 🟢 已支持 | 浏览器直接通过 WebUSB 推送 Agent 至真机，并以 setsid 守护进程离线运行。 |
| **画面压缩** | H.265/HEVC 编码 | 🔵 规划中 | 支持 H.265 编码，可在同等画质下降低 40% 的公网带宽开销。 |
| **服务端录屏** | 本地视频流转存 | 🔵 规划中 | 支持在云手机投屏时，直接将音视频流实时转存为本地 MP4 文件。 |
