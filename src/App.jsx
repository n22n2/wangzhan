/*
 * ─────────────────────────────────────────────────
 *  App — 应用根组件
 *  职责：
 *    1. 语言切换（zh / en），translations 集中管理所有文案
 *    2. 加载动画状态控制（Loader）
 *    3. 自定义光标（圆点 + 圆环，分层延迟跟随）
 *    4. 鼠标跟随 CSS 变量（光斑 / Hero 视差 / Contact 光斑）
 *    5. 导航栏滚动紧凑样式
 *    6. 滚动进度条 + Hero 视差变量
 *    7. IntersectionObserver 控制 .reveal 入场动画
 *
 *  调参参考：
 *    圆点跟随速度  → dotPosRef 插值系数（当前 0.55，越大越快）
 *    圆环跟随速度  → ringPosRef 插值系数（当前 0.18，越小越懒）
 *    光标悬停大小  → global.css .cursor-ring 中的 width / height
 * ─────────────────────────────────────────────────
 */

import { useCallback, useEffect, useRef, useState } from 'react'
import Navbar    from './components/Navbar.jsx'
import Hero      from './components/Hero.jsx'
import About     from './components/About.jsx'
import Projects  from './components/Projects.jsx'
import Advantages        from './components/Advantages.jsx'
import Contact          from './components/Contact.jsx'
import Loader           from './components/Loader.jsx'
import PhysicsPlayground from './components/PhysicsPlayground.jsx'

/* ─────────────────────────────────────────────────
 *  translations — 中英文全站文案字典
 *  使用方式：t = translations[language]，传入各子组件
 * ───────────────────────────────────────────────── */
const translations = {
  zh: {
    /* 导航栏文字 */
    nav: {
      brand:   '肖岩 · VFX', // 左侧品牌名
      about:   '关于',        // 导航项
      work:    '作品',
      skills:  '技能',
      contact: '联系',
    },

    /* Hero 首屏文案 */
    hero: {
      pill:       '3D特效',          // 左上角标签胶囊
      desc:       '专注于游戏特效，不断探索新的技术', // 副标题
      btn1:       '查看个人作品',     // 主按钮
      btn2:       '联系我',           // 次按钮
      signature:  '肖岩',             // 底部签名
      scrollHint: '向下滚动',         // 底部滚动提示
    },

    /* About 个人介绍文案 */
    about: {
      label:            '01 — 关于',           // 章节小标签
      title:            '简介',                 // 大标题
      name:             '肖岩',                 // 姓名
      role:             '3D特效',               // 职位
      bio1:             'XX项目经验',             // 个人简介段落
      emailLabel:       '邮箱',                  // 联系信息标签
      internshipLabel:  '实习经历',              // 经历区标签
      internshipDate:   '2026.04 — 2026.12',    // 实习时间
      internshipTitle:  '字节跳动',              // 公司名
      internshipRole:   '3D特效',               // 职位
      internshipDesc:   '参与三体IP的写实科幻射击项目', // 描述
    },

    /* Projects 作品区文案 */
    projects: {
      label:           '02 — 作品',        // 章节小标签
      title:           '个人作品',          // 大标题
      clickPlay:       '点击播放',           // 缩略图 hover 提示
      clickToViewVideo:'点击查看视频 →',    // 有视频的卡片链接文字
      viewCase:        '查看案例 →',        // 无视频的卡片链接文字
      modalClose:      '关闭',              // 弹窗关闭按钮 aria-label
      modalFullscreen: '全屏播放',           // 弹窗全屏按钮文字
      modalCloseWindow:'关闭窗口',           // 弹窗关闭按钮文字
      items: [
        // 每项：tag=分类标签, title=标题, desc=描述
        { tag: '正在路上', title: '正在路上',
          desc: '正在路上' },
        { tag: '正在路上', title: '正在路上',
          desc: '正在路上' },
      ],
    },

    /* Advantages 能力区文案 */
    advantages: {
      label: '03 — 能力',                            // 章节小标签
      title: '个人技能',            // 大标题
      sub:   '正处于并将长期处于学习的路上', // 副标题
      items: [
        // 每项：title=技能名, desc=一句话描述
        { title: 'Unreal 5',  desc: '掌握 Unreal Engine 5 的 Niagara 系统' },
        { title: 'Unity',     desc: '掌握旧粒子系统和Visual Effect Graph（VEG）系统' },
        { title: '3ds Max',   desc: '制作特效所需模型和模型动画' },
        { title: '正在路上',desc: '正在路上' },
        { title: '正在路上',desc: '正在路上' },
        { title: '正在路上',desc: '正在路上' },
      ],
    },

    /* Contact 联系区文案 */
    contact: {
      label:      '04 — 联系',   // 章节小标签
      titleLine1: '寻找',          // 大标题第 1 行
      titleLine2: '志同道合的',   // 大标题第 2 行
      titleLine3: '朋友',         // 大标题第 3 行
      block2Title:'社交媒体',     // 右栏标题
    },

    /* PhysicsPlayground 互动区文案 */
    physics: {
      label: '— 互动',
      title: '和我的爱好互动一下吧',
      sub:   '拖拽它们',
    },
  },

  en: {
    /* Navbar */
    nav: {
      brand:   'Xiao Yan · VFX',
      about:   'About',
      work:    'Work',
      skills:  'Skills',
      contact: 'Contact',
    },

    /* Hero */
    hero: {
      pill:       '3D VFX',
      desc:       'Focused on game VFX, constantly exploring new techniques',
      btn1:       'View My Work',
      btn2:       'Contact Me',
      signature:  'Xiao Yan',
      scrollHint: 'Scroll Down',
    },

    /* About */
    about: {
      label:           '01 — About',
      title:           'Introduction',
      name:            'Xiao Yan',
      role:            '3D VFX',
      bio1:            'XX project experience',
      emailLabel:      'Email',
      internshipLabel: 'Experience',
      internshipDate:  '2026.04 — 2026.12',
      internshipTitle: 'ByteDance',
      internshipRole:  '3D VFX',
      internshipDesc:  'Participated in realistic sci-fi shooting project based on Three-Body IP',
    },

    /* Projects */
    projects: {
      label:           '02 — Work',
      title:           'Personal Works',
      clickPlay:       'Click to Play',
      clickToViewVideo:'Watch Video →',
      viewCase:        'View Case →',
      modalClose:      'Close',
      modalFullscreen: 'Fullscreen',
      modalCloseWindow:'Close Window',
      items: [
        { tag: 'In Progress', title: 'In Progress',
          desc: 'In Progress' },
        { tag: 'In Progress', title: 'In Progress',
          desc: 'In Progress' },
      ],
    },

    /* Advantages */
    advantages: {
      label: '03 — Capabilities',
      title: 'Personal Skills',
      sub:   'On the path of learning, and will be for a long time to come',
      items: [
        { title: 'Unreal 5',          desc: 'Proficient in Unreal Engine 5 Niagara system' },
        { title: 'Unity',             desc: 'Proficient in Legacy Particle System and Visual Effect Graph (VEG)' },
        { title: '3ds Max',           desc: 'Creating models and model animations for VFX production' },
        { title: 'On the Way',desc: 'On the Way' },
        { title: 'On the Way',desc: 'On the Way' },
        { title: 'On the Way',desc: 'On the Way' },
      ],
    },

    /* Contact */
    contact: {
      label:      '04 — Contact',
      titleLine1: 'Looking for',
      titleLine2: 'like-minded',
      titleLine3: 'friends',
      block2Title:'Social Media',
    },

    /* PhysicsPlayground */
    physics: {
      label: '— Interactive',
      title: 'Interact with My Hobbies',
      sub:   'Drag them',
    },
  },
}

/* ─────────────────────────────────────────────────
 *  App — 根组件
 * ───────────────────────────────────────────────── */
export default function App() {

  /* ── 加载动画：loading=true 时显示 Loader，onDone 后隐藏 ── */
  const [loading, setLoading] = useState(true)
  const handleLoaderDone = useCallback(() => setLoading(false), []) // 用 useCallback 避免子组件不必要的重渲染

  /* ── 语言状态：默认中文，toggleLanguage 在 zh / en 之间切换 ── */
  const [language, setLanguage] = useState('zh')
  const t = translations[language] // 当前语言文案对象，传给所有子组件

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'zh' ? 'en' : 'zh')) // 三元切换
  }

  /* ── 语言变化时同步 <html lang> 属性和 <title> ── */
  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en'
    document.title = language === 'zh'
      ? '肖岩 · 3D VFX 作品集'
      : 'Xiao Yan · 3D VFX Portfolio'
  }, [language])

  /* ── DOM 引用 ── */
  const dotRef      = useRef(null) // 光标小圆点 DOM
  const ringRef     = useRef(null) // 光标圆环 DOM
  const rafRef      = useRef(null) // requestAnimationFrame 句柄，用于清理
  const posRef      = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })     // 鼠标真实位置
  const ringPosRef  = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })     // 圆环插值位置
  const dotPosRef   = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })     // 圆点插值位置
  const spotlightRef = useRef(null) // 所有带 data-spotlight 的元素数组
  const heroRef     = useRef(null)  // Hero section DOM
  const contactRef  = useRef(null)  // Contact section DOM

  /* ── 导航栏压缩状态：向下滚动超 40px 时激活 ── */
  const [scrolled, setScrolled] = useState(false)

  /* ── 主副作用：挂载一次，绑定全局事件，组件卸载时清理 ── */
  useEffect(() => {
    /* 缓存 data-spotlight 元素列表（避免每帧 querySelectorAll）*/
    spotlightRef.current = Array.from(document.querySelectorAll('[data-spotlight]'))
    heroRef.current      = document.querySelector('.hero')
    contactRef.current   = document.querySelector('.contact')

    /* ── 鼠标移动处理 ── */
    const onMove = (e) => {
      const cx = e.clientX // 鼠标 X（相对视口）
      const cy = e.clientY // 鼠标 Y（相对视口）

      /* 更新全局鼠标位置引用，供 rAF 动画使用 */
      posRef.current.x = cx
      posRef.current.y = cy

      /* 将全局鼠标坐标写入 CSS 变量，供全站光斑使用 */
      document.documentElement.style.setProperty('--mx', cx + 'px')
      document.documentElement.style.setProperty('--my', cy + 'px')

      /* 为每个 data-spotlight 元素写入鼠标相对位置（相对于元素左上角）*/
      for (let i = 0; i < spotlightRef.current.length; i++) {
        const el   = spotlightRef.current[i]
        const rect = el.getBoundingClientRect()
        const x    = cx - rect.left  // 鼠标在元素内的 X
        const y    = cy - rect.top   // 鼠标在元素内的 Y
        /* --rx/ry --sx/sy 等多个变量兼容不同 CSS 光斑写法 */
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
      }

      /* Hero 区域：额外写入视差偏移量 --gx/--gy（±15px 范围）*/
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < window.innerHeight) { // 仅在 Hero 可见时计算
          const x = cx - rect.left
          const y = cy - rect.top
          heroRef.current.style.setProperty('--hx', x + 'px')
          heroRef.current.style.setProperty('--hy', y + 'px')
          heroRef.current.style.setProperty('--gx', (x / rect.width  - 0.5) * 30 + 'px') // 水平偏移
          heroRef.current.style.setProperty('--gy', (y / rect.height - 0.5) * 30 + 'px') // 垂直偏移
        }
      }

      /* Contact 区域：写入鼠标相对坐标供背景光斑使用 */
      if (contactRef.current) {
        const rect = contactRef.current.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          contactRef.current.style.setProperty('--cx', (cx - rect.left) + 'px')
          contactRef.current.style.setProperty('--cy', (cy - rect.top)  + 'px')
        }
      }
    }
    window.addEventListener('mousemove', onMove)

    /* ── rAF 动画：圆点 + 圆环插值跟随鼠标（每帧执行）──
       插值公式：pos += (target - pos) * factor
       factor 越大 → 越贴近鼠标；越小 → 延迟越明显 */
    const animate = () => {
      dotPosRef.current.x  += (posRef.current.x - dotPosRef.current.x)  * 0.55 // 圆点：轻微拖拽感
      dotPosRef.current.y  += (posRef.current.y - dotPosRef.current.y)  * 0.55
      ringPosRef.current.x += (posRef.current.x - ringPosRef.current.x) * 0.18 // 圆环：较明显延迟
      ringPosRef.current.y += (posRef.current.y - ringPosRef.current.y) * 0.18

      /* 写入 transform：translate 到插值位置，再 -50% 居中 */
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${dotPosRef.current.x}px, ${dotPosRef.current.y}px) translate(-50%, -50%)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${ringPosRef.current.x}px, ${ringPosRef.current.y}px) translate(-50%, -50%)`
      }
      rafRef.current = requestAnimationFrame(animate) // 下一帧继续
    }
    rafRef.current = requestAnimationFrame(animate) // 启动动画循环

    /* ── 光标悬停样式：鼠标进入可交互元素时放大圆环 ── */
    const interactiveSelector = 'a, button, [data-cursor-hover]'
    const onOver = (e) => { if (e.target.closest(interactiveSelector)) document.body.classList.add('cursor-hover') }
    const onOut  = (e) => { if (e.target.closest(interactiveSelector)) document.body.classList.remove('cursor-hover') }
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout',  onOut)

    /* ── 光标按压样式 ── */
    const onDown = () => document.body.classList.add('cursor-active')
    const onUp   = () => document.body.classList.remove('cursor-active')
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup',   onUp)

    /* ── 滚动处理：导航栏状态 + 进度条 + 视差变量 ── */
    const onScroll = () => {
      setScrolled(window.scrollY > 40) // 超过 40px 时导航栏切换为紧凑模式
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress  = maxScroll > 0 ? window.scrollY / maxScroll : 0 // 0~1 的滚动进度
      document.documentElement.style.setProperty('--scroll-progress', progress) // 控制顶部进度条宽度
      document.documentElement.style.setProperty('--scroll-y', window.scrollY + 'px') // 供 Hero 视差使用
    }
    onScroll() // 初始化（处理刷新时已有滚动量的场景）
    window.addEventListener('scroll', onScroll, { passive: true }) // passive=true 优化滚动性能

    /* ── IntersectionObserver：元素进入视口时添加 is-visible 触发淡入 ── */
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible') // 只触发一次，无需 unobserve
        })
      },
      { threshold: 0.12 } // 元素露出 12% 时触发
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))

    /* ── 清理：组件卸载时移除所有监听，停止动画 ── */
    return () => {
      window.removeEventListener('mousemove',  onMove)
      window.removeEventListener('scroll',     onScroll)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout',  onOut)
      window.removeEventListener('mousedown',  onDown)
      window.removeEventListener('mouseup',    onUp)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      io.disconnect()
    }
  }, []) // 空依赖数组：仅挂载/卸载时执行

  /* ── JSX 输出 ── */
  return (
    <>
      {/* 加载遮罩：loading 为 true 时渲染，onDone 后卸载 */}
      {loading && <Loader onDone={handleLoaderDone} />}

      {/* 顶部滚动进度条（CSS 通过 --scroll-progress 控制宽度）*/}
      <div className="scroll-progress-bar" aria-hidden="true" />

      {/* 自定义光标：圆环（大，延迟）+ 圆点（小，贴近）*/}
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef}  className="cursor-dot"  aria-hidden="true" />

      {/* 导航栏：传入滚动状态、语言、切换函数、文案 */}
      <Navbar scrolled={scrolled} language={language} onToggleLang={toggleLanguage} t={t} />

      {/* 页面主体：按顺序渲染各区块 */}
      <main>
        <Hero      t={t} />
        <About     t={t} />
        <Projects  t={t} />
        <Advantages      t={t} />
        <PhysicsPlayground t={t} />   {/* 物理互动区：技能标签可拖拽抛掷 */}
        <Contact         t={t} />
      </main>
    </>
  )
}
