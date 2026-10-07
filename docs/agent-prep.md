# 设备接入准备与全景选型指南 (Device Onboarding & Preparation)

在尝试将 Android 物理真机、虚拟机或 Docker 容器接入 ScrcpyOverWebRTC 管理平台之前，请先根据本指南完成设备的前置环境准备，并根据业务场景选择最适合的接入方式。

---

## 🧭 一、接入模式全景特性对比与选型

系统支持物理真机、Root 设备、未 Root 设备、Docker Redroid 容器以及 Android App 双端等多种设备形态接入。各接入模式的核心特性对比如下：

| 接入模式 | 重启自动上线 | 批量操作能力 | 权限要求 | 适用场景与定位 | 详细部署指南 |
| :--- | :---: | :---: | :--- | :--- | :--- |
| **1. 网页 ADB (WebUSB)** | ❌ 不支持 | ❌ 不支持 | 仅需开启 USB 调试 | 纯浏览器免驱直连，零环境依赖，适合小白单机快速体验与调试 | [查看 WebUSB 指南](/agent-webusb) |
| **2. 电脑 ADB 脚本一键部署** | ❌ 不支持 | ✅ 支持 (通过批量脚本) | 仅需开启 USB 调试 | 电脑端批量脚本并发推送，免 Root 多机快速纳管 | [查看电脑脚本指南](/agent-script) |
| **3. Magisk 模块开机自启** | ✅ 支持 | ✅ 支持 (预改配置批量刷入) | Root (Magisk/KSU/APatch) | 系统开机自启常驻，适合机房集群自动化与长期稳定运维 | [查看 Magisk 模块指南](/agent-magisk) |
| **4. App ADB 模式 (Shizuku)** | ❌ 不支持 | ❌ 不支持 | 免 Root (需 Shizuku) | 免电脑在手机端一键拉起被控端，适合单机临时体验 | [查看 Android App 指南](/app-guide) |
| **5. App Root 权限模式** | ✅ 支持 | ✅ 支持 (支持离线配置与自启) | 需获得 Root (`su`) 权限 | 原生 App 图形化提权，支持开机自启与 `/data/local/tmp` 批量配置 | [查看 Android App 指南](/app-guide) |
| **6. Docker / Redroid 容器云手机** | ✅ 原生支持 (固化自启) | ✅ 支持 (标准镜像一键多开) | Docker / 特权容器权限 | 1 秒免编译打 AIO 镜像，开机自启与 MAC 自动防冲突，批量云手机首选 | [查看 Docker 容器指南](/agent-docker) |
| **7. Linux Host Agent 宿主机管理** | ✅ 支持 (systemd 常驻) | ✅ 支持 (统一纳管所有虚机与开关机) | Linux 宿主机 Root 权限 | 宿主机级守护进程，集中管理本地所有虚机并支持远程批量开关机 | 🚀 **后续发布** |

---

## 📱 二、物理真机通用前置准备清单

如果您接入的是 **Android 物理手机**（无论是通过 WebUSB、电脑脚本、Magisk 模块还是原生 App），请在首次接入前确保完成以下系统设置：

### 1. 开启开发者选项
1. 打开手机 **「设置」** ➔ **「关于手机」**（部分机型在「我的设备」或「系统信息」中）；
2. 连续快速点击 **「版本号 (Build Number)」** 5~7 次；
3. 直到屏幕弹出提示：*“您现在处于开发者模式！”* 或 *“您已开启开发者选项”*。

### 2. 开启 USB 调试
1. 返回设置主菜单，进入 **「系统与更新」**（或「更多设置」/「开发者选项」）；
2. 找到并打开 **「USB 调试 (USB Debugging)」** 开关；
3. 弹出风险提示框时，勾选“我已知晓”并点击 **确定**。

### 3. 开启触控与安全注入权限 (国产品牌必做 ⭐️)
对于小米（MIUI / HyperOS）、OPPO、vivo、魅族等特定国产品牌手机，如果未开启安全权限，控制台**将只能看到视频画面，而鼠标触控点击完全无法操作**：

| 手机品牌 / 系统 | 必须开启的关键开关 | 注意事项 |
| :--- | :--- | :--- |
| **小米 (MIUI / HyperOS)** | **「USB 调试（安全设置）」** | 开启时系统通常要求手机已插入 SIM 卡并登录小米账号；开启过程中需确认 3 次风险警告 |
| **OPPO / 一加 (ColorOS)** | **「禁止权限监控」** | 开启后可防止系统频繁弹出安全警告弹窗中断操作 |
| **vivo (OriginOS)** | **「USB 安全权限」** | 需在开发者选项中开启允许通过 USB 模拟输入 |
| **魅族 (Flyme)** | **「允许模拟点击」** | 允许外部 ADB 输入事件注入屏幕 |

### 4. 特定品牌机型 ADB 常见避坑指南 💡

不同手机厂商对 Android 底层做出了深度修改，以下为常见机型的关键避坑事项：

* **小米 / 红米 / POCO (MIUI / HyperOS)**：
  - **USB 调试（安全设置）**：必须开启，与普通的“USB 调试”是两个分开的独立开关，未开启会导致触控失效。
  - **无线调试配对码立刻失败**：在系统设置的「通知管理」➔「通知显示设置」中，将通知样式切换为 **「原生样式」** 即可正常弹窗输入配对码。
  - **开发者选项被意外关闭**：尽量不要运行「手机管家」的深度扫描/垃圾清理功能，部分系统版本清理时会自动禁用开发者选项并重置调试授权。
* **华为 / 荣耀 (EMUI / HarmonyOS / MagicOS)**：
  - **仅充电模式断连**：必须在开发者选项中开启 **「“仅充电”模式下允许 ADB 调试」**，否则插拔线或切换供电状态时 ADB 会瞬间掉线。
* **OPPO / 一加 / Realme (ColorOS)**：
  - **ADB 权限受限**：在开发者选项中关闭 **「权限监控」**（或开启 **「禁止权限监控」**），防止后台交互被阻断。
* **魅族 (Flyme)**：
  - **支付保护拦截**：需在开发者选项中关闭 **「Flyme 支付保护」**，并开启 **「允许模拟点击」**。
* **索尼 (Sony Xperia)**：
  - 插上 USB 数据线后不要点击弹出的 USB 模式切换对话框，避免 USB 使用模式改变导致物理接口被重置。
* **GrapheneOS (安全定制 ROM)**：
  - 需进入系统设置 ➔「安全」➔ 关闭 **「Secure app spawning」**。

### 5. 全机型通用防超时与保活设置 (强烈推荐)
- **停用 ADB 授权超时 (Android 11+)**：在开发者选项中找到并开启 **「停用 adb 授权超时功能 (Disable adb authorization timeout)」**，防止手机长时间息屏后 ADB 授权自动过期断连；
- **默认 USB 配置**：在开发者选项中将“默认 USB 配置”设置为 **「不进行数据传输 / 仅充电」**，避免每次插拔线触发传输协议变更；
- **数据线与驱动检查**：请使用支持高速数据传输的物理 USB 数据线，避免使用仅能供电的劣质充电线；连接时若弹出“允许 USB 调试吗？”，勾选 **「一律允许使用这台计算机进行调试」** 并确定。

### 6. 验证基础连通性
如果您电脑上已安装 ADB 命令行工具，可以在终端中运行以下命令检查设备是否被正确识别：
```bash
adb devices
```
- **正常状态**：输出设备序列号且状态为 `device`；
- **未授权状态**（显示 `unauthorized`）：说明手机屏幕上有未确认的调试授权弹窗，请点亮屏幕并点击“允许”；
- **无设备输出**：检查数据线连接、更换电脑后置 USB 接口或重新插拔。

---

## 🐳 三、Docker / Redroid 容器云手机前置准备清单

如果您在 Linux 服务器上通过 Docker 运行 **Redroid (Remote Android)** 云手机容器集群，在部署前必须确保宿主机内核满足以下关键前置要求：

### 1. 内核 Binder 驱动检查与挂载
Redroid 依赖 Android 的进程间通信驱动 Binder：
1. **检查 Binder 节点**：
   ```bash
   ls -l /dev/binderfs /dev/binder
   ```
   若输出存在 `/dev/binder` 或 `/dev/binderfs/binder`、`hwbinder`、`vndbinder`，说明驱动已就绪。
2. **若未加载驱动**（Ubuntu / Debian / PVE）：
   ```bash
   sudo modprobe binder_linux devices="binder,hwbinder,vndbinder"
   ```
   若提示模块不存在，请安装宿主机发行版的 extra 内核模块包（如 Ubuntu 可通过 `sudo apt install linux-modules-extra-$(uname -r)` 获取，或使用 DKMS 版 binder 驱动）。

### 2. Loop 回环设备节点预分配 (高密多开核心必做 ⭐️)
> [!IMPORTANT]
> **多开容器第 2 台秒退 (Exit Code 129) 的排错关键！**  
> Android 10+（尤其是 Android 14 与 Android 15）的系统核心运行时（Bionic C 库、动态链接器 `linker64`、ART 等）打包在 APEX 镜像中。单个容器启动需要将 20~30 个 `.apex` 作为 Loop 设备挂载。  
> 普通 Linux 宿主机默认只预先创建了 **8 个 Loop 设备节点**（`/dev/loop0` ~ `/dev/loop7`）。当第 1 台容器占满后，第 2 台容器因无节点可用会导致动态链接器挂载失败，触发 `vold` 自毁关机。

在宿主机执行一次性预分配命令（创建至 256 个节点）：
```bash
sudo bash -c 'for i in $(seq 8 255); do [ ! -e /dev/loop$i ] && mknod -m 660 /dev/loop$i b 7 $i; done'
```
*💡 推荐将此操作固化为开机自启 systemd 服务（如 `/etc/systemd/system/redroid-loop.service`），确保宿主机重启后依然生效。*

### 3. 网络模式安全红线 (严格禁止 `--net=host`)
> [!CAUTION]
> **切勿在特权模式下对 Redroid 容器使用 `--net=host`！**  
> Redroid 内部的 `netd` 守护进程默认认为自己独占整台机器的网络协议栈。启动时会直接清空 Linux 宿主机的 `lookup main` 主路由规则、关闭 `net.ipv4.ip_forward=0` 并在 iptables 下发 DROP 规则，**直接摧毁宿主机全局所有容器的网桥与外部网络通信**！  
> **所有 Redroid 容器必须使用标准 Docker Bridge 模式运行。**

### 4. GPU 硬件加速与渲染选型
* **宿主机具备 Intel/AMD 核显或独立显卡**：启动容器时映射 GPU 节点 `-v /dev/dri:/dev/dri`，并配置内核参数 `androidboot.redroid_gpu_mode=host`，享用显存直通硬件加速；
* **纯 CPU 云服务器或无显卡环境**：配置 `androidboot.redroid_gpu_mode=guest`，系统将自动采用 Mesa CPU 软解渲染。

---

## ➡️ 四、选择对应的接入指南开始部署

完成上述前置准备后，请点击下方链接进入对应的详细实操指南：

1. **[方式一：网页端 WebUSB 一键部署](/agent-webusb)**：纯浏览器免驱动插线一键安装（小白首选）。
2. **[方式二：电脑 ADB 脚本一键部署](/agent-script)**：通过电脑终端脚本一键推送（支持 USB / 有线 / 无线 ADB，支持批量操作）。
3. **[方式三：Magisk / Root 模块开机自启](/agent-magisk)**：Root 真机开机自启系统守护，支持预改配置统一刷入，无人值守运维首选。
4. **[方式四：Android App 原生客户端](/app-guide)**：手机安装 App，免电脑被控（支持 Root 模式开机自启与配置预设，以及 Shizuku 免 Root ADB 模式）。
5. **[方式五：Docker / Redroid 容器云手机](/agent-docker)**：服务器端 Redroid 虚机集群接入（强烈推荐使用发布包内置的 AIO 极速构建套件，1 秒打出开箱自启镜像）。
