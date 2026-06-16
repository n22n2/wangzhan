/*
 * ─────────────────────────────────────────────────
 *  Navbar 组件 — 顶部导航栏
 *  结构：Logo + 4 个锚链接 + 联系按钮
 *  参数：scrolled (boolean) — true = 页面已向下滚动，触发紧凑样式
 *  修改提示：
 *    - Logo 文字：修改 brand 中的 <span> 内容
 *    - 导航项：修改 nav-links 中的 href 和文字
 *    - 按钮文字：修改 btn-contact 中的内容
 * ─────────────────────────────────────────────────
 */

/* props.scrolled = 父组件(App.jsx) 监听页面滚动传入的布尔值 */
export default function Navbar({ scrolled = false }) {
  return (
    {/* 根容器：className 会根据 scrolled 添加 "scrolled" 类
       scrolled 类 = 更紧凑的样式（更细的边框、更小的 padding） */}
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>

      <div className="navbar-inner">

        {/* —— 左侧 Logo —— */}
        <a href="#" className="brand" data-spotlight>
          <span className="brand-dot"></span>       {/* 小圆点图标 */}
          <span>肖岩 · VFX</span>                    {/* 品牌文字 */}
        </a>

        {/* —— 中间 4 个锚链接 ——
           href="#xxx" 会跳转到对应 id 的 section（about/work/skills/contact） */}
        <div className="nav-links">
          <a href="#about" data-spotlight>关于</a>
          <a href="#work" data-spotlight>作品</a>
          <a href="#skills" data-spotlight>技能</a>
          <a href="#contact" data-spotlight>联系</a>
        </div>

        {/* —— 右侧 CTA 按钮：联系 —— */}
        <a href="#contact" className="btn-contact" data-spotlight>
          联系 →
        </a>

      </div>
    </nav>
  )
}
