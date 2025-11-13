// src/pages/JobDetail.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import useJob from "../hooks/useJob";
import { useAuth } from "../context/AuthContext"
import http from "../config/api";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { job, loading, error } = useJob(id || "");
  const [applying, setApplying] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);
  const [appSuccess, setAppSuccess] = useState<string | null>(null);

  if (!id) return <div>Invalid job id.</div>;
  if (loading) return <div>Loading...Please wait</div>;
  if (error) return <div>Error {error}</div>;
  if (!job) return <div>Job not found</div>;

  const handleApply = async () => {
    if (!job) return;
    if (!user) {
      setAppError("请先登录，再投递该职位。");
      return;
    }
    if (user.role !== "CANDIDATE") {
      setAppError("只有候选人角色可以在系统内投递。");
      return;
    }

    try {
      setApplying(true);
      setAppError(null);
      setAppSuccess(null);

      await http.post("/applications", {
        jobId: Number(job.id),
      });

      setAppSuccess("已成功投递！后续可以在候选人面板查看进度（后续实现）。");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "投递失败";
      setAppError(msg);
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="job-detail">
      <button
        type="button"
        className="job-detail__back"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1 className="job-detail__title">{job.title}</h1>
      <div className="job-detail__meta">
        <span>{job.company ?? "—"}</span>
        <span className="job-detail__dot">·</span>
        <span>{job.location ?? "—"}</span>
        {job.type && (
          <>
            <span className="job-detail__dot">·</span>
            <span>{job.type}</span>
          </>
        )}
      </div>

      {job.description && (
        <div className="job-detail__content">{job.description}</div>
      )}

      <div className="job-detail__actions">
        {job.url ? (
          <a
            className="job-detail__link"
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Check/Apply (External)
          </a>
        ) : (
          <button className="job-detail__btn" disabled>
            No Url
          </button>
        )}

        {user?.role === "CANDIDATE" && (
          <button
            type="button"
            className="job-detail__btn primary"
            onClick={handleApply}
            disabled={applying}
          >
            {applying ? "Submitting..." : "Apply via HireHub"}
          </button>
        )}
      </div>

      {appError && <div className="job-detail__error">{appError}</div>}
      {appSuccess && <div className="job-detail__success">{appSuccess}</div>}
    </div>
  );
};

export default JobDetail;
