# 设备接入与 Agent 部署总览

本文档为设备接入的统一导航页。ScrcpyOverWebRTC 支持物理真机、Root 设备、未 Root 设备、Docker Redroid 容器以及 Android App 双端等多种设备形态接入。

请根据您的设备与运行环境选择对应的详细指南：

---

## 🧭 接入方式全景选型

| 接入方式 | 适用场景 | 依赖条件 | 推荐指南 |
| :--- | :--- | :--- | :--- |
| **方式一：网页端 WebUSB 部署** | 物理手机小白首选 | Chrome / Edge 浏览器，USB 数据线 | [查看 WebUSB 部署指南](/agent-webusb) |
| **方式二：电脑脚本一键包接入** | 开发者、内网调试、无线 ADB | 电脑具备 ADB 环境（USB 或 Wi-Fi） | [查看电脑脚本一键包指南](/agent-script) |
| **方式三：Magisk 模块开机自启** | 已 Root 真机长期无人值守群控 | 设备具备 Magisk / KernelSU / APatch | [查看 Magisk 模块部署指南](/agent-magisk) |
| **方式四：Android App 原生客户端** | 手机直接作为主控端或被控端 | Android 手机（支持 Root 或 Shizuku 免 Root） | [查看 Android App 使用指南](/app-guide) |
| **方式五：Docker / Redroid 容器云手机** | Linux 云服务器批量多开云手机 | 宿主机支持 KVM 虚拟化与 Docker | [查看 Redroid 容器多开指南](/agent-docker) |
| **方式六：自定义 ROM / Redroid 镜像集成** | 定制固件底座、免推送开机自启 | 支持 Android 源码编译或 Dockerfile 定制 | 🚀 后续发布 |
| **方式七：Linux Host Agent 宿主机管理** | Linux 物理机统一管理所有虚机与开关机 | Linux 宿主机物理服务器 / 独立主机 | 🚀 后续发布 |

---

> 💡 首次接入前，请务必先查阅 [设备接入准备与开发者选项](/agent-prep) 完成 USB 调试与国产手机安全权限配置。
