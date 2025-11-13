import { useEffect,useState } from "react"
import http from "../config/api"
import type {Job} from "./useJobs"

const useJob=(id:string):{
  job:Job|null;
  loading:boolean;
  error:string|null;
} =>{
  const [job,setJob]=useState<Job|null>(null);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState<string|null>(null);

  
  useEffect(()=>{
    let cancelled=false;
    (async ()=>{
        try {
            setLoading(true);
            const res=await http.get(`/jobs/${id}`);
            const data=res.data?.data??res.data??null;
            if(!cancelled)setJob(data);
        } catch (err:any) {
            if (!cancelled) setError(err?.response?.data?.message||err.message);
        }finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return()=>{cancelled=true;};
  },[id]);
  return {job,loading,error};
}



export default useJob;

