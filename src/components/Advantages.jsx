/*
 * ─────────────────────────────────────────────────
 *  Advantages — 能力 / 技能模块
 *  结构：章节标题 + 6 张能力卡片网格
 *
 *  图标规则：
 *    第 1 张（i=0）— UE5 自绘 SVG（U 形 logo）
 *    第 2 张（i=1）— Unity 自绘 SVG（菱形 logo）
 *    其余         — 通用菱形符号 ◆
 *
 *  文案通过 t prop 传入，在 App.jsx translations.advantages 中修改
 * ─────────────────────────────────────────────────
 */

export default function Advantages({ t }) {
  const items = t?.advantages?.items || [] // 从文案字典取技能列表，缺省为空数组

  return (
    <section className="section advantages" id="skills">
      <div className="container">

        {/* 章节小标签 + 大标题 + 副标题 */}
        <div className="section-label reveal">{t.advantages.label}</div>
        <h2 className="section-title reveal">{t.advantages.title}</h2>
        <p className="section-desc reveal">{t.advantages.sub}</p>

        {/* 能力卡片网格：6 列等宽 */}
        <div className="advantages-grid">
          {items.map((item, i) => (
            <article
              key={i}
              className="adv-card reveal"
              data-spotlight    /* 鼠标移入时卡片内出现跟随光斑 */
              data-cursor-hover /* 鼠标变自定义样式 */
            >
              {/* 图标区：根据索引渲染不同图标 */}
              <span className="adv-icon">
                {i === 0 && (
                  /* UE5 图标：使用 public/ue.png */
                  <img src="/ue.png" width="120" height="120" alt="Unreal Engine 5" style={{ objectFit: 'contain' }} />
                )}
                {i === 1 && (
                  /* Unity 图标：使用 public/Unity.png */
                  <img src="/Unity.png" width="80" height="80" alt="Unity" style={{ objectFit: 'contain' }} />
                )}
                {i === 2 && (
                  /* 3ds Max 图标：使用 public/3ds-max.png */
                  <img src="/3ds-max.png" width="80" height="80" alt="3ds Max" style={{ objectFit: 'contain' }} />
                )}
                {i > 2 && (
                  /* 通用图标：纯 CSS 符号 ◆ */
                  <span style={{ fontSize: '20px', lineHeight: 1, color: 'var(--accent-2)' }}>◆</span>
                )}
              </span>

              {/* 卡片编号：01 / 02 / … */}
              <span className="adv-num" style={{ display: 'block', fontSize: '12px', opacity: 0.5, marginBottom: '8px' }}>
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* 技能标题 */}
              <h3 className="adv-title">{item.title}</h3>

              {/* 技能描述 */}
              <p className="adv-desc">{item.desc}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
