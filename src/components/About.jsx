/*
 * ─────────────────────────────────────────────────
 *  About 组件 — 个人介绍页
 *  结构：顶部标题 → 头像+个人信息 → 实习经历
 *  修改提示：
 *    - 姓名/职位/简介：在 profile-info 区块修改文字
 *    - 头像占位：将 portrait-placeholder 替换为 <img src="/你的照片.jpg">
 *    - 邮箱：在 contact-info 区块修改 href 和显示文字
 *    - 实习经历：在 internship-list 区块增删 internship-item
 * ─────────────────────────────────────────────────
 */

export default function About({ t }) {
  return (
    /* —— 主容器：section 标签定义了本区块的背景色与边距 ——
       className="section"  继承全站通用的章节样式
       id="about"            锚点名，顶部导航的"关于"会跳转到这里 */
    <section className="section" id="about">

      {/* —— 内容容器：限制最大宽度，实现版心效果（约 1700px）—— */}
      <div className="container">

        {/* —— 章节小标签：显示 "01 — 关于" 上方小字 —— */}
        {/* reveal 类：滚动到视口时触发淡入动画 */}
        <div className="section-label reveal">{t.about.label}</div>

        {/* —— 大标题：本区块的引导语 —— */}
        {/* 修改这段文字可改变关于页的主标题 */}
        <h2 className="section-title reveal">
          {t.about.title}
        </h2>

        {/* ========== 区块 1：个人资料（头像 + 信息） ========== */}
        {/* profile = 左侧头像 + 右侧文字，两栏网格布局 */}
        <div className="profile">

          {/* —— 左侧：头像占位区 ——
             data-spotlight：鼠标移入时内部出现跟随光斑
             data-cursor-hover：鼠标变自定义光标样式
             替换方式：将下方 <div className="portrait-placeholder"> 替换为：
             <img src="/你的照片.jpg" alt="肖岩" style={{width:'100%',height:'100%',objectFit:'cover'}} /> */}
          <div className="portrait reveal" data-spotlight data-cursor-hover>
            <div className="portrait-placeholder">
              <span className="portrait-silhouette">◐</span>
            </div>
          </div>

          {/* —— 右侧：个人文字信息 —— */}
          <div className="profile-info reveal">

            <h3>{t.about.name}</h3>                    {/* 姓名，可直接修改 */}

            <div className="profile-role">{t.about.role}</div>
            {/* 职位标签，修改此文字可更新职位描述 */}

            {/* 个人简介：可增减 <p> 段落 */}
            <div className="profile-bio">
              <p>
                {t.about.bio1}
              </p>
            </div>

            {/* —— 联系信息：仅保留邮箱 ——
               single 样式：单列布局；如需多列（邮箱/电话/微信）可移除 single
               修改邮件地址：href="mailto:xxx" 和中间的显示文字 */}
            <div className="contact-info single">
              <div data-spotlight data-cursor-hover>
                <div className="contact-item-label">{t.about.emailLabel}</div>
                <a href="mailto:xiaoyan_vfx@foxmail.com" className="contact-item-value">
                  xiaoyan_vfx@foxmail.com →
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* ========== 区块 2：实习经历列表 ========== */}
        {/* internship = 整段实习经历容器 */}
        <div className="internship reveal">

          <div className="section-label reveal" style={{marginTop: 0}}>{t.about.internshipLabel}</div>
          {/* 小标题，如需改名可直接改文字 */}

          {/* —— 时间线列表容器 —— */}
          <div className="internship-list">

            {/* === 实习条目模板（共 3 条）：复制整块可新增 ===
                每条包含：时间 + 职位 + 公司 + 描述 */}

            {/* 实习条目：2026.04 — 2026.12，字节跳动，三体IP项目
                职位：公司与职位名称位置互换 */}
            <div className="internship-item" data-spotlight data-cursor-hover>
              <div className="internship-date">{t.about.internshipDate}</div>
              <div className="internship-content">
                <h4>{t.about.internshipTitle}</h4>
                <div className="internship-company">{t.about.internshipRole}</div>
                <p>{t.about.internshipDesc}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
