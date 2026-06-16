/*
 * ─────────────────────────────────────────────────
 *  Hero 组件 — 首屏（页面最上方）
 *  结构：顶部渐变背景 + 流动光环 + 鼠标光斑 + 网格 + 暗色遮罩
 *        → 主标题（VFX）+ 简介 + 两个按钮 + 底部签名
 *  修改提示：
 *    - 主标题：修改 hero-title-main 中的文字（如将"VFX"）
 *    - 胶囊标签：修改 hero-title-accent 中的文字
 *    - 简介文字：修改 hero-desc 区块
 *    - 按钮文字/链接：修改 hero-cta 区块
 *    - 背景风格：如需加入背景视频，可在 hero-fallback 前添加
 * ─────────────────────────────────────────────────
 */

import { useRef, useEffect } from 'react'

export default function Hero() {

  /* heroRef：用于绑定到 section.hero DOM 节点，便于在 JS 中监听鼠标事件 */
  const heroRef = useRef(null)

  /* ========== 鼠标跟随：监听鼠标移动，实时更新 CSS 变量 ========== */
  /* --mx, --my = 鼠标在 Hero 区域内的百分比坐标（用于径向渐变）
     --px, --py = 鼠标偏离中心的像素位移（用于让元素轻微视差） */
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return   /* 如果找不到 hero 节点则不执行 */

    /* 鼠标移动处理函数 */
    const handleMouseMove = (e) => {
      const rect = hero.getBoundingClientRect()

      /* 将鼠标坐标转为 hero 区域内的百分比 */
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      hero.style.setProperty('--mx', x + '%')
      hero.style.setProperty('--my', y + '%')

      /* 计算偏离中心点的偏移，用于视差效果（正负 10px 范围） */
      const offsetX = ((e.clientX - rect.left) / rect.width - 0.5) * 20
      const offsetY = ((e.clientY - rect.top) / rect.height - 0.5) * 20
      hero.style.setProperty('--px', offsetX + 'px')
      hero.style.setProperty('--py', offsetY + 'px')
    }

    /* 挂载：注册鼠标移动监听 */
    hero.addEventListener('mousemove', handleMouseMove)
    /* 卸载：移除监听（组件销毁时）*/
    return () => hero.removeEventListener('mousemove', handleMouseMove)
  }, [])
  /* 依赖数组为空 = 仅在组件首次渲染时执行一次 */

  /* ========== 返回 JSX（页面结构）========== */
  return (
    /* —— 整个首屏容器 ——
       ref={heroRef}：让上面的鼠标监听绑定到这里 */
    <section className="hero" ref={heroRef}>

      /* ========== 背景层（从底层到上层依次堆叠） ========== */
      /* 注意：这些背景层都设置了 aria-hidden="true"
         表示它们仅作装饰用，不会被屏幕阅读器朗读 */

      <div className="hero-fallback" aria-hidden="true"></div>
      /* 基础暗色径向渐变背景（最底层）*/

      <div className="hero-orbit hero-orbit-1" aria-hidden="true"></div>
      /* 流动光环 1（较大的椭圆环，顺时针缓慢转动）*/

      <div className="hero-orbit hero-orbit-2" aria-hidden="true"></div>
      /* 流动光环 2（较小的椭圆环，逆时针转动）*/

      <div className="hero-spotlight" aria-hidden="true"></div>
      /* 鼠标跟随光斑（主光斑），跟随鼠标位置）*/

      <div className="hero-spotlight-secondary" aria-hidden="true"></div>
      /* 环境光斑（次光斑），固定在某个位置做氛围光）*/

      <div className="hero-noise" aria-hidden="true"></div>
      /* 胶片噪点叠加层，让暗色更有质感 */

      <div className="hero-grid" aria-hidden="true"></div>
      /* 细线网格，随鼠标做轻微视差 */

      <div className="hero-overlay"></div>
      /* 暗色遮罩：让背景变暗，保证文字可读（最上层背景）*/

      /* ========== 内容层：标题 + 简介 + 按钮 ========== */
      <div className="container hero-content">

        {/* —— 主标题 —— */}
        <h1 className="hero-title">
          {/* 上方小胶囊标签，如 "3D视效" */}
          <span className="hero-title-accent">3D视效</span>
          {/* 下方超大标题，如 "VFX" —— 这是整个首屏的视觉核心 */}
          <span className="hero-title-main vfx-title">VFX</span>
        </h1>

        {/* —— 简介段落 —— */}
        <p className="hero-desc">
          专注于三维视觉特效、动态图形与合成影像的独立创作者。
        </p>

        {/* —— 两个操作按钮（CTA = Call To Action）—— */}
        <div className="hero-cta">
          {/* 主按钮：查看作品 —— href="#work" 跳转到作品区块 */}
          <a href="#work" className="btn-primary" data-spotlight data-cursor-hover>
            <span className="btn-label">查看精选作品</span>
            <span className="btn-arrow">↗</span>
          </a>
          {/* 次按钮：联系我 —— href="#contact" 跳转到联系方式 */}
          <a href="#contact" className="btn-ghost" data-spotlight data-cursor-hover>
            <span className="btn-label">联系我</span>
            <span className="btn-arrow">→</span>
          </a>
        </div>

      </div>

      /* ========== 底部签名栏（底部一行文字） ========== */
      <div className="hero-footer">
        <span>肖岩 · Xiao Yan</span>
        {/* 左侧：姓名 */}
        <span className="scroll-hint">
          <span className="scroll-line"></span>
          向下滚动
        </span>
        {/* 中间：向下滚动提示 + 细横线动画 */}
        <span>© 2026</span>
        {/* 右侧：版权年份 */}
      </div>

    </section>
  )
}
