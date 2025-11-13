import { useEffect, useState } from "react";
import http from "../config/api";

type ApplicationStatus =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED";

interface HrCandidate {
  id: number;
  name?: string | null;
  email: string;
}

interface HrJob {
  id: number;
  title: string;
}

interface HrApplication {
  id: number;
  status: ApplicationStatus;
  createdAt: string;
  job: HrJob;
  candidate: HrCandidate;
}

const HrDashboard = () => {
  const [applications, setApplications] = useState<HrApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function fetchApplications() {
    try {
      setLoading(true);
      setError(null);
      const res = await http.get("/applications/hr");
      const data = res.data?.data ?? res.data ?? [];
      setApplications(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "加载失败");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchApplications();
  }, []);

  async function updateStatus(id: number, status: ApplicationStatus) {
    try {
      setUpdatingId(id);
      await http.patch(`/applications/${id}/status`, { status });

      setApplications((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, status } : app
        )
      );
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          err.message ||
          "更新状态失败"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <main className="dash">
      <h1 className="dash__title">HR Dashboard</h1>

      {loading && <div>加载中...</div>}
      {error && <div className="dash__error">{error}</div>}

      {!loading && !error && applications.length === 0 && (
        <div className="dash__empty">暂时还没有申请。</div>
      )}

      {!loading && !error && applications.length > 0 && (
        <table className="dash__table">
          <thead>
            <tr>
              <th>职位</th>
              <th>候选人</th>
              <th>状态</th>
              <th>投递时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.job.title}</td>
                <td>
                  {app.candidate.name || "未填写"} ({app.candidate.email})
                </td>
                <td>{app.status}</td>
                <td>{new Date(app.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    type="button"
                    className="btn-ghost sm"
                    disabled={updatingId === app.id}
                    onClick={() => updateStatus(app.id, "SCREENING")}
                  >
                    初筛通过
                  </button>
                  <button
                    type="button"
                    className="btn-ghost sm"
                    disabled={updatingId === app.id}
                    onClick={() => updateStatus(app.id, "INTERVIEW")}
                  >
                    推送面试
                  </button>
                  <button
                    type="button"
                    className="btn-ghost sm"
                    disabled={updatingId === app.id}
                    onClick={() => updateStatus(app.id, "REJECTED")}
                  >
                    拒绝
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default HrDashboard;
