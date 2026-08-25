# 官网部署与动态更新说明

为了提供极致的加载性能和全天候稳定性，穿云投屏的**官网主站与帮助文档系统**已完成生产环境部署架构升级。目前抛弃了传统的 PM2 + Node 静态服务方案，升级为以 **Docker Nginx** 作为基础服务器，并配合 **Cloudflare** 作为边缘反代的方案。

---

## 🛠️ 1. 本地环境起步

在修改官网主站或文档内容时，可以在本地进行热更新开发调试：

### 1.1 安装依赖
在项目根目录 `official-website/` 下执行：
```bash
npm install
```

### 1.2 启动开发服务器
*   **官网主页开发调试**:
    ```bash
    npm run dev
    ```
    主页为基于原生 HTML/JS/CSS 构建的动效响应式主站，启动后可在 `http://localhost:5173` 实时预览。
*   **帮助文档开发调试**:
    ```bash
    npm run docs:dev
    ```
    文档为基于 Vitepress 构建的静态站点。启动后可通过命令行提示的端口独立预览文档的编写排版效果。

### 1.3 本地打包编译
静态编译主站及文档，并将它们深度合并至最终的 `dist/` 部署目录下：
```bash
npm run build
```

---

## 🚀 2. 生产部署架构

我们采用了容器化 Nginx 对外提供静态资源服务，确保服务能长期稳定运行。

### 2.1 服务器环境配置 (Docker Nginx)
我们在远程 `ssh web` 服务器上拉起了一个常驻的、资源消耗极低的 Nginx 容器：
```bash
# 服务器运行命令 (已配置好，无需重复执行)
docker run -d \
  --name website-nginx \
  -p 8080:80 \
  -v /root/dist:/usr/share/nginx/html \
  --restart always \
  nginx:alpine
```
*   **挂载点映射**: 容器内的网页根目录被强行挂载映射到了宿主机上的 `/root/dist` 文件夹下。
*   **开机自启**: `--restart always` 参数能够确保当本地物理服务器在发生断电重启、系统宕机等意外事件后，Docker 会自动在系统重新拉起时复活该 Nginx 容器。

---

## 🔄 3. 一键同步部署工作流

在本地将代码修改并验证无误后，无需先登录 SSH 终端再用 Git 拉取。我们编写了自动编译和差分传输脚本。

### 本地一键更新
在本地电脑的项目根目录 `official-website/` 下，直接执行：
```bash
./deploy-web.sh
```

**该脚本的后台自动化处理流：**
1. **自动构建**: 自动在本地调起 Node 引擎执行 `npm run build` 生成最新的静态资源。
2. **安全核验**: 检测本地 `dist/` 目录的存在性与完备性。
3. **差分同步**: 调起本地 `rsync` 命令，通过 SSH 隧道计算变动部分，**仅将有差异的变动文件增量推送到服务器的 `/root/dist/` 下**。
4. **实时渲染**: 传输完毕后无需做任何服务重启动作，Nginx 在接收到最新的文件读写请求时会自动读取最新文件，全球更新在 **1~2 秒内**瞬间热生效。

---

## ⚙️ 4. 动态配置免编译更新 (config.json)

为了使网盘链接、最新版本信息和镜像拉取指令的更新更加快速和防错，我们设计了动态异步渲染逻辑，将这部分易变配置进行了抽离。

### 配置文件位置
*   **本地源码路径**: `official-website/public/config.json`
*   **服务器环境路径**: `/root/dist/config.json`

### 配置文件内容结构
```json
{
  "quarkName": "夸克网盘",
  "quarkLink": "https://pan.quark.cn/s/18d37ca38717",
  "quarkCode": "免密",
  "latestVersion": "v0.3.3 (App v0.3.2)",
  "appVersion": "v0.3.2",
  "magiskVersion": "v0.3.3",
  "platformVersion": "v0.3.3",
  "appApkLink": "https://pan.quark.cn/s/5bc91448b37e",
  "magiskModuleLink": "https://pan.quark.cn/s/071eb552381c",
  "platformZipLink": "https://pan.quark.cn/s/18d37ca38717",
  "dockerPullCmd": "docker pull buutuu/scrcpy-over-webrtc:latest",
  "updateTime": "2026-08-09"
}
```

### 💡 如何在不编译、不重新打包的情况下瞬间修改信息？

当网盘下载地址变动、或者发布了新镜像，你不必重新运行前端的打包和同步流程。可采用以下任一手段：

*   **手段 A：直接在远程服务器上快速修改 (极速推荐)**
    直接 SSH 登录你的物理服务器后台，直接编辑已经被 Nginx 服务渲染的配置文件：
    ```bash
    vi /root/dist/config.json
    ```
    修改完字段保存后，**用户端刷新官网页面即可看见数据已成功渲染，无需本地重新构建同步。**
*   **手段 B：本地配置同步**
    修改本地源码中的 `public/config.json` 文件后，直接执行 `./deploy-web.sh`，仅更新同步这个配置文件至服务器。
