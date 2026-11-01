# Agent 到期紧急修复（v0.4.3）

由于早期测试版本的疏漏，Agent 内置的测试到期日期（2026-11-01）未及时移除，导致旧版本无法启动或自动退出。v0.4.3 已移除默认到期限制，对造成的不便深表歉意。

## 旧版本处理方案

建议升级至 **v0.4.3 并重新部署设备端 Agent**。暂时无法升级的用户可按以下方式恢复：

- **脚本部署**：编辑 `run.sh` / `run.bat`，将启动命令中的 `env GODEBUG=asyncpreemptoff=1` 替换为 `env GODEBUG=asyncpreemptoff=1 CP_AGENT_EXPIRES_AT=2099-01-01`，然后重新运行脚本。
- **Magisk / KernelSU**：在 `/data/adb/modules/cloudphone-agent/config.conf` 末尾加入 `export CP_AGENT_EXPIRES_AT="2099-01-01"`，执行 `cpctl restart` 或重启设备。

注意：仅更新服务端无效；旧版部署脚本不支持直接追加 `-expires-at` 参数。


## 下载修复包

- [v0.4.3 全套平台包](https://pan.quark.cn/s/8d1fa2582cc1)
- [v0.4.3 Magisk 模块](https://pan.quark.cn/s/c2fb80b237a1)

平台网盘包解压后，请按内附说明将 `.bin` 文件重命名为 `.zip` 再解压。

