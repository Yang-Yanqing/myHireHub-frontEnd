import { useEffect, useState } from "react";
import http from "../config/api";
import { useAuth } from "../context/AuthContext";

type ApplicationStatus =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED";

interface ApplicationJob {
  id: number;
  title: string;
  company?: string | null;
  location?: string | null;
}

interface Application {
  id: number;
  status: ApplicationStatus;
  createdAt: string;
  job: ApplicationJob;
}

const CandidateProfile = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await http.get("/applications/me");
        const data = res.data?.data ?? res.data ?? [];
        if (!ignore) {
          setApplications(Array.isArray(data) ? data : []);
        }
      } catch (err: any) {
        if (!ignore) {
          setError(err?.response?.data?.message || err.message || "加载失败");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="profile">
      <h1 className="profile__title">候选人中心</h1>

      <section className="profile__card">
        <h2>我的基本信息</h2>
        <p>姓名：{user?.name ?? "未填写"}</p>
        <p>邮箱：{user?.email}</p>
      </section>

      <section className="profile__card">
        <h2>我的投递</h2>
        {loading && <div>加载中...</div>}
        {error && <div className="profile__error">{error}</div>}

        {!loading && !error && applications.length === 0 && (
          <div className="profile__empty">当前还没有任何投递。</div>
        )}

        {!loading && !error && applications.length > 0 && (
          <ul className="profile__list">
            {applications.map((app) => (
              <li key={app.id} className="profile__item">
                <div className="profile__item-main">
                  <div>
                    <div className="profile__job-title">
                      {app.job.title}
                    </div>
                    <div className="profile__job-meta">
                      <span>{app.job.company ?? "—"}</span>
                      <span className="dot">·</span>
                      <span>{app.job.location ?? "—"}</span>
                    </div>
                  </div>
                  <div className="profile__status">
                    状态：{app.status}
                  </div>
                </div>
                <div className="profile__item-sub">
                  投递时间：{new Date(app.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};

export default CandidateProfile;
