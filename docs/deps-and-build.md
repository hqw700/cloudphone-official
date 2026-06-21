# 依赖安装与服务编译指南

本章节介绍如何获取 ScrcpyOverWebRTC 的服务端源码/程序包，并进行依赖安装与服务编译。

---

## 🚀 获取服务端代码的两种方式

根据您的开发与体验需求，您可以选择下载开箱即用的预编译完整包，或通过克隆 GitHub 开源仓库进行手动编译。

### 选项 A：从 GitHub Releases 下载预编译完整包（最简单，推荐）

1. 打开浏览器，访问项目发布页面：[GitHub Releases v0.2.2](https://github.com/hqw700/ScrcpyOverWebRTC/releases/tag/v0.2.2)。
2. 下载对应您系统架构的预编译压缩包（例如 Windows/Linux/macOS 平台归档包）。
3. 解压下载的压缩包。
4. **无需额外编译**：预编译完整包中已内置构建完毕的 Web 前端静态资源（位于 `assets/` 目录）和各平台的服务器二进制程序，您可以直接启动运行。

---

### 选项 B：克隆 Git 仓库源码并手动编译

如果您需要定制开发、体验最新提交的代码，或者想要自行编译服务，请遵循以下流程。

#### 1. 克隆代码库
```bash
git clone https://github.com/hqw700/ScrcpyOverWebRTC.git
cd ScrcpyOverWebRTC
```

#### 2. 编译 Web 前端静态资源 (必须)
信令服务器在运行时需要托管 Web 控制后台页面。在首次运行或修改了前端代码后，您必须手动编译前端工程。

**环境要求**：本地已安装 **Node.js**（推荐使用 v18 或以上版本，带有 `npm`）。

您可以使用项目根目录下提供的快速构建脚本进行一键自动安装依赖并构建：
* **macOS / Linux 平台**：
  ```bash
  chmod +x build.sh
  ./build.sh
  ```
* **Windows 平台**：
  双击运行 `build.bat` 脚本，或在终端（CMD / PowerShell）中运行：
  ```cmd
  build.bat
  ```

*构建完成后，前端静态文件将被自动编译、收集并输出至中央静态资源目录 `assets/` 中。*
