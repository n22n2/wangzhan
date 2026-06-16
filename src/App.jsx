/*
 * ─────────────────────────────────────────────────
 *  App 组件 — 整个应用的根组件
 *  作用：
 *    1. 挂载所有页面模块（Navbar + Hero + About + Projects + Advantages + Contact）
 *    2. 监听鼠标移动，驱动 CSS 变量（产生光斑 / 视差效果）
 *    3. 驱动自定义光标（小圆点 + 圆环）
 *    4. 监听滚动状态，传入 Navbar 让其变为紧凑样式
 *    5. IntersectionObserver：元素进入视口时添加淡入动画类
 *  修改提示：
 *    - 调整页面顺序：修改下方 return 中组件的排列顺序
 *    - 修改光标动画参数：调整动画循环内的插值系数（0.18）
 * ─────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar.jsx'      // 顶部导航栏
import Hero from './components/Hero.jsx'          // 首屏（VFX 大标题）
import About from './components/About.jsx'         // 关于我 + 实习经历
import Projects from './components/Projects.jsx'   // 项目作品 + 视频弹窗
import Advantages from './components/Advantages.jsx' // 能力模块
import Contact from './components/Contact.jsx'     // 联系方式页

export default function App() {

  /* ============ 引用 / 状态声明 ============ */

  const dotRef = useRef(null)       /* 自定义光标：小圆点（立即跟随鼠标） */
  const ringRef = useRef(null)      /* 自定义光标：圆环（有延迟跟随鼠标） */
  const rafRef = useRef(null)       /* requestAnimationFrame 的 id，用于关闭时取消 */

  /* 鼠标当前位置存储 — 用 ref 而非 state，避免每帧触发 React 渲染 */
  const posRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  /* 圆环的延迟位置（用于平滑追踪） */
  const ringPosRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })

  /* 页面滚动状态（true = 已向下滚动超过 40px） */
  const [scrolled, setScrolled] = useState(false)


  /* ============ 主逻辑：页面加载后执行的全局交互逻辑 ============ */
  useEffect(() => {

    /* ───── 1. 鼠标移动追踪：更新 CSS 变量，让页面各元素产生交互 ───── */
    const onMove = (e) => {
      /* 记录鼠标坐标（给光标动画使用） */
      posRef.current.x = e.clientX
      posRef.current.y = e.clientY

      /* 全局 CSS 变量 — 驱动整页背景光（如 hero / contact 的渐变光斑） */
      document.documentElement.style.setProperty('--mx', e.clientX + 'px')
      document.documentElement.style.setProperty('--my', e.clientY + 'px')

      /* 局部 CSS 变量 — 为每个带 data-spotlight 的元素设置光标相对位置
         这样在 CSS 中可以用 radial-gradient(var(--rx), var(--ry), ...) 画跟随光标 的光斑 */
      const targets = document.querySelectorAll('[data-spotlight]')
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect()
        const x = e.clientX - rect.left  /* 相对元素内部的 X 坐标 */
        const y = e.clientY - rect.top   /* 相对元素内部的 Y 坐标 */
        /* 多组变量兼容不同 CSS 模块 */
        el.style.setProperty('--rx', x + 'px')
        el.style.setProperty('--ry', y + 'px')
        el.style.setProperty('--sx', x + 'px')
        el.style.setProperty('--sy', y + 'px')
        el.style.setProperty('--ix', x + 'px')
        el.style.setProperty('--iy', y + 'px')
        el.style.setProperty('--px', x + 'px')
        el.style.setProperty('--py', y + 'px')
        el.style.setProperty('--ax', x + 'px')
        el.style.setProperty('--ay', y + 'px')
      })

      /* Hero 区的鼠标视差 — 网格与光斑轻微跟随鼠标移动 */
      const hero = document.querySelector('.hero')
      if (hero) {
        const rect = hero.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        hero.style.setProperty('--hx', x + 'px')
        hero.style.setProperty('--hy', y + 'px')
        /* 归一化后乘以 20px 作为轻微视差 */
        hero.style.setProperty('--gx', (x / rect.width - 0.5) * 20 + 'px')
        hero.style.setProperty('--gy', (y / rect.height - 0.5) * 20 + 'px')
      }

      /* Contact 区的鼠标光斑 — 类似 Hero 逻辑 */
      const contact = document.querySelector('.contact')
      if (contact) {
        const rect = contact.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        contact.style.setProperty('--cx', x + 'px')
        contact.style.setProperty('--cy', y + 'px')
      }
    }
    window.addEventListener('mousemove', onMove)


    /* ───── 2. 光标动画循环：使用 requestAnimationFrame（约 60fps 平滑更新） ───── */
    const animate = () => {
      /* 小圆点：立即移动到鼠标位置 */
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`
      }
      /* 圆环：平滑跟随鼠标 — 通过插值系数 0.18 实现缓动效果 */
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.18
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.18
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ringPosRef.current.x}px, ${ringPosRef.current.y}px) translate(-50%, -50%)`
      }
      /* 下一帧继续调用自己，形成循环 */
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)


    /* ───── 3. hover 可交互元素 — 给 <body> 添加类，让光标放大/变色 ───── */
    const interactiveSelector = 'a, button, [data-cursor-hover]'
    /* 鼠标进入：添加 cursor-hover 类 */
    const onOver = (e) => {
      if (e.target.closest(interactiveSelector)) {
        document.body.classList.add('cursor-hover')
      }
    }
    /* 鼠标离开：移除 cursor-hover 类 */
    const onOut = (e) => {
      if (e.target.closest(interactiveSelector)) {
        document.body.classList.remove('cursor-hover')
      }
    }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)


    /* ───── 4. 滚动状态：超过 40px 视为"已滚动"，导航栏变为紧凑样式 ───── */
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', onScroll, { passive: true })  /* passive = 更好的滚动性能 */


    /* ───── 5. 进入视口动画（IntersectionObserver） — 元素滚入视野时添加动画类 ───── */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          /* 元素进入视口可见比例超过 12% 时触发 */
          if (entry.isIntersecting) {
            /* 添加 is-visible 类，CSS 会让元素从下方淡入 */
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.12 }  /* 触发阈值 = 元素 12% 可见时触发 */
    )
    /* 观察所有带 reveal 类的元素 */
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))


    /* ───── 组件卸载时清理所有监听器，防止内存泄漏 ───── */
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      io.disconnect()
    }
  }, [])   /* 依赖数组为空 = 仅在首次渲染后执行一次 */


  /* ============ 返回 JSX：页面结构 ============ */
  return (
    <>
      {/* 自定义光标：2 个浮层（无实际内容，纯装饰） */}
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />

      {/* 顶部导航栏 — scrolled 状态决定是否紧凑 */}
      <Navbar scrolled={scrolled} />

      {/* 主内容区：5 个页面模块按顺序排列 */}
      <main>
        <Hero />
        <About />
        <Projects />
        <Advantages />
        <Contact />
      </main>
    </>
  )
}
