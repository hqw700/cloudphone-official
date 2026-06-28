# ScrcpyOverWebRTC (CloudPhone) 官方指南与帮助文档

欢迎使用 ScrcpyOverWebRTC 官方开发者指南。本指南由项目核心维护团队编写，旨在帮助您快速启动、编译及将云手机项目集成至商业环境中。

---

## 📖 指南导航

### [🚀 快速开始](/introduction)
- **[项目简介 & 架构优势](/introduction)**：深入了解三通道隔离（控制、触控、视频）以及硬件级 PTS 时间轴透传原理。
- **[极速运行与入网指南](/quickstart)**：只需三步，利用 Docker 一体化镜像和一键部署包快速接入云手机。

### [💻 服务端部署](/deploy-lan)
- **[内网与局域网部署](/deploy-lan)**：本地交叉编译环境搭建与本地部署指南。
- **[飞牛 OS (fnOS) NAS 部署](/deploy-fnos)**：针对飞牛 OS (fnOS) 的图形化 Docker 极速部署指引。
- **[iStoreOS 软路由部署](/deploy-istoreos)**：针对 iStoreOS 软路由系统的 Docker 部署与防火墙规则放行说明。
- **[云服务器部署与穿透](/deploy-cloud)**：解决 NAT 端口受阻、TURN 服务器设置、IPv6 直连与 UPnP 自动端口开门。
- **[Android 独立运行生态](/deploy-standalone)**：将整个信令服务器、Web 界面托管至 Android 设备内部运行。

### [📱 设备接入与 Agent 配置](/agent-deploy)
- **[真机与容器 Agent 部署](/agent-deploy)**：物理手机 USB 调试开启、Docker 内 `redroid` 容器的端口段多开多控管理、Root 权限免 ADB 运行及 WebUSB 网页一键直连原理。

### [⚙️ 高级特性与深度定制](/rom-custom)
- **[虚拟相机与定制 ROM 方案](/rom-custom)**：虚拟摄像头驱动注入、定制 ROM 内 GPS 位置透传与传感器物理上报机制。
- **[按键映射与群控高级应用](/keymap-advanced)**：可视化编辑器改键规范（joystick/tap/swipe）以及多端大盘同步群控架构设计。

### [💻 开发者二次开发](/web-development)
- **[前端控制台二次开发](/web-development)**：基于 Vite Proxy 的本地热更新调试配置及前端核心源码架构索引。

### [🛠️ 高级配置与常见问题](/faq)
- **[常见问题排查 (FAQ)](/faq)**：首触卡顿、浏览器 Jitter Buffer 积压延迟如何排查、硬编忽略 I 帧问题排障手段。

---

> [!NOTE]
> 文档在 GitHub 实时更新，若您在部署中遇到问题，欢迎向社区提交 Issue 反馈。
