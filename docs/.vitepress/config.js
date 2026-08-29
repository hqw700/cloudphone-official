import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'ScrcpyOverWebRTC Docs',
  description: '下一代 WebRTC 极速超低延迟云手机官方开发者指南与帮助文档',
  
  // 编译输出的目标相对路径设为相对 docs/ 的 .vitepress/dist
  // 打包产物后续会通过 package.json 脚本合并到主 dist 目录下
  base: '/docs/',

  themeConfig: {
    logo: '/favicon.svg',
    
    // 全站本地模糊搜索配置 (开箱即用)
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档...',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        }
      }
    },

    // 顶部导航栏
    nav: [
      { text: '官网首页', link: '/index.html' },
      { text: '快速开始', link: '/introduction' },
      { text: '设备接入', link: '/agent-prep' },
      { text: '服务端部署', link: '/deploy-config' },
      { text: '功能手册', link: '/feature-dashboard' },
      { text: '实操教程', link: '/tutorial-windows' },
      { text: '常见问题', link: '/faq' }
    ],

    // 侧边栏目录配置
    sidebar: [
      {
        text: '📖 一、项目概览',
        collapsed: false,
        items: [
          { text: '项目简介与架构解析', link: '/introduction' },
          { text: '核心功能全景特性', link: '/features' },
          { text: '硬件要求与选型决策', link: '/quickstart' }
        ]
      },
      {
        text: '📱 二、设备接入与 Agent 部署',
        collapsed: false,
        items: [
          { text: '接入准备与开发者选项', link: '/agent-prep' },
          { text: '方式一：网页端 WebUSB 部署', link: '/agent-webusb' },
          { text: '方式二：电脑脚本一键包接入', link: '/agent-script' },
          { text: '方式三：Magisk / Root 模块开机自启', link: '/agent-magisk' },
          { text: '方式四：Android App 原生客户端', link: '/app-guide' },
          { text: '方式五：Docker / Redroid 容器云手机', link: '/agent-docker' }
        ]
      },
      {
        text: '💻 三、服务端部署与运维',
        collapsed: false,
        items: [
          { text: '服务端统一配置与端口参数', link: '/deploy-config' },
          { text: '局域网与绿色免 Docker 部署', link: '/deploy-lan' },
          { text: 'Docker 一体化镜像部署 (AIO)', link: '/deploy-docker' },
          { text: 'NAS 与软路由部署 (fnOS / iStoreOS)', link: '/deploy-nas' },
          { text: '公网云服务器部署与穿透', link: '/deploy-cloud' },
          { text: '手机脱机独立运行 (Standalone)', link: '/deploy-standalone' }
        ]
      },
      {
        text: '🎮 四、核心功能操作手册',
        collapsed: false,
        items: [
          { text: '监控大盘、预览直控与群控', link: '/feature-dashboard' },
          { text: '多账号、租户权限与操作审计', link: '/feature-users' },
          { text: '机器分享与卡密免登录直连', link: '/feature-share' },
          { text: '设备标签管理与大盘过滤', link: '/feature-tags' },
          { text: '高级输入：汉字输入与按键映射', link: '/feature-inputs' },
          { text: '远程终端：xterm.js 交互与宏指令', link: '/feature-terminal' },
          { text: 'P2P 文件管理与 APK 批量分发', link: '/feature-files' },
          { text: 'AI 智能排障诊断助手', link: '/feature-ai' }
        ]
      },
      {
        text: '🎯 五、真实环境手把手实操',
        collapsed: false,
        items: [
          { text: '实操一：Windows 本地搭建与真机控制', link: '/tutorial-windows' },
          { text: '实操二：阿里云 ECS 搭建云手机管理平台', link: '/tutorial-aliyun' }
        ]
      },
      {
        text: '⚙️ 六、高级定制与二次开发',
        collapsed: false,
        items: [
          { text: '虚拟 HAL 注入 (Camera/GPS/Sensors)', link: '/rom-hal' },
          { text: '前端控制台二次开发', link: '/dev-web' },
          { text: '官网与文档站构建部署', link: '/dev-website' }
        ]
      },
      {
        text: '🛠️ 七、排障与调优',
        collapsed: false,
        items: [
          { text: '常见问题解答与调优 (FAQ)', link: '/faq' }
        ]
      }
    ],

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hqw700/ScrcpyOverWebRTC' }
    ],

    // 页脚配置
    footer: {
      message: '基于开源协议分发。本文档持续同步 AOSP 与 scrcpy 优化规范。',
      copyright: 'Copyright © 2026-present ScrcpyOverWebRTC Project'
    },

    // 辅助配置
    outline: {
      level: [2, 3],
      label: '本页大纲'
    },
    
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },

    darkModeSwitchLabel: '深色模式切换',
    lightModeSwitchTitle: '切换至浅色模式',
    darkModeSwitchTitle: '切换至深色模式',
    sidebarMenuLabel: '文档菜单',
    returnToTopLabel: '返回顶部'
  }
}))
