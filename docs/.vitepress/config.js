import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  base: '/docs/',

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'ScrcpyOverWebRTC Docs',
      description: '下一代 WebRTC 极速超低延迟云手机官方开发者指南与帮助文档',
      themeConfig: {
        nav: [
          { text: '官网首页', link: '/index.html' },
          { text: '快速开始', link: '/introduction' },
          { text: '设备接入', link: '/agent-prep' },
          { text: '服务端部署', link: '/deploy-config' },
          { text: '功能手册', link: '/feature-dashboard' },
          { text: '实操教程', link: '/tutorial-windows' },
          { text: '常见问题', link: '/faq' }
        ],
        sidebar: [
          {
            text: '📖 一、项目概览',
            collapsed: false,
            items: [
              { text: '文档首页', link: '/index' },
              { text: '项目简介与架构解析', link: '/introduction' },
              { text: '核心功能全景特性', link: '/features' },
              { text: '硬件要求与选型决策', link: '/quickstart' },
              { text: '典型业务场景与容量测算', link: '/use-cases' }
            ]
          },
          {
            text: '📱 二、设备接入与 Agent 部署',
            collapsed: false,
            items: [
              { text: '设备接入全景选型指南', link: '/agent-deploy' },
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
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      title: 'ScrcpyOverWebRTC Docs',
      description: 'Next-gen Ultra-Low Latency Cloud Phone & Screen Mirroring Documentation',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/index.html' },
          { text: 'Quickstart', link: '/en/introduction' },
          { text: 'Device Setup', link: '/en/agent-prep' },
          { text: 'Server Deploy', link: '/en/deploy-config' },
          { text: 'Features', link: '/en/feature-dashboard' },
          { text: 'Tutorials', link: '/en/tutorial-windows' },
          { text: 'FAQ', link: '/en/faq' }
        ],
        sidebar: [
          {
            text: '📖 1. Overview & Architecture',
            collapsed: false,
            items: [
              { text: 'Documentation Home', link: '/en/' },
              { text: 'Introduction & Architecture', link: '/en/introduction' },
              { text: 'Core Feature Matrix', link: '/en/features' },
              { text: 'Hardware Requirements & Sizing', link: '/en/quickstart' },
              { text: 'Industry Use Cases & Sizing', link: '/en/use-cases' }
            ]
          },
          {
            text: '📱 2. Device Access & Agent Setup',
            collapsed: false,
            items: [
              { text: 'Onboarding Overview & Matrix', link: '/en/agent-deploy' },
              { text: 'Device Preparation & Developer Options', link: '/en/agent-prep' },
              { text: 'Method 1: WebUSB Browser Setup', link: '/en/agent-webusb' },
              { text: 'Method 2: PC Script One-Click Setup', link: '/en/agent-script' },
              { text: 'Method 3: Magisk / Root Auto-Start', link: '/en/agent-magisk' },
              { text: 'Method 4: Android App Native Client', link: '/en/app-guide' },
              { text: 'Method 5: Docker / Redroid Cloud Phone', link: '/en/agent-docker' }
            ]
          },
          {
            text: '💻 3. Server Deployment & Operations',
            collapsed: false,
            items: [
              { text: 'Server Unified Configuration & Ports', link: '/en/deploy-config' },
              { text: 'LAN & Standalone Green Deployment', link: '/en/deploy-lan' },
              { text: 'Docker All-in-One Deployment (AIO)', link: '/en/deploy-docker' },
              { text: 'NAS & Router Deployment (fnOS / iStoreOS)', link: '/en/deploy-nas' },
              { text: 'Public Cloud ECS & NAT Traversal', link: '/en/deploy-cloud' },
              { text: 'Standalone Device Mode', link: '/en/deploy-standalone' }
            ]
          },
          {
            text: '🎮 4. Core Features User Manual',
            collapsed: false,
            items: [
              { text: 'Monitoring Matrix, Direct & Group Control', link: '/en/feature-dashboard' },
              { text: 'Multi-User, Leases & Audit Logging', link: '/en/feature-users' },
              { text: 'Device Sharing & Access Passcodes', link: '/en/feature-share' },
              { text: 'Device Tag Management & Filtering', link: '/en/feature-tags' },
              { text: 'Advanced Input: IME Text & Keymapping', link: '/en/feature-inputs' },
              { text: 'Remote Terminal: xterm.js & Macros', link: '/en/feature-terminal' },
              { text: 'P2P File Manager & APK Distribution', link: '/en/feature-files' },
              { text: 'AI Troubleshooting & Diagnostic Assistant', link: '/en/feature-ai' }
            ]
          },
          {
            text: '🎯 5. Hands-On Tutorials',
            collapsed: false,
            items: [
              { text: 'Tutorial 1: Windows Local Setup', link: '/en/tutorial-windows' },
              { text: 'Tutorial 2: Alibaba Cloud ECS Setup', link: '/en/tutorial-aliyun' }
            ]
          },
          {
            text: '⚙️ 6. Advanced Customization & Development',
            collapsed: false,
            items: [
              { text: 'Virtual HAL Injection (Camera/GPS/Sensors)', link: '/en/rom-hal' },
              { text: 'Web Console Secondary Development', link: '/en/dev-web' },
              { text: 'Website & Documentation Building', link: '/en/dev-website' }
            ]
          },
          {
            text: '🛠️ 7. Troubleshooting & Optimization',
            collapsed: false,
            items: [
              { text: 'Frequently Asked Questions (FAQ)', link: '/en/faq' }
            ]
          }
        ],
        outline: {
          level: [2, 3],
          label: 'On this page'
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        },
        darkModeSwitchLabel: 'Theme',
        lightModeSwitchTitle: 'Switch to light mode',
        darkModeSwitchTitle: 'Switch to dark mode',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Return to top'
      }
    }
  },

  themeConfig: {
    logo: '/favicon.svg',
    
    // 全站本地模糊搜索配置 (开箱即用)
    search: {
      provider: 'local',
      options: {
        translations: {
          button: {
            buttonText: '搜索文档 / Search docs...',
            buttonAriaLabel: '搜索文档'
          },
          modal: {
            noResultsText: '无法找到相关结果 / No results found',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择 / Select',
              navigateText: '切换 / Navigate',
              closeText: '关闭 / Close'
            }
          }
        }
      }
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/hqw700/ScrcpyOverWebRTC' }
    ],

    // 页脚配置
    footer: {
      message: 'Distributed under open source license. Synced with AOSP and scrcpy standards.',
      copyright: 'Copyright © 2026-present ScrcpyOverWebRTC Project'
    }
  }
}))
