import { defineConfig } from 'vite'
import { resolve } from 'path'
import fs from 'fs'

import { cloudflare } from "@cloudflare/vite-plugin";

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2'
}

export default defineConfig({
  plugins: [{
    name: 'serve-docs',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        let urlPath = req.url.split('?')[0]
        
        if (urlPath.startsWith('/docs')) {
          // 如果请求是 /docs 且未带斜杠，进行重定向
          if (urlPath === '/docs') {
            res.writeHead(301, { Location: '/docs/' })
            res.end()
            return
          }
          
          if (urlPath.endsWith('/')) {
            urlPath += 'index.html'
          }
          
          const filePath = resolve(__dirname, 'dist', urlPath.substring(1))
          if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            const ext = filePath.substring(filePath.lastIndexOf('.'))
            res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream')
            fs.createReadStream(filePath).pipe(res)
            return
          }
        }
        next()
      })
    }
  }, cloudflare()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        apply: resolve(__dirname, 'apply.html')
      }
    }
  }
})