/*
 * ─────────────────────────────────────────────────
 *  Contact — 联系区（页面最后一屏）
 *  结构：背景装饰 → 章节标签 → 大标题 → 左栏邮箱 + 右栏社交
 *
 *  修改邮箱：修改 email-big 的 href 和显示文字
 *  修改社交：修改 social-item 的 href / 平台名 / ID
 *  文案通过 t prop 传入，在 App.jsx translations.contact 中修改
 * ─────────────────────────────────────────────────
 */

export default function Contact({ t }) {
  return (
    /* 整屏容器，id="contact" 供导航锚点跳转 */
    <section className="contact" id="contact">

      {/* 背景装饰层（纯视觉，屏幕阅读器忽略）*/}
      <div className="contact-bg"       aria-hidden="true" /> {/* 径向渐变底色 */}
      <div className="contact-spotlight" aria-hidden="true" /> {/* 跟随鼠标的光斑，坐标由 App.jsx 写入 --cx/--cy */}
      <div className="contact-overlay"   aria-hidden="true" /> {/* 半透明暗色遮罩，增强文字对比 */}

      {/* 内容层 */}
      <div className="container contact-inner">

        {/* 章节小标签：04 — 联系 */}
        <div className="contact-label">{t.contact.label}</div>

        {/* 主标题：三行大字 */}
        <h2 className="contact-title">
          <span className="contact-title-line">{t.contact.titleLine1}</span>
          <span className="contact-title-line">{t.contact.titleLine2}</span>
          <span className="contact-title-line">{t.contact.titleLine3}</span>
        </h2>

        {/* 两栏布局：左栏邮箱 + 右栏社交媒体 */}
        <div className="contact-main">

          {/* 左栏：大邮箱链接，点击唤起邮件客户端 */}
          <div className="contact-block">
            <a
              className="email-big"
              href="mailto:xiaoyan_vfx@foxmail.com"
              data-spotlight
              data-cursor-hover
            >
              xiaoyan_vfx@foxmail.com →
            </a>
          </div>

          {/* 右栏：社交媒体列表 */}
          <div className="contact-block">
            <h4>{t.contact.block2Title}</h4> {/* "社交媒体" 标题 */}
            <div className="social-list">

              {/* 小红书：点击跳转主页，target="_blank" 新标签页打开 */}
              <a
                className="social-item"
                href="https://xhslink.com/m/AXsi3xcqWy5"
                target="_blank"
                rel="noopener noreferrer" /* 安全属性：防止子页面通过 window.opener 操控父页面 */
                data-spotlight
                data-cursor-hover
              >
                <span className="social-platform">小红书</span>
                <span>n22n2 ↗</span>
              </a>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
