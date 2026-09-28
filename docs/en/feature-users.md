# Multi-User, Lease Management & Audit Logging

To support commercial cloud phone leasing, multi-tenant studio collaboration, and strict access isolation, ScrcpyOverWebRTC features a complete **multi-user role architecture, device lease model, granular policy locks, and administrative audit logging**.

---

## 👥 Role & Permission Architecture

The system provides two fundamental user roles:

| Role | Identifier | Permissions & Capabilities |
| :--- | :--- | :--- |
| **Super Administrator** | `admin` | Highest platform authority. Full device fleet visibility, user/lease management, share/passcode generation, batch operations, audit log inspection, global configuration, and commercial licensing. |
| **Standard User (Tenant)** | `user` | **Can only view and control devices with active leases assigned to them**; other devices are completely invisible. Navigation is restricted to "Devices / Files / Logout", with all admin portals strictly forbidden. |

Upon initial launch, the system automatically creates the default administrator `admin / admin123` (please change the password immediately).

---

## 📜 Device Lease Model

The core abstraction for commercial leasing: **a device may only have one active lease at any given time (exclusive occupancy)**.

- **Duration Semantics**:
  - **Account = Identity (Permanent by default)**: Accounts do not expire by default. When all leases expire, the user can still log in (viewing an empty device list with renewal instructions) to facilitate subscription renewals.
  - **Lease `expires_at` (Device Usage Rights)**: Controls access to a specific device. Upon expiry, the lease is automatically reclaimed (zero value = permanent).
  - **Account `expires_at` (Optional Account Deactivation)**: Used solely to block suspended or delinquent accounts; usually left blank.
- **Automated Reclaim & Session Eviction**: The server audits expired leases every minute, reclaiming access and instantly terminating active streaming sessions for that tenant.
- **Transparent Tenant View**:
  - Device cards display remaining time (e.g. `6d 3h left`, orange warning when ≤1 day, `♾️ Permanent` when unbounded).
  - The top navbar countdown displays the earliest expiring lease.
- **Wildcard Escape Hatch**: Setting `assigned_devices = ["*"]` grants visibility to all devices for universal management.

---

## 🔒 Policy Locks & Feature Restrictions

Administrators can configure **7 feature lock flags plus video quality constraints** per user or per lease:

| Policy Flag | Restriction Effect |
| :--- | :--- |
| `forbid_bitrate` / `forbid_fps` / `forbid_resolution` / `forbid_audio` | Stream Quality Lock: Settings panel options are disabled in the web UI, and the server enforces administrator-defined parameters. |
| `forbid_file_push` | Disables file upload/push portals (file manager upload, batch distribution); server blocks `/upload` and signed download URL issuance. |
| `forbid_terminal` | Disables terminal Shell, ADB debugging, AI assistant (P2P shell), and hardware command buttons (Power, Home, custom keys); server drops `command` messages. |
| `forbid_share` | Disables generating device shares or passcodes. |

> Batch tasks (batch shell, APK installation, file distribution via `/api/tasks`) are administrator-exclusive and return HTTP 403 for standard users.

---

## 🖥️ Five Administrative Consoles

The administrative backend is structured into five dedicated panels:

| Panel | Route | Purpose |
| :--- | :--- | :--- |
| **User & Permission Management** | `/admin/users` | User creation/deletion, password resets, credential sharing, lease overviews, policy locks, optional expiration dates, and forced session termination. |
| **Device Lease Operations** | `/admin/devices` | Comprehensive fleet lease view: grant leases, renew, revoke, per-lease policy overrides, and occupancy status. |
| **Audit Logs** | `/admin/audit` | Comprehensive operation audit search: filter by admin, target user, or action type. |
| **System Settings** | `/admin/settings` | Global default video quality parameters, commercial license management. |
| **Share Management** | `/admin/shares` | Full visibility, renewal, and revocation of temporary device share links and passcodes. |

---

## 📋 Operation Audit Logging (`audit.log`)

Sensitive management actions are appended to `data/audit.log` (JSON Lines format):

- **Logged Events**: User CRUD, password resets, lease grant/renewal/revocation, policy alterations, share creation, session evictions, and batch task dispatches.
- **Fields Captured**: Timestamp, operating admin, target user, action type, payload parameters, and client IP.
- **Interactive UI**: The audit console supports username fuzzy search and category filtering.

---

## 🛡️ Security Baseline

- **Password Hashing**: Bcrypt encryption; legacy sha256+salt credentials are automatically migrated to bcrypt upon successful authentication.
- **Session Tokens**: Active tokens persist in `data/tokens.json`, surviving server restarts.
- **Pre-Shared Device Secret**: Signaling endpoints (`/register_device`, `/register_agent`) support pre-shared secrets (`-device-secret` / `CLOUDPHONE_DEVICE_SECRET`) to prevent unauthorized agent onboarding.
- **Signed Download URLs**: The `/downloads/` directory is never exposed statically; file downloads require HMAC-signed temporary URLs (10-minute validity) from `/api/files/url`.
- **Server Cryptographic Key**: Automatically generated `data/secret.key` (mode 0600) secures URL signatures and user AI API keys.
- **Data Minimization**: Endpoints like `/api/license_status` and tags return only the minimum dataset associated with the authenticated user's assigned devices.
