# 服务端配置参考 (环境变量 / 启动参数 / 端口)

本页是服务端部署的**统一配置参考**：Docker 环境变量、非 Docker 启动参数、端口放行规则与数据持久化。各部署指南（[局域网](/deploy-lan)、[云服务器](/deploy-cloud)、[飞牛 OS](/deploy-fnos)、[iStoreOS](/deploy-istoreos)）中涉及的参数均以此页为准。

---

## 🐳 一、Docker 环境变量 (AIO 镜像)

`buutuu/scrcpy-over-webrtc` 一体化镜像通过 `-e` 传入以下环境变量定制行为：

| 环境变量 | 默认值 | 说明 |
| --- | --- | --- |
| `PUBLIC_IP` | `127.0.0.1` | 宿主机真实 IP，用于 WebRTC ICE 候选地址发布。有公网填公网 IP，纯局域网填宿主机内网 IP |
| `TURN_USER` | `cloudphone_user` | TURN 中转服务认证用户名，**生产环境务必修改** |
| `TURN_PASSWORD` | `cloudphone_secure_password` | TURN 中转服务认证密码，**生产环境务必修改** |
| `SIGNALING_PORT` | `8443` | 容器内部信令 / Web 服务监听端口 |
| `USE_TLS` | `true` | 是否启用 HTTPS，设为 `false` 后以 HTTP 模式运行 |
| `NO_AUTH` | - | 设为 `true` 时关闭登录认证，**仅限内网调试，公网环境严禁开启** |
| `DEFAULT_SETTINGS` | 见下方说明 | 新接入设备的默认画质参数 (JSON) |
| `EXTERNAL_SIGNALING_PORT` | 同 `SIGNALING_PORT` | 非对称端口映射时，外部实际暴露的信令端口（见下文第四节） |
| `EXTERNAL_TURN_PORT` | `3478` | 非对称端口映射时，外部实际暴露的 TURN 端口（见下文第四节） |
| `COTURN_MIN_PORT` / `COTURN_MAX_PORT` | `50000` / `50100` | TURN 媒体中转使用的 UDP 端口段，Bridge 模式下需与 `-p` 映射范围保持一致 |

*   **DEFAULT_SETTINGS 示例**：`{"maxBitrate":4,"minBitrate":1,"fps":30,"size":1920,"bitrate":4}`，分别对应最高码率 (Mbps)、最低码率 (Mbps)、帧率、分辨率长边像素与默认码率。
*   **完整示例**：
    ```bash
    docker run -d \
      --name cp-aio \
      --net=host \
      -v ./data:/app/data \
      -e PUBLIC_IP=<宿主机真实IP> \
      -e TURN_USER=my_turn_user \
      -e TURN_PASSWORD=my_strong_password \
      -e DEFAULT_SETTINGS='{"maxBitrate":8,"minBitrate":2,"fps":60,"size":1920,"bitrate":6}' \
      buutuu/scrcpy-over-webrtc:latest
    ```

---

## 💻 二、非 Docker 启动参数

非 Docker 部署时，追加在 `start_server.sh` 之后的参数会透传给 `webrtc-signaling` 二进制：

| 参数 | 默认值 | 说明 |
| --- | --- | --- |
| `-port` | `8443` | 监听端口 |
| `-host` | 双栈 | 绑定地址，如 `0.0.0.0`（仅 IPv4）或 `::` |
| `-tls` | `true` | 是否启用 HTTPS，`-tls=false` 切换为 HTTP 模式 |
| `-cert` / `-key` | `certs/server.crt` / `certs/server.key` | 替换为正式 SSL 证书路径 |
| `-assets` | `../assets` | 前端静态资源目录 |
| `-data` | `data` | 持久化数据目录（用户、快照、下载文件） |
| `-ice_servers` | 公共 STUN | 自定义 STUN/TURN 列表，如 `"turn:user:pass@IP:3478"` |
| `-no-auth` | 关闭 | 关闭登录认证（仅限内网调试） |
| `-debug` | 关闭 | 输出详细调试日志 |

> 💡 以上参数均有等价的环境变量（`PORT`、`HOST`、`USE_TLS`、`TLS_CERT`、`TLS_KEY`、`ASSETS`、`DATA_DIR`、`ICE_SERVERS`、`NO_AUTH`、`DEFAULT_SETTINGS`），便于在 systemd 等场景中注入。

---

## 🔌 三、端口放行规则

不同部署方式需要放行的端口不同，**切勿照搬整张表**，按您实际的方式选择：

| 部署方式 | 需放行端口 | 说明 |
| --- | --- | --- |
| **非 Docker 原生运行** | `8443/TCP` | 仅需一个端口。媒体流在浏览器与手机间点对点直连，不经过服务器 |
| **Docker Host 模式** | `8443/TCP`、`3478/TCP+UDP`、`50000-50100/UDP` | `3478` 为 TURN 监听口，`50000-50100` 为 TURN 中转 UDP 段（`COTURN_MIN/MAX_PORT` 默认值） |
| **Docker Bridge 模式** | 同 Host 模式，但经 `-p` 映射 | 务必用 `COTURN_MIN/MAX_PORT` 收窄中转段并只映射该范围 |

> [!WARNING]
> **切忌映射或放行整个 `49152-65535` 端口段**：在 Bridge 模式下映射上万条端口会导致宿主机内存耗尽 (OOM)。该端口段是 coturn 上游的默认中转区间，本项目 AIO 镜像已默认收窄为 `50000-50100`；仅当您使用发布包内 `docker/deploy_cloud.sh`（compose 双容器方案）时，才需要按 `coturn/turnserver.conf` 中 `min-port`/`max-port` 的实际配置放行。

---

## 🔀 四、非对称端口映射 (Bridge 模式防黑屏)

当宿主机默认端口被占用，不得不将外部端口映射为不同端口（如外部 `18443` ➔ 容器 `8443`、外部 `13478` ➔ 容器 `3478`）时，容器内部不知道外部端口，仍会把默认 `3478` 作为 TURN 地址下发给前端，导致前端连接失败黑屏。

**解决方案**：通过 `EXTERNAL_SIGNALING_PORT` 和 `EXTERNAL_TURN_PORT` 明确告知容器外部映射的公开端口：

```bash
docker run -d --name cp-aio \
  -p 18443:8443 \
  -p 13478:3478/tcp \
  -p 13478:3478/udp \
  -p 55000-55100:55000-55100/udp \
  -e PUBLIC_IP=<宿主机IP> \
  -e COTURN_MIN_PORT=55000 \
  -e COTURN_MAX_PORT=55100 \
  -e EXTERNAL_SIGNALING_PORT=18443 \
  -e EXTERNAL_TURN_PORT=13478 \
  buutuu/scrcpy-over-webrtc:latest
```

---

## 💾 五、数据持久化

* **Docker**：挂载 `-v ./data:/app/data`。容器会把用户账号 (`users.json`)、设备标签、快照与下载文件全部保存在宿主机 `./data` 目录下，升级镜像时数据不受影响。
* **非 Docker**：所有数据保存在发布包解压目录的 `./data` 下，升级时替换二进制与 `assets` 即可，请勿覆盖 `data` 目录。

---

## 🔑 六、默认访问入口与账号

服务拉起成功后，浏览器访问 `https://<宿主机IP>:8443` 打开管理大盘：

* **默认管理员账号**：`admin`
* **默认管理员密码**：`admin123`

> ⚠️ 信令与 Web 默认以 HTTPS（自签名证书）运行，首次访问浏览器会提示证书不受信任，选择「继续前往」即可；生产环境请替换 `certs/` 下的证书。
