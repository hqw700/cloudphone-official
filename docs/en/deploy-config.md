# Server Unified Configuration Reference

This page provides the comprehensive configuration reference for ScrcpyOverWebRTC server deployments, covering Docker environment variables, standalone CLI flags, firewall port rules, and persistent storage directories.

---

## 🐳 1. Docker Environment Variables (AIO Image)

When using the `buutuu/scrcpy-over-webrtc:latest` image, customize container behavior using `-e`:

| Variable | Default | Description |
| :--- | :--- | :--- |
| `PUBLIC_IP` | `127.0.0.1` | **Core Parameter**. Host public/LAN IP for WebRTC ICE candidate broadcasting. Set to your public IP on cloud VPS, or LAN IP for internal networks |
| `TURN_USER` | `cloudphone_user` | Built-in coturn relay authentication username. **Change in production** |
| `TURN_PASSWORD` | `cloudphone_secure_password` | Built-in coturn relay authentication password. **Change in production** |
| `SIGNALING_PORT` | `8443` | Internal listening port for signaling and Web Console |
| `USE_TLS` | `true` | Enable HTTPS mode (self-signed cert by default). Set to `false` for plain HTTP |
| `NO_AUTH` | `false` | When `true`, disables user authentication (**for isolated local testing only, strictly prohibited on public networks**) |
| `DEFAULT_SETTINGS` | See below | Default video quality policy for newly connected devices (JSON string) |
| `EXTERNAL_SIGNALING_PORT` | Same as `SIGNALING_PORT` | Mapped external signaling port when using asymmetric Docker port forwarding (e.g. `18443`) |
| `EXTERNAL_TURN_PORT` | `3478` | Mapped external TURN port when using asymmetric port forwarding (e.g. `13478`) |
| `COTURN_MIN_PORT` | `50000` | Start of coturn UDP media relay port range |
| `COTURN_MAX_PORT` | `50100` | End of coturn UDP media relay port range |

### DEFAULT_SETTINGS Format
Controls default resolution, frame rate, and bitrate for all newly connected devices:
```json
{"maxBitrate":4,"minBitrate":1,"fps":30,"size":1920,"bitrate":4}
```
- `maxBitrate`: Max adaptive bitrate (Mbps)
- `minBitrate`: Minimum guaranteed bitrate (Mbps)
- `fps`: Default frame rate (FPS)
- `size`: Max video dimension length (px)
- `bitrate`: Default initial bitrate (Mbps)

---

## 💻 2. Standalone Binary CLI Flags (Non-Docker)

Command-line flags supported when running `webrtc-signaling` directly on Linux, macOS, or Windows:

| Flag | Equivalent Env | Default | Description |
| :--- | :--- | :--- | :--- |
| `-port` | `PORT` | `8443` | Listening port for web console and signaling |
| `-host` | `HOST` | Dual-stack | Host binding address (`0.0.0.0` for IPv4 only, `::` for dual-stack) |
| `-tls` | `USE_TLS` | `true` | Enable HTTPS. Pass `-tls=false` for HTTP |
| `-cert` / `-key` | `TLS_CERT` / `TLS_KEY` | `certs/server.crt` / `.key` | Custom SSL certificate and private key paths |
| `-assets` | `ASSETS` | `../assets` | Path to Web Console static assets |
| `-data` | `DATA_DIR` | `data` | Directory for persistent storage (users, tags, logs, downloads) |
| `-ice_servers` | `ICE_SERVERS` | Public STUN | Custom STUN/TURN relay list, format: `"turn:user:pass@IP:3478"` |
| `-no-auth` | `NO_AUTH` | `false` | Disable login authentication (local debugging only) |
| `-debug` | `DEBUG` | `false` | Enable verbose protocol debug logs |

---

## 🔌 3. Firewall & Security Group Rules

Select the port rules corresponding to your deployment architecture:

| Deployment Mode | Required Ports | Protocol | Purpose |
| :--- | :--- | :--- | :--- |
| **Standalone Non-Docker** | `8443` | `TCP` | Web Console access & WebSocket signaling (media flows direct P2P between browser and phone) |
| **Docker Host Mode** | `8443` | `TCP` | Web Console & signaling |
| | `3478` | `TCP + UDP` | Built-in coturn STUN/TURN listener |
| | `50000-50100` | `UDP` | TURN media relay UDP pool (`COTURN_MIN/MAX_PORT` default range) |
| **Docker Bridge Mode** | Same as Host mode, mapped via `-p` | Same as above | Keep relay range narrow (100 ports); avoid mapping full 49152-65535 range |

> [!WARNING]
> **Never map the entire `49152-65535` UDP port range in Docker Bridge mode!**  
> Mapping tens of thousands of individual ports in Docker causes excessive kernel memory consumption and kernel OOM crashes. Our AIO image narrows the pool to `50000-50100` (101 ports), minimizing resource usage while ensuring rock-solid relay stability.

---

## 💾 4. Persistent Storage & Upgrades

The system stores persistent configuration under the `data/` directory:
- `users.json`: User accounts, password hashes, role policies, and device permissions;
- `admin_logs.json`: Administrative audit logs;
- `tags.json`: Custom device tags and color palettes;
- `shares.json`: Temporary sharing links and 8-character passcode records;
- `shortcuts.json`: Custom terminal shortcut macros.

### Persistence Best Practices:
- **Docker**: Always mount `-v ./data:/app/data`. When upgrading images, destroy and recreate the container; all data remains intact.
- **Standalone**: When upgrading, replace the binary and `assets/` directory only; **never overwrite or delete `data/`**.

---

## 🔑 5. Default Administrator Credentials

After starting the server, navigate to `https://<SERVER-IP>:8443`:
- **Default Username**: `admin`
- **Default Password**: `admin123`

*(Change the administrator password immediately after first login under the "Management" panel).*
