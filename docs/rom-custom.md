# 虚拟相机与定制 ROM 方案

云手机除了常规的画面显示和远程控制，在群控社交、测试自动化、隐私对抗等高级商业场景中，需要更深度地与底层 Android 软硬件进行交互，这就涉及到定制 ROM 与外设模拟技术。

---

## 📸 虚拟摄像头驱动模拟方案

在云手机（如 `redroid` 容器或真机）中，由于没有物理摄像头硬件，当运行微信、抖音或扫码类应用时，常会因为调用 Camera 接口获取不到画面而闪退或黑屏。

我们提供以下几种虚拟相机（Virtual Camera）的注入模拟方案：

### 在 HAL 硬件抽象层注入 (推荐 - 定制 ROM 首选)
通过修改 AOSP 源码的 HAL 层（`hardware/interfaces/camera/`），实现将传入的 H.264 媒体视频流解码并塞入 Camera HAL 的 FrameBuffer 中：
* **数据流向**：前端上传视频/图片文件 ➔ 信令端通过 WebRTC DataChannel ➔ 注入到 Android 设备的 UDS Socket ➔ 定制 HAL 层的驱动程序读取该 Socket 并解码 ➔ 作为物理摄像头采集帧喂给 APP 接口。
* **优势**：兼容性最高。

> 当前已针对rk3588容器方案进行适配，可以通过`docker pull buutuu/rk3588-with-camera:latest`体验，稍后推出使用更广泛的x86 redroid镜像.

---

## 🗺️ 虚拟 GPS 与精准地理位置透传

对于基于地理位置服务（LBS）的云手机开发，实现远程虚拟定位必不可少：

1. **Mock 位置 API 方案**：
   * 在 Agent 中获取开发者调试权限，调用 Android 系统自带的 `LocationManager.setTestProviderLocation()`。
   * **限制**：极易被美团、抖音等应用的安全组件检测到开启了“模拟位置”选项而被直接封禁。
2. **底层定位系统 Hook 注入 (商业化定制 ROM)**：
   * 修改 AOSP 核心中的定位服务程序 `com.android.server.LocationManagerService`。
   * 直接从底层拦截 GPS 驱动的 NMEA 原始数据，将前端实时发送的虚拟纬度、经度直接翻译为原始 NMEA 卫星协议数据注入。
   * 对 APP 暴露完全真实的硬件 GPS 状态，彻底避开了系统级“模拟定位服务”的安全检测。

---

## 🧭 物理传感器透传与运动模拟

云手机常用于各种需要重力、加速度传感器的游戏和运动 APP。
* **数据采集**：前端捕获电脑或手机物理陀螺仪/重力感应数据（在 Web 端使用 `DeviceOrientationEvent`），以 `{"type":"sensor", "gyroX":xx, "gyroY":xx}` JSON 格式发送。
* **数据注入**：Agent 通过 UDS 数据通道将数据写入 `/dev/input/` 或者自定义的虚拟传感器设备驱动中。
* **ROM 级集成**：定制 ROM 通过传感器驱动注册虚拟传感器节点，从而向 Android 的 `SensorManager` 提供连续的、带有物理意义的重力与加速度模拟变化数据。
