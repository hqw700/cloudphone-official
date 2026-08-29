# 实操二：阿里云 ECS 搭建云手机管理平台 (Aliyun ECS Tutorial)

本教程以高性价比的 **阿里云 ECS (2 核 CPU / 2GB 内存 / 3Mbps 固定带宽)** 为例，带领您手把手完成从云服务器安全组放行、国内镜像加速拉取 Docker AIO 到跨公网纳管真机与低带宽多路并发操控的完整全流程。

---

## 🎯 实操目标与准备

* **目标**：在公网云服务器上搭建 ScrcpyOverWebRTC 中心，跨公网接入真机，实现大盘巡检与多并发低延迟直控；
* **环境准备**：
  1. 阿里云 ECS 一台（推荐 Ubuntu 22.04 / Debian 11 / Alibaba Cloud Linux 3）；
  2. 已安装 Docker 环境（若未安装可执行 `curl -fsSL https://get.docker.com | bash`）；
  3. 待接入的 Android 手机一部或 Redroid 容器；
  4. 电脑浏览器（Chrome / Edge）。

---

## 🔐 第一步：阿里云安全组端口放行

登录 [阿里云 ECS 管理控制台](https://ecs.console.aliyun.com/)，在当前实例的 **「安全组」➔「入方向规则」** 中添加以下三条放行策略：

| 授权策略 | 协议类型 | 端口范围 | 授权对象 | 描述 |
| :--- | :--- | :--- | :--- | :--- |
| **允许** | `TCP` | `8443` | `0.0.0.0/0` | Web 管理控制台与信令端口 |
| **允许** | `TCP+UDP` | `3478` | `0.0.0.0/0` | coturn STUN/TURN 中继监听端口 |
| **允许** | `UDP` | `50000/50100` | `0.0.0.0/0` | TURN 媒体流中转 UDP 端口段 (必开) |

> [!WARNING]
> 若未放行 `50000/50100` 的 UDP 端口，当手机与控制端处于严格对称 NAT 无法 P2P 直连时，媒体中继受阻会导致画面黑屏。

---

## 🐳 第二步：国内镜像站极速拉取并启动容器

SSH 连接登录您的阿里云 ECS，执行以下命令：

```bash
# 1. 使用国内加速镜像站快速下载镜像
docker pull m.daocloud.io/docker.io/buutuu/scrcpy-over-webrtc:latest

# 2. 重新打标为标准镜像名
docker tag m.daocloud.io/docker.io/buutuu/scrcpy-over-webrtc:latest buutuu/scrcpy-over-webrtc:latest

# 3. 以 Host 模式启动容器 (将 PUBLIC_IP 替换为您 ECS 的真实公网 IP)
docker run -d \
  --restart=always \
  --name cp-aio \
  --net=host \
  -v ./data:/app/data \
  -e PUBLIC_IP=<您的阿里云ECS公网IP> \
  -e TURN_USER=admin \
  -e TURN_PASSWORD=MySecurePassword123 \
  buutuu/scrcpy-over-webrtc:latest
```

查看容器状态：
```bash
docker ps
```
显示 `cp-aio` 处于 `Up` 状态即表示启动成功！

---

## 🌐 第三步：公网访问 Web 大盘

1. 在任意电脑或手机浏览器中打开：
   ```text
   https://<您的ECS公网IP>:8443
   ```
2. 浏览器提示“证书不受信任”，点击 **“高级” ➔ “继续前往”**。
3. 输入初始管理员账号登录：
   - **用户名**：`admin`
   - **密码**：`admin123`

---

## 📱 第四步：将 Android 手机接入公网云服务器

### 方式 A：电脑脚本一键包接入 (最常用)
1. 在大盘右上角点击 **“一键部署” ➔ “下载电脑一键部署包”**；
2. 手机插上电脑开启 USB 调试，运行一键部署脚本；
3. 拔掉数据线，手机即自动向公网阿里云服务器注册上线！

### 方式 B：Magisk 模块开机自启 (长期在线推荐)
在已 Root 手机的终端中执行：
```bash
su
cpctl set CP_AGENT_SIGNALING "wss://<您的ECS公网IP>:8443"
cpctl set CP_AGENT_ICE_SERVERS '["turn:admin:MySecurePassword123@<您的ECS公网IP>:3478?transport=udp","stun:<您的ECS公网IP>:3478"]'
cpctl restart
```

---

## ⚡ 第五步：调优码率，实现 2~4 人公网低带宽流畅并发

在 3Mbps 固定带宽下：
1. 点击已接入设备的画面卡片进入控制界面；
2. 在右侧工具栏打开 **「设置」➔「视频」**；
3. 将 **视频码率** 设为 **`0.3 Mbps` (300 kbps)**，编码格式保持 Baseline Profile；
4. **效果**：在 3Mbps 固定带宽下，支持 **2~4 个用户同时打开不同设备进行远程操作**，流畅不卡顿，且延迟保持在 50ms~80ms 极佳水平！
