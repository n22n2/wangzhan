/*
 * ─────────────────────────────────────────────────
 *  Contact 组件 — 联系方式（整屏收尾页）
 *  结构：背景光斑 + 大标题 + 联系区块 + 社交链接 + 底部版权
 *  修改提示：
 *    - 邮箱：修改 <a className="email-big" 的 href 和显示文字
 *    - 社交账号：在 social-list 中修改 href 和显示文字
 *    - 个人信息：底部 contact-footer 修改姓名/地点
 * ─────────────────────────────────────────────────
 */

export default function Contact() {
  return (
    /* section = 整屏容器，id="contact" 让导航"联系"可跳转至此 */
    <section className="contact" id="contact">

      {/* ============ 背景装饰层（仅视觉，不会被屏幕阅读器朗读） ============ */}
      <div className="contact-bg" aria-hidden="true"></div>      {/* 径向渐变背景 */}
      <div className="contact-spotlight" aria-hidden="true"></div> {/* 跟随鼠标的光斑 */}
      <div className="contact-overlay"></div>                      {/* 暗色遮罩 */}

      {/* ============ 内容层 ============ */}
      <div className="container contact-inner">

        {/* 顶部小标签：04 — 联系 */}
        <div className="contact-label">04 — 联系</div>

        {/* 大标题：三行竖排大字 */}
        <h2 className="contact-title">
          <span className="contact-title-line">让我们一起</span>
          <span className="contact-title-line">创造令人难忘的</span>
          <span className="contact-title-line">视觉作品。</span>
        </h2>

        {/* 主体两栏：联系方式 + 社交媒体 */}
        <div className="contact-main">

          {/* —— 左栏：联系我 —— */}
          <div className="contact-block">
            <h4>联系我</h4>
            <p>
              目前接受新项目合作与咨询。如果你正在筹备一个需要视觉加持的项目，欢迎来信讨论。
              通常在 24 小时内回复。
            </p>
            {/* 大邮箱按钮：点击自动唤起邮件客户端 */}
            <a className="email-big" href="mailto:xiaoyan_vfx@foxmail.com" data-spotlight data-cursor-hover>
              xiaoyan_vfx@foxmail.com →
            </a>
          </div>

          {/* —— 右栏：社交媒体列表 —— */}
          <div className="contact-block">
            <h4>社交媒体</h4>
            {/* 社交条目列表 — 每一项可独立点击 */}
            <div className="social-list">

              <a className="social-item" href="#" data-spotlight data-cursor-hover>
                <span className="social-platform">Instagram</span>
                <span>@xiaoyan.vfx ↗</span>
              </a>

              <a className="social-item" href="#" data-spotlight data-cursor-hover>
                <span className="social-platform">Vimeo</span>
                <span>/xiaoyanvfx ↗</span>
              </a>

              <a className="social-item" href="#" data-spotlight data-cursor-hover>
                <span className="social-platform">Behance</span>
                <span>/xiaoyanvfx ↗</span>
              </a>

              <a className="social-item" href="#" data-spotlight data-cursor-hover>
                <span className="social-platform">微信</span>
                <span>xiaoyan-vfx ↗</span>
              </a>

            </div>
          </div>
        </div>

        {/* 底部版权信息栏 */}
        <div className="contact-footer">
          <span>肖岩 · Xiao Yan</span>
          <span>Shanghai · Remote Worldwide</span>
          <span>© 2026 All rights reserved</span>
        </div>

      </div>
    </section>
  )
}
