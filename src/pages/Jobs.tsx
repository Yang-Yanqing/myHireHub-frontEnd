// src/pages/Jobs.tsx
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import useJobs, { type Job } from "../hooks/useJobs";
import JobCard from "../components/JobCard";
import { useAuth } from "../context/AuthContext";
import http from "../config/api";

const Jobs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs,loading,error } = useJobs();

  const isCandidate = user?.role === "CANDIDATE";
  const isHrOrLead = user?.role === "HR" || user?.role === "LEAD";

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [url, setUrl] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  async function handleCreateJob(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setCreateError("Job title cannot be empty");
      return;
    }

    try {
      setCreating(true);
      setCreateError(null);

      await http.post("/jobs", {
        title: title.trim(),
        company: company.trim() || undefined,
        location: location.trim() || undefined,
        url: url.trim() || undefined,
         });

      
      window.location.reload();
    } catch (err: any) {
      setCreateError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Failed to create position"
      );
    } finally {
      setCreating(false);
    }
  }


  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function startEdit(job: Job) {
    setEditingId(job.id);
    setEditTitle(job.title ?? "");
    setEditCompany(job.company ?? "");
    setEditLocation(job.location ?? "");
    setEditUrl(job.url ?? "");
    setUpdateError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setUpdateError(null);
  }

  async function handleUpdateJob() {
    if (!editingId) return;
    if (!editTitle.trim()) {
      setUpdateError("Job title cannot be empty");
      return;
    }

    try {
      setUpdating(true);
      setUpdateError(null);

      await http.patch(`/jobs/${editingId}`, {
        title: editTitle.trim(),
        company: editCompany.trim() || undefined,
        location: editLocation.trim() || undefined,
        url: editUrl.trim() || undefined,
      });

    
      window.location.reload();
    } catch (err: any) {
      setUpdateError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Failed to update position"
      );
    } finally {
      setUpdating(false);
    }
  }

  async function handleDeleteJob(id: number) {
    if (!window.confirm("Are you sure to delete")) return;

    try {
      setDeletingId(id);
      await http.delete(`/jobs/${id}`);
      window.location.reload();
    } catch (err: any) {
      alert(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Failed to delete position"
      );
    } finally {
      setDeletingId(null);
    }
  }

  // --- Loading / Error ---
  if (loading) return <div>Loading...Please wait</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="jobs-page">
      <div className="jobs-page__header">
        <h1>Job listings</h1>

        {isHrOrLead && (
          <span className="jobs-page__hint">
            Hello, {user?.role}，You can create, edit, and delete positions below.
          </span>
        )}
      </div>

      
      {isHrOrLead && (
        <section className="jobs-page__create">
          <h2>Create new position</h2>
          {createError && (
            <div className="jobs-page__error">{createError}</div>
          )}
          <form onSubmit={handleCreateJob} className="jobs-page__form">
            <div className="jobs-page__form-row">
              <label>
                 Position title *
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>
              <label>
                Company
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </label>
            </div>
            <div className="jobs-page__form-row">
              <label>
                Location
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </label>
              <label>
                External links (optional)
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://..."
                />
              </label>
            </div>
            <button
              type="submit"
              className="btn-pop"
              disabled={creating}
            >
              {creating ? "Creating..." : "+ Create a job"}
            </button>
          </form>
        </section>
      )}

      
      {isHrOrLead && jobs.length > 0 && (
        <section className="jobs-page__manage">
          <h2>Management positions (updated/deleted)</h2>
          {updateError && (
            <div className="jobs-page__error">{updateError}</div>
          )}

          <table className="jobs-page__table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>External links</th>
                <th>Operate</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const isEditing = editingId === job.id;

                if (isEditing) {
                  return (
                    <tr key={job.id}>
                      <td>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editCompany}
                          onChange={(e) => setEditCompany(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={editLocation}
                          onChange={(e) =>
                            setEditLocation(e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="url"
                          value={editUrl}
                          onChange={(e) => setEditUrl(e.target.value)}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-pop sm"
                          disabled={updating}
                          onClick={handleUpdateJob}
                        >
                          {updating ? "Saving" : "Saved"}
                        </button>
                        <button
                          type="button"
                          className="btn-ghost sm"
                          disabled={updating}
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={job.id}>
                    <td>{job.title}</td>
                    <td>{job.company ?? "—"}</td>
                    <td>{job.location ?? "—"}</td>
                    <td>
                      {job.url ? (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          External links
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-ghost sm"
                        onClick={() => startEdit(job)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn-ghost sm"
                        disabled={deletingId === job.id}
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        {deletingId === job.id ? "Deleting..." : "Deleted"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      )}

     
      <div className="jobs">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => navigate(`/jobs/${job.id}`)}
            showApply={isCandidate}
          />
        ))}

        {jobs.length === 0 && (
          <div className="jobs-page__empty">There are currently no positions available.</div>
        )}
      </div>
    </main>
  );
};

export default Jobs;
