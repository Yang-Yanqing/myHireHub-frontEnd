import { memo } from "react";
import type { Job } from "../hooks/useJobs";

type Props = {
  job: Job;
  onClick?: () => void;
  showApply?: boolean;
};

const JobCard = ({ job, onClick, showApply = false }: Props) => {
  const { title, company, location, type, description, url } = job;

  return (
    <div
      className="job-card"
      onClick={onClick}
      role={onClick ? "button" : undefined}
    >
      <div className="job-card__header">
        <h3 className="job-card__title">{title}</h3>
        {type && <span className="job-card__badge">{type}</span>}
      </div>

      <div className="job-card__meta">
        <span className="job-card__company">{company ?? "-"}</span>
        <span className="job-card__dot">·</span>
        <span className="job-card__location">{location ?? "-"}</span>
      </div>

      {description && (
        <p className="job-card__desc">
          {description.slice(0, 160)}
          {description.length > 160 ? "..." : ""}
        </p>
      )}

      {showApply && (
        <div
          className="job-card__actions"
          onClick={(e) => e.stopPropagation()}
        >
          {url ? (
            <a
              className="job-card__link"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              Check / Apply
            </a>
          ) : (
            <button className="job-card__btn" disabled>No Url</button>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(JobCard);
