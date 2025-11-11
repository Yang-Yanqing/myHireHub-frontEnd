//===========Dispatch data to child components for rendering===============//

import useJobs from "../hooks/useJobs";
import JobCard from "../components/JobCard"

const Jobs=()=>{
const{jobs, loading, error}=useJobs(true);
if(loading)return <div>Loading...Please wait</div>
if(error)return <div>Error:{error}</div>

return(
    <div className="jobs">
        {jobs.map((job)=> <JobCard key={job.id} job={job}/>)}
    </div>
);
}

export default Jobs;