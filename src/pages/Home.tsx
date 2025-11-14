import { Link } from "react-router-dom";

const Home = () => {
  return (
    <main className="home">
      {/* Page 1: Hero (unchanged) */}
      <section className="snap hero">
        <div className="hero__content pop-card">
          <h1 className="hero__title">HireHub</h1>
          <p className="hero__subtitle">
            Minimal ATS • Quick to Start • Seamless Workflow
          </p>
          <div className="hero__cta">
            <Link to="/jobs" className="btn-pop">
              Find Job Now
            </Link>
            <a href="#p2" className="btn-ghost">
              See the Highlights
            </a>
          </div>
        </div>
        <div className="hero__pattern" aria-hidden="true" />
      </section>

      {/* Page 2: Highlights A + images */}
      <section id="p2" className="snap features">
        <div className="grid pop-card">
          <h2 className="section-title">Why HireHub?</h2>

          <div className="features__layout">
            {/* Text side */}
            <div className="features__text">
              <ul className="feature-list">
                <li>
                  <span className="badge">1</span>
                  <div>
                    <h3>Lightweight yet professional</h3>
                    <p>
                      A clean 4-tables-plus-log data model handling jobs,
                      candidates, applications and status transitions.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="badge">2</span>
                  <div>
                    <h3>Fast to get started</h3>
                    <p>
                      React + TypeScript on the frontend, Prisma + Postgres on
                      the backend, ready to ship demos quickly.
                    </p>
                  </div>
                </li>
                <li>
                  <span className="badge">3</span>
                  <div>
                    <h3>Built for growth</h3>
                    <p>
                      Roles and review flows prepared for Admin, notifications
                      and full audit trails later on.
                    </p>
                  </div>
                </li>
              </ul>
              <div className="section-cta">
                <Link to="/jobs" className="btn-pop">
                  去看看职位
                </Link>
              </div>
            </div>

            {/* Image side */}
            <div className="features__images">
              <figure className="feature-image-card">
                <img
                  src="https://res.cloudinary.com/dtcgrtslg/image/upload/v1763121812/%E4%B8%8D%E6%AD%BB%E7%8E%8B%E5%9C%A8%E5%8A%9E%E5%85%AC%E5%AE%A4_mvnru5.png"
                  alt="Fantasy manager working in an office"
                  className="feature-image"
                />
                <figcaption>Fantasy lead managing candidates in the office.</figcaption>
              </figure>

              <figure className="feature-image-card">
                <img
                  src="https://res.cloudinary.com/dtcgrtslg/image/upload/v1763121819/Fantasy_Charaktere_im_Pop-Art-Stil_ehisxn.png"
                  alt="Fantasy characters in a pop-art hiring board"
                  className="feature-image"
                />
                <figcaption>Warcraft-style team on a hiring board.</figcaption>
              </figure>
            </div>
          </div>
        </div>
        <div className="confetti" aria-hidden="true" />
      </section>

      {/* Page 3: Highlights B + image */}
      <section className="snap features alt">
        <div className="grid pop-card">
          <h2 className="section-title">Three-slide, PPT-style flow</h2>
          <div className="features__layout">
            {/* Text side */}
            <div className="features__text">
              <div className="cards">
                <article className="card">
                  <h3>Landing</h3>
                  <p>
                    Branded hero and highlights in a vertical scroll, ready for
                    live demos.
                  </p>
                </article>
                <article className="card">
                  <h3>Jobs</h3>
                  <p>
                    Public job browsing, with role-based actions for HR, leads
                    and candidates.
                  </p>
                </article>
                <article className="card">
                  <h3>Details</h3>
                  <p>
                    Clean information hierarchy, external job links and mobile-friendly layout.
                  </p>
                </article>
              </div>
              <div className="section-cta">
                <Link to="/jobs" className="btn-pop">
                  立即体验
                </Link>
                <a href="#top" className="btn-ghost">
                  返回顶部
                </a>
              </div>
            </div>

            {/* Image side */}
            <div className="features__images">
              <figure className="feature-image-card">
                <img
                  src="https://res.cloudinary.com/dtcgrtslg/image/upload/v1763121812/Jobsuche_im_Fantasy-Stil_fi7vhg.png"
                  alt="Fantasy-style job search scene"
                  className="feature-image"
                />
                <figcaption>Epic fantasy job search powered by HireHub.</figcaption>
              </figure>
            </div>
          </div>
        </div>
        <div className="squares" aria-hidden="true" />
      </section>
    </main>
  );
};

export default Home;
