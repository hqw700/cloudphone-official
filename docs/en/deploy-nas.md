# NAS & Router Deployment (fnOS / iStoreOS / Synology)

Many home and studio setups maintain always-on **Private Cloud NAS appliances (fnOS, Synology DSM)** or **software routers (iStoreOS, OpenWrt)**.  
Running ScrcpyOverWebRTC via Docker on these appliances provides a 24/7 centralized management hub for your private device cluster.

---

## 🐋 Option 1: fnOS (Flying Cow OS) Graphical Setup

fnOS includes an intuitive Docker container management UI for rapid one-click deployments.

### 1. Search & Pull Image
* Open the **"Containers"** app in fnOS and navigate to **"Images"** on the left menu.
* Click **"Popular Images"** or search directly for: `buutuu/scrcpy-over-webrtc`.
* Select and download the `latest` tag.
* *(💡 If image searches time out, configure a registry mirror in Docker daemon settings).*

![fnOS Search Image](../img/fnos-1.png)

### 2. Create Container & Base Settings
* In the "Images" list, locate the image and click **"Launch"**;
* **Container Name**: Enter `cp-aio`;
* **Restart Policy**: Check **"Always restart when container stops"**.

![fnOS Base Configuration](../img/fnos-2.png)

### 3. Network & Port Mapping
* Switch to the **"Network"** tab;
* fnOS automatically populates port mappings declared in the image (`8443` signaling, `3478` TURN, and `50000-50100/UDP` media relay).

![fnOS Network Ports](../img/fnos-4.png)
![fnOS Port List](../img/fnos-8.png)

> [!TIP]
> If you remap external ports to non-standard ports (asymmetric mapping), remember to set `EXTERNAL_SIGNALING_PORT` and `EXTERNAL_TURN_PORT` in Environment Variables to prevent connection timeouts (see [Configuration Reference](/en/deploy-config)).

### 4. Environment Variables
* Switch to the **"Environment"** tab;
* Click **"Add"** and specify the following variables:
  * **`PUBLIC_IP`** ➔ `<Your-NAS-LAN-IP>` (e.g. `192.168.100.189`);
  * **`TURN_USER` / `TURN_PASSWORD`** ➔ Custom relay credentials.

![fnOS Environment Variables](../img/fnos-3.png)

### 5. Persistent Storage Volume
* Under the **"Storage"** tab, bind a local directory on your NAS to `/app/data` inside the container;
* All user accounts and tags will persist safely across updates and restarts.

### 6. Start & Verify
* Click **"Finish"** to launch the container.
* Open `https://<YOUR-NAS-IP>:8443` in a browser on your LAN, and log in with default credentials `admin` / `admin123`:

![fnOS Console Login](../img/fnos-6.png)
![Device Deployment Execution](../img/fnos-7.png)

---

## 📶 Option 2: iStoreOS / OpenWrt Router Deployment

Because software routers sit directly at the LAN gateway, hosting the signaling service on the router provides the most direct forwarding path.

### 1. SSH Launch (Host Mode Recommended)
Using `--net host` directly shares the router's physical interfaces:

```bash
docker run -d \
  --name cp-aio \
  --restart always \
  --net host \
  -v ./data:/app/data \
  -e PUBLIC_IP=<ROUTER-LAN-IP> \
  -e TURN_USER=my_user \
  -e TURN_PASSWORD=my_password \
  buutuu/scrcpy-over-webrtc:latest
```

### 2. Firewall Rule Configuration
If clients or devices cross subnets or connect via the router WAN port:
1. Log in to iStoreOS / OpenWrt, open **"Network" ➔ "Firewall" ➔ "Traffic Rules"**.
2. Add a new rule:
   - **Name**: `cloudphone-webrtc`
   - **Protocol**: `TCP+UDP`
   - **Source Zone**: `Any`
   - **Destination Zone**: `Device (input)`
   - **Destination Ports**: `8443, 3478, 50000-50100`
   - **Action**: `ACCEPT`
3. Click **"Save & Apply"**.

---

## 🖥️ Option 3: Synology NAS (DSM 7.x Container Manager)

In Synology **Container Manager**:
1. Search `buutuu/scrcpy-over-webrtc` in "Registry" and download;
2. In "Image", click "Run" and select **"Use the same network as Docker Host"**;
3. In "Environment", set `PUBLIC_IP` to your Synology LAN IP;
4. In "Volume Settings", mount a local folder to `/app/data`;
5. Apply and start the container.

---

## 🔑 Console Access

Navigate to `https://<NAS-OR-ROUTER-IP>:8443`:
- **Default Username**: `admin`
- **Default Password**: `admin123`

To connect devices, see [Device Onboarding Guide](/en/agent-prep).
