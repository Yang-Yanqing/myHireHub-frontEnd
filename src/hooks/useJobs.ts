//=============Fetch backend data and process state==============//

import {useEffect,useState} from "react";
import http from "../config/api";


export interface Job{
  id:number;
  externalId:string;
  title:string;
  company:string;
  location:string;
  type?:string;
  description?:string;
  url?:string;
  published?:boolean;
}


const useJobs=(published=true):{
    jobs:Job[];
    loading:boolean;
    error:string|null;
}=>{
    const [jobs,setJobs]=useState<Job[]>([]);

    //Believe me, we need this:
    const [loading,setLoading]=useState<boolean>(true);
    const [error,setError]=useState<string|null>(null);

    useEffect(()=>{
        let ignore=false;
        const fetchJobs=async ()=>{
            try {
                setLoading(true);
                //No published no brodacast
                const res=await http.get("/jobs");
                const data=res.data?.data??res.data??[];
                //Array is easy to handle
                if (!ignore) setJobs(Array.isArray(data)?data:[]);
            } catch (err:any) {
                if (!ignore) setError(err?.response?.data?.message||err.message);
            } finally {
                if (!ignore) setLoading(false);
                  }
              }
        fetchJobs();
        return ()=>{ignore=true};
    },[published]);

return {jobs,loading,error}    
}

export default useJobs;