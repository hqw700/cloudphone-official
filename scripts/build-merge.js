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

import { execSync } from 'child_process';

try {
  // 1. 编译 webrtc-operator/web-app Demo 控制台
  console.log('📦 正在构建演示版管理控制台 (Demo WebApp)...');
  const webAppDir = path.resolve(__dirname, '../../webrtc-operator/web-app');
  execSync('npm run build:demo', { cwd: webAppDir, stdio: 'inherit' });

  const webAppDist = path.resolve(webAppDir, 'dist');
  const demoHtmlSrc = path.resolve(webAppDist, 'index.html');
  const demoHtmlDest = path.resolve(__dirname, '../dist/demo.html');
  const webAppAssetsSrc = path.resolve(webAppDist, 'assets');
  const webAppAssetsDest = path.resolve(__dirname, '../dist/assets');

  if (fs.existsSync(demoHtmlSrc)) {
    fs.copyFileSync(demoHtmlSrc, demoHtmlDest);
    console.log('✨ Demo WebApp (demo.html) successfully created at dist/demo.html!');
  }

  if (fs.existsSync(webAppAssetsSrc)) {
    copyDir(webAppAssetsSrc, webAppAssetsDest);
    console.log('✨ Demo WebApp assets merged into dist/assets!');
  }

  // 2. 清理已有的 dist/docs 目录并合并文档
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  
  if (fs.existsSync(srcDir)) {
    copyDir(srcDir, destDir);
    console.log('✨ ScrcpyOverWebRTC Docs successfully merged into dist/docs!');
  } else {
    console.error('❌ Error: docs/.vitepress/dist not found. Please build docs first.');
    process.exit(1);
  }
} catch (err) {
  console.error('❌ Error merging demo or docs:', err);
  process.exit(1);
}
