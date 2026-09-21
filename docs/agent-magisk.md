# 方式三：Magisk / Root 模块开机自启 (Magisk Setup)

本指南介绍将 `cloudphone-agent` 封装为 **Magisk / KernelSU / APatch 模块** 刷入 Android 手机的部署方式。  
刷入后 Agent 将作为系统级底层守护服务运行：**开机自动拉起、异常崩溃自动重启**，全程无需连接电脑，非常适合机房批量部署与长期无人值守的物理真机群控。

---

## 📋 前置条件

1. **设备已 Root**：手机已安装并激活 Magisk（v24+）、KernelSU 或 APatch 模块管理器。
2. **已知信令地址**：确认您的信令服务端地址（如 `wss://192.168.1.100:8443`）。
3. **获取模块包**：打开云手机 Web 控制大盘，进入 **“一键部署”** 页面，切换到 **“Magisk / KSU 刷机模块”** 选项卡，下载 **`cloudphone-agent-magisk.zip`**。

---

## 🔥 第一步：刷入模块

1. 将下载的 `cloudphone-agent-magisk.zip` 传输到手机内部存储（可通过微信传输、手机浏览器直接下载或数据线拷贝）。
2. 打开手机上的 **Magisk / KernelSU / APatch 管理器**。
3. 进入 **「模块」** 页面，点击 **「从本地安装」**，选中该 ZIP 模块包。
4. 刷入完成后，点击右下角 **「重启」** 手机。

模块在安装时会自动完成以下底层适配：
* **架构自适应**：自动探测设备 CPU 架构（`arm64` / `armeabi-v7a` / `x86_64`），安装匹配的原生二进制。
* **系统级守护**：注册系统开机自启脚本，系统启动完成后自动拉起 Agent，并以 5 秒周期巡检保活。
* **运维控制台**：内置 `cpctl`（即 `cloudphone-ctl`）交互式命令行工具。
* **配置平滑备份**：若设备上已存在旧配置，后续覆盖升级刷入时会自动备份并恢复，避免参数被清空。

---

## ⚙️ 第二步：配置信令地址与设备 ID

手机重启后守护脚本已在后台运行，首次使用需将 Agent 指向您的信令服务器地址。以下三种方式任选其一：

### 方式 A：命令行一键配置（推荐）

在手机终端 App（如 Termux / MT 管理器终端）或电脑 `adb shell` 中执行（Web 部署页面会根据当前服务器地址动态生成该命令，可直接复制）：

```bash
su
cpctl set CP_AGENT_SIGNALING "wss://<您的服务器IP>:8443"
cpctl set CP_AGENT_ID "<自定义设备ID>"

# 💡 强烈建议：配置 TURN 中转服务（确保跨网段/跨公网 100% 成功出流）
cpctl set CP_AGENT_ICE_SERVERS '["turn:cloudphone_user:cloudphone_secure_password@<您的服务器IP>:3478?transport=udp","stun:<您的服务器IP>:3478"]'

cpctl restart
```

> [!IMPORTANT]
> **中转服务 (ICE/TURN) 配置提醒**：  
> 虽然手机在局域网内或双方均具备公网 IPv6 时能够直接 P2P 连通，但当手机切换至移动 4G/5G 蜂窝网络或处于严格对称 NAT（Symmetric NAT）环境时，**若未配置 TURN 中转服务，可能导致大盘能看预览但点击控制一直超时黑屏**。因此强烈建议在 `CP_AGENT_ICE_SERVERS` 中填入您服务端的 TURN 地址与凭据！

> 💡 **协议一致性**：信令地址协议需与服务端 TLS 状态一致：服务端开启 HTTPS（默认）时使用 `wss://`，关闭时使用 `ws://`。

### 方式 B：交互式控制台菜单

在终端中执行 `su` 获取 Root 权限后，直接运行 `cpctl` 打开可视化终端菜单：

```bash
su
cpctl
```

控制台主菜单会展示当前 Agent 运行状态、PID、信令地址与设备 ID；选择 **“4) 交互式修改参数配置”** 即可依次修改信令地址、设备 ID、视频码率及 ICE 服务器，修改后选择 **“3) 重启 Agent 服务”** 生效。

### 方式 C：电脑端离线预设定制（推荐批量刷机预制）

如果您有多台手机需要批量刷机，或不想在手机端/电脑终端敲命令，推荐在**刷入手机前直接在电脑端修改 ZIP 刷机包的预设配置**：

1. **获取离线配置工具**：
   在 Web 控制台的“一键部署 -> Magisk / KSU 刷机模块”页面，直接点击下载 **`magisk-config-tools.zip`**（约 15KB，纯原生支持，无需安装 Python 环境）。
2. **解压工具包**：
   将 `magisk-config-tools.zip` 解压，并与下载的 `cloudphone-agent-magisk.zip` 置于同一文件夹中。
3. **一键定制参数**：
   * **Windows 用户（极简拖拽即用）**：
     直接将 `cloudphone-agent-magisk.zip` **拖拽并放到 `configure_magisk.bat` 图标上**，弹出终端向导，按提示输入信令地址（或回车使用默认值），秒级生成已定制好的 `cloudphone-agent-magisk-configured.zip`；或在 PowerShell 中执行原生免 Python 脚本：
     ```powershell
     .\configure_magisk.ps1 -Signaling "wss://<您的服务器IP>:8443"
     ```
   * **macOS / Linux 用户**：
     在终端运行向导或单行命令：
     ```bash
     chmod +x configure_magisk.sh
     ./configure_magisk.sh -s "wss://<您的服务器IP>:8443"
     ```
4. **手机刷入即连**：
   将生成的定制刷机包传输至手机并在 Magisk / KernelSU / APatch 中刷入，**手机重启后将直接以预设的信令地址自动上线**，完全省去手机端后续敲命令步骤！

### 方式 D：手机端直接编辑配置文件

使用 MT 管理器等具备 Root 权限的文件编辑器直接编辑配置文件：

```text
/data/adb/modules/cloudphone-agent/config.conf
```

保存修改后，在 Magisk 管理器的模块列表中 **连续点击 2 次 Action 按钮**（第一次停止、第二次启动）即可瞬间热重载生效，无需重启手机。

---

## 🛠️ cpctl 常用运维命令速查

`cpctl` 所有操作均需 Root 特权（请先执行 `su`）：

| 命令 | 功能作用 |
| :--- | :--- |
| `cpctl start` | 开启保活看门狗并立即启动 Agent 进程 |
| `cpctl stop` | 关闭保活看门狗并立即停止 Agent 进程 |
| `cpctl restart` | 重启 Agent 服务（修改配置后使其生效） |
| `cpctl status` | 查看守护开关状态、Agent 与 Scrcpy 伴生进程 PID、最近运行日志 |
| `cpctl log` | 实时追踪滚动查看运行日志（按 `Ctrl+C` 退出） |
| `cpctl set <键> <值>` | 快速修改配置参数，如 `cpctl set CP_AGENT_BITRATE 8000000` |
| `cpctl config` | 输出当前全部生效配置参数 |
| `cpctl` | 打开交互式终端菜单 |

---

## 📄 配置文件完整参数说明 (config.conf)

文件路径：`/data/adb/modules/cloudphone-agent/config.conf`

| 参数名称 | 默认值 | 说明 |
| :--- | :--- | :--- |
| `ENABLED` | `true` | 保活守护总开关。设为 `false` 时守护脚本将彻底停止巡检且不再自动拉起 |
| `CP_AGENT_SIGNALING` | - | **必填**。信令服务器地址，如 `wss://192.168.1.100:8443` |
| `CP_AGENT_ID` | 自动生成 | 设备唯一 ID，留空则自动取「手机型号-序列号」 |
| `CP_AGENT_BITRATE` | `4000000` | 视频默认码率 (bps)，如 `4000000` 代表 4Mbps |
| `CP_AGENT_RESOLUTION` | 原始尺寸 | 视频分辨率长边（如 `1080`、`720`），留空跟随屏幕原生分辨率 |
| `CP_AGENT_MAX_FPS` | `60` | 最大编码帧率限制（如 `60`、`30`） |
| `CP_AGENT_BWE` | `true` | 开启动态拥塞码率自适应控制 |
| `CP_AGENT_AUDIO` | `true` | 开启设备音频内录采集（需 Android 11+） |
| `CP_AGENT_ICE_SERVERS` | - | 自定义 STUN/TURN 中继服务器（JSON 格式） |
| `CP_AGENT_EXTERNAL_ADDR`| - | 复杂 NAT 环境下用于构造 ICE 候选的外部 IP |
| `CP_AGENT_WEBRTC_PORT` | - | WebRTC 媒体指定 UDP 端口或端口段（如 `50000` 或 `50000-50010`） |
| `CP_AGENT_DEBUG` | `false` | 输出底层详细调试日志 |

---

## 🔍 验证运行状态

在手机终端或电脑端运行以下命令验证：

```bash
adb shell "su -c cpctl status"
```

输出中只要显示 **Agent Process: RUNNING** 且 **Scrcpy Helper: RUNNING**，即代表服务已完全正常工作。打开 Web 控制大盘，该设备即可稳定在线操作。

---

## 🛑 手机内快速断开与停止 Agent

如果您手边没有电脑，需要直接在手机上快速断开当前的远程投屏连接：

* **方式一 (推荐)**：在手机本地自带浏览器中打开：
  ```text
  http://127.0.0.1:12345/d
  ```
  页面提供一键切断当前远程画面（保持 Agent 待命）或彻底退出 Agent 服务的可视化按钮。
* **方式二 (终端命令)**：在 Termux 等 Root 终端中执行 `su -c "cpctl stop"`。

---

## ♻️ 升级与卸载

- **平滑升级**：直接在 Magisk / KSU 中重新刷入新版 `cloudphone-agent-magisk.zip` 并重启，原有的 `config.conf` 配置会自动保留。
- **彻底卸载**：在模块列表中点击“移除”并重启手机，系统守护脚本与临时文件将被全部清理。
