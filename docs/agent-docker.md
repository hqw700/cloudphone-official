# 方式五：Docker / Redroid 容器云手机多开 (Container Setup)

如果您在云服务器或本地 Linux 服务器上通过 Docker 运行 **`redroid` (Remote Android in Docker)** 搭建云手机集群，可以通过本文档将多台 Redroid 虚机批量挂载至 ScrcpyOverWebRTC 管理平台。

---

## 📋 关键网络特性：容器 IPv6 限制与网络选型

> [!WARNING]
> **重要前置概念：Docker 容器默认不支持 IPv6 P2P 直连！**  
> 物理手机在移动 4G/5G 网络下通常具备公网 IPv6 地址，可以实现零成本直连；但 **Docker Redroid 容器默认处于 IPv4 Bridge 网桥中，无法直接获取公网 IPv6 地址**。  
> 
> 因此，容器云手机必须在以下两种网络方案中 **二选一**，否则会导致大盘能看到预览但点击控制连接失败：
> * **方案 A (直连模式 - 推荐)**：为每个容器映射独立的 UDP 端口，并在 Agent 启动时显式指定 **`-external-addr <宿主机IP>`** 与 **`-webrtc-port <指定UDP端口>`**；
> * **方案 B (中转模式)**：在 Agent 启动时显式指定 TURN 中转服务 **`-ice-servers "turn:user:pass@<服务器IP>:3478?transport=udp"`**，由 coturn 中继媒体流。

```mermaid
graph TD
    Client[Web 浏览器客户端]

    subgraph Linux 宿主机 (IP: 192.168.1.200)
        Signaling[信令服务 :8443]

        subgraph "Redroid 容器 1 (vm-01)"
            R1[Android 12]
            A1[Agent 1 -webrtc-port 50001]
        end

        subgraph "Redroid 容器 2 (vm-02)"
            R2[Android 12]
            A2[Agent 2 -webrtc-port 50002]
        end
    end

    Client -->|WebSocket 信令| Signaling
    Client <==>|WebRTC UDP :50001 直连 (需 -external-addr)| A1
    Client <==>|WebRTC UDP :50002 直连 (需 -external-addr)| A2
```

---

## ⚡ 部署方法一：通过 `docker exec` 以 Root 权限极速部署 (强烈推荐)

该方式直接在宿主机操作，**无需通过 ADB 连接容器端口**，直接以系统最高特权将 Agent 注入容器内部并后台运行，最安全高效。

### 第 1 步：启动 Redroid 容器集群
在宿主机启动 Redroid 容器时，为每个容器分配独立的 WebRTC UDP 端口：

```bash
# 启动第 1 台 Redroid (vm-01)
docker run -d --privileged \
  --name redroid-01 \
  -p 50001:50001/udp \
  -v /data/redroid-01:/data \
  redroid/redroid:12.0.0-latest \
  androidboot.redroid_width=1080 \
  androidboot.redroid_height=1920 \
  androidboot.redroid_dpi=420

# 启动第 2 台 Redroid (vm-02)
docker run -d --privileged \
  --name redroid-02 \
  -p 50002:50002/udp \
  -v /data/redroid-02:/data \
  redroid/redroid:12.0.0-latest \
  androidboot.redroid_width=1080 \
  androidboot.redroid_height=1920 \
  androidboot.redroid_dpi=420
```

### 第 2 步：通过 `docker cp` 复制文件进容器
从 Web 控制台下载 `agent-deploy.zip` 并解压，在宿主机上直接将 x86_64（或 ARM64）二进制和投屏核心复制进容器：

```bash
# 拷贝到第 1 台容器
docker cp cloudphone-agent-amd64 redroid-01:/data/local/tmp/cloudphone-agent
docker cp libsys_core.so redroid-01:/data/local/tmp/libsys_core.so

# 拷贝到第 2 台容器
docker cp cloudphone-agent-amd64 redroid-02:/data/local/tmp/cloudphone-agent
docker cp libsys_core.so redroid-02:/data/local/tmp/libsys_core.so
```

### 第 3 步：通过 `docker exec` 以 Root 身份启动 Agent

```bash
# 启动第 1 台容器内的 Agent
docker exec -d -u 0 redroid-01 sh -c \
  "chmod 755 /data/local/tmp/cloudphone-agent && \
   export CP_AGENT_JAR=/data/local/tmp/libsys_core.so && \
   nohup /data/local/tmp/cloudphone-agent \
     -signaling wss://<信令服务器IP>:8443 \
     -id vm-01 \
     -external-addr <宿主机真实IP> \
     -webrtc-port 50001 \
     -ice-servers 'turn:cloudphone_user:cloudphone_secure_password@<信令服务器IP>:3478?transport=udp,stun:<信令服务器IP>:3478' \
     -jar /data/local/tmp/libsys_core.so \
     > /data/local/tmp/agent.log 2>&1 &"

# 启动第 2 台容器内的 Agent
docker exec -d -u 0 redroid-02 sh -c \
  "chmod 755 /data/local/tmp/cloudphone-agent && \
   export CP_AGENT_JAR=/data/local/tmp/libsys_core.so && \
   nohup /data/local/tmp/cloudphone-agent \
     -signaling wss://<信令服务器IP>:8443 \
     -id vm-02 \
     -external-addr <宿主机真实IP> \
     -webrtc-port 50002 \
     -ice-servers 'turn:cloudphone_user:cloudphone_secure_password@<信令服务器IP>:3478?transport=udp,stun:<信令服务器IP>:3478' \
     -jar /data/local/tmp/libsys_core.so \
     > /data/local/tmp/agent.log 2>&1 &"
```

---

## 🛠️ 部署方法二：通过传统 ADB 命令推送

如果您更习惯在宿主机通过 ADB 端口管理容器：

1. **容器映射 ADB 端口**：在 `docker run` 时增加 `-p 5555:5555`；
2. **连接并推送**：
   ```bash
   adb connect 127.0.0.1:5555
   adb -s 127.0.0.1:5555 push cloudphone-agent-amd64 /data/local/tmp/cloudphone-agent
   adb -s 127.0.0.1:5555 push libsys_core.so /data/local/tmp/
   ```
3. **ADB Shell 启动**：
   ```bash
   adb -s 127.0.0.1:5555 shell "chmod 755 /data/local/tmp/cloudphone-agent && nohup /data/local/tmp/cloudphone-agent \
     -signaling wss://<信令服务器IP>:8443 \
     -id vm-01 \
     -external-addr <宿主机真实IP> \
     -webrtc-port 50001 \
     -ice-servers 'turn:cloudphone_user:cloudphone_secure_password@<信令服务器IP>:3478?transport=udp' \
     -jar /data/local/tmp/libsys_core.so > /data/local/tmp/agent.log 2>&1 &"
   ```

---

## 🔍 验证与日志排查

通过 `docker exec` 查看运行状态或实时日志：

```bash
# 查看 Agent 进程是否在运行
docker exec redroid-01 pidof cloudphone-agent

# 实时查看运行日志
docker exec redroid-01 tail -f /data/local/tmp/agent.log
```

---

## 🛑 停止容器内的 Agent

```bash
docker exec redroid-01 pkill -f cloudphone-agent
```
