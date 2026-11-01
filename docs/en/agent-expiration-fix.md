# Agent Expiration Hotfix (v0.4.3)

Due to an oversight in an early test version, the Agent’s test expiration date (November 1, 2026) was left in place, preventing older Agents from starting or causing them to exit automatically. v0.4.3 removes the default expiration. We apologize for the disruption.

## Workaround for Older Versions

**Upgrade to v0.4.3 and redeploy the device-side Agent.** If you cannot upgrade immediately:

- **Script deployment:** In `run.sh` / `run.bat`, replace `env GODEBUG=asyncpreemptoff=1` with `env GODEBUG=asyncpreemptoff=1 CP_AGENT_EXPIRES_AT=2099-01-01`, then rerun the script.
- **Magisk / KernelSU:** Append `export CP_AGENT_EXPIRES_AT="2099-01-01"` to `/data/adb/modules/cloudphone-agent/config.conf`, then run `cpctl restart` or reboot the device.

Note: Updating the server alone does not resolve this issue. Older deployment scripts do not forward the `-expires-at` option.

## Download the Hotfix

- [v0.4.3 Platform Bundle](https://pan.quark.cn/s/8d1fa2582cc1)
- [v0.4.3 Magisk Module](https://pan.quark.cn/s/c2fb80b237a1)

After extracting the cloud drive bundle, follow the included instructions to rename the `.bin` file to `.zip`, then extract it.

