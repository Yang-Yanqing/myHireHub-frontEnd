import { useEffect, useState } from "react";
import http from "../config/api";

type ApplicationStatus =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "HIRED"
  | "REJECTED";

interface LeadCandidate {
  id: number;
  fullName?: string | null;
  email: string;
}

interface LeadJob {
  id: number;
  title: string;
}

interface LeadApplication {
  id: number;
  status: ApplicationStatus;
  createdAt: string;
  job: LeadJob;
  candidate: LeadCandidate;
}

const LeadDashboard = () => {
  const [applications, setApplications] = useState<LeadApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function fetchApplications() {
    try {
      setLoading(true);
      setError(null);
      const res = await http.get("/applications/lead");
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
      <h1 className="dash__title">Lead Dashboard</h1>

      {loading && <div>加载中...</div>}
      {error && <div className="dash__error">{error}</div>}

      {!loading && !error && applications.length === 0 && (
        <div className="dash__empty">暂时还没有审批中的候选人。</div>
      )}

      {!loading && !error && applications.length > 0 && (
        <table className="dash__table">
          <thead>
            <tr>
              <th>职位</th>
              <th>候选人</th>
              <th>当前状态</th>
              <th>投递时间</th>
              <th>审批操作</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app.id}>
                <td>{app.job.title}</td>
                <td>
                  {app.candidate.fullName||"未填写"} ({app.candidate.email})
                </td>
                <td>{app.status}</td>
                <td>{new Date(app.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    type="button"
                    className="btn-ghost sm"
                    disabled={updatingId === app.id}
                    onClick={() => updateStatus(app.id, "OFFER")}
                  >
                    发 Offer
                  </button>
                  <button
                    type="button"
                    className="btn-ghost sm"
                    disabled={updatingId === app.id}
                    onClick={() => updateStatus(app.id, "REJECTED")}
                  >
                    拒绝
                  </button>
                  <button
                    type="button"
                    className="btn-ghost sm"
                    disabled={updatingId === app.id}
                    onClick={() => updateStatus(app.id, "SCREENING")}
                  >
                    打回初筛
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

export default LeadDashboard;
