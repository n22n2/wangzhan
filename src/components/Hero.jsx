import { useRef, useEffect } from 'react'

export default function Hero({ t }) {
  const heroRef  = useRef(null)
  const videoRef = useRef(null)

  /* ── 视频淡入：加 is-loaded 类触发 CSS 过渡 ── */
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const reveal = () => {
      if (!video.classList.contains('is-loaded')) {
        video.classList.add('is-loaded')
      }
    }

    if (video.readyState >= 3) {
      reveal()
    }
    video.addEventListener('loadeddata', reveal)
    video.addEventListener('canplay', reveal)
    video.addEventListener('playing', reveal)

    const p = video.play()
    if (p && typeof p.then === 'function') {
      p.then(reveal).catch(reveal)
    }
    const timer = setTimeout(reveal, 2500)

    return () => {
      video.removeEventListener('loadeddata', reveal)
      video.removeEventListener('canplay', reveal)
      video.removeEventListener('playing', reveal)
      clearTimeout(timer)
    }
  }, [])

  /* ── 视差：仅更新 --px/--py 供次光斑漂移使用，不覆盖全局 --mx/--my ── */
  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect()
      const ox = ((e.clientX - rect.left) / rect.width - 0.5) * 20
      const oy = ((e.clientY - rect.top) / rect.height - 0.5) * 20
      hero.style.setProperty('--px', ox + 'px')
      hero.style.setProperty('--py', oy + 'px')
    }

    hero.addEventListener('mousemove', onMove)
    return () => hero.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section className="hero" ref={heroRef}>

      {/* ── 层 0：CSS 渐变兜底背景 ── */}
      <div className="hero-fallback" aria-hidden="true" />

      {/* ── 层 1：视频背景（加载后淡入，盖住兜底层）── */}
      <video
        ref={videoRef}
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={`${import.meta.env.BASE_URL}火焰.mp4`} type="video/mp4" />
      </video>

      {/* ── 层 2+：动态装饰层 ── */}
      <div className="hero-orbit hero-orbit-1"  aria-hidden="true" />
      <div className="hero-orbit hero-orbit-2"  aria-hidden="true" />
      <div className="hero-spotlight"           aria-hidden="true" />
      <div className="hero-spotlight-secondary" aria-hidden="true" />
      <div className="hero-noise"               aria-hidden="true" />
      <div className="hero-grid"                aria-hidden="true" />
      <div className="hero-overlay" />

      {/* ── 主内容层 ── */}
      <div className="container hero-content">
        <h1 className="hero-title">
          <span className="hero-title-accent">{t.hero.pill}</span>
          <span className="hero-title-main vfx-title">VFX</span>
        </h1>

        <p className="hero-desc">{t.hero.desc}</p>

        <div className="hero-cta">
          <a href="#work" className="btn-primary" data-spotlight data-cursor-hover>
            <span className="btn-label">{t.hero.btn1}</span>
            <span className="btn-arrow">↗</span>
          </a>
          <a href="#contact" className="btn-ghost" data-spotlight data-cursor-hover>
            <span className="btn-label">{t.hero.btn2}</span>
            <span className="btn-arrow">→</span>
          </a>
        </div>
      </div>

      {/* ── 底部签名栏 ── */}
      <div className="hero-footer">
        <span>{t.hero.signature}</span>
        <span className="scroll-hint">
          <span className="scroll-line" />
          {t.hero.scrollHint}
        </span>
      </div>

    </section>
  )
}
