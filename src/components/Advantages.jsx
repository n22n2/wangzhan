/*
 * ─────────────────────────────────────────────────
 *  Advantages 组件 — 能力 / 技能模块
 *  结构：顶部标题 + 6 张能力卡片的 3×2 网格
 *  修改提示：
 *    - 增删能力：在 advantages 数组中添加/删除条目
 *    - 图标：icon 字段使用特殊符号（◈ ◇ ◆ ◉ ◎ ◌）
 *    - 标题：title（中文）+ titleEn（英文小字）
 * ─────────────────────────────────────────────────
 */

/* 能力数据数组：共 6 张卡片 */
const advantages = [
  {
    icon: "◈",                                          /* 图标符号 */
    title: "写实渲染",                                    /* 中文主标题 */
    titleEn: "Photoreal Rendering",                     /* 英文小标题 */
    desc: "对光影、材质与物理渲染有深度理解，能够在短时间内输出高质量视觉，兼顾效率与质感。"
  },
  {
    icon: "◇",
    title: "特效模拟",
    titleEn: "Simulation",
    desc: "流体、粒子、破碎、柔体 — 擅长通过程序化手段构建真实可信的视觉现象。"
  },
  {
    icon: "◆",
    title: "动态设计",
    titleEn: "Motion Design",
    desc: "从节奏、镜头语言到排版的整体把控，能够独立完成从概念到成片的动态影像。"
  },
  {
    icon: "◉",
    title: "合成与调色",
    titleEn: "Compositing",
    desc: "注重画面最后的合成与调色阶段，把控最终画面的氛围、层级与整体色彩。"
  },
  {
    icon: "◎",
    title: "视觉开发",
    titleEn: "Look Development",
    desc: "在项目前期提供清晰的视觉方向与参考体系，为团队协作锚定风格。"
  },
  {
    icon: "◌",
    title: "全流程协作",
    titleEn: "Pipeline",
    desc: "熟悉从前期概念到最终交付的完整流程，能够高效与团队协作并独立完成项目。"
  }
]


/* 组件主函数：渲染 6 张能力卡片 */
export default function Advantages() {
  return (
    /* section = 整个区块容器
       className = "section advantages" — 继承 section 通用样式 + 本模块专属样式
       id = "skills" — 顶部导航"技能"会跳转到这里 */
    <section className="section advantages" id="skills">

      <div className="container">

        {/* 顶部标签 + 标题 */}
        <div className="section-label reveal">03 — 技能</div>
        <h2 className="section-title reveal">
          我所擅长的 · 一种克制的精准。
        </h2>
        <p className="section-desc reveal">
          在不同类型的项目中积累的能力模块，可以根据项目需要灵活组合。
        </p>

        {/* 能力卡片网格 — 6 张卡片的网格 */}
        <div className="advantages-grid">

          {/* 使用 Array.map 渲染 6 张卡片 */}
          {advantages.map((item, i) => (
            /* article = 每张能力卡片
               key = React 列表渲染的唯一标识（用索引 i）*/
            <article
              key={i}
              className="advantage-card reveal"
              data-spotlight           /* 鼠标光斑效果（由 CSS 读取） */
              data-cursor-hover         /* 自定义光标 hover 样式 */
            >
              <span className="advantage-icon">{item.icon}</span> {/* 图标 */}
              <h3 className="advantage-title">
                {item.title}
                <span className="advantage-title-en">{item.titleEn}</span> {/* 英文小字 */}
              </h3>
              <p className="advantage-desc">{item.desc}</p>           {/* 描述 */}
            </article>
          ))}

        </div>
      </div>
    </section>
  )
}
