import { BrowserRouter,Route, Routes, Link, NavLink } from "react-router-dom";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Home from "./pages/Home";

const Navbar = () => (
  <header className="navbar">
    <div className="navbar__inner">
      <NavLink to="/" className="brand">HireHub</NavLink>
      <nav>
        <NavLink to="/jobs" className="nav-link">找工作</NavLink>
        {/* 预留登录入口 */}
        <Link to="/login" className="btn-ghost sm">员工登录</Link>
      </nav>
    </div>
  </header>
);


const App=()=>{
  return(
    <BrowserRouter>
    <Navbar />
     <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/jobs" element={<Jobs />}></Route>
      <Route path="/jobs/:id" element={<JobDetail />}></Route>
      <Route path="*" element={<div>404 Not Found</div>} />
     </Routes>
    </BrowserRouter>
  )
}

export default App;