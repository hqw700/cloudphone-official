import DefaultTheme from 'vitepress/theme'
import { watch, onMounted, nextTick } from 'vue'
import { useRoute } from 'vitepress'
import './custom.css'

export default {
  extends: DefaultTheme,
  setup() {
    const route = useRoute()

    const initLightbox = () => {
      // 避免重复注册，先移除可能存在的老监听
      document.removeEventListener('click', handleMermaidClick)
      document.addEventListener('click', handleMermaidClick)
    }

    const handleMermaidClick = (e) => {
      // 寻找点击的目标是否在 .mermaid 容器内
      const mermaidContainer = e.target.closest('.mermaid')
      if (!mermaidContainer) return

      // 关键防冲突：如果是点击了 Mermaid 内部的链接 (a 标签或 a 标签子级)，允许默认跳转，不触发灯箱
      if (e.target.closest('a')) return

      // 获取内部真正的 SVG
      const svgElement = mermaidContainer.querySelector('svg')
      if (!svgElement) return

      e.preventDefault()
      e.stopPropagation()

      // 创建全屏 Lightbox 容器
      const lightbox = document.createElement('div')
      lightbox.id = 'mermaid-lightbox'
      lightbox.innerHTML = `
        <div class="lightbox-close">&times;</div>
        <div class="lightbox-content"></div>
        <div class="lightbox-tip">💡 双击或点击任意空白处可退出全屏 ➔</div>
      `

      // 复制并注入 SVG 节点
      const svgClone = svgElement.cloneNode(true)
      // 清理克隆 SVG 上的固定高度限制以允许在灯箱内撑满放大
      svgClone.removeAttribute('height')
      svgClone.style.width = '100%'
      svgClone.style.height = 'auto'
      lightbox.querySelector('.lightbox-content').appendChild(svgClone)

      document.body.appendChild(lightbox)

      // 触发淡入动画过渡
      requestAnimationFrame(() => {
        lightbox.classList.add('active')
      })

      // 关闭灯箱销毁函数
      const closeLightbox = () => {
        lightbox.classList.remove('active')
        setTimeout(() => {
          if (lightbox.parentNode) {
            lightbox.parentNode.removeChild(lightbox)
          }
        }, 250) // 等待淡出过渡动画结束后移除 DOM
        document.removeEventListener('keydown', handleEsc)
      }

      const handleEsc = (event) => {
        if (event.key === 'Escape' || event.key === 'Esc') {
          closeLightbox()
        }
      }

      // 点击灯箱任意处或按 Esc 关闭
      lightbox.addEventListener('click', closeLightbox)
      document.addEventListener('keydown', handleEsc)
    }

    onMounted(() => {
      initLightbox()
    })

    // 监听路由改变，在路由跳转完成且 DOM 重新渲染后重新绑定事件
    watch(() => route.path, () => {
      nextTick(() => {
        // 给 300ms 宽限期以保证 Vitepress/Mermaid 异步渲染 SVG 占位完毕
        setTimeout(initLightbox, 300)
      })
    })
  }
}
