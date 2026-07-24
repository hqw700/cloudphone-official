# Magisk 模块部署指南 (Root 开机自启)

本指南介绍将 `cloudphone-agent` 封装为 **Magisk / KernelSU / APatch 模块** 刷入手机的部署方式。刷入后 Agent 将作为系统级守护服务运行：**开机自动拉起、崩溃自动重启**，全程无需连接电脑，非常适合机房批量部署与长期无人值守的物理云手机。

---

## 📋 前置条件

1. **设备已 Root**：手机已安装 Magisk、KernelSU 或 APatch 模块管理器。
2. **已知信令地址**：确认您的信令服务器地址（如 `wss://<信令服务器IP>:8443`），服务端部署请参见 [内网与局域网部署](/deploy-lan) 或 [云服务器部署与穿透](/deploy-cloud)。
3. **获取模块包**：打开云手机 Web 仪表盘，进入 **“部署新设备”** 页面，切换到 **“Magisk / KSU 刷机模块”** 选项卡，下载 **`cloudphone-agent-magisk.zip`**。

<!-- 📷 截图占位：部署页 “Magisk / KSU 刷机模块” 选项卡与下载卡片，建议文件名 img/magisk-1-download.png -->

---

## 🔥 第一步：刷入模块

1. 将下载的 `cloudphone-agent-magisk.zip` **传输到手机**（可通过数据线拷贝、微信文件传输或直接手机浏览器下载）。
2. 打开手机上的 **Magisk / KernelSU 管理器**，进入 **“模块”** 页面，选择 **“从本地安装”**，选中该 ZIP 包。
3. 刷入完成后 **重启手机**。

<!-- 📷 截图占位：Magisk 管理器 “从本地安装” 刷入过程，建议文件名 img/magisk-2-flash.png -->

模块安装时会自动完成以下工作：

* **架构自适应**：自动探测设备 CPU 架构（`arm64` / `armeabi-v7a` / `x86_64`），安装匹配的 Agent 二进制。
* **守护服务**：注册开机自启守护脚本，系统启动完成后自动拉起 Agent，并以 5 秒间隔巡检保活。
* **控制台工具**：内置 `cpctl`（即 `cloudphone-ctl`）命令行工具，用于配置与运维。
* **配置备份**：若设备上已存在旧配置，升级刷入时会自动备份并恢复，不会被清空。

---

## ⚙️ 第二步：配置信令地址与设备 ID

重启后 Agent 已随系统自启，但首次使用必须先指向您的信令服务器。以下三种方式任选其一：

### 方式 A：命令行一键配置（推荐）

在手机终端 App 或电脑 `adb shell` 中执行（部署页面会按您的服务器地址动态生成这组命令，可直接复制）：

```bash
su
cpctl set CP_AGENT_SIGNALING "wss://<信令服务器IP>:8443"
cpctl set CP_AGENT_ID "<自定义设备ID>"
cpctl restart
```

> 💡 信令地址协议需与服务端 TLS 状态保持一致：服务端开启 HTTPS（默认）时使用 `wss://`，关闭时使用 `ws://`。

### 方式 B：交互式控制台

在手机终端中运行 `su` 获取 Root 权限后，直接运行 `cpctl` 打开交互控制台：

```bash
su
cpctl
```

主菜单可查看保活开关、Agent 运行状态、当前信令地址与设备 ID；选择 **“4) 交互式修改参数配置”** 可依次修改信令地址、设备 ID、ICE 服务器与视频码率，修改后选择 **“3) 重启 Agent 服务”** 生效。

<!-- 📷 截图占位：cpctl 交互控制台主菜单，建议文件名 img/magisk-3-cpctl.png -->

### 方式 C：编辑配置文件

使用 MT 管理器等工具直接编辑模块配置文件：

```text
/data/adb/modules/cloudphone-agent/config.conf
```

保存后，在 Magisk 管理器的模块界面 **连续点击 2 次 Action 按钮**（第一次停止、第二次启动）即可热重载生效，无需重启手机。

---

## 🛠️ cpctl 命令速查

`cpctl` 所有操作均需 Root 权限（先执行 `su`）：

| 命令 | 作用 |
| --- | --- |
| `cpctl start` | 开启保活看门狗并立即启动 Agent |
| `cpctl stop` | 关闭保活看门狗并立即停止 Agent |
| `cpctl restart` | 重启 Agent 服务（修改配置后执行） |
| `cpctl status` | 查看保活开关、Agent 与投屏进程 PID、最近 5 行日志 |
| `cpctl log` | 实时滚动查看运行日志（Ctrl+C 退出） |
| `cpctl set <键> <值>` | 修改配置参数，如 `cpctl set CP_AGENT_BITRATE 8000000` |
| `cpctl config` | 查看当前全部配置参数 |
| `cpctl`（不带参数） | 进入交互式控制台 |

---

## 📄 配置文件参数说明 (config.conf)

`/data/adb/modules/cloudphone-agent/config.conf` 支持的全部参数（修改后需 `cpctl restart` 或连点 2 次 Action 按钮生效）：

| 参数 | 说明 |
| --- | --- |
| `ENABLED` | 保活总开关（`true`/`false`）。为 `false` 时守护脚本将停止且不再拉起 Agent |
| `CP_AGENT_SIGNALING` | **必填**。信令服务器地址，如 `wss://192.168.1.100:8443` |
| `CP_AGENT_ID` | 设备唯一 ID，留空则按「手机型号-序列号」自动生成 |
| `CP_AGENT_BITRATE` | 视频码率 (bps)，如 `4000000` 表示 4Mbps |
| `CP_AGENT_RESOLUTION` | 视频分辨率长边（如 `1080`、`720`），留空自动跟随系统 |
| `CP_AGENT_MAX_FPS` | 最大帧率（如 `60`、`30`） |
| `CP_AGENT_BWE` | 开启动态码率（`true`/`false`），根据网络拥塞自动调节画质 |
| `CP_AGENT_AUDIO` | 开启设备音频采集（`true`/`false`，需 Android 11+） |
| `CP_AGENT_ICE_SERVERS` | 自定义 ICE 穿透服务器（JSON 格式） |
| `CP_AGENT_EXTERNAL_ADDR` | Docker/NAT 场景下用于 P2P 的外部地址 |
| `CP_AGENT_WEBRTC_PORT` | WebRTC 媒体 UDP 端口或端口段（如 `50000` 或 `50000-50010`） |
| `CP_AGENT_UPNP` | 开启 UPnP 自动端口映射（`true`/`false`） |
| `CP_AGENT_DEBUG` | 输出详细调试日志（`true`/`false`） |

---

## 🔍 第三步：验证运行状态

```bash
# 方式一：电脑端验证
adb shell "su -c cpctl status"

# 方式二：查看实时日志
adb shell "su -c 'tail -f /data/local/tmp/cloudphone-agent.log'"
```

`cpctl status` 输出中 **Agent Process: RUNNING** 且 **Scrcpy Helper: RUNNING** 即表示服务正常。随后打开 Web 仪表盘，设备列表中应出现该设备，点击即可连接。

---

## ♻️ 升级与卸载

* **升级模块**：直接刷入新版 `cloudphone-agent-magisk.zip` 并重启，原有 `config.conf` 配置会自动备份并恢复。
* **卸载模块**：在 Magisk / KernelSU 管理器的模块页面移除该模块并重启手机，Agent 与守护服务将被彻底移除。

---

## ❓ 常见问题

**Q：刷入并重启后，大盘上看不到设备？**
依次排查：① `cpctl status` 确认 Agent 进程在运行；② `cpctl config` 确认信令地址的协议（`ws`/`wss`）与 IP 端口正确；③ 手机与服务器之间的网络连通性（可 `ping` 或浏览器访问服务端地址验证）。

**Q：修改了 config.conf 但没有生效？**
配置文件由守护脚本动态加载，但 Agent 进程需要重启才会应用新参数。执行 `cpctl restart`，或在 Magisk 模块界面连续点击 2 次 Action 按钮。

**Q：如何彻底停止 Agent 且防止被守护脚本自动拉起？**
执行 `su -c "cpctl stop"`。该命令会同时关闭保活开关（`ENABLED=false`），守护脚本将不再自动重启 Agent。
