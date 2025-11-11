import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="home">
      {/* Page 1: Hero */}
      <section className="snap hero">
        <div className="hero__content pop-card">
          <h1 className="hero__title">HireHub</h1>
          <p className="hero__subtitle">
            Minimal ATS • 快速上手 • 流畅流程
          </p>
          <div className="hero__cta">
            <Link to="/jobs" className="btn-pop">开始找工作</Link>
            <a href="#p2" className="btn-ghost">看看亮点</a>
          </div>
        </div>
        <div className="hero__pattern" aria-hidden="true" />
      </section>

      {/* Page 2: Highlights A */}
      <section id="p2" className="snap features">
        <div className="grid pop-card">
          <h2 className="section-title">为什么选择 HireHub？</h2>
          <ul className="feature-list">
            <li>
              <span className="badge">1</span>
              <div>
                <h3>轻量但专业</h3>
                <p>四表一日志的数据模型，支持职位、候选人、申请与状态流转。</p>
              </div>
            </li>
            <li>
              <span className="badge">2</span>
              <div>
                <h3>极速上手</h3>
                <p>React + TS 前端，Prisma + Postgres 后端，开箱即用。</p>
              </div>
            </li>
            <li>
              <span className="badge">3</span>
              <div>
                <h3>可扩展</h3>
                <p>预留角色与审核流，轻松加上 Admin、通知、审计日志。</p>
              </div>
            </li>
          </ul>
          <div className="section-cta">
            <Link to="/jobs" className="btn-pop">去看看职位</Link>
          </div>
        </div>
        <div className="confetti" aria-hidden="true" />
      </section>

      {/* Page 3: Highlights B */}
      <section className="snap features alt">
        <div className="grid pop-card">
          <h2 className="section-title">三页式 · PPT 风</h2>
          <div className="cards">
            <article className="card">
              <h3>首页</h3>
              <p>品牌感十足的 Hero + 亮点页，滚动即演示。</p>
            </article>
            <article className="card">
              <h3>职位页</h3>
              <p>公共浏览，按角色显示按钮（新增/编辑/申请）。</p>
            </article>
            <article className="card">
              <h3>详情页</h3>
              <p>干净的信息层次与外链跳转，移动端友好。</p>
            </article>
          </div>
          <div className="section-cta">
            <Link to="/jobs" className="btn-pop">立即体验</Link>
            <a href="#top" className="btn-ghost">返回顶部</a>
          </div>
        </div>
        <div className="squares" aria-hidden="true" />
      </section>
    </main>
  );
};

export default Home;
