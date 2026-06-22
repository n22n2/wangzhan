export default function Navbar({ scrolled = false, language, onToggleLang, t }) {
  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="navbar-inner">

        {/* Logo */}
        <a href="#" className="brand" data-spotlight>
          <span className="brand-dot" />
          <span>{t.nav.brand}</span>
        </a>

        {/* 导航链接 */}
        <div className="nav-links">
          <a href="#about"   data-spotlight>{t.nav.about}</a>
          <a href="#work"    data-spotlight>{t.nav.work}</a>
          <a href="#skills"  data-spotlight>{t.nav.skills}</a>
          <a href="#contact" data-spotlight>{t.nav.contact}</a>
        </div>

        {/* 语言切换 */}
        <div className="lang-switch" data-spotlight data-cursor-hover onClick={onToggleLang}>
          <span className={`lang-opt${language === 'zh' ? ' active' : ''}`}>中</span>
          <span className="lang-sep">·</span>
          <span className={`lang-opt${language === 'en' ? ' active' : ''}`}>EN</span>
        </div>

      </div>
    </nav>
  )
}
