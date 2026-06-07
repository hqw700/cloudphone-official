import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'CloudPhone Docs',
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
      { text: '官网首页', link: 'http://localhost:8443/' }, // 便于从文档回退到官网
      { text: '帮助指南', link: '/introduction' },
      { text: '开发指南', link: '/deps-and-build' }
    ],

    // 侧边栏目录配置
    sidebar: [
      {
        text: '🚀 快速开始',
        collapsed: false,
        items: [
          { text: '项目简介 & 架构优势', link: '/introduction' },
          { text: '极速运行指南', link: '/quickstart' }
        ]
      },
      {
        text: '💻 服务端部署',
        collapsed: false,
        items: [
          { text: '依赖安装与服务编译', link: '/deps-and-build' },
          { text: 'Docker & TURN 一键部署', link: '/deploy-cloud' }
        ]
      },
      {
        text: '📱 Agent 安装与推送',
        collapsed: false,
        items: [
          { text: 'Agent 部署 (Redroid & 真机)', link: '/agent-deploy' }
        ]
      },
      {
        text: '🛠️ 高级配置与常见问题',
        collapsed: false,
        items: [
          { text: '自定义按键映射规范', link: '/keymap-advanced' },
          { text: '常见问题排查 (FAQ)', link: '/faq' }
        ]
      }
    ],

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com' }
    ],

    // 页脚配置
    footer: {
      message: '基于开源协议分发。本文档持续同步 AOSP 与 scrcpy 优化规范。',
      copyright: 'Copyright © 2026-present CloudPhone Project'
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
})
