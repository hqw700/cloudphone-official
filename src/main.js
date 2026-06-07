/* ==========================================================================
   CloudPhone - 官网首页主逻辑脚本 (Main Interaction Script V3)
   ========================================================================== */

import './style.css'

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll()
  initCommandCopy()
  initLatencySimulation()
  
  // 初始化系统架构图交互
  initArchitectureAnimation()
})

/**
 * 监听滚动，动态改变头部导航栏透明度和磨砂程度
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
 * 终端命令行的一键复制功能
 */
function initCommandCopy() {
  const copyButtons = document.querySelectorAll('.copy-btn')
  
  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const cmdText = button.getAttribute('data-cmd')
      if (!cmdText) return
      
      try {
        await navigator.clipboard.writeText(cmdText)
        
        // 成功反馈效果
        const originalHTML = button.innerHTML
        button.innerHTML = `
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3fb950" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `
        button.style.background = 'rgba(63, 185, 80, 0.1)'
        
        setTimeout(() => {
          button.innerHTML = originalHTML
          button.style.background = 'transparent'
        }, 2000)
      } catch (err) {
        console.error('复制失败:', err)
      }
    })
  })
}

/**
 * 手机 Mockup 中的 Latency 延迟参数微颤动，使界面产生逼真的实时推流效果
 */
function initLatencySimulation() {
  const latencySpan = document.querySelector('.screen-latency')
  if (!latencySpan) return
  
  setInterval(() => {
    const randomLatency = Math.floor(Math.random() * 5) + 10 // 10ms - 14ms
    latencySpan.textContent = `Latency: ${randomLatency}ms`
  }, 1800)
}

/**
 * 系统架构图的动效控制逻辑 (整合自 arch-anima.html - 原汁原味完整移植版)
 */
function initArchitectureAnimation() {
  const wrapper = document.getElementById('arch-canvas-wrapper')
  const canvas = document.getElementById('recording-canvas')
  if (!wrapper || !canvas) return

  // 1. 等比例自适应宽度缩放
  function resizeArchCanvas() {
    const containerWidth = wrapper.clientWidth
    const scale = containerWidth / 1280
    
    canvas.style.transform = `scale(${scale})`
    wrapper.style.height = `${720 * scale}px`
  }

  window.addEventListener('resize', resizeArchCanvas)
  window.addEventListener('load', resizeArchCanvas)
  // 延时执行以确保 DOM 完全渲染完毕
  setTimeout(resizeArchCanvas, 50)
  setTimeout(resizeArchCanvas, 300)

  // 2. 交互状态管理
  const tabs = ['overview', 'minimal', 'signaling', 'streaming', 'interactive', 'file', 'adb']
  const metrics = {
    overview: {
      channel: "P2P (UDP Direct) / IPv6",
      rtt: "18.5 ms",
      video: "15.4 Mbps @ 60fps",
      audio: "48 kHz / Stereo",
      touch: "1.8 ms"
    },
    minimal: {
      channel: "P2P (UDP Direct) / IPv6",
      rtt: "18.2 ms",
      video: "15.4 Mbps @ 60fps",
      audio: "--",
      touch: "--"
    },
    signaling: {
      channel: "WebSocket WS (Signaling)",
      rtt: "120.4 ms",
      video: "-- / Offline",
      audio: "-- / Offline",
      touch: "--"
    },
    streaming: {
      channel: "P2P (UDP Direct) / IPv6",
      rtt: "18.1 ms",
      video: "15.8 Mbps @ 60fps",
      audio: "48 kHz / Stereo",
      touch: "--"
    },
    interactive: {
      channel: "DataChannel (Reliable)",
      rtt: "17.9 ms",
      video: "14.2 Mbps @ 60fps",
      audio: "48 kHz / Stereo",
      touch: "1.5 ms"
    },
    file: {
      channel: "DataChannel (file-channel)",
      rtt: "18.8 ms",
      video: "-- / Background",
      audio: "12.5 MB/s",
      touch: "--"
    },
    adb: {
      channel: "DataChannel (adb-channel)",
      rtt: "22.3 ms",
      video: "-- / Suspended",
      audio: "-- / Suspended",
      touch: "2.1 ms"
    }
  }

  let activeTab = 'overview'
  let termInterval = null
  let touchInterval = null

  function switchArchTab(mode) {
    activeTab = mode
    
    // 清除旧的 state class 并应用新的 state
    canvas.className = 'bg-grid select-none state-' + mode

    // 切换 Tab 选项卡高亮样式
    tabs.forEach(tab => {
      const btn = document.getElementById('tab-' + tab)
      if (!btn) return
      
      if (tab === mode) {
        btn.className = "flex-grow text-center py-2 text-xs font-semibold rounded-lg text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 transition-all duration-300 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
      } else {
        btn.className = "flex-grow text-center py-2 text-xs font-semibold rounded-lg text-slate-400 hover:text-white transition-all duration-300"
      }
    })

    // 更新 SVG 流光通道连线
    updatePipeFlows(mode)

    // 控制手机屏幕和终端内容联动
    const screenApps = document.getElementById('screen-apps')
    const screenVideo = document.getElementById('screen-video')
    const screenFile = document.getElementById('screen-file')
    const screenTouchDot = document.getElementById('screen-touch-dot')
    const termContent = document.getElementById('term-content')
    const termTitle = document.getElementById('term-title')

    if (!screenApps || !screenVideo || !screenFile || !screenTouchDot || !termContent || !termTitle) return

    termTitle.innerText = "🐚 Web-ADB Terminal"
    
    clearInterval(termInterval)
    clearInterval(touchInterval)
    screenTouchDot.style.opacity = '0'

    if (mode === 'streaming') {
      screenApps.style.opacity = '0'
      screenVideo.style.opacity = '1'
      screenFile.style.opacity = '0'
    } else if (mode === 'minimal') {
      screenApps.style.opacity = '0'
      screenVideo.style.opacity = '1'
      screenFile.style.opacity = '0'
    } else if (mode === 'file') {
      screenApps.style.opacity = '0'
      screenVideo.style.opacity = '0'
      screenFile.style.opacity = '1'
      termTitle.innerText = "📁 File Transfer Manager"

      let lineCount = 0
      const logs = [
        "[FileChannel] upload_start: /sdcard/Download/wechat_v8.0.apk (125MB)",
        "[FileChannel] session hash check: SHA-256 verifying...",
        "[FileChannel] received chunk 45/520 (8.6%)",
        "[FileChannel] received chunk 180/520 (34.6%)",
        "[FileChannel] received chunk 360/520 (69.2%)",
        "[FileChannel] upload_finished: 131072000 bytes written",
        "shell@redroid:/ $ pm install -r /sdcard/Download/wechat_v8.0.apk",
        "Success (wechat installed successfully)"
      ]
      termContent.innerHTML = "<div>[FileChannel] channel established.</div><div>type: upload, installOnFinish: true</div>"
      termInterval = setInterval(() => {
        const log = logs[lineCount % logs.length]
        const div = document.createElement('div')
        div.innerText = log
        if (termContent.children.length > 7) {
          termContent.removeChild(termContent.firstChild)
        }
        termContent.appendChild(div)
        lineCount++
      }, 1000)
    } else if (mode === 'interactive') {
      screenApps.style.opacity = '0'
      screenVideo.style.opacity = '1' // 交互模式包含视频流背景
      screenFile.style.opacity = '0'
      screenTouchDot.style.opacity = '1'
      
      let angle = 0
      touchInterval = setInterval(() => {
        angle += 0.05
        const x = 50 + Math.sin(angle) * 30
        const y = 90 + Math.cos(angle * 1.5) * 35
        screenTouchDot.style.left = `${x}px`
        screenTouchDot.style.top = `${y}px`
      }, 30)
    } else if (mode === 'adb') {
      screenApps.style.opacity = '1'
      screenVideo.style.opacity = '0'
      screenFile.style.opacity = '0'
      
      let lineCount = 0
      const logs = [
        "shell@redroid:/ $ adb shell",
        "06-05 09:20:01.120 I/cloudphone-agent(124): ADB Tunnel Init",
        "06-05 09:20:01.155 D/adbd(1022): write CNXN payload size 24",
        "06-05 09:20:01.210 D/adbd(1022): received OPEN local 1 remote 1",
        "06-05 09:20:01.215 I/cloudphone-agent(124): Direct tunnel established",
        "06-05 09:20:02.045 D/adbd(1022): command execute success",
        "06-05 09:20:03.112 D/adbd(1022): socket recv loop active"
      ]
      termContent.innerHTML = "<div>shell@redroid:/ $ adb shell</div><div>[adb-channel] connected.</div>"
      termInterval = setInterval(() => {
        const log = logs[lineCount % logs.length]
        const div = document.createElement('div')
        div.innerText = log
        if (termContent.children.length > 7) {
          termContent.removeChild(termContent.firstChild)
        }
        termContent.appendChild(div)
        lineCount++
      }, 1000)
    } else {
      screenApps.style.opacity = '1'
      screenVideo.style.opacity = '0'
      screenFile.style.opacity = '0'
    }

    // 动态更改监控面板的标签
    const audioTitle = document.getElementById('metric-audio-title')
    if (audioTitle) {
      if (mode === 'file') {
        audioTitle.innerText = "File Transfer Rate"
      } else {
        audioTitle.innerText = "Opus Audio Stream"
      }
    }

    // 静态写入监控指标
    const m = metrics[mode]
    document.getElementById('metric-channel').innerText = m.channel
    document.getElementById('metric-rtt').innerText = m.rtt
    document.getElementById('metric-video').innerText = m.video
    document.getElementById('metric-audio').innerText = m.audio
    document.getElementById('metric-touch').innerText = m.touch
  }

  // 管道高亮切换
  function updatePipeFlows(mode) {
    const glowIds = [
      'glow-sig-web', 'glow-sig-agent', 'glow-webrtc-media',
      'glow-webrtc-touch', 'glow-webrtc-file', 'glow-webrtc-adb',
      'glow-uds-video', 'glow-uds-audio', 'glow-uds-touch',
      'glow-uds-control', 'glow-agent-adb'
    ]

    glowIds.forEach(id => {
      const el = document.getElementById(id)
      if (el) el.classList.add('opacity-0')
    })

    const miniLabels = ['mini-webrtc-label', 'mini-sig-label']
    miniLabels.forEach(id => {
      const el = document.getElementById(id)
      if (el) el.classList.add('hidden', 'opacity-0')
    })

    if (mode === 'overview') {
      glowIds.forEach(id => {
        const el = document.getElementById(id)
        if (el) el.classList.remove('opacity-0')
      })
    } else if (mode === 'minimal') {
      document.getElementById('glow-sig-web').classList.remove('opacity-0')
      document.getElementById('glow-sig-agent').classList.remove('opacity-0')
      document.getElementById('glow-webrtc-media').classList.remove('opacity-0')
      miniLabels.forEach(id => {
        const el = document.getElementById(id)
        if (el) {
          el.classList.remove('hidden')
          setTimeout(() => el.classList.remove('opacity-0'), 50)
        }
      })
    } else if (mode === 'signaling') {
      document.getElementById('glow-sig-web').classList.remove('opacity-0')
      document.getElementById('glow-sig-agent').classList.remove('opacity-0')
    } else if (mode === 'streaming') {
      document.getElementById('glow-webrtc-media').classList.remove('opacity-0')
      document.getElementById('glow-uds-video').classList.remove('opacity-0')
      document.getElementById('glow-uds-audio').classList.remove('opacity-0')
    } else if (mode === 'interactive') {
      document.getElementById('glow-webrtc-touch').classList.remove('opacity-0')
      document.getElementById('glow-uds-touch').classList.remove('opacity-0')
      document.getElementById('glow-uds-control').classList.remove('opacity-0')
      document.getElementById('glow-webrtc-media').classList.remove('opacity-0')
      document.getElementById('glow-uds-video').classList.remove('opacity-0')
    } else if (mode === 'file') {
      document.getElementById('glow-webrtc-file').classList.remove('opacity-0')
      document.getElementById('glow-agent-adb').classList.remove('opacity-0')
    } else if (mode === 'adb') {
      document.getElementById('glow-webrtc-adb').classList.remove('opacity-0')
      document.getElementById('glow-agent-adb').classList.remove('opacity-0')
    }
  }

  // 3. 动态指标跳变微动与折线图生成
  setInterval(() => {
    if (activeTab === 'overview' || activeTab === 'streaming' || activeTab === 'interactive' || activeTab === 'file') {
      const baseRTT = activeTab === 'interactive' ? 17.5 : (activeTab === 'file' ? 18.5 : 18.0)
      const jitter = (Math.random() * 0.8 - 0.4).toFixed(1)
      const rttVal = (parseFloat(baseRTT) + parseFloat(jitter)).toFixed(1)
      document.getElementById('metric-rtt').innerText = `${rttVal} ms`

      if (activeTab !== 'file') {
        const baseVideo = 15.0
        const videoJitter = (Math.random() * 1.2 - 0.6).toFixed(1)
        const videoVal = (parseFloat(baseVideo) + parseFloat(videoJitter)).toFixed(1)
        document.getElementById('metric-video').innerText = `${videoVal} Mbps @ 60fps`
      }

      if (activeTab === 'file') {
        const baseSpeed = 12.0
        const speedJitter = (Math.random() * 3.5 - 1.75).toFixed(1)
        const speedVal = (parseFloat(baseSpeed) + parseFloat(speedJitter)).toFixed(1)
        document.getElementById('metric-audio').innerText = `${speedVal} MB/s`
      }

      if (activeTab !== 'streaming' && activeTab !== 'file') {
        const baseTouch = 1.6
        const touchJitter = (Math.random() * 0.4 - 0.2).toFixed(1)
        const touchVal = (parseFloat(baseTouch) + parseFloat(touchJitter)).toFixed(1)
        document.getElementById('metric-touch').innerText = `${touchVal} ms`
      }
    } else if (activeTab === 'adb') {
      const baseRTT = 22.0
      const jitter = (Math.random() * 1.6 - 0.8).toFixed(1)
      document.getElementById('metric-rtt').innerText = `${(baseRTT + parseFloat(jitter)).toFixed(1)} ms`
    }

    // 绘制折线图
    const path = document.getElementById('jitter-path')
    if (!path) return
    
    let points = []
    for (let i = 0; i <= 10; i++) {
      const x = i * 20
      let y = 20
      if (activeTab === 'signaling') {
        y = 20 + (Math.random() * 15 - 7.5)
      } else if (activeTab === 'streaming' || activeTab === 'interactive' || activeTab === 'overview' || activeTab === 'file') {
        y = 20 + (Math.random() * 4 - 2)
      } else {
        y = 20 + (Math.random() * 8 - 4)
      }
      points.push(`${x} ${y}`)
    }
    
    let d = "M " + points[0]
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1].split(' ')
      const curr = points[i].split(' ')
      const xc = (parseFloat(prev[0]) + parseFloat(curr[0])) / 2
      const yc = (parseFloat(prev[1]) + parseFloat(curr[1])) / 2
      d += ` Q ${prev[0]} ${prev[1]}, ${xc} ${yc}`
    }
    path.setAttribute('d', d)
  }, 400)

  // 4. 绑定 Tab 点击事件 (Vite 下的最佳实践)
  tabs.forEach(tab => {
    const btn = document.getElementById('tab-' + tab)
    if (btn) {
      btn.addEventListener('click', () => {
        switchArchTab(tab)
      })
    }
  })

  // 将方法挂载到 window 上，防止 HTML 的 onclick 报错
  window.switchArchTab = switchArchTab

  // 初始化首帧流动
  updatePipeFlows('overview')
}
