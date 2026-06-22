import { useEffect, useRef, useState } from 'react'

/*
 * Loader — 加载动画
 * 时序：
 *   0ms     → 背景光球浮现，名字淡入，进度线开始填充
 *   2200ms  → 进度线填满，数字到 100
 *   2400ms  → 遮罩整体向上滑出
 *   3000ms  → 组件卸载
 *
 * 进度条宽度用 ref 直接操纵 DOM，跳过 React 渲染周期，保证逐帧流畅
 */
export default function Loader({ onDone }) {
  const [count,   setCount]   = useState(0)   // 显示用百分比整数
  const [leaving, setLeaving] = useState(false)
  const barRef = useRef(null)  // 直接操纵进度条 DOM，不走 setState

  useEffect(() => {
    const duration = 2200
    const start    = performance.now()

    let raf
    const tick = (now) => {
      const elapsed = now - start
      const linear  = Math.min(elapsed / duration, 1)
      // easeInOutQuart：开头慢 → 中间快 → 结尾慢
      const eased   = linear < 0.5
        ? 8 * linear ** 4
        : 1 - Math.pow(-2 * linear + 2, 4) / 2

      if (barRef.current) {
        barRef.current.style.width = `${eased * 100}%`
      }
      setCount(Math.floor(eased * 100))

      if (linear < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    const t1 = setTimeout(() => setLeaving(true), 2400)
    const t2 = setTimeout(() => onDone(),          3000)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDone])

  return (
    <div className={`loader${leaving ? ' loader--leave' : ''}`} aria-hidden="true">

      {/* 流动光球层：三个缓慢漂移的渐变色晕 */}
      <div className="loader-orb loader-orb-1" />
      <div className="loader-orb loader-orb-2" />
      <div className="loader-orb loader-orb-3" />

      {/* 细网格纹理 */}
      <div className="loader-grid" />

      {/* 噪点纹理 */}
      <div className="loader-noise" />

      {/* 中心：名字 */}
      <div className="loader-center">
        <p className="loader-role">3D VFX Artist</p>
        <h1 className="loader-name">肖岩</h1>
      </div>

      {/* 底部：进度线 + 百分比 */}
      <div className="loader-bar-wrap">
        <div className="loader-bar" ref={barRef} />
        <span className="loader-bar-pct">{count}%</span>
      </div>
    </div>
  )
}
