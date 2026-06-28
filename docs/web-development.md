# 前端控制台二次开发指南

ScrcpyOverWebRTC 的前端控制台（`web-app`）基于 **Vue 3 + Vite + Pinia** 构建。
前端完全开源，支持开发人员对大盘布局、连接设置、Web-ADB 命令行交互以及可视化改键编辑器等模块进行二次开发与高度定制。

---

## 🛠️ 1. 本地环境起步

在开始开发前，请确保您的开发机已配置 Node.js 18+ 或 20+ 运行环境：

1. **克隆开源项目并进入前端目录**：
   ```bash
   git clone https://github.com/hqw700/ScrcpyOverWebRTC.git
   cd ScrcpyOverWebRTC/web-app
   ```
2. **安装物理依赖**：
   ```bash
   npm install
   ```
   > [!IMPORTANT]
   > 如果您刚克隆完仓库直接运行 `npm run build` 或 `npm run dev`，会由于缺少依赖抛出 `vite: command not found` 错误。请务必先执行 `npm install` 完整下载前端依赖库。

---

## 🔌 2. 核心：本地开发联调与代理配置 (Vite Proxy)

在二次开发写代码时，为了体验**热更新 (HMR)** 效果，不需要每次修改代码都执行 `build` 并推送到远端服务器上。我们可以使用 Vite 内置的代理功能，将本地 `localhost:5173` 的请求转发给正在运行的容器或服务器：

1. **准备真实的信令服务端 IP**：
   * 确保您的云服务器、局域网物理机或 Docker AIO 容器中的信令服务（`webrtc-signaling`）已启动，且其局域网/公网 IP 已知（假设为 `192.168.1.100`）。
2. **传入环境变量启动热更新**：
   在启动本地 Vite 开发服务器时，附加 `VITE_PROXY_TARGET` 变量指向您的信令服务器地址：
   * **Linux / macOS**:
     ```bash
     VITE_PROXY_TARGET=http://192.168.1.100:8443 npm run dev
     ```
   * **Windows PowerShell**:
     ```powershell
     $env:VITE_PROXY_TARGET="http://192.168.1.100:8443"; npm run dev
     ```
3. **热更新调试**：
   * 终端会输出本地开发地址（如 `http://localhost:5173/`）。
   * 在浏览器中访问此开发地址。此时，您修改本地的 Vue 组件或 CSS，浏览器画面会瞬时同步渲染更新，且 WebRTC 媒体推流和触控仍能完美与远端云手机交互。

---

## 📁 3. 前端核心源码架构索引

方便开发者快速定位到核心功能代码进行重写与扩展：

| 组件 / 文件路径 | 核心负责功能 | 核心逻辑点 |
| :--- | :--- | :--- |
| **[`views/DeviceList.vue`](file:///Volumes/m2/code/cloudphone/webrtc-operator/web-app/src/views/DeviceList.vue)** | 管理矩阵大盘主界面 | 负责大盘平铺视图、设备搜索、缩略图大小滑块调优以及 USB / WebUSB 快速部署引导。 |
| **[`components/DeviceConsole.vue`](file:///Volumes/m2/code/cloudphone/webrtc-operator/web-app/src/components/DeviceConsole.vue)** | 虚拟机单机控制台面板 | 负责右侧滑出抽屉的布局，内嵌了视频推流 `<video>` 视轨、按键操作悬浮 FAB 以及 adb-xterm.js 命令行终端。 |
| **[`composables/useWebRTC.js`](file:///Volumes/m2/code/cloudphone/webrtc-operator/web-app/src/composables/useWebRTC.js)** | WebRTC 连接与媒体流管理 | 负责 SDP 媒体协商、时钟透传配置、触控事件转化、双通道心跳保活与连接重试流程。 |
| **[`components/KeymapEditor.vue`](file:///Volumes/m2/code/cloudphone/webrtc-operator/web-app/src/components/KeymapEditor.vue)** | 可视化改键编辑器覆盖层 | 负责拖拽式虚拟键位创建、绑定键盘物理事件、Joystick 摇杆参数配置以及 localStorage 配置存档。 |
| **[`stores/keymap.js`](file:///Volumes/m2/code/cloudphone/webrtc-operator/web-app/src/stores/keymap.js)** | Pinia 按键数据状态机 | 负责按键方案的 Profiles 导出、导入、切换以及运行态下的防边界抖动防黑边处理。 |

---

## 📦 4. 生产环境构建与发布

当您在本地开发联调完毕后，可以通过以下指令编译生成生产打包产物：

1. **打包编译**：
   ```bash
   npm run build
   ```
   * 编译产物默认将输出在 `web-app/dist/` 文件夹下。
2. **部署产物上线**：
   * **方式 A (覆盖物理服务器资产)**：将该文件夹下的所有静态文件拷贝到您 `webrtc-signaling` 信令服务器所指定的静态托管 assets 目录（默认为服务器同级 `assets/` 路径）中进行覆盖，然后重启信令服务。
   * **方式 B (挂载入官方 Docker 容器验证)**：
     如果您想直接在容器环境中测试打包后的前端页面，可以在运行官方镜像时使用 `-v` 参数，将本地打包出的网页文件（主项目的整个 `assets/` 目录）强行挂载进容器内覆盖：
     ```bash
     docker run -d --name cp-dev-test \
       -p 8443:8443 \
       -p 3478:3478/tcp \
       -p 3478:3478/udp \
       -p 55000-55100:55000-55100/udp \
       -e PUBLIC_IP=<宿主机IP> \
       -v /absolute/path/to/ScrcpyOverWebRTC/assets:/app/assets \
       buutuu/scrcpy-over-webrtc:latest
     ```

### 💡 自动补全软链接机制 (二次开发防覆盖)
在二次开发时，您本地打包出的前端目录（`assets/`）中默认是**不含有**庞大的设备端 Agent 二进制文件及一键部署包的（即不存在 `assets/agent/` 目录）。直接将本地目录挂载进容器，会导致容器中原本内置的 `agent-deploy.zip` 下载文件被挂载操作物理覆盖，造成页面上点击“下载一键部署包”时报 404 错误。

**我们已在 Docker 的启动入口脚本 `entrypoint.sh` 中集成了安全兜底与自动嫁接逻辑**：
* 容器启动时，会自动检测挂载的 `/app/assets/agent/` 文件夹是否为空。
* 若为空，它将自动在挂载区生成对应的符号链接（软链接），指向容器内部备份的 `/app/agent_binaries` 二进制源文件夹。
* **效果**：瞬间恢复 `/agent/agent-deploy.zip` 极速入网包的下载通路，实现二次开发后的挂载页面 100% 开箱即用，免去开发者手动拷贝配置的麻烦。
