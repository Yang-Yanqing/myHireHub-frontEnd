//===========Dispatch data to child components for rendering===============//
import { useNavigate } from "react-router-dom";
import useJobs from "../hooks/useJobs";
import JobCard from "../components/JobCard";
import { useAuth } from "../context/AuthContext";

const Jobs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { jobs, loading, error } = useJobs(true);

  const isCandidate = user?.role === "CANDIDATE";
  const isHrOrLead = user?.role === "HR" || user?.role === "LEAD";

  if (loading) return <div>Loading...Please wait</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="jobs-page">
      <div className="jobs-page__header">
        <h1>职位列表</h1>

        {isHrOrLead && (
          <button
            type="button"
            className="btn-pop"
            onClick={() => alert("TODO: 新建职位表单")}
          >
            + 新建职位
          </button>
        )}
      </div>

      <div className="jobs">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => navigate(`/jobs/${job.id}`)}
            showApply={isCandidate}
          />
        ))}
      </div>
    </main>
  );
};

export default Jobs;
