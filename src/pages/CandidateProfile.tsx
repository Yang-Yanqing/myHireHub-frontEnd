// src/pages/CandidateProfile.tsx
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
          setError(err?.response?.data?.message || err.message || "Failed to load");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const displayInitial =
    (user?.name || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <main className="profile">
      <h1 className="profile__title">Candidate portal</h1>

      <section className="profile__card">
        <h2>Basic information</h2>
        <div className="profile__user">
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt={user.name || user.email}
              className="profile__avatar"
            />
          ) : (
            <div className="profile__avatar profile__avatar--fallback">
              {displayInitial}
            </div>
          )}
          <div className="profile__user-info">
            <p>Full name: {user?.name ?? "Not provided"}</p>
            <p>Email: {user?.email}</p>
            <p>Role: {user?.role ?? "Unknown"}</p>
          </div>
        </div>
      </section>

      <section className="profile__card">
        <h2>My applications</h2>
        {loading && <div>Loading applications...</div>}
        {error && <div className="profile__error">{error}</div>}

        {!loading && !error && applications.length === 0 && (
          <div className="profile__empty">
            You have not applied to any jobs yet.
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <ul className="profile__list">
            {applications.map((app) => (
              <li key={app.id} className="profile__item">
                <div className="profile__item-main">
                  <div>
                    <div className="profile__job-title">{app.job.title}</div>
                    <div className="profile__job-meta">
                      <span>{app.job.company ?? "—"}</span>
                      <span className="dot">·</span>
                      <span>{app.job.location ?? "—"}</span>
                    </div>
                  </div>
                  <div className="profile__status">
                    Status: {app.status}
                  </div>
                </div>
                <div className="profile__item-sub">
                  Applied at: {new Date(app.createdAt).toLocaleString()}
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
