# CloudPhone 官方指南与帮助文档

欢迎使用 CloudPhone 官方开发者指南。本指南由项目核心维护团队编写，旨在帮助您快速启动、编译及将云手机项目集成至商业环境中。

---

## 📖 指南导航

### [🚀 快速开始](/introduction)
- **[项目简介 & 架构优势](/introduction)**：深入了解 HW-PTS 帧透传与三通道隔离的核心机制。
- **[极速运行指南](/quickstart)**：只需三步，即可在本地和真机运行起体验版。

### [💻 服务端部署](/deps-and-build)
- **[依赖安装与服务编译](/deps-and-build)**：配置公网 Coturn 服务端安全规范，并使用 Go 交叉编译信令服务器与 WebRTC 桥接组件。

### [📱 Agent 安装与推送](/agent-deploy)
- **[Agent 部署 (Redroid & 真机)](/agent-deploy)**：通过 Docker 多开 redroid 安卓 12 虚机集群，或使用 WebUSB 浏览器一键免驱动推送物理真机。

### [🛠️ 高级配置与常见问题](/keymap-advanced)
- **[自定义按键映射规范](/keymap-advanced)**：掌握游戏级 Tap、Joystick 及 Swipe 映射的 JSON 规范与坐标转换算法。
- **[常见问题排查 (FAQ)](/faq)**：解决黑屏超时、触控漂移偏移及音频积压等常见排障手段。

---

> [!NOTE]
> 文档在 GitHub 实时更新，若您在部署中遇到问题，欢迎向社区提交 Issue 反馈。
