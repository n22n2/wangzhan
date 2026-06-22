/*
 * ─────────────────────────────────────────────────
 *  PhysicsPlayground — 技能标签物理互动场景
 *
 *  原理：
 *    1. 标签元素先以 position:absolute 渲染在容器内，opacity:0
 *    2. rAF 后测量每个标签的真实尺寸，创建对应的 Matter.js 矩形刚体
 *    3. Runner 驱动引擎，每帧将 body.position / angle 同步到 DOM transform
 *    4. MouseConstraint 绑定容器，让用户可以抓起和抛掷标签
 *    5. resize 时移除旧边界墙、按新尺寸重建
 *
 *  调参：
 *    restitution  → 弹性（0 = 不弹，1 = 完全弹）
 *    frictionAir  → 空气阻力（越大越快停下）
 *    gravity.y    → 重力强度
 *    TAGS         → 标签内容列表（≤60 个）
 * ─────────────────────────────────────────────────
 */

import { useEffect, useRef } from 'react'
import Matter from 'matter-js'

const { Engine, Runner, Bodies, Body, World, MouseConstraint, Mouse, Composite, Events } = Matter

/* 标签内容：技术关键词（中英文通用，无需 i18n）*/
const TAGS = [
  '台球', 'Niagara', 'Control',
  '台球', 'Niagara', 'Control',
  '台球', 'Niagara', 'Control',
]

/* t prop：接收当前语言文案，用于标题 / 副标题的中英文切换 */
export default function PhysicsPlayground({ t }) {
  const containerRef = useRef(null) // 物理场景容器 DOM
  const engineRef   = useRef(null)  // Matter.Engine 实例
  const runnerRef   = useRef(null)  // Matter.Runner 实例
  const rafRef      = useRef(null)  // requestAnimationFrame 句柄

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let onResize

    const frameId = requestAnimationFrame(() => {
      const W = container.offsetWidth
      const H = container.offsetHeight

      /* ── 创建物理引擎 ── */
      const engine = Engine.create({ gravity: { y: 1.2 } })
      engineRef.current = engine
      const runner = Runner.create()
      runnerRef.current = runner

      /* ── 边界墙工厂 ── */
      const makeWalls = (w, h) => [
        Bodies.rectangle(w / 2, h + 25, w + 100, 50, { isStatic: true, label: 'wall', friction: 0.4 }), // 地板
        Bodies.rectangle(w / 2,    -25, w + 100, 50, { isStatic: true, label: 'wall' }),                 // 顶墙
        Bodies.rectangle(-25,    h / 2,  50, h + 100, { isStatic: true, label: 'wall' }),                // 左墙
        Bodies.rectangle(w + 25, h / 2,  50, h + 100, { isStatic: true, label: 'wall' }),                // 右墙
      ]
      World.add(engine.world, makeWalls(W, H))

      /* ── 创建标签刚体 ── */
      const tagEls = Array.from(container.querySelectorAll('[data-ptag]'))
      const pairs = tagEls.map((el, i) => {
        const rect = el.getBoundingClientRect()
        const bw = Math.max(rect.width,  60)
        const bh = Math.max(rect.height, 28)
        const x  = 80 + Math.random() * Math.max(W - 160, 10)
        const y  = 50 + Math.random() * Math.max(H - 100, 10)

        const body = Bodies.rectangle(x, y, bw, bh, {
          restitution: 0.6,
          friction:    0.08,
          frictionAir: 0.018,
          density:     0.0015,
          label: 'tag'
        })
        Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06)
        World.add(engine.world, body)
        el.style.opacity = '1'
        return { body, el, bw, bh }
      })

      /* ── MouseConstraint ── */
      const mouse = Mouse.create(container)

      /* 移除 Matter.js 对滚轮事件的劫持（覆盖三种事件名，兼容各浏览器）*/
      mouse.element.removeEventListener('mousewheel',    mouse.mousewheel)
      mouse.element.removeEventListener('DOMMouseScroll', mouse.mousewheel)
      mouse.element.removeEventListener('wheel',         mouse.mousewheel) // 现代浏览器标准事件名

      /* 额外：在容器上监听 wheel，以 passive 方式透传，确保页面可以正常滚动 */
      const onWheel = (e) => { e.stopPropagation() }
      container.addEventListener('wheel', onWheel, { passive: true })

      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } }
      })
      World.add(engine.world, mc)

      Events.on(mc, 'startdrag', () => { container.style.cursor = 'grabbing' })
      Events.on(mc, 'enddrag',   () => { container.style.cursor = 'grab' })

      Runner.run(runner, engine)

      /* ── 每帧同步 body → DOM ── */
      const sync = () => {
        pairs.forEach(({ body, el, bw, bh }) => {
          const { x, y } = body.position
          const a = body.angle
          el.style.transform = `translate(${x - bw / 2}px, ${y - bh / 2}px) rotate(${a}rad)`
        })
        rafRef.current = requestAnimationFrame(sync)
      }
      rafRef.current = requestAnimationFrame(sync)

      /* ── resize：重建边界墙 ── */
      onResize = () => {
        const nW = container.offsetWidth
        const nH = container.offsetHeight
        Composite.allBodies(engine.world)
          .filter(b => b.label === 'wall')
          .forEach(b => World.remove(engine.world, b))
        makeWalls(nW, nH).forEach(b => World.add(engine.world, b))
      }
      window.addEventListener('resize', onResize)
    })

    return () => {
      cancelAnimationFrame(frameId)
      cancelAnimationFrame(rafRef.current)
      if (runnerRef.current) Runner.stop(runnerRef.current)
      if (engineRef.current) Engine.clear(engineRef.current)
      if (onResize) window.removeEventListener('resize', onResize)
    }
  }, [])

  /* 从 t 中取文案，缺省兜底 */
  const label = t?.physics?.label    || '— 互动'
  const title = t?.physics?.title    || '互动一下吧'
  const sub   = t?.physics?.sub      || '拖拽它们'

  return (
    <section className="section physics-section">
      <div className="container">
        <div className="section-label reveal">{label}</div>
        <h2 className="section-title reveal">{title}</h2>
        <p className="section-desc reveal">{sub}</p>
      </div>

      <div ref={containerRef} className="physics-container" style={{ cursor: 'grab' }} aria-hidden="true">
        {TAGS.map((tag, i) => (
          <span key={i} data-ptag className="physics-tag">
            {tag}
          </span>
        ))}
      </div>
    </section>
  )
}
