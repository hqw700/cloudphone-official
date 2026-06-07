import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const srcDir = path.resolve(__dirname, '../docs/.vitepress/dist');
const destDir = path.resolve(__dirname, '../dist/docs');

// 递归拷贝目录
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  // 1. 清理已有的 dist/docs 目录
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  
  // 2. 创建并拷贝最新的 docs 构建产物
  if (fs.existsSync(srcDir)) {
    copyDir(srcDir, destDir);
    console.log('✨ CloudPhone Docs successfully merged into dist/docs!');
  } else {
    console.error('❌ Error: docs/.vitepress/dist not found. Please build docs first.');
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Error merging docs:', err);
  process.exit(1);
}
