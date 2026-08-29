# 前端控制台二次开发指南 (Web Frontend Dev)

ScrcpyOverWebRTC 的前端控制台（位于源码仓库中的 `webrtc-operator/web-app/`）基于 **Vue 3 + Vite + Pinia** 构建。  
前端完全开源，支持二次开发人员根据自身业务定制大盘布局、自定义品牌 Logo 与 UI 主题、扩展交互控制以及集成自研系统。

---

## 🛠️ 1. 本地开发环境准备

确保本地已安装 Node.js 18+ 或 20+ 环境：

```bash
# 1. 克隆开源仓库并进入前端工程目录
git clone https://github.com/hqw700/ScrcpyOverWebRTC.git
cd ScrcpyOverWebRTC/webrtc-operator/web-app

# 2. 安装前端物理依赖
npm install
```

---

## 🔌 2. 核心技巧：使用 Vite Proxy 本地热联调

在二次开发写代码时，为了享受 **Vite 毫秒级热更新 (HMR)** 体验，无需每次修改代码都执行打包部署。可以使用 Vite 内置的代理机制将本地请求直接转发给正在运行的信令服务器：

### 启动命令：

#### Linux / macOS：
```bash
VITE_PROXY_TARGET=http://192.168.1.100:8443 npm run dev
```

#### Windows PowerShell：
```powershell
$env:VITE_PROXY_TARGET="http://192.168.1.100:8443"; npm run dev
```

### 调试体验：
- 浏览器打开本地地址 `http://localhost:5173/`；
- 修改任意 Vue 组件或 CSS，浏览器即时响应热更新，同时 WebRTC 媒体推流与触控指令仍可正常与远端云手机交互。

---

## 📁 3. 前端核心源码结构索引

| 文件路径 | 负责功能 | 关键业务逻辑 |
| :--- | :--- | :--- |
| **`src/views/DeviceList.vue`** | 设备列表与接入主页 | 负责平铺大盘渲染、搜索过滤、快速接入弹窗与 WebUSB 网页一键部署引导 |
| **`src/components/DeviceConsole.vue`** | 云手机直控控制台 | 包含右侧直控抽屉、WebRTC 画面视轨、控制栏悬浮按钮、交互 Shell 终端与按键映射入口 |
| **`src/composables/useWebRTC.js`** | WebRTC 核心通信与出流 | 负责 SDP/ICE 协商、HW-PTS 时钟配置、多点触控与按键事件打包、断线重连 |
| **`src/components/KeymapEditor.vue`** | 可视化按键映射编辑器 | 负责虚拟按键拖拽定位、实体键绑定、Joystick 轮盘配置与本地 localStorage 方案存档 |
| **`src/components/UserDetailDrawer.vue`** | 管理员一站式全景抽屉 | 集中负责用户基本信息、密码修改、设备批量分配、画质强制锁定与一键强退占用 |
| **`src/views/ShareView.vue`** | 外部访客免登直控页 | 专为机器分享与卡密免登录打造的独立轻量播放器 |

---

## 📦 4. 生产环境构建与上线

### 1. 编译打包：
```bash
npm run build
```
打包产物将输出在 `webrtc-operator/web-app/dist/` 文件夹下。

### 2. 覆盖发布：
- **物理机部署**：将 `dist/` 下的所有静态文件拷贝至信令服务器指定的 `assets/` 静态目录，重启信令服务即可。
- **Docker 部署**：通过 `-v` 将本地打包生成的静态目录挂载到容器的 `/app/assets` 中。
