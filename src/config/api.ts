import axios from "axios";
import type{AxiosInstance, InternalAxiosRequestConfig } from "axios";



const API_URL=import.meta.env.VITE_API_URL??"http://localhost:5000/api";

//---------------------Prepare for use of socket.io------------------------//
//------------------------------------------------------------------------//
//const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:5000";
//const SOCKET_PATH = import.meta.env.VITE_SOCKET_PATH ?? "/socket.io";

// export const SOCKET_BASE=SOCKET_URL;
// export const SOCKET_PATHNAME=SOCKET_PATH;


export const API_BASE=API_URL;

//CREATE
const http:AxiosInstance=axios.create({baseURL:API_BASE,timeout:10000});

//CLEAN
const normalizeUrl=(u: string): string=>{
  if (/^https?:\/\//i.test(u)) return u;
  let out=u.startsWith("/") ? u : `/${u}`;
  return out.replace(/([^:]\/)\/+/g, "$1");
}

//TOKEN
http.interceptors.request.use(( config:InternalAxiosRequestConfig )=>{
    const token=localStorage.getItem("token");
    if(token){
        config.headers=config.headers??{};
        (config.headers as Record<string,string>).Authorization=`Bearer ${token}`
    }
    if(typeof config.url==='string'){
        config.url=normalizeUrl(config.url);
    }
    return config;
});

export default http;




