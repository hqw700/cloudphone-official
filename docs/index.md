# ScrcpyOverWebRTC 官方指南与帮助文档

欢迎使用 ScrcpyOverWebRTC（穿云投屏）官方使用指南与开发者文档。  
本系统基于 **WebRTC 直连、redroid 虚拟化与定制 scrcpy-server** 深度打造，面向超低延迟、高频交互与大规模设备纳管场景。

---

## 📖 文档全景导航

### [📖 一、项目概览](/introduction)
* **[项目简介与架构解析](/introduction)**：了解系统的整体网络拓扑、UDS 三通道隔离与硬件级 PTS 时间戳直通机制。
* **[核心功能全景特性](/features)**：系统支持的所有核心能力总览，包括音视频、大盘、输入、审计、调试等。
* **[硬件要求与选型决策](/quickstart)**：服务端与设备端环境要求、场景选型与部署路线决策树。

### [📱 二、设备接入与 Agent 部署](/agent-prep)
* **[接入准备与开发者选项](/agent-prep)**：USB 调试授权、特定品牌安全设置与网络检查。
* **[方式一：网页端 WebUSB 部署](/agent-webusb)**：纯浏览器免驱免装 ADB 一键插线配对推送。
* **[方式二：电脑脚本一键包接入](/agent-script)**：通过解压 `agent-deploy.zip` 在 PC/Mac/Linux 终端一键拉起。
* **[方式三：Magisk / Root 模块开机自启](/agent-magisk)**：刷入 Magisk/KernelSU/APatch 模块，实现系统守护保活与 `cpctl` 命令行运维。
* **[方式四：Android App 原生客户端](/app-guide)**：主控操控 + 被控端（Root 或 Shizuku 免 Root 双模式）+ 单机独立运行。
* **[方式五：Docker / Redroid 容器云手机](/agent-docker)**：redroid 云虚机多开纳管与指定 UDP 端口段映射。

### [💻 三、服务端部署与运维](/deploy-config)
* **[服务端统一配置与端口参数](/deploy-config)**：环境变量、CLI 启动参数、端口放行规则与数据持久化。
* **[局域网与绿色免 Docker 部署](/deploy-lan)**：解压即用的绿色单二进制（Linux/macOS/Windows）。
* **[Docker 一体化镜像部署 (AIO)](/deploy-docker)**：开箱即用集成 coturn 与信令的前后端一体镜像。
* **[NAS 与软路由部署 (fnOS / iStoreOS)](/deploy-nas)**：飞牛 OS、iStoreOS / OpenWrt、群晖等专项容器配置。
* **[公网云服务器部署与穿透](/deploy-cloud)**：公网安全组、IPv6 零成本直连与 coturn 中转保障。
* **[手机脱机独立运行 (Standalone)](/deploy-standalone)**：无服务器脱机模式，手机内部自建信令与 Web 服务。

### [🎮 四、核心功能操作手册](/feature-dashboard)
* **[监控大盘、预览直控与群控](/feature-dashboard)**：高频 H.264 预览流、WebCodecs 硬件加速、预览直控与多设备批量操作。
* **[多账号、租户权限与操作审计](/feature-users)**：Admin/User 角色、设备按人分配、画质策略锁定与 `admin_logs.json` 审计中心。
* **[机器分享与卡密免登录直连](/feature-share)**：生成带时效的分享链接或 8 位卡密（`CP-XXXX-XXXX`），支持只读防误触。
* **[设备标签管理与大盘过滤](/feature-tags)**：自定义颜色与名称标签，双端同步，大盘毫秒级响应式筛选。
* **[高级输入：汉字输入与按键映射](/feature-inputs)**：100% 汉字落屏、静默双向剪贴板、可视化按键映射编辑器。
* **[远程终端：xterm.js 交互与宏指令](/feature-terminal)**：真交互式 ANSI 命令终端、批量命令并发分发与自定义宏。
* **[P2P 文件管理与 APK 批量分发](/feature-files)**：WebRTC DataChannel 文件双向传输与 APK 静默批量分发。
* **[AI 智能排障诊断助手](/feature-ai)**：接入大模型，通过原生 Function Calling 自动执行排障与诊断。

### [🎯 五、真实环境手把手实操](/tutorial-windows)
* **[实操一：Windows 本地搭建与真机控制](/tutorial-windows)**：Windows 绿色免 Docker 启动、WebUSB 插线一键接入与拔线无线低延迟直控。
* **[实操二：阿里云 ECS 搭建云手机管理平台](/tutorial-aliyun)**：ECS 安全组放行、国内镜像加速拉取 Docker AIO、手机公网挂载与低码率多路并发。

### [⚙️ 六、高级定制与二次开发](/rom-hal)
* **[虚拟 HAL 注入 (Camera/GPS/Sensors)](/rom-hal)**：Camera 9001 (YUV)、GPS 9002 与 Sensors 9003 底层驱动对接规范。
* **[前端控制台二次开发](/dev-web)**：Vue 3 + Vite Proxy 本地热更新联调、组件结构与打包挂载。
* **[官网与文档站构建部署](/dev-website)**：VitePress 本地预览、全站打包构建与 Nginx 边缘部署。

### [🛠️ 七、排障与调优](/faq)
* **[常见问题解答与调优 (FAQ)](/faq)**：连接超时、黑屏、触控失效、横屏错位、声音输出、发热熄屏等常见问题排错清单。

---

> [!NOTE]
> 本文档与项目最新版本持续保持同步更新。如果您在使用或集成过程中发现任何问题，欢迎在 [GitHub Issues](https://github.com/hqw700/ScrcpyOverWebRTC/issues) 反馈。
