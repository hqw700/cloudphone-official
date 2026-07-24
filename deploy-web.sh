#!/bin/bash

# 确保脚本遇到错误时立即退出
set -e

# 获取脚本所在的绝对路径
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "=== 🚀 官网部署同步工具 ==="

# 1. 本地打包编译
echo "📦 正在本地构建前端产物..."
npm run build

# 2. 检查编译产物是否存在
if [ ! -d "dist" ]; then
  echo "❌ 错误: 未检测到 dist 目录，请检查打包是否成功。"
  exit 1
fi

# 3. 差分同步到远程服务器
# 目标：ssh web 上的 /root/dist/ 目录
echo "📤 正在同步 dist/ 到远程服务器 web:/root/dist/ ..."
rsync -avz --delete dist/ web:/root/dist/

echo "✨ 部署成功！所有文件已同步，已通过 Nginx 容器对外服务。"
