import { useParams,useNavigate  } from "react-router-dom";
import useJob from "../hooks/useJob";

const JobDetail=()=>{
    const {id}=useParams <{id:string}> ();
    const navigate=useNavigate();
    if (!id) return <div>Invalid job id.</div>;
    const {job,loading,error}=useJob(id);

    if(loading) return <div>Loading...Please wait</div>;
    if(error) return <div>Error{error}</div>;
    if(!job) return <div>Job not found</div>;



    return(
        <div className="job-detail">
       <button type="button" className="job-detail__back" onClick={() => navigate(-1)}>← Back</button>
      <h1 className="job-detail__title">{job.title}</h1>
      <div className="job-detail__meta">
        <span>{job.company ?? "—"}</span>
        <span className="job-detail__dot">·</span>
        <span>{job.location ?? "—"}</span>
        {job.type && (<><span className="job-detail__dot">·</span><span>{job.type}</span></>)}
      </div>
      {job.description && (
        <div className="job-detail__content">
          {job.description}
        </div>
      )}
      <div className="job-detail__actions">
        {job.url ? (
          <a className="job-detail__link" href={job.url} target="_blank" rel="noopener noreferrer">Check/Apply</a>
        ) : (
          <button className="job-detail__btn" disabled>No Url</button>
        )}
      </div>
    </div>
    )
}

export default JobDetail;