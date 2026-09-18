/* ==========================================================================
   CloudPhone - 授权购买与闲鱼中转逻辑 (Buy & Redirect Script)
   ========================================================================== */

import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll()
  initCopyActions()
  initFaqAccordion()
  loadConfigAndHandleRedirect()
})

/**
 * 监听滚动，动态改变头部导航栏透明度和磨砂程度 (与主页和申请页一致)
 */
function initHeaderScroll() {
  const header = document.getElementById('site-header')
  if (!header) return
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.style.background = 'rgba(6, 9, 14, 0.85)'
      header.style.borderColor = 'rgba(0, 242, 254, 0.15)'
    } else {
      header.style.background = 'rgba(6, 9, 14, 0.6)'
      header.style.borderColor = 'rgba(48, 54, 61, 0.8)'
    }
  })
}

let targetXianyuUrl = 'https://m.tb.cn/h.8UxnpeF?tk=HTNmgBqagHA'
let autoRedirectTimer = null

/**
 * 异步拉取 config.json 配置并处理智能跳转
 */
async function loadConfigAndHandleRedirect() {
  try {
    const res = await fetch('/config.json')
    if (res.ok) {
      const config = await res.json()
      if (config.xianyuLink) {
        targetXianyuUrl = config.xianyuLink
      }
      
      // 更新所有闲鱼购买按钮链接
      const xianyuBtns = document.querySelectorAll('.xianyu-buy-link')
      xianyuBtns.forEach(btn => {
        btn.setAttribute('href', targetXianyuUrl)
      })

      // 更新淘口令
      const tpwdEl = document.getElementById('xianyu-tpwd-text')
      const tpwdBtn = document.getElementById('copy-tpwd-btn')
      if (config.xianyuTpwd && tpwdEl) {
        tpwdEl.textContent = config.xianyuTpwd
        tpwdEl.setAttribute('title', config.xianyuTpwd)
      }
      if (config.xianyuTpwd && tpwdBtn) {
        tpwdBtn.setAttribute('data-copy', config.xianyuTpwd)
      }

      // 更新官方邮箱
      const emailLinks = document.querySelectorAll('.contact-email-link')
      const emailTexts = document.querySelectorAll('.contact-email-text')
      const emailCopyBtn = document.getElementById('copy-email-btn')
      const email = config.contactEmail || 'cloudphone@qq.com'
      
      emailLinks.forEach(link => {
        link.setAttribute('href', `mailto:${email}`)
      })
      emailTexts.forEach(txt => {
        txt.textContent = email
      })
      if (emailCopyBtn) {
        emailCopyBtn.setAttribute('data-copy', email)
      }

      // 更新最后维护时间
      const updateEl = document.getElementById('config-update-time')
      if (config.updateTime && updateEl) {
        updateEl.textContent = config.updateTime
      }
    }
  } catch (err) {
    console.warn('⚠️ 动态配置加载失败，使用默认链接兜底:', err)
  }

  // 检查是否需要触发自动跳转
  checkAutoRedirect()
}

/**
 * 检查 URL 是否携带自动重定向参数 (?auto=1 或 ?direct=1 或 ?target=xianyu)
 */
function checkAutoRedirect() {
  const params = new URLSearchParams(window.location.search)
  const isAuto = params.get('auto') === '1' || params.get('direct') === '1' || params.get('target') === 'xianyu'
  
  if (!isAuto) return

  const banner = document.getElementById('auto-redirect-banner')
  const countdownEl = document.getElementById('redirect-countdown')
  const cancelBtn = document.getElementById('cancel-redirect-btn')
  const directBtn = document.getElementById('direct-redirect-btn')

  if (!banner || !countdownEl) return

  banner.style.display = 'flex'
  let seconds = 3
  countdownEl.textContent = `${seconds}s`

  directBtn?.setAttribute('href', targetXianyuUrl)

  autoRedirectTimer = setInterval(() => {
    seconds--
    if (seconds <= 0) {
      clearInterval(autoRedirectTimer)
      window.location.href = targetXianyuUrl
    } else {
      countdownEl.textContent = `${seconds}s`
    }
  }, 1000)

  cancelBtn?.addEventListener('click', () => {
    if (autoRedirectTimer) {
      clearInterval(autoRedirectTimer)
      autoRedirectTimer = null
    }
    banner.style.opacity = '0'
    setTimeout(() => {
      banner.style.display = 'none'
    }, 300)
  })
}

/**
 * 一键复制内容交互
 */
function initCopyActions() {
  const copyButtons = document.querySelectorAll('[data-copy]')

  copyButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault()
      const text = btn.getAttribute('data-copy')
      if (!text) return

      try {
        await navigator.clipboard.writeText(text)
        const origHtml = btn.innerHTML
        btn.innerHTML = `<span style="color: var(--color-success); font-weight: 600;">✓ 已复制</span>`
        btn.classList.add('copied')
        setTimeout(() => {
          btn.innerHTML = origHtml
          btn.classList.remove('copied')
        }, 2000)
      } catch (err) {
        console.error('复制失败:', err)
      }
    })
  })
}

/**
 * FAQ 手风琴展开与收起
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item')
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question')
    if (!question) return

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('active')
      // 关闭同级所有打开项
      faqItems.forEach(i => i.classList.remove('active'))
      if (!isOpen) {
        item.classList.add('active')
      }
    })
  })
}
