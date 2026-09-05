# 官网与文档站构建部署指南 (Website & Docs)

本指南介绍 ScrcpyOverWebRTC **官网主站与 VitePress 帮助文档系统**（即本工程 `official-website/`）的本地开发调试、全站编译合并与生产环境 Nginx 部署流程。

---

## 🛠️ 1. 本地环境起步

进入项目 `official-website/` 根目录：

```bash
cd official-website
npm install
```

### 启动本地开发服务：
- **官网主页热更新调试**：
  ```bash
  npm run dev
  ```
  在 `http://localhost:5173` 实时预览官网主页动效与排版。
- **帮助文档热更新调试**：
  ```bash
  npm run docs:dev
  ```
  在本地浏览器实时预览 VitePress 文档编写与 Mermaid 渲染效果。

---

## 📦 2. 静态全站编译打包

执行全站打包命令，将官网主页与文档站合并编译至最终的 `dist/` 生产目录中：

```bash
npm run build
```

打包产物目录结构：
```text
dist/
├── index.html          # 官网主页
├── apply.html          # 申请试用页
├── config.json         # 动态配置文件
├── assets/             # 主站静态资源
└── docs/               # VitePress 静态文档站产物
```

---

## 🚀 3. 生产环境 Docker Nginx 部署

生产环境采用容器化 Nginx 提供高性能静态资源分发：

```bash
docker run -d \
  --name website-nginx \
  -p 8080:80 \
  -v /data/website/dist:/usr/share/nginx/html \
  --restart always \
  nginx:alpine
```

---

## ⚙️ 4. 动态配置免编译更新 (`config.json`)

为了避免每次更新下载链接、版本号或网盘地址都需要重新执行前端打包，官网主站设计了动态异步渲染机制：

### 配置文件路径：
- 本地源码：`official-website/public/config.json`
- 生产环境：`/data/website/dist/config.json`

### 字段示例：
```json
{
  "latestVersion": "v0.3.5 (App v0.3.2)",
  "appVersion": "v0.3.2",
  "magiskVersion": "v0.3.5",
  "platformVersion": "v0.3.5",
  "appApkLink": "https://pan.quark.cn/s/...",
  "magiskModuleLink": "https://pan.quark.cn/s/...",
  "dockerPullCmd": "docker pull buutuu/scrcpy-over-webrtc:latest",
  "updateTime": "2026-09-05"
}
```

> 💡 **免编译即时生效**：只需直接在服务器上编辑该 JSON 文件，用户刷新官网即可立即看到最新下载链接和版本号，无需重新打包构建。
