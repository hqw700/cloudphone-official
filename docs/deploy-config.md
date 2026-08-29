# 服务端统一配置与端口参数 (Configuration Reference)

本页面是 ScrcpyOverWebRTC 服务端部署的**核心统一配置参考**。涵盖 Docker 环境变量、非 Docker 命令行参数、网络端口放行规则与数据持久化目录说明。

---

## 🐳 一、Docker 环境变量 (AIO 一体化镜像)

使用 `buutuu/scrcpy-over-webrtc:latest` 镜像时，通过 `-e` 传入以下环境变量定制容器行为：

| 环境变量名 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `PUBLIC_IP` | `127.0.0.1` | **核心参数**。宿主机真实 IP，用于 WebRTC ICE 候选地址发布。公网部署填公网 IP，纯局域网填宿主机内网 IP |
| `TURN_USER` | `cloudphone_user` | 内置 coturn 中转服务认证用户名，**公网生产环境务必修改** |
| `TURN_PASSWORD` | `cloudphone_secure_password` | 内置 coturn 中转服务认证密码，**公网生产环境务必修改** |
| `SIGNALING_PORT` | `8443` | 容器内部信令与 Web 前端服务监听端口 |
| `USE_TLS` | `true` | 是否启用 HTTPS 模式（默认使用自签名证书）。设为 `false` 切换为 HTTP 模式 |
| `NO_AUTH` | `false` | 设为 `true` 时关闭用户登录鉴权（**仅限内网脱机调试，公网严禁开启**） |
| `DEFAULT_SETTINGS` | 见下方说明 | 新接入设备的默认画质策略 (JSON 字符串) |
| `EXTERNAL_SIGNALING_PORT` | 同 `SIGNALING_PORT` | 非对称端口映射时，外部实际暴露的信令端口（如外部映射为 18443） |
| `EXTERNAL_TURN_PORT` | `3478` | 非对称端口映射时，外部实际暴露的 TURN 端口（如外部映射为 13478） |
| `COTURN_MIN_PORT` | `50000` | TURN 媒体中转 UDP 端口段起始值 |
| `COTURN_MAX_PORT` | `50100` | TURN 媒体中转 UDP 端口段结束值 |

### DEFAULT_SETTINGS 格式说明
用于控制所有新接入云手机的默认清晰度与帧率：
```json
{"maxBitrate":4,"minBitrate":1,"fps":30,"size":1920,"bitrate":4}
```
- `maxBitrate`: 最大自适应码率 (Mbps)
- `minBitrate`: 最小保底码率 (Mbps)
- `fps`: 默认帧率 (FPS)
- `size`: 视频长边分辨率 (px)
- `bitrate`: 默认初始码率 (Mbps)

---

## 💻 二、非 Docker 单二进制启动参数

在 Linux / macOS / Windows 直接运行 `webrtc-signaling` 原生程序时支持的命令行参数：

| 参数 | 等效环境变量 | 默认值 | 说明 |
| :--- | :--- | :--- | :--- |
| `-port` | `PORT` | `8443` | 信令与 Web 服务监听端口 |
| `-host` | `HOST` | 双栈绑定 | 绑定监听地址，如 `0.0.0.0` (仅 IPv4) 或 `::` (IPv4/IPv6 双栈) |
| `-tls` | `USE_TLS` | `true` | 是否启用 HTTPS，传入 `-tls=false` 切换为 HTTP |
| `-cert` / `-key` | `TLS_CERT` / `TLS_KEY` | `certs/server.crt` / `.key` | 自定义正式 SSL 证书与私钥路径 |
| `-assets` | `ASSETS` | `../assets` | Web 前端静态资源目录路径 |
| `-data` | `DATA_DIR` | `data` | 持久化数据存储目录（用户账号、标签、下载缓存等） |
| `-ice_servers` | `ICE_SERVERS` | 公共 STUN | 自定义 STUN/TURN 中继列表，格式如 `"turn:user:pass@IP:3478"` |
| `-no-auth` | `NO_AUTH` | `false` | 关闭登录鉴权（内网调试专用） |
| `-debug` | `DEBUG` | `false` | 输出详细底层通信调试日志 |

---

## 🔌 三、网络防火墙与安全组端口放行规则

不同部署模式需要放行的端口清单如下，**请根据实际部署方式选择对应规则**：

| 部署模式 | 必须放行的端口 | 协议 | 作用说明 |
| :--- | :--- | :--- | :--- |
| **非 Docker 绿色模式** | `8443` | `TCP` | Web 控制台网页访问与 WebSocket 信令通道（媒体直接在浏览器与手机间 P2P 直连） |
| **Docker Host 模式** | `8443` | `TCP` | 网页与信令通信 |
| | `3478` | `TCP + UDP` | 内置 coturn STUN/TURN 服务监听口 |
| | `50000-50100` | `UDP` | TURN 媒体中转数据包转发端口段（`COTURN_MIN/MAX_PORT` 默认范围） |
| **Docker Bridge 模式** | 同 Host 模式，但需通过 `-p` 映射 | 同上 | 务必收窄中转端口段（如 100 个），禁止映射整个 49152-65535 大段 |

> [!WARNING]
> **切忌在 Docker Bridge 模式下映射整个 `49152-65535` 端口段**！  
> 在 Docker 宿主机上映射上万个 UDP 端口会瞬间耗尽宿主机内存导致系统崩溃 (OOM)。本项目 AIO 镜像已默认收窄为 `50000-50100`（仅 101 个端口），安全且极度节省系统资源。

---

## 💾 四、数据持久化与升级安全

系统会将所有持久化数据统一保存在 `data/` 目录下：
- `users.json`: 用户账号、密码 Hash、角色权限、VIP 特权与设备绑定关系；
- `admin_logs.json`: 管理员全流程操作审计日志；
- `tags.json`: 设备自定义色彩与名称标签；
- `shares.json`: 临时分享链接与 8 位卡密记录；
- `shortcuts.json`: 用户自定义 Shell 快捷宏指令。

### 持久化操作规范：
- **Docker 部署**：启动时务必挂载 `-v ./data:/app/data`，更新镜像时直接销毁并重新创建容器，用户数据 100% 安全不丢失。
- **非 Docker 部署**：升级时只需替换二进制文件与 `assets/` 静态目录，**切勿覆盖或删除 `data/` 目录**。

---

## 🔑 五、默认管理员账号

服务拉起成功后，在浏览器访问 `https://<服务器IP>:8443`：
- **默认用户名**：`admin`
- **默认初始密码**：`admin123`

*(首次登录后，推荐在「管理」页面或全景抽屉中及时修改管理员密码)*
