# 穿云投屏 (ScrcpyOverWebRTC) 官网项目

本项目是穿云投屏官网和官方帮助文档的源码仓库，采用 **Vite** 构建主站，**Vitepress** 构建官方文档，并在构建后通过自定义脚本自动合并，形成完整的单体静态站点。

---

## 🛠️ 本地开发与调试

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
*   **官网主站开发**:
    ```bash
    npm run dev
    ```
*   **帮助文档开发**:
    ```bash
    npm run docs:dev
    ```

### 3. 本地打包编译
编译出的所有静态产物会存放在 `dist/` 目录下，其中文档会被合并至 `dist/docs/`：
```bash
npm run build
```

---

## 🚀 生产部署架构

为了获得极致的并发性能与高稳定性，目前生产环境采用 **Docker Nginx** 挂载托管，并通过 Cloudflare 进行安全反向代理。

### 1. 服务器环境准备 (已配置)
远程服务器 `ssh web` 上无需安装 Node.js/PM2，已配置一个极简的 Nginx 容器运行于 `8080` 端口：
```bash
# 服务器上运行的容器命令 (已拉起，无需重复执行)
docker run -d --name website-nginx -p 8080:80 -v /root/dist:/usr/share/nginx/html --restart always nginx:alpine
```
*   **服务路径**: 容器实时读取远程宿主机的 `/root/dist` 文件夹作为 Web 根目录。
*   **自动重启**: `--restart always` 确保服务器重启时网站自动恢复运行。

---

## 🔄 快速更新与同步

当你在本地修改代码并调试无误后，可以通过本地的一键同步脚本快速将更新推送到远程生产服务器上。

### 本地一键部署
在本地项目根目录下，直接运行：
```bash
./deploy-web.sh
```

**该脚本的自动化工作流：**
1. 在本地执行 `npm run build`，编译生成最新的静态网站文件。
2. 检查本地 `dist` 目录是否存在。
3. 利用 `rsync` 差分算法将本地 `dist/` 中的变动文件快速同步到服务器的 `/root/dist/`。
4. **即时生效**：因为 Nginx 容器直接挂载了该目录，所有更新瞬间全局生效，**无需重启 Nginx，访问无感知**。

---

## ⚙️ 动态配置免编译更新 (config.json)

为了方便非技术运维人员或者临时紧急更新，我们将经常变化的关键配置（如网盘链接、提取码、发布版本号、Docker指令等）从 HTML 代码中抽离到了独立配置文件中。

### 配置文件路径
*   本地源码路径：`official-website/public/config.json`
*   服务器生产路径：`/root/dist/config.json`

### 配置文件内容
```json
{
  "quarkName": "夸克网盘",
  "quarkLink": "https://pan.quark.cn/s/e83971b8a4df",
  "quarkCode": "免密",
  "latestVersion": "v0.3.5 (App v0.3.2)",
  "appVersion": "v0.3.2",
  "magiskVersion": "v0.3.5",
  "platformVersion": "v0.3.5",
  "appApkLink": "https://pan.quark.cn/s/5bc91448b37e",
  "magiskModuleLink": "https://pan.quark.cn/s/b6ae48cb2d21",
  "platformZipLink": "https://pan.quark.cn/s/e83971b8a4df",
  "dockerPullCmd": "docker pull buutuu/scrcpy-over-webrtc:latest",
  "updateTime": "2026-09-05"
}
```

### 如何免编译秒级热更新？

如果你只想修改下载地址、提取码或发布版本等信息，**你可以完全不修改 HTML 代码、也无需运行打包命令**，采用以下任一方式：

*   **方法一：直接在服务器上修改 (推荐)**
    直接 SSH 登录你的服务器，编辑对应的 JSON 文件：
    ```bash
    vi /root/dist/config.json
    ```
    修改相关字段并保存后，**刷新官网主页即可实时渲染生效**。
*   **方法二：在本地修改并同步**
    修改本地的 `public/config.json` 后，在本地终端直接运行 `./deploy-web.sh` 推送覆盖。
