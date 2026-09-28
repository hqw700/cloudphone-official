/**
 * CloudPhone / ScrcpyOverWebRTC - Official Website i18n
 * 轻量纯原生中英双语国际化引擎
 */

export const TRANSLATIONS = {
  'zh-CN': {
    // 网页元信息与品牌
    pageTitle: '穿云投屏 | 下一代 WebRTC 极速超低延迟云手机与真机投屏平台',
    pageDesc: '穿云投屏 (ScrcpyOverWebRTC) - 基于 WebRTC 和 redroid 的高性能、极速超低延迟云手机与真机投屏解决方案。支持硬件级 PTS 帧透传、三通道 Unix Socket 隔离与公网 P2P 直连，提供商业级按键映射与 WebADB 运维工具。',
    brandTitle: '穿云投屏',

    // 头部导航
    navHome: '官网首页',
    navDownload: '镜像下载',
    navDocs: '帮助文档',
    navBuy: '授权购买',
    demoBtn: '🎮 演示大盘',
    buyBtn: '购买授权',
    langSwitch: 'English',

    // Hero 区域
    heroBadge: 'v0.3.8 正式发布',
    heroTitle: '穿云投屏',
    heroSubtitle: '不仅仅是投屏，更是你的专属云手机',
    heroDesc: '依托纯粹的 <strong>P2P 直连</strong> 与 <strong>WebRTC 极速协议</strong>，“穿云投屏”以企业级云手机架构重构设备连接。我们打破了物理硬件与云端虚拟环境的界限，为您实现 <strong>实体真机</strong>、<strong>本地模拟器</strong>，甚至 <strong>市面主流云手机</strong> 的统一纳管。无需复杂的网络穿透与配置，所有设备一键极速上云，在浏览器中瞬间化身为您的 <strong>专属云端真机</strong>。',
    heroBtnDemo: '🎮 在线体验 Demo 管理台',
    heroBtnBuy: '⚡ 授权购买',
    heroBtnGithub: '🌐 GitHub 源码',
    heroBtnDocs: '📖 帮助文档',

    // 架构动效 Tabs
    archOverview: '🚀 全局预览',
    archMinimal: '📱 极简直连',
    archSignaling: '💬 信令建立',
    archStreaming: '🎬 音视频流',
    archInteractive: '⚡ 毫秒级触控',
    archFile: '📁 文件管理',
    archAdb: '🐚 ADB 隧道',
    archMiniWebrtc: 'WebRTC (UDP) P2P 直连',
    archMiniSig: 'WebSocket 信令',
    archSigServerNode: '信令服务器',
    archWsRouterNode: 'WebSocket 路由与注册中心',
    archUploadingStatus: '上传并静默安装中...',
    archKeymappingTitle: '⌨️ 按键映射',
    archDeviceContainer: '真机 / redroid 容器',
    archDeviceSystem: 'Android 系统 / 物理设备',
    archDeviceSubtitle: '集成了 WebRTC 媒体编码与网络协议栈',
    mockPhonePhone: '电话',
    mockPhoneMsg: '短信',
    mockPhoneSettings: '设置',
    mockPhoneGames: '游戏',

    // 下载板块
    downloadTitle: '镜像与资源下载',
    downloadSubtitle: '提供多样化的获取渠道，包括高速网盘、GitHub 官方发布包以及 Docker 一键拉取镜像。',
    dlQuarkTitle: '高速网盘下载 (夸克)',
    dlQuarkDesc: '适合国内网络直连。提供 Android APP、Magisk 模块以及管理平台全套压缩包（免密下载）。',
    dlQuarkBtn: '打开夸克网盘全量分享',
    dlAppApkBtn: '下载 .apk 🚀',
    dlMagiskZipBtn: '下载 .zip 🚀',
    dlPlatformZipBtn: '下载全套包 🚀',
    dlAppLabel: '📱 Android APP',
    dlMagiskLabel: '🧩 Magisk 模块',
    dlPlatformLabel: '📦 管理平台',
    dlGithubTitle: 'GitHub Releases',
    dlGithubDesc: '获取官方最新发布的开源源码、Release 预编译包（包括 webrtc-signaling 信令端、android-agentd 以及脚本工具）。',
    dlGithubVer: '最新版本：',
    dlGithubRepo: '官方仓库：',
    dlGithubStatus: '发布状态：',
    dlGithubStatusVal: 'Stable (稳定版)',
    dlGithubBtn: '前往 GitHub Releases',
    dlDockerTitle: 'Docker 一体化镜像',
    dlDockerDesc: '包含信令服务、Web 仪表盘、coturn 中转服务。一行指令，即可在本地或云端完成全套控制端基础设施部署。',
    dlDockerSize: '镜像大小：约 280MB (多架构)',

    // 更新日志板块
    changelogTitle: '最新版本更新日志',
    changelogDesc: '全新升级 Android 客户端、Magisk 保活模块以及管理平台核心性能。',
    changelogAppBadge: '📱 Android APP 客户端',
    changelogMagiskBadge: '🧩 Magisk 极速模块',
    changelogPlatformBadge: '💻 管理平台优化',

    // 全景功能大盘
    featuresTitle: '全景功能大盘与核心技术矩阵',
    featuresDesc: '全面覆盖 WebRTC 流媒体、高频群控大盘、Android App 双引擎、虚拟 HAL 注入与 AI 智能排障。',
    tabDashboard: '🖥️ 高频预览与批量群控',
    tabApp: '📱 Android APP & 模块保活',
    tabWebrtc: '⚡ 超低延迟与双轨配置',
    tabInputs: '⌨️ 高级交互与 Terminal',
    tabAi: '🤖 AI 智能排障与 WebADB',
    tabHal: '🔮 虚拟 HAL & 集群管理',

    // 更新日志要点
    clAppLi1: '<strong>移动端沉浸单机体验</strong>：全面优化移动端界面，修复 iOS 网页全屏与 H.264 视频显示/兼容问题，增加 PWA 添加到主屏幕免地址栏全屏引导。',
    clAppLi2: '<strong>终端与用户管理深度重构</strong>：彻底解决移动端终端点击闪烁、iOS 获焦自动放大网页变形、聚焦跳屏及敲命令行被遮挡；重构用户管理抽屉。',
    clAppLi3: '<strong>免 Root 宿主 App (Shizuku) 适配</strong>：引入 100% 现代 Kotlin 宿主工程，支持 Shizuku (UID 2000) 与 Root 双通道，手机脱机长期稳定受控。',
    clAppLi4: '<strong>Android 14+ 前台保活与自愈</strong>：接入 specialUse 前台服务与守护看门狗，建立沙盒穿透安全部署机制，抵御系统进程查杀。',

    clMagiskLi1: '<strong>Magisk 模块离线配置工具</strong>：支持在电脑端直接解包配置 Magisk 刷机包参数（提供 Windows 批处理/PowerShell 免 Python 及 Shell 脚本），刷入直接连接后台，避免手动敲命令。',
    clMagiskLi2: '<strong>ADB 多机批量并发拉起</strong>：提供自动遍历探测在线健康设备并并发推送启动 Agent 的脚本套件，群控多机连上电脑一键批量上线。',
    clMagiskLi3: '<strong>客户端断开解耦与心跳对齐</strong>：Agent 断开清理流程异步化，心跳超时调整为 60s 对齐服务端，消除网络闪断引发的假死掉线重连风暴。',
    clMagiskLi4: '<strong>推流源动态追踪与写入超时</strong>：引入 RunningVideoSource 物理源追踪状态机，摄像头与屏幕切换强制冷重启；信令全链路注入 2~3s 写超时防护防死锁。',

    clPlatformLi1: '<strong>移动端与 PC 端双模直控重构</strong>：移动端默认沉浸单机全屏，修复 iOS 视频显示与终端焦点跳屏；PC 端单机悬浮窗与自由缩放全量回归，支持单机/多机模式秒级平滑热切换。',
    clPlatformLi2: '<strong>Redroid 云手机一键适配支持</strong>：提供开箱即用的 AIO 镜像构建工具（release/redroid），自动识别导入官方镜像与 AOSP 离线包，容器开机自启、秒级接入。',
    clPlatformLi3: '<strong>海量设备展开式高密选择抽屉</strong>：控制台 Tab 更名为“执行命令”，Targets 区域升级为展开式抽屉，支持模糊搜索、批量反选与自适应网格，轻松承载 100+ 台设备批量命令分发。',
    clPlatformLi4: '<strong>全链路推流互斥与断开防抖</strong>：加固屏幕直连与摄像头监控切换互斥，引入 1500ms 协议热切换防抖看门狗，根治协议切换或页面刷新导致的误杀黑屏。',
    clAppDownload: '获取 ScrcpyOverWebRTC-release.apk →',
    clMagiskDownload: '获取 cloudphone-agent-magisk.zip →',
    clPlatformDownload: '获取 cloudphone.zip 平台包 →',

    // 全景功能大盘 38 项卡片
    // Panel 1: Dashboard
    fDash1T: '高频大盘实时预览',
    fDash1D: '独立 WebSocket 二进制 H.264 裸流分发，抛弃传统 CPU 压缩 JPEG 方案，支持数十台设备大盘高帧率并发流畅监控。',
    fDash2T: '独立预览直控 (Direct Control)',
    fDash2D: '无需建立昂贵的 WebRTC P2P 握手，即可在大盘 Canvas 卡片上直接滑动点击操作云手机，极致响应，瞬间直控。',
    fDash3T: '批量触控与按键群控',
    fDash3D: '支持批量勾选目标云手机，一键将屏幕触控手势、按键宏同步广播至全量设备，大幅提升群控运维效率。',
    fDash4T: '应用批量分发与静默安装 (v0.3.0)',
    fDash4D: '上传 APK 一键广播分发至多台云手机，Agent 后台异步并发 `pm install -r` 静默安装，在管理大盘实时汇总反馈安装状态。',
    fDash5T: 'P2P 直连文件管理器 (Web & App)',
    fDash5D: '依托 DataChannel P2P 物理通道与滑动窗口 BWE 流控，支持对远端云手机目录进行全功能浏览、新建、删除及极速双向传输。',
    fDash6T: '批量命令行分发终端',
    fDash6D: '结合设备标签一键全选，并发广播下发 ADB Shell 指令，在大盘实时展示各机器执行状态与 stdout/stderr 输出。',
    fDash7T: '坐标自适应与 90° 旋转逆映射',
    fDash7D: '自动解析视频帧物理像素，剥离 `object-fit: contain` 黑边；支持原生横屏设备（车机/Pad）90° 顺时针逆映射，触控 100% 精准。',
    fDash8T: '视口感知智能降级与 GPU 硬解',
    fDash8D: '感知大盘滚动视口 (IntersectionObserver)，仅对可见区域卡片推流，结合 WebCodecs GPU 硬件解码，极致节省带宽与 CPU。',

    // Panel 2: App & Daemon
    fApp1T: 'APP 主控端直控大盘',
    fApp1D: '支持原生 Android App 登录连接大盘直控云手机，提供多点触控、悬浮金刚键、端到端延迟悬浮球及软键盘抑制。',
    fApp2T: 'Root / Shizuku 双引擎被控',
    fApp2D: '物理手机免连接电脑，支持 Root 或无线调试 Shizuku (ADB) 双引擎授权，一键免电脑拉起 Agent 受控运行。',
    fApp3T: '独立单机模式 (手机内置 Server)',
    fApp3D: '信令与 Web 托管可直接解压运行在手机内部，通过局域网/公网 HTTPS 直连访问，彻底摆脱外部服务器依赖。',
    fApp4T: 'Magisk / KSU 系统服务保活',
    fApp4D: '支持作为 Magisk / KernelSU / APatch 插件模块作为底层服务开机自启保活，防 LMK 误杀，稳定性达 99.9%。',
    fApp5T: 'cpctl 工具与 MT管理器配置',
    fApp5D: '内置 `cpctl` 终端命令行交互配置工具，亦可直接使用 MT管理器 编辑 `/data/adb/modules/cloudphone-agent/config` 热生效。',
    fApp6T: 'App 原生直连文件管理 (v0.3.1)',
    fApp6D: 'App 内部集成 P2P 文件管理器，支持对远端云手机目录进行直观浏览、新建、重命名、删除及高速双向上传下载。',

    // Panel 3: Ultra-Low Latency & WebRTC
    fRtc1T: 'HW-PTS 硬件级时间戳 Passthrough',
    fRtc1D: '捕获 MediaCodec 硬件编码器原始 PTS 时间戳解算 RTP Duration，彻底解决累积漂移，Jitter Buffer 降至 10ms 内。',
    fRtc2T: '三通道 UDS 物理隔离',
    fRtc2D: '视频 (@video)、控制 (@control) 和多点触控 (@touch) 三路 Socket 隔离运行，高频触控绝不抢占视频带宽。',
    fRtc3T: 'Opus 音频内录直通',
    fRtc3D: 'Android 后台 `scrcpy-server` 输出 Opus 裸流并转换为 WebRTC AudioTrack，画面与声音精准同步低延迟输出。',
    fRtc4T: 'P2P IPv6 直连与 TURN 中继',
    fRtc4D: '自动收集 IPv6 候选地址实现公网 0 带宽成本直连；严格对称 NAT 环境自动匹配内置 `coturn` TURN 中继中转。',
    fRtc5T: '全局 vs 单设备双轨定制隔离',
    fRtc5D: '独立保存特定设备的分辨率、码率、帧率、通道策略 (auto/direct/relay) 和 IP 偏好 (v4/v6)，重连瞬间热生效。',
    fRtc6T: '息屏连接防窥与硬件节电',
    fRtc6D: '唤醒录屏后自动切断物理真机屏幕背光，具备防窥、防硬件发热、大幅延长电池寿命的作用。',

    // Panel 4: Advanced Input & Terminal
    fIn1T: '静默双向剪切板 (防回环)',
    fIn1D: '焦点回弹自动无感同步剪贴板，支持快捷键粘贴，两端以最近同步文本判重，彻底避免无限复制回环。',
    fIn2T: 'IME 拼音汉字无错落屏',
    fIn2D: '1px 透明 Textarea 锁定焦点与 Composition 拼音合成管理，非 ASCII (汉字) 自动走剪切板注入，100% 选词落屏。',
    fIn3T: '可视化改键与摇杆引擎',
    fIn3D: '内置可视化拖拽编辑器，支持 Tap(单击)、Joystick(跑动摇杆)、Swipe(线性滑动)及系统按键映射绑定。',
    fIn4T: 'Interactive Shell (xterm.js)',
    fIn4D: '嵌入 xterm.js ANSI 仿真终端，支持多 Tab 会话，可流畅运行 top、vi、logcat 等真交互式程序。',
    fIn5T: '批量命令分发终端',
    fIn5D: '支持根据设备标签一键点选全选，并发下发 ADB Shell 命令，在大盘分组高亮展示各机器执行状态与 stdout/stderr。',
    fIn6T: '自定义快捷宏云同步 (v0.3.0)',
    fIn6D: '控制台右侧支持自主增删改快捷宏命令，数据自动在信令 Server 端持久化存储 (`shortcuts.json`) 实现多端漫游。',

    // Panel 5: AI & WebADB
    fAi1T: 'AI 智能排障代理',
    fAi1D: '完美接入 OpenAI、Claude 及 DeepSeek，自主运行原生工具链 (Tool Calling)，查命令、抓包并分析卡顿根本原因。',
    fAi2T: 'AI 思考与工具 Trace 日志',
    fAi2D: '顶层集成“思考过程与工具调用日志”面板，实时展现 Prompt 解析、逻辑推理以及下发 Shell / Stats 工具的日志。',
    fAi3T: 'P2P 隧道 WebADB 调试',
    fAi3D: '依托 DataChannel 专用通道，前端纯 JS 实现 WebADB 握手，直接在浏览器上与云手机 adbd 通信，免本地安装 ADB。',
    fAi4T: 'P2P 文件管理与静默分发',
    fAi4D: '基于 DataChannel 滑动窗口 BWE 流控传输，支持文件浏览、上传下载及异步并发 `pm install -r` 静默应用安装。',
    fAi5T: '离线设备列表与状态持久化 (v0.3.0)',
    fAi5D: '信令服务器与管理平台全面优化设备注册心跳，引入离线设备持久化视图，方便大盘对离线设备的统一追踪。',
    fAi6T: '切网恢复与网络链路自愈 (v0.3.0)',
    fAi6D: '彻底修复因 Wi-Fi / 移动网络切换导致的设备离线误报与假死，网络重连后 Agent 自动触发注册上报与链路自愈。',

    // Panel 6: Virtual HAL & Fleet Management
    fHal1T: 'Camera HAL 摄像头裸流注入',
    fHal1D: '捕获网页摄像头流，Agent 解码为 YUV420p 裸流直注 TCP 9001 端口，云手机内相机 App 瞬间捕捉本机画面。',
    fHal2T: 'GPS HAL 虚拟定位',
    fHal2D: 'Agent 开放 TCP 9002 端口接收经纬度，动态更新 GNSS 配置文件，定位 HAL 线程 1s 轮询上报 LocationManager。',
    fHal3T: 'Sensors HAL 传感器模拟',
    fHal3D: '开放 TCP 9003 端口接收 JSON 数据，动态更新内存 `gMockSensorData`，实时模拟加速度计、陀螺仪与折叠角。',
    fHal4T: '多账号与租户隔离 (Kick 强退)',
    fHal4D: '划分 admin 与普通用户角色，提供细粒度设备分配；管理员可实时监控活动连接并一键强退 (Kick) 释放设备。',
    fHal5T: '设备彩色标签与大盘筛选',
    fHal5D: '支持给设备设置自定义彩色标签，本地+云端 HTTP API 双轨同步，大盘与 ECharts 监控走势响应式即时过滤。',
    fHal6T: 'WebSocket 指标与 ECharts 趋势',
    fHal6D: 'Agent 端 5s 差分采集 CPU、内存、磁盘、网速与温度，前端 Pinia 滑动窗口与 ECharts 展现设备实时性能折线图。',

    // 快速开始板块
    quickstartTitle: '三步开启您的云手机之旅',
    quickstartDesc: '原生支持在 MacOS、Linux 和 Windows 上交叉编译并一键运行。跟随以下极简流程，立刻启动您的服务。',
    quickstartDocsBtn: '阅读完整部署文档',
    terminalComment1: '# 1. 使用 Docker 一键运行信令服务端 (PUBLIC_IP为宿主机IP或者公网IP)',
    terminalComment2: '# 2. 免驱一键部署：浏览器访问 https://192.168.1.100:8443 点击「部署新设备」自动配置',
    terminalSubComment2: '# 支持自动判定架构并推送 Agent 服务，Setsid 守护常驻启动',
    terminalComment3: '# 3. 命令行手动部署：下载一键资源包推送并启动 Agent',

    // 页脚
    footerLogo: '“穿云投屏”开源项目',
    footerInfo: '基于开源协议分发。致力于为社区提供极速无损的安卓云手机与真机远程投屏体验。',
    footerHome: '主页',
    footerDocs: '帮助文档',
    footerBuy: '授权购买',
    footerGithub: 'GitHub'
  },

  'en-US': {
    // Page metadata & Brand
    pageTitle: 'ScrcpyOverWebRTC | Next-Gen Ultra-Low Latency Cloud Phone & Screen Mirroring',
    pageDesc: 'ScrcpyOverWebRTC - High-performance, ultra-low latency WebRTC cloud phone and device management solution based on redroid and customized scrcpy-server. Supports hardware PTS passthrough, 3-channel UDS isolation, P2P direct streaming, keymapping, and WebADB tooling.',
    brandTitle: 'ScrcpyOverWebRTC',

    // Header nav
    navHome: 'Home',
    navDownload: 'Downloads',
    navDocs: 'Docs',
    navBuy: 'Pricing',
    demoBtn: '🎮 Live Demo',
    buyBtn: 'Get License',
    langSwitch: '简体中文',

    // Hero section
    heroBadge: 'v0.3.8 Released',
    heroTitle: 'ScrcpyOverWebRTC',
    heroSubtitle: 'More Than Mirroring — Your Dedicated Cloud Phone',
    heroDesc: 'Powered by pure <strong>P2P direct connections</strong> and <strong>WebRTC ultra-fast protocols</strong>, ScrcpyOverWebRTC redefines remote Android device management. We eliminate the barrier between physical hardware and cloud containers, allowing you to unify <strong>physical phones</strong>, <strong>local emulators</strong>, and <strong>cloud instances</strong> in one central console. No complex port forwarding required — every device transforms into your <strong>dedicated cloud phone</strong> inside any modern web browser.',
    heroBtnDemo: '🎮 Try Live Demo Console',
    heroBtnBuy: '⚡ View Pricing',
    heroBtnGithub: '🌐 GitHub Repo',
    heroBtnDocs: '📖 Documentation',

    // Architecture interactive tabs
    archOverview: '🚀 Global View',
    archMinimal: '📱 Direct P2P',
    archSignaling: '💬 Signaling',
    archStreaming: '🎬 Media Stream',
    archInteractive: '⚡ Low Latency',
    archFile: '📁 File Manager',
    archAdb: '🐚 ADB Tunnel',
    archMiniWebrtc: 'WebRTC (UDP) P2P Direct',
    archMiniSig: 'WebSocket Signaling',
    archSigServerNode: 'Signaling Server',
    archWsRouterNode: 'WebSocket Router & Registry',
    archUploadingStatus: 'Uploading & installing...',
    archKeymappingTitle: '⌨️ Keymapping',
    archDeviceContainer: 'Physical Device / Redroid',
    archDeviceSystem: 'Android OS / Device',
    archDeviceSubtitle: 'Integrated WebRTC media codecs & network stack',
    mockPhonePhone: 'Phone',
    mockPhoneMsg: 'Messages',
    mockPhoneSettings: 'Settings',
    mockPhoneGames: 'Games',

    // Download section
    downloadTitle: 'Downloads & Deployment Packages',
    downloadSubtitle: 'Available as Docker Compose, Magisk Modules, Android Apps, and standalone portable packages.',
    dlQuarkTitle: 'Cloud Drive Downloads (Quark)',
    dlQuarkDesc: 'Direct high-speed downloads in China for Android APK, Magisk modules, and platform bundle.',
    dlQuarkBtn: 'Open Cloud Drive Share',
    dlAppApkBtn: 'Download .apk 🚀',
    dlMagiskZipBtn: 'Download .zip 🚀',
    dlPlatformZipBtn: 'Download Full Bundle 🚀',
    dlAppLabel: '📱 Android APP',
    dlMagiskLabel: '🧩 Magisk Module',
    dlPlatformLabel: '📦 Console Bundle',
    dlGithubTitle: 'GitHub Releases',
    dlGithubDesc: 'Get the latest open-source releases, precompiled binaries (webrtc-signaling, agent, and scripts).',
    dlGithubVer: 'Latest Version: ',
    dlGithubRepo: 'Official Repo: ',
    dlGithubStatus: 'Release Status: ',
    dlGithubStatusVal: 'Stable',
    dlGithubBtn: 'Go to GitHub Releases',
    dlDockerTitle: 'Docker All-in-One Image',
    dlDockerDesc: 'Includes signaling server, Web dashboard, and coturn relay. One command to deploy the entire server infrastructure.',
    dlDockerSize: 'Image size: ~280MB (Multi-Arch)',

    // Changelog section
    changelogTitle: 'Latest Version Changelog',
    changelogDesc: 'Major upgrades across Android App, Magisk daemon, and management platform.',
    changelogAppBadge: '📱 Android App Client',
    changelogMagiskBadge: '🧩 Magisk System Module',
    changelogPlatformBadge: '💻 Management Platform',

    // Changelog bullet points
    clAppLi1: '<strong>Immersive Mobile Experience</strong>: Fully optimized mobile UI, fixed iOS fullscreen & H.264 video rendering, and added PWA Add-to-Home-Screen prompt for clean UI.',
    clAppLi2: '<strong>Terminal & User Management Overhaul</strong>: Fixed mobile terminal flicker, iOS zoom deform upon focus, scroll jumps, and keyboard clipping; overhauled user management drawer.',
    clAppLi3: '<strong>Root-Free Host App (Shizuku)</strong>: 100% modern Kotlin host app supporting both Shizuku (UID 2000) and Root engines for long-term untethered phone management.',
    clAppLi4: '<strong>Android 14+ Keepalive & Self-Healing</strong>: specialUse foreground service and watchdog daemon with sandbox-bypassing deploy to withstand OS process pruning.',

    clMagiskLi1: '<strong>Offline Magisk Config Tool</strong>: Unpack and configure Magisk module parameters directly on PC (Windows batch/PowerShell & Shell scripts included) for zero-CLI flashing.',
    clMagiskLi2: '<strong>ADB Multi-Device Concurrent Start</strong>: Automated discovery and concurrent agent launcher script suite to bring dozens of USB-connected phones online at once.',
    clMagiskLi3: '<strong>Async Disconnect & Heartbeat Alignment</strong>: Asynchronous disconnect cleanup and aligned 60s timeout to eliminate reconnect storms caused by network jitters.',
    clMagiskLi4: '<strong>Dynamic Video Source & Write Timeouts</strong>: State machine tracking for screen/camera switching with cold restart; 2-3s write timeouts on signaling channels against deadlocks.',

    clPlatformLi1: '<strong>Dual-Mode Mobile & PC Direct Control</strong>: Mobile defaults to immersive single-device view; PC floating window and free resizing restored with seamless hot switching.',
    clPlatformLi2: '<strong>Redroid Cloud Phone Instant Adapter</strong>: Ready-to-use AIO image builder (`release/redroid`) with auto-import for official images and AOSP bundles, auto-starting on boot.',
    clPlatformLi3: '<strong>High-Density Fleet Target Drawer</strong>: Targets area upgraded to expandable drawer with fuzzy search, batch invert selection, and responsive grid for 100+ devices.',
    clPlatformLi4: '<strong>Stream Mutex & Debounce Guard</strong>: Strict mutual exclusion between screen and camera streaming with 1500ms debounce watchdog to prevent false black screens.',
    clAppDownload: 'Get ScrcpyOverWebRTC-release.apk →',
    clMagiskDownload: 'Get cloudphone-agent-magisk.zip →',
    clPlatformDownload: 'Get cloudphone.zip Platform Bundle →',

    // Feature matrix section
    featuresTitle: 'Full Feature Matrix & Technical Architecture',
    featuresDesc: 'Complete coverage of WebRTC streaming, high-frequency group control, dual-engine Android app, virtual HAL injection, and AI diagnostics.',
    tabDashboard: '🖥️ Matrix Preview & Group Control',
    tabApp: '📱 Android App & Daemon',
    tabWebrtc: '⚡ Ultra-Low Latency & Dual-Track',
    tabInputs: '⌨️ Advanced Input & Terminal',
    tabAi: '🤖 AI Assistant & WebADB',
    tabHal: '🔮 Virtual HAL & Fleet Management',

    // Feature matrix 38 cards
    // Panel 1: Dashboard
    fDash1T: 'High-Frequency Matrix Live Preview',
    fDash1D: 'Independent WebSocket binary H.264 stream distribution, eliminating high-CPU JPEG compression, streaming 60fps across dozens of devices simultaneously.',
    fDash2T: 'Instant Direct Preview Control',
    fDash2D: 'Direct touch and swipe manipulation on matrix Canvas cards without initiating full WebRTC P2P handshakes, achieving instantaneous responsiveness.',
    fDash3T: 'Batch Touch & Gesture Group Control',
    fDash3D: 'Multi-select target devices to broadcast touch gestures and keymapping macros synchronously across your entire cloud phone fleet.',
    fDash4T: 'Batch App Distribution & Silent Install',
    fDash4D: 'Upload APKs to broadcast to multiple devices with background asynchronous `pm install -r` silent installation and live progress tracking.',
    fDash5T: 'P2P File Manager (Web & App)',
    fDash5D: 'Full-featured remote filesystem browsing, upload, download, and deletion backed by WebRTC DataChannel and sliding-window BWE flow control.',
    fDash6T: 'Batch Fleet Command Terminal',
    fDash6D: 'Select devices by tags and dispatch concurrent ADB Shell commands, visualizing live stdout/stderr streams per device in real time.',
    fDash7T: 'Coordinate Auto-Mapping & 90° Inversion',
    fDash7D: 'Derives true video frame pixels, strips `object-fit: contain` black margins, and accurately maps landscape devices with 90° clockwise rotation.',
    fDash8T: 'Viewport-Aware Throttling & WebCodecs',
    fDash8D: 'Uses IntersectionObserver to stream only visible cards in viewport, paired with WebCodecs GPU hardware decoding to minimize CPU and bandwidth usage.',

    // Panel 2: App & Daemon
    fApp1T: 'Native Android Master App',
    fApp1D: 'Native Android application to control cloud phones with multi-touch, floating navigation keys, RTT latency ball, and soft keyboard suppression.',
    fApp2T: 'Dual-Engine Root & Shizuku Control',
    fApp2D: 'No PC needed: supports Root or wireless debugging Shizuku (UID 2000) dual engines to launch the Agent directly on device.',
    fApp3T: 'Standalone Device Mode',
    fApp3D: 'Built-in signaling and Web host running directly inside the phone, allowing LAN/WAN HTTPS access without external servers.',
    fApp4T: 'Magisk / KernelSU Daemon Keepalive',
    fApp4D: 'Runs as an OS-level boot daemon via Magisk/KernelSU/APatch modules to prevent LMK process termination with 99.9% uptime.',
    fApp5T: 'cpctl CLI & MT Manager Config',
    fApp5D: 'Built-in `cpctl` interactive command-line tool, and supports direct hot-reload edits to `/data/adb/modules/cloudphone-agent/config`.',
    fApp6T: 'In-App P2P File Explorer',
    fApp6D: 'Integrated P2P file manager in Android app for browsing, renaming, deleting, and bidirectional file transfer.',

    // Panel 3: Ultra-Low Latency & WebRTC
    fRtc1T: 'Hardware PTS Passthrough',
    fRtc1D: 'Passes hardware MediaCodec timestamps directly to RTP Duration calculation, eliminating drift and reducing jitter buffer under 10ms.',
    fRtc2T: '3-Channel Unix Socket Isolation',
    fRtc2D: 'Video (@video), control (@control), and multi-touch (@touch) sockets run isolated so high-rate touches never starve video bandwidth.',
    fRtc3T: 'Passthrough Opus Audio Streaming',
    fRtc3D: 'Scrcpy server captures internal audio as raw Opus stream into WebRTC AudioTrack, perfectly syncing sound and visual frames.',
    fRtc4T: 'IPv6 P2P Direct & TURN Fallback',
    fRtc4D: 'Automatic IPv6 candidate harvesting for zero-bandwidth cost public P2P direct streaming, with built-in coturn fallback for symmetric NATs.',
    fRtc5T: 'Dual-Track Global vs Device Settings',
    fRtc5D: 'Saves resolution, bitrate, framerate, transport policy, and IPv4/IPv6 preference per device with instant hot-reload upon reconnect.',
    fRtc6T: 'Screen-Off Mirroring & Power Saving',
    fRtc6D: 'Cuts physical screen backlight upon streaming connection to prevent snooping, reduce device heating, and extend battery lifespan.',

    // Panel 4: Advanced Input & Terminal
    fIn1T: 'Silent Bidirectional Clipboard',
    fIn1D: 'Seamlessly syncs clipboard text on focus return with shortcut paste support and deduplication to prevent infinite sync loops.',
    fIn2T: 'IME Chinese Composition & Bypass',
    fIn2D: '1px transparent textarea with composition event handling routes non-ASCII characters through atomic clipboard injection with 100% accuracy.',
    fIn3T: 'Visual Keymapping & Joystick Engine',
    fIn3D: 'Visual drag-and-drop keymapper supporting Tap, WASD Joystick, linear Swipe, and hardware system keys.',
    fIn4T: 'Interactive Terminal (xterm.js)',
    fIn4D: 'Embedded ANSI terminal emulator supporting multi-tab sessions and full interactive tools like top, vi, and logcat.',
    fIn5T: 'Batch Fleet Command Broadcast',
    fIn5D: 'Concurrent broadcast of ADB shell commands grouped by device tags, with color-coded execution output logs.',
    fIn6T: 'Custom Macro Cloud Sync',
    fIn6D: 'Create, edit, and trigger custom shortcuts saved to server (`shortcuts.json`) for seamless roaming across devices.',

    // Panel 5: AI & WebADB
    fAi1T: 'AI Diagnostic Troubleshooting Agent',
    fAi1D: 'Connects to OpenAI, Claude, and DeepSeek with native Tool Calling to inspect system status, capture packets, and analyze lag root causes.',
    fAi2T: 'AI Reasoning & Tool Trace Logs',
    fAi2D: 'Real-time trace inspector displaying prompt parsing, logical reasoning steps, and executed shell/metric tool calls.',
    fAi3T: 'P2P WebADB Browser Tunnel',
    fAi3D: 'Pure JavaScript WebADB implementation over DataChannel enabling direct adbd communication inside the browser without local ADB installation.',
    fAi4T: 'P2P File Ops & Silent APK Install',
    fAi4D: 'Sliding-window BWE flow controlled file transfer supporting file management and concurrent silent `pm install -r`.',
    fAi5T: 'Offline Device State Persistence',
    fAi5D: 'Persistent offline registry view with optimized heartbeat tracking to monitor disconnected devices in matrix dashboard.',
    fAi6T: 'Network Handover & Auto-Healing',
    fAi6D: 'Fully handles Wi-Fi to cellular transitions, triggering automatic agent registration and link re-establishment.',

    // Panel 6: Virtual HAL & Fleet Management
    fHal1T: 'Camera HAL Raw Stream Injection',
    fHal1D: 'Injects browser camera streams as YUV420p directly to TCP 9001, allowing cloud phone camera apps to capture real-time feeds.',
    fHal2T: 'GPS HAL Location Mocking',
    fHal2D: 'Listens on TCP 9002 for coordinate injection, updating GNSS configs with 1s periodic reporting to Android LocationManager.',
    fHal3T: 'Sensors HAL Simulation',
    fHal3D: 'Listens on TCP 9003 for sensor JSON data to dynamically update mock accelerometer, gyroscope, and hinge angle in memory.',
    fHal4T: 'Multi-User & Tenant Isolation',
    fHal4D: 'Role-based access control (Admin/User), device lease allocation, active session monitoring, and one-click Kick disconnect.',
    fHal5T: 'Colored Device Tags & Filtering',
    fHal5D: 'Assign custom color-coded tags to devices with local + HTTP API dual-sync, providing responsive matrix and metric filtering.',
    fHal6T: 'WebSocket Metrics & ECharts Analytics',
    fHal6D: '5-second interval metrics for CPU, RAM, disk, network speed, and battery temperature displayed via sliding-window ECharts.',

    // Quickstart section
    quickstartTitle: 'Get Started in Three Steps',
    quickstartDesc: 'Cross-compiled and ready to run on macOS, Linux, and Windows with a single binary or Docker command.',
    quickstartDocsBtn: 'Read Full Documentation',
    terminalComment1: '# 1. Run signaling server via Docker (PUBLIC_IP is host or public IP)',
    terminalComment2: '# 2. Driverless WebUSB: Open https://192.168.1.100:8443 and click "Deploy Device"',
    terminalSubComment2: '# Automatically detects architecture, pushes Agent, and detaches via Setsid',
    terminalComment3: '# 3. Manual CLI setup: Download portable bundle and launch Agent',

    // Footer
    footerLogo: 'ScrcpyOverWebRTC Project',
    footerInfo: 'Distributed under open-source licenses. Dedicated to providing an ultra-low latency, lossless Android cloud phone and device mirroring experience.',
    footerHome: 'Home',
    footerDocs: 'Documentation',
    footerBuy: 'Pricing',
    footerGithub: 'GitHub'
  }
}

const STORAGE_KEY = 'website_locale'

/**
 * 获取当前语言 (默认优先使用 localStorage，其次参考浏览器首选语言，默认 zh-CN)
 */
export function getCurrentLocale() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && (saved === 'zh-CN' || saved === 'en-US')) {
    return saved
  }
  const navLang = navigator.language || navigator.userLanguage || ''
  if (navLang.startsWith('en')) {
    return 'en-US'
  }
  return 'zh-CN'
}

/**
 * 切换语言并更新页面所有 i18n 节点
 */
export function setLocale(lang) {
  if (lang !== 'zh-CN' && lang !== 'en-US') {
    lang = 'zh-CN'
  }
  localStorage.setItem(STORAGE_KEY, lang)
  document.documentElement.lang = lang
  if (document.body) {
    document.body.classList.toggle('lang-en', lang === 'en-US')
  }

  // 英文下显隐切换 (如隐藏授权购买)
  document.querySelectorAll('.hide-on-en').forEach(el => {
    el.style.display = lang === 'en-US' ? 'none' : ''
  })

  // 智能切换文档链接 (中文跳转 /docs/，英文跳转 /docs/en/)
  document.querySelectorAll('a[href^="/docs/"]').forEach(link => {
    const currentHref = link.getAttribute('href')
    if (lang === 'en-US') {
      if (!currentHref.startsWith('/docs/en/')) {
        link.setAttribute('href', currentHref.replace(/^\/docs\/?/, '/docs/en/'))
      }
    } else {
      if (currentHref.startsWith('/docs/en/')) {
        link.setAttribute('href', currentHref.replace(/^\/docs\/en\/?/, '/docs/'))
      }
    }
  })

  const dict = TRANSLATIONS[lang]
  if (!dict) return

  // 更新网页 Title 和 Description
  if (dict.pageTitle) {
    document.title = dict.pageTitle
  }
  const metaDesc = document.querySelector('meta[name="description"]')
  if (metaDesc && dict.pageDesc) {
    metaDesc.setAttribute('content', dict.pageDesc)
  }

  // 批量替换具有 data-i18n 属性的节点
  const elements = document.querySelectorAll('[data-i18n]')
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n')
    if (dict[key] !== undefined) {
      el.innerHTML = dict[key]
    }
  })

  // 批量替换具有 data-i18n-attr 的节点 (例如 title:key, placeholder:key)
  const attrElements = document.querySelectorAll('[data-i18n-attr]')
  attrElements.forEach(el => {
    const raw = el.getAttribute('data-i18n-attr')
    raw.split(',').forEach(pair => {
      const [attr, key] = pair.split(':')
      if (attr && key && dict[key.trim()] !== undefined) {
        el.setAttribute(attr.trim(), dict[key.trim()])
      }
    })
  })

  // 触发全局自定义事件
  window.dispatchEvent(new CustomEvent('website-locale-changed', { detail: { locale: lang } }))
}

/**
 * 切换中英
 */
export function toggleLocale() {
  const current = getCurrentLocale()
  const next = current === 'zh-CN' ? 'en-US' : 'zh-CN'
  setLocale(next)
  return next
}

/**
 * 初始化 i18n 系统
 */
export function initI18n() {
  const current = getCurrentLocale()
  setLocale(current)

  // 绑定语言切换按键事件
  const switchBtn = document.getElementById('lang-switch-btn')
  if (switchBtn) {
    switchBtn.addEventListener('click', () => {
      const nextLang = toggleLocale()
      switchBtn.textContent = nextLang === 'zh-CN' ? '🌐 EN' : '🌐 中文'
    })
    // 初始文字设置
    switchBtn.textContent = current === 'zh-CN' ? '🌐 EN' : '🌐 中文'
  }
}
