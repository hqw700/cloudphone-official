/* ==========================================================================
   CloudPhone - 申请试用交互逻辑 (Apply Trial Interactions)
   ========================================================================== */

import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll()
  initApplyForm()
})

/**
 * 监听滚动，动态改变头部导航栏透明度和磨砂程度 (与主页 main.js 保持完全一致)
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

/**
 * 表单校验及提交逻辑模拟
 */
function initApplyForm() {
  const form = document.getElementById('apply-form')
  const loadingDiv = document.getElementById('submit-loading')
  const successDiv = document.getElementById('submit-success')
  
  if (!form || !loadingDiv || !successDiv) return
  
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    // 基础输入捕获
    const orgName = document.getElementById('orgName').value.trim()
    const contactName = document.getElementById('contactName').value.trim()
    const contactPhone = document.getElementById('contactPhone').value.trim()
    const email = document.getElementById('email').value.trim()
    const scale = document.getElementById('scale').value
    const useCase = document.getElementById('useCase').value.trim()
    
    // 隐藏主表单并进入 loading
    form.style.opacity = '0'
    setTimeout(() => {
      form.style.display = 'none'
      loadingDiv.style.display = 'flex'
      loadingDiv.style.opacity = '1'
    }, 200)
    
    // 模拟 1.5 秒加密提交上报
    setTimeout(() => {
      // 写入本地存储做数据记录 (演示)
      const applications = JSON.parse(localStorage.getItem('cloudphone_applications') || '[]')
      applications.push({
        orgName,
        contactName,
        contactPhone,
        email,
        scale,
        useCase,
        date: new Date().toISOString()
      })
      localStorage.setItem('cloudphone_applications', JSON.stringify(applications))
      
      // 隐藏 loading 进入 success
      loadingDiv.style.opacity = '0'
      setTimeout(() => {
        loadingDiv.style.display = 'none'
        successDiv.style.display = 'flex'
        successDiv.style.opacity = '1'
      }, 200)
      
    }, 1500)
  })
}
