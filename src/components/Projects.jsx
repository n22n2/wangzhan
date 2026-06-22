/*
 * ─────────────────────────────────────────────────
 *  Projects — 精选作品区
 *  结构：章节标题 → 4 张项目卡片（左图右文）→ 点击视频弹出播放器
 *
 *  子组件：
 *    ProjectThumb  — 卡片内静音循环的视频缩略图
 *    VideoModal    — 全屏视频播放弹窗
 *
 *  新增项目：在 videoSources 末尾加视频路径（或 null），
 *            并在 App.jsx translations.projects.items 中添加对应条目
 * ─────────────────────────────────────────────────
 */

import { useRef, useEffect, useState } from 'react'

/* 视频资源路径列表，顺序与 translations.projects.items 一一对应
   null = 该项目暂无视频，卡片显示"查看案例"链接 */
const videoSources = ['/火焰.mp4', '/紫色刀光.mp4']


/* =======================================================================
 *  ProjectThumb — 卡片左侧视频缩略图（静音自动循环）
 *  props：
 *    src     — 视频文件路径
 *    onClick — 点击时的回调（打开弹窗）
 *    title   — 项目标题，用于 hover tooltip
 *    t       — 当前语言文案对象
 * ======================================================================= */
function ProjectThumb({ src, onClick, title, t }) {
  const videoRef = useRef(null) // 引用 <video> DOM 元素

  /* 视频加载 + 播放逻辑：4 种兜底方式保证视频可见 */
  useEffect(() => {
    const video = videoRef.current
    if (!video || !src) return // 无元素或无路径直接退出

    /* 添加 is-loaded 类，触发 CSS opacity 过渡（0 → 1 淡入）*/
    const reveal = () => {
      if (!video.classList.contains('is-loaded')) video.classList.add('is-loaded')
    }

    if (video.readyState >= 3) reveal()          // 已缓存：直接显示
    video.addEventListener('loadeddata', reveal) // 数据加载完成
    video.addEventListener('canplay',    reveal) // 可以播放
    video.addEventListener('playing',    reveal) // 实际开始播放

    const p = video.play() // 触发播放
    if (p?.then) p.then(reveal).catch(reveal)    // Promise 兜底

    const fallback = setTimeout(reveal, 2000)    // 2s 后强制显示

    return () => {
      video.removeEventListener('loadeddata', reveal)
      video.removeEventListener('canplay',    reveal)
      video.removeEventListener('playing',    reveal)
      clearTimeout(fallback)
    }
  }, [src]) // src 变化时重新执行

  return (
    /* 外层容器：可点击，触发弹窗 */
    <div className="project-thumb" onClick={onClick} title={`${t.projects.clickPlay} · ${title}`}>

      {/* 视频：静音 + 自动循环，is-loaded 类控制淡入 */}
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

      {/* hover 覆盖层：显示播放图标 + 提示文字 */}
      <div className="project-play">
        <span className="play-icon">▶</span>
        <span className="play-text">{t.projects.clickPlay}</span>
      </div>
    </div>
  )
}


/* =======================================================================
 *  VideoModal — 全屏视频播放弹窗
 *  props：
 *    project — 当前项目数据（tag / title / desc / video）
 *    onClose — 关闭弹窗的回调
 *    t       — 当前语言文案对象
 * ======================================================================= */
function VideoModal({ project, onClose, t }) {
  const videoRef = useRef(null) // 引用弹窗内的 <video>
  const modalRef = useRef(null) // 引用遮罩层（用于点击背景关闭）

  /* 弹窗打开后：解锁音频、自动播放、绑定 ESC、锁定页面滚动 */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted    = false // 弹窗内允许有声（用户主动点击，浏览器不拦截）
    video.controls = true  // 显示原生控制条

    /* 尝试有声播放；失败时退回静音播放 */
    const p = video.play()
    if (p?.then) {
      p.catch(() => {
        video.muted = true
        video.play().catch(() => {})
      })
    }

    /* ESC 键关闭弹窗 */
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)

    /* 锁定页面滚动（避免背景内容意外滚动）*/
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = '' // 恢复滚动
    }
  }, [onClose])

  /* 全屏按钮：调用浏览器原生全屏 API（兼容 Safari / IE11）*/
  const handleFullscreen = () => {
    const video = videoRef.current
    if (!video) return
    if      (video.requestFullscreen)       video.requestFullscreen()
    else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen()
    else if (video.msRequestFullscreen)     video.msRequestFullscreen()
  }

  /* 点击遮罩背景关闭（仅当 target 是遮罩本身，不是内部内容）*/
  const handleBackdropClick = (e) => {
    if (e.target === modalRef.current) onClose()
  }

  return (
    /* 全屏遮罩层 */
    <div className="modal-backdrop" ref={modalRef} onClick={handleBackdropClick}>

      {/* 弹窗主体 */}
      <div className="modal-content">

        {/* 顶部：分类标签 + 标题 + 关闭按钮 */}
        <div className="modal-header">
          <div>
            <span className="modal-tag">{project.tag}</span>
            <h3 className="modal-title">{project.title}</h3>
          </div>
          <button className="modal-close" onClick={onClose} aria-label={t.projects.modalClose}>
            ✕
          </button>
        </div>

        {/* 视频播放区（16:9 比例）*/}
        <div className="modal-video-wrap">
          <video
            ref={videoRef}
            className="modal-video"
            controls
            autoPlay
            loop
            playsInline
          >
            <source src={project.video} type="video/mp4" />
            你的浏览器不支持视频播放。
          </video>
        </div>

        {/* 操作按钮行：全屏 + 关闭 */}
        <div className="modal-actions">
          <button className="modal-btn"           onClick={handleFullscreen} data-spotlight data-cursor-hover>
            <span>⛶</span> {t.projects.modalFullscreen}
          </button>
          <button className="modal-btn secondary" onClick={onClose}          data-spotlight data-cursor-hover>
            <span>✕</span> {t.projects.modalCloseWindow}
          </button>
        </div>

        {/* 项目描述文字 */}
        <p className="modal-desc">{project.desc}</p>
      </div>
    </div>
  )
}


/* =======================================================================
 *  Projects — 主组件
 * ======================================================================= */
export default function Projects({ t }) {
  /* activeProject：当前弹窗展示的项目对象。null = 无弹窗 */
  const [activeProject, setActiveProject] = useState(null)

  const projectItems = t.projects.items || [] // 从文案字典取项目列表

  return (
    <section className="section projects" id="work">
      <div className="container">

        {/* 章节小标签 + 大标题 */}
        <div className="section-label reveal">{t.projects.label}</div>
        <h2 className="section-title reveal">{t.projects.title}</h2>

        {/* 项目卡片网格 */}
        <div className="projects-grid">
          {projectItems.map((p, i) => {
            const video = videoSources[i] // 对应索引的视频路径（可为 null）

            return (
              /* 偶数索引：图左文右；奇数加 offset 类：图右文左 */
              <article
                key={i}
                className={`project-card reveal${i % 2 === 1 ? ' offset' : ''}`}
                data-spotlight
              >
                {/* 左侧媒体区：有视频显示缩略图，否则显示纯色占位块 */}
                <div className="project-image" data-spotlight>
                  {video ? (
                    <ProjectThumb
                      src={video}
                      onClick={() => setActiveProject({ ...p, video })} // 打开弹窗
                      title={p.title}
                      t={t}
                    />
                  ) : (
                    <div className={`project-placeholder ${p.cls || ''}`} />
                  )}
                </div>

                {/* 右侧文字区：标题 + 描述 + 链接 */}
                <div className="project-info">
                  <h3 className="project-title">{p.title}</h3>
                  <p  className="project-desc">{p.desc}</p>

                  {/* 有视频 → 点击打开弹窗；无视频 → 普通外链 */}
                  {video ? (
                    <a
                      href="#"
                      className="project-link"
                      onClick={(e) => {
                        e.preventDefault()               // 阻止默认跳转
                        setActiveProject({ ...p, video }) // 设置激活项，触发弹窗渲染
                      }}
                      data-cursor-hover
                    >
                      {t.projects.clickToViewVideo}
                    </a>
                  ) : (
                    <a href="#" className="project-link" data-cursor-hover>
                      {t.projects.viewCase}
                    </a>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      </div>

      {/* 视频弹窗：仅当 activeProject 非 null 时渲染，关闭后自动卸载 */}
      {activeProject && (
        <VideoModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
          t={t}
        />
      )}
    </section>
  )
}
