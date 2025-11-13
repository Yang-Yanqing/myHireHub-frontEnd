// src/pages/HrDashboard.tsx
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
  fullName?: string | null;
  email: string;
  photoUrl?: string | null; 
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
      setError(err?.response?.data?.message || err.message || "Failed to load");
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
          "Failed to update status"
      );
    } finally {
      setUpdatingId(null);
    }
  }


  const visibleApps = applications.filter(
    (app) => app.status === "APPLIED" || app.status === "SCREENING"
  );

  return (
    <main className="dash">
      <h1 className="dash__title">HR Dashboard</h1>

      {loading && <div>Loading...</div>}
      {error && <div className="dash__error">{error}</div>}

      {!loading && !error && visibleApps.length === 0 && (
        <div className="dash__empty">No applications for HR at the moment.</div>
      )}

      {!loading && !error && visibleApps.length > 0 && (
        <table className="dash__table">
          <thead>
            <tr>
              <th>Job</th>
              <th>Avatar</th>
              <th>Candidate</th>
              <th>Status</th>
              <th>Applied at</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visibleApps.map((app) => {
              const candidate = app.candidate;
              const displayInitial =
                (candidate.fullName || candidate.email || "?")
                  .trim()
                  .charAt(0)
                  .toUpperCase();

              return (
                <tr key={app.id}>
                  <td>{app.job.title}</td>
                  <td>
                    {candidate.photoUrl ? (
                      <img
                        src={candidate.photoUrl}
                        alt={candidate.fullName || candidate.email}
                        className="table-avatar"
                      />
                    ) : (
                      <div className="table-avatar table-avatar--fallback">
                        {displayInitial}
                      </div>
                    )}
                  </td>
                  <td>
                    {candidate.fullName || "Unnamed"} ({candidate.email})
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
                      Pass screening
                    </button>
                    <button
                      type="button"
                      className="btn-ghost sm"
                      disabled={updatingId === app.id}
                      onClick={() => updateStatus(app.id, "INTERVIEW")}
                    >
                      Send to Lead
                    </button>
                    <button
                      type="button"
                      className="btn-ghost sm"
                      disabled={updatingId === app.id}
                      onClick={() => updateStatus(app.id, "REJECTED")}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
};

export default HrDashboard;
