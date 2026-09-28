# 方式五：Docker / Redroid 容器云手机 (Container Setup)

如果您在云服务器或本地 Linux 服务器上通过 Docker 运行 **`redroid` (Remote Android in Docker)** 搭建云手机集群，可以通过本文档将多台 Redroid 虚机开箱自启挂载至 ScrcpyOverWebRTC 管理平台。

> [!TIP]
> **发布包内置极简 AIO 套件**：最新发布包已内置 `redroid/` 极简构建套件（体积仅 36 KB），支持 **1 秒免编译生成 AIO 镜像**，容器开机自启上线，多开自动基于网卡 MAC 地址后 4 位防重名冲突！

---

## 📋 关键网络特性：容器网络与连接选型

> [!WARNING]
> **重要前置概念：Docker 容器默认处于 IPv4 内部网桥中！**  
> 物理手机在移动 4G/5G 网络下通常具备公网 IPv6 地址，可以实现零成本直连；但 **Docker Redroid 容器默认处于 IPv4 Bridge 网桥中，无法直接获取宿主机公网 IPv6 地址**。  
> 
> 因此，容器云手机建议在以下两种网络方案中按需选择：
> * **方案 A (中转模式 - 推荐首选)**：在 Agent 配置文件中配置 TURN 中转服务（`CP_AGENT_ICE_SERVERS`），由 coturn 自动完成全网络穿透与中继，无需为每个容器配置复杂的端口映射；
> * **方案 B (直连模式)**：为每个容器映射独立的 UDP 端口，并在启动时显式指定 **`-external-addr <宿主机IP>`** 与 **`-webrtc-port <指定UDP端口>`**。

> [!CAUTION]
> **切勿在特权模式下使用 `--net=host`！**  
> Android `netd` 启动时会删除宿主机 `lookup main` 主路由表并强行下发防火墙丢包规则，导致宿主机全局网络被破坏。**必须使用标准 Docker Bridge 模式。**

---

## ⚡ 部署方法一：使用 AIO 一体化镜像 (强烈推荐首选 ⭐️⭐️⭐️)

无需下载编译数百 GB 的 AOSP 源码，发布包中已内置 `redroid/` 极简套件，**1 秒内打出内置自启 Agent 的开箱即用镜像**。

```text
cloudphone-vX.Y.Z/
├── agentd/                      # 集中化 Agent 二进制目录
│   ├── cloudphone-agent-amd64
│   ├── cloudphone-agent-arm64
│   └── libsys_core.so
└── redroid/                     # Redroid 极简 AIO 构建套件 (仅 36 KB)
    ├── Dockerfile               # 镜像构建定义
    ├── build_aio.sh             # 一键构建脚本 (自动借用二进制并在构建后自动清理)
    ├── cloudphone.conf.example  # 配置文件模板
    └── README.md                # 专属中文说明
```

### 步骤 1：准备宿主机环境 (Loop 节点预分配)
Android 14/15 的 APEX 模块对 Loop 设备消耗较大，单个容器需挂载 20~30 个节点。多开容器前请在宿主机执行一次性预分配（防止第 2 台容器秒退 Exit Code 129）：
```bash
sudo bash -c 'for i in $(seq 8 255); do [ ! -e /dev/loop$i ] && mknod -m 660 /dev/loop$i b 7 $i; done'
```

### 步骤 2：编辑配置文件
进入发布包解压后的 `redroid/` 目录，复制模板并填入你的信令服务器与 STUN/TURN 地址：
```bash
cd redroid/
cp cloudphone.conf.example cloudphone.conf
vim cloudphone.conf
```
*示例配置：*
```ini
# 信令服务器地址 (支持 wss:// 或 ws://)
CP_AGENT_SIGNALING="wss://192.168.100.241:8443"

# TURN/STUN 服务器 (彻底不受 Android 92 字节限制)
CP_AGENT_ICE_SERVERS="turn:test:test123@192.168.5.178:3478?transport=udp,stun:192.168.5.178:3478"
```

### 步骤 3：执行一键构建
```bash
# 语法: ./build_aio.sh [基础镜像名 或 本地已有镜像 或 离线tar包] [配置文件] [目标镜像Tag]
./build_aio.sh redroid/redroid:13.0.0-latest cloudphone.conf cloudphone-aio:13.0
```
> **智能自适应特性**：
> - **官方镜像**：传入 `redroid/redroid:13.0.0-latest`，自动拉取并注入；
> - **本地已有镜像**：传入本地已安装镜像（如 `my-redroid:15`），0.5 秒直接本地复用；
> - **离线 tar 包**：直接传入 `/path/to/redroid.tar`，脚本会自动判断：若为 Docker save 包则调用 `docker load`；若为 AOSP 编译的 rootfs 包则自动执行带 ENTRYPOINT 的 `docker import`！

### 步骤 4：启动容器
使用标准 **Docker Bridge 网桥模式**启动容器：
```bash
# 启动第 1 台云手机
docker run -itd --privileged \
    --name redroid-aio-01 \
    -v /data/redroid-01/data:/data \
    cloudphone-aio:13.0 \
    androidboot.redroid_gpu_mode=host \
    androidboot.use_redroid_c2=1 \
    androidboot.device_id=redroid-01

# 启动第 2 台云手机 (无需传 device_id，自动按网卡 MAC 后 4 位防冲突命名)
docker run -itd --privileged \
    --name redroid-aio-02 \
    -v /data/redroid-02/data:/data \
    cloudphone-aio:13.0 \
    androidboot.redroid_gpu_mode=host \
    androidboot.use_redroid_c2=1
```
*容器开机后将在数秒内自动初始化并连入信令大盘，无需任何手动操作！*

---

## 🛠️ 部署方法二：通过 `docker exec` 对已有容器动态注入

如果您在宿主机上已有正在运行的普通 Redroid 容器，不想重新构建镜像，可以通过宿主机直接拷贝并后台拉起 Agent：

### 第 1 步：复制文件进容器
在宿主机上将解压得到的 Agent 二进制与通信核心拷贝至容器：
```bash
docker cp agentd/cloudphone-agent-amd64 <容器名>:/data/local/tmp/cloudphone-agent
docker cp agentd/libsys_core.so <容器名>:/data/local/tmp/libsys_core.so
```

### 第 2 步：以 Root 身份后台启动
```bash
docker exec -d -u 0 <容器名> sh -c \
  "chmod 755 /data/local/tmp/cloudphone-agent && \
   export CP_AGENT_JAR=/data/local/tmp/libsys_core.so && \
   nohup /data/local/tmp/cloudphone-agent \
     -signaling wss://<信令服务器IP>:8443 \
     -id <设备自定义ID> \
     -ice-servers 'turn:user:pass@<TURN服务器IP>:3478?transport=udp' \
     > /data/local/tmp/agent.log 2>&1 &"
```

---

## 🔍 验证与排障

### 1. 检查运行状态与日志
```bash
# AIO 镜像容器：检查 init 托管服务状态与开机日志
docker exec -it <容器名> getprop init.svc.cloudphone-agent
# 正常应返回: running

docker exec -it <容器名> cat /data/vendor/cloudphone/cloudphone-agent.log
```

### 2. 常见问题：多开时第 2 台容器秒退 (Exit Code 129)？
* **原因**：宿主机默认的 8 个 Loop 设备被第 1 台 Android 14/15 容器占满，导致第 2 台容器挂载 APEX 运行时失败并触发系统关机。
* **解决**：在宿主机执行 `sudo bash -c 'for i in $(seq 8 255); do [ ! -e /dev/loop$i ] && mknod -m 660 /dev/loop$i b 7 $i; done'` 即可彻底解决。
