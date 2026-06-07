# Agent 部署 (Redroid & 真机)

Android Agent 负责生命周期的按需启停、三通道 UDS 隔离监听、以及控制指令的多点触控协议转化。CloudPhone 支持在 Docker 容器虚拟机（redroid）和 Android 物理真机上部署 Agent。

---

## 🐋 方案一：Docker redroid 容器化部署

redroid (Remote Android) 是一个高性能的容器化 Android 方案。非常适用于在云服务器上批量多开虚机。

### 1. 运行 redroid 容器实例

确保您的 Linux 宿主机已经正确加载了 `binder` 和 `ashmem` 驱动。以 Android 11 为例启动实例：

```bash
docker run -d --rm --privileged \
  --name cloudphone-redroid-1 \
  -p 5555:5555 \
  redroid/redroid:11.0.0-latest \
  androidboot.redroid.width=720 \
  androidboot.redroid.height=1280 \
  androidboot.redroid.gpu.mode=guest
```

### 2. 绑定运行 Agent
因为运行在 Docker 隔离网卡中，Agent 无法直连外部路由器。需要开启单端口 UDP 绑定（`-webrtc-port`）和外网 IP 强制指定参数：

```bash
cd agentd

# 将 192.168.1.100 替换为宿主机实际 IP，webrtc-port 设为 50000 并映射出容器
./run.sh -id redroid-phone-01 \
  -signaling ws://192.168.1.100:8443 \
  -external-addr "192.168.1.100" \
  -webrtc-port 50000
```

---

## 📱 方案二：物理真机 WebUSB 免驱一键推送

CloudPhone 内置了领先的 **WebUSB** 浏览器直连驱动，让您在无需配置本地 ADB 和驱动的情况下，插上 USB 数据线就能直接在网页上一键部署物理真机。

### 1. 推送与部署步骤

1. 在电脑上打开 Chrome / Edge 浏览器，登录云手机管理后台。
2. 点击仪表盘右上角的 **“部署新设备”**。
3. 点击弹窗中的“查找 USB 设备”按钮。
4. 浏览器会弹出一个原生的物理接口选择栏，选择您的手机（例如 *Xiaomi 12 / OnePlus 10*），点击连接。
5. 建立 WebUSB 通道后，系统会自动解析目标设备的 CPU 架构（`arm64-v8a` 或 `x86_64`），向手机 `/data/local/tmp` 推送编译好的 agent 和 scrcpy-server 二进制，并拉起服务。

> [!NOTE]
> 部署流程是 100% 幂等的。如果 Agent 进程意外退出，您可以随时再次插上数据线，在网页端点击“一键修复/重部署”，系统会自动清理脏数据并完美拉起服务。

### 2. 离线防断开保护
WebUSB 一键推送脚本在启动 Agent 进程时，采用了如下脱离机制：

```bash
# 自动通过 setsid nohup 脱离当前控制端终端
setsid nohup ./cloudphone-agent -signaling ws://... > /dev/null 2>&1 &
```

即使部署完成拔掉 USB 物理数据线，手机内部的 Agent 也会在后台独立、持久地运行。
