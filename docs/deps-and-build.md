# 依赖安装与服务编译

在公网云服务器上部署时，由于防火墙及对称型 NAT 的阻隔，需要提前准备好 Coturn 服务作为中继。如果您需要二次开发或自定义功能，可以在本地直接使用 Go 对整个模块进行交叉编译。

---

## 🌐 部署 Coturn 中继服务器 (TURN)

当客户端和云手机代理端因为复杂的防火墙无法建立直接的 P2P 通道时，WebRTC 会自动降级使用 TURN 中继服务器转发流量。

### 1. 安装 Coturn
在 Ubuntu / Debian 环境下执行安装：

```bash
sudo apt-get update
sudo apt-get install coturn
```

### 2. 配置 `/etc/turnserver.conf`
备份并编辑配置文件，推荐配置如下：

```ini
# 监听端口
listening-port=3478
tls-listening-port=5349

# 启用高可靠的凭据机制
fingerprint
lt-cred-mech

# 配置静态用户和密码 (格式为 用户名:密码)
user=cloudphone:superpassword123

# 自定义域名
realm=yourdomain.com

# 限制中继流量分配的 UDP 随机端口范围，便于配置防火墙
min-port=49152
max-port=65535
```

### 3. 配置安全组与防火墙放行
请务必在云服务器的安全组中放行以下所有端口：
- **3478 TCP / UDP** (Coturn 侦听)
- **49152 - 65535 UDP** (WebRTC 音视频推流动态分配区间)

> [!WARNING]
> 如果动态端口段放行不全，会导致 WebRTC 信令握手成功（有触控轨迹、连接状态成功）但屏幕全黑没有视频画面渲染。

---

## 🛠️ 服务端 Go 编译

主项目包含了信令端和桥接端的源码，可以非常容易地构建出多平台的目标文件。

### 1. 编译信令服务器 (Signaling)
信令服务基于 Go 原生开发，无重量级外部依赖：

```bash
cd webrtc-operator/standalone

# 编译当前系统平台的二进制
go build -o signaling-server main.go

# 交叉编译到 Android ARM64 平台 (运行 Standalone 所需)
CGO_ENABLED=0 GOOS=android GOARCH=arm64 go build -o signaling-android main.go
```

### 2. 编译音视频桥接器 (Go Bridge)
Go Bridge 负责读取 UDS 裸流，并将其封装为 RTP 格式转发至 Pion WebRTC 拦截器管道中：

```bash
cd webrtc-bridge/go-bridge

# 编译生成
go build -o go-bridge main.go
```
