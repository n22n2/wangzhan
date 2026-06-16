/*
 * ─────────────────────────────────────────────────
 *  Projects 组件 — 精选项目列表
 *  结构：顶部标题 → 4 个项目卡片（左图右文）→ 点击视频项目会弹出视频播放弹窗
 *  组件构成：
 *    1) projects 数组   —— 项目数据（标题/描述/视频等）
 *    2) ProjectThumb     —— 卡片内的视频缩略图（静音自动循环）
 *    3) VideoModal       —— 点击视频后弹出的大屏播放器
 *    4) Projects         —— 主组件（渲染卡片 + 控制弹窗开关）
 *  修改提示：
 *    - 新增项目：在 projects 数组中添加一个 { no, tag, title, desc, video, cls } 对象
 *    - 替换为图片：将 video: "/xxx.mp4" 改为 video: null，并修改 project-placeholder 样式
 *    - 视频文件：放在项目根目录（与 index.html 同级），路径写为 "/文件名.mp4"
 * ─────────────────────────────────────────────────
 */

import { useRef, useEffect, useState } from 'react'

/* ========== 项目数据：修改/扩展这里即可 ========== */
/* 每条项目包含：
   no    — 项目编号（如 "01"）
   tag   — 项目分类标签（如 "品牌影像 / 3D"）
   title — 主标题
   desc  — 详细描述
   video — 视频路径（字符串 = 显示视频；null = 仅显示彩色占位）
   cls   — 占位块的样式类（project-a ~ project-d，在 CSS 中定义不同颜色） */
const projects = [
  {
    no: "01",
    tag: "品牌影像 / 3D",
    title: "极光 — 品牌视觉短片",
    desc: "为某科技品牌制作的年度品牌影像，从概念设计到完整制作，聚焦光影质感与品牌气质的契合。",
    video: "/hero-bg.mp4",   /* ← 视频路径：项目根目录下的文件 */
    cls: "project-a"
  },
  {
    no: "02",
    tag: "产品广告 / 流体",
    title: "液态流动 — 高端护肤广告",
    desc: "高端护肤品类产品广告，以写实流体与光影表现产品的质感，完成产品与环境的整体氛围渲染。",
    video: null,             /* ← null = 显示彩色占位块，不显示视频 */
    cls: "project-b"
  },
  {
    no: "03",
    tag: "MV包装 / 霓虹",
    title: "霓虹脉动 — 音乐 MV 视觉包装",
    desc: "为独立音乐人 MV 提供完整视觉包装与动态影像，风格偏未来主义与赛博氛围。",
    video: null,
    cls: "project-c"
  },
  {
    no: "04",
    tag: "短片片头 / 合成",
    title: "纸间世界 — 短片片头设计",
    desc: "独立短片的片头设计与后期合成，构建统一视觉语言与氛围。",
    video: null,
    cls: "project-d"
  }
]


/* =======================================================================
 * 子组件 1：ProjectThumb — 卡片左侧的视频缩略图
 *  功能：在卡片内自动循环播放静音视频，hover 时显示"点击播放"
 *  参数：src=视频路径, onClick=点击时触发, title=鼠标悬停提示文字
 * ======================================================================= */
function ProjectThumb({ src, onClick, title }) {

  /* 引用 video DOM 元素，用于在 JS 中控制播放 */
  const videoRef = useRef(null)

  /* 视频加载逻辑：4 种兜底方式确保视频能显示 */
  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return   /* 无视频节点或无路径则退出 */

    /* 添加 "is-loaded" CSS 类，让视频从透明淡入 */
    const reveal = () => {
      if (video && !video.classList.contains('is-loaded')) {
        video.classList.add('is-loaded')
      }
    }

    /* 方式 1：如果视频已缓存且加载完成（readyState >= 3）直接显示 */
    if (video.readyState >= 3) reveal()
    /* 方式 2：监听浏览器加载事件 */
    video.addEventListener('loadeddata', reveal)
    video.addEventListener('canplay', reveal)
    video.addEventListener('playing', reveal)
    /* 方式 3：手动触发 play()（绕过浏览器自动播放限制）*/
    const p = video.play()
    if (p && typeof p.then === 'function') {
      p.then(() => reveal()).catch(() => reveal())
    }
    /* 方式 4：2 秒兜底（无论如何强制显示）*/
    const fallback = setTimeout(reveal, 2000)

    /* 组件卸载时：清理监听器 + 定时器 */
    return () => {
      video.removeEventListener('loadeddata', reveal)
      video.removeEventListener('canplay', reveal)
      video.removeEventListener('playing', reveal)
      clearTimeout(fallback)
    }
  }, [src])  /* src 变化时重新执行 */

  /* 渲染：外层可点击的盒子 + 视频 + hover 播放图标 */
  return (
    <div className="project-thumb" onClick={onClick} title={`点击播放 · ${title}`}>

      {/* <video> 标签属性：
          autoPlay   - 自动播放
          muted      - 静音（浏览器要求自动播放必须静音）
          loop       - 循环播放
          playsInline - 在 iOS 内联播放（不强制全屏）
          preload="auto" - 立即加载视频 */}
      <video
        ref={videoRef}
        className="project-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={src} type="video/mp4" />
      </video>

      {/* hover 时显示的播放图标层 */}
      <div className="project-play">
        <span className="play-icon">▶</span>
        <span className="play-text">点击播放</span>
      </div>
    </div>
  )
}


/* =======================================================================
 * 子组件 2：VideoModal — 点击视频后弹出的全屏播放器
 *  参数：project=项目数据对象, onClose=关闭弹窗的回调函数
 *  功能：弹窗展示项目视频，支持浏览器原生控制（暂停/音量/全屏）
 * ======================================================================= */
function VideoModal({ project, onClose }) {

  const videoRef = useRef(null)     /* 引用视频元素 */
  const modalRef = useRef(null)     /* 引用弹窗背景层 */
  const [isPlaying, setIsPlaying] = useState(true)  /* 播放状态（暂未使用，保留扩展）*/

  /* 打开弹窗后的逻辑：解锁音频 + 自动播放 + ESC 关闭 + 禁止页面滚动 */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    /* 在弹窗中解锁音频（用户已点击触发，浏览器允许有声播放）*/
    video.muted = false
    video.controls = true

    /* 尝试播放；若被浏览器拦截则退回静音播放 */
    const tryPlay = () => {
      const p = video.play()
      if (p && typeof p.then === 'function') {
        p.then(() => setIsPlaying(true)).catch(() => {
          /* 浏览器阻止自动播放，退回到静音再播放 */
          video.muted = true
          video.play().then(() => setIsPlaying(true)).catch(() => {})
        })
      }
    }
    tryPlay()

    /* 监听 ESC 键关闭弹窗 */
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)

    /* 弹窗打开时：锁定页面滚动条，避免用户误操作滚动 */
    document.body.style.overflow = 'hidden'

    /* 组件卸载时：清理监听 + 恢复页面滚动 */
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [])

  /* 额外监听播放 / 暂停状态（预留扩展功能，如显示播放图标）*/
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
    }
  }, [])

  /* 全屏按钮：调用浏览器原生全屏 API（兼容多浏览器前缀）*/
  const handleFullscreen = () => {
    const video = videoRef.current
    if (!video) return
    if (video.requestFullscreen) video.requestFullscreen()           /* 标准 */
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen() /* Safari */
    else if (video.msRequestFullscreen) video.msRequestFullscreen()      /* IE11 */
  }

  /* 点击遮罩（弹窗背景的灰色区域）时关闭 — 仅当点击的是背景本身才触发 */
  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) onClose()
  }

  return (
    /* 最外层：固定定位 + 全屏 + 背景半透明的遮罩 */
    <div
      className="modal-backdrop"
      ref={modalRef}
      onClick={handleBackdropClick}
    >
      {/* 弹窗内容容器 */}
      <div className="modal-content">

        {/* —— 顶部标题栏 —— */}
        <div className="modal-header">
          <div>
            <span className="modal-tag">{project.tag}</span>  {/* 标签：品牌影像 / 3D */}
            <h3 className="modal-title">{project.title}</h3>     {/* 标题：极光 — ... */}
          </div>
          {/* 关闭按钮 */}
          <button className="modal-close" onClick={onClose} aria-label="关闭">
            ✕
          </button>
        </div>

        {/* —— 视频播放区：16:9 比例 —— */}
        <div className="modal-video-wrap">
          <video
            ref={videoRef}
            className="modal-video"
            controls          /* 显示浏览器原生控制条（播放/暂停/音量/全屏）*/
            autoPlay
            loop
            playsInline
          >
            <source src={project.video} type="video/mp4" />
            你的浏览器不支持视频播放。
          </video>
        </div>

        {/* —— 两个操作按钮：全屏播放 + 关闭 —— */}
        <div className="modal-actions">
          <button className="modal-btn" onClick={handleFullscreen} data-spotlight data-cursor-hover>
            <span>⛶</span> 全屏播放
          </button>
          <button className="modal-btn secondary" onClick={onClose} data-spotlight data-cursor-hover>
            <span>✕</span> 关闭窗口
          </button>
        </div>

        {/* —— 项目描述文字 —— */}
        <p className="modal-desc">{project.desc}</p>
      </div>
    </div>
  )
}


/* =======================================================================
 * 主组件：Projects — 渲染 4 个项目卡片 + 控制视频弹窗
 * ======================================================================= */
export default function Projects() {

  /* 状态：当前打开弹窗的项目。null = 无弹窗，设置某个项目 = 显示该项目弹窗 */
  const [activeProject, setActiveProject] = useState(null)

  return (
    <section className="section projects" id="work">
      <div className="container">

        {/* 顶部标题区 */}
        <div className="section-label reveal">02 — 作品</div>
        <h2 className="section-title reveal">
          精选项目 · 精心雕琢，而非模板化。
        </h2>
        <p className="section-desc reveal">
          以下为近年来参与或独立完成的代表性作品。每一个项目都值得单独开一个章节。
        </p>

        {/* 项目卡片网格：使用 Array.map 将 projects 数组转为 JSX */}
        <div className="projects-grid">
          {projects.map((p, i) => (
            /* article = 语义化的"文章/项目"容器
               key = React 需要的唯一标识（用项目编号即可）
               className = 添加 offset 让奇数项左右布局翻转（如 02 项图片在右） */
            <article
              key={p.no}
              className={`project-card reveal${i % 2 === 1 ? ' offset' : ''}`}
              data-spotlight
            >

              {/* 左侧图片区：有视频则显示 ProjectThumb，否则显示占位色块 */}
              <div className="project-image" data-spotlight>
                {p.video ? (
                  <ProjectThumb
                    src={p.video}
                    onClick={() => setActiveProject(p)}
                    title={p.title}
                  />
                ) : (
                  <div className={`project-placeholder ${p.cls}`}></div>
                )}
                {/* 叠在图片上的标签文字 */}
                <span className="project-index">{p.tag}</span>
                <span className="project-no">项目 N° {p.no} / 2024–2026</span>
              </div>

              {/* 右侧描述区：标题 + 描述 + 链接 */}
              <div className="project-info">
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.desc}</p>
                {/* 有视频的项目显示"点击查看视频"链接（点击打开弹窗）*/}
                {p.video ? (
                  <a
                    href="#"
                    className="project-link"
                    onClick={(e) => {
                      e.preventDefault()      /* 阻止链接的默认跳转 */
                      setActiveProject(p)    /* 将该项目设为激活项 → 打开弹窗 */
                    }}
                    data-cursor-hover
                  >
                    点击查看视频 →
                  </a>
                ) : (
                  <a href="#" className="project-link" data-cursor-hover>
                    查看案例 →
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* —— 条件渲染：只有当 activeProject 不为 null 时才渲染弹窗 —— */}
      {activeProject && (
        <VideoModal
          project={activeProject}
          onClose={() => setActiveProject(null)}  /* 关闭时将激活项设为 null → 销毁弹窗 */
        />
      )}
    </section>
  )
}
