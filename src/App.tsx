import { BrowserRouter,Route, Routes, Link, NavLink } from "react-router-dom";
import {useAuth} from "./context/AuthContext"
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Home from "./pages/Home";
import Login from "./pages/Login";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="brand">
          HireHub
        </NavLink>
        <nav>
          <NavLink to="/jobs" className="nav-link">
            找工作
          </NavLink>

          {user ? (
            <>
              <span className="nav-user">
                {user.name || user.email}（{user.role}）
              </span>
              <button
                type="button"
                className="btn-ghost sm"
                onClick={logout}
              >
                退出
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-ghost sm">
              员工登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};


const App=()=>{
  return(
    <BrowserRouter>
    <Navbar />
     <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/jobs" element={<Jobs />}></Route>
      <Route path="/jobs/:id" element={<JobDetail />}></Route>
      <Route path="/login" element={<Login />} ></Route>
      <Route path="*" element={<div>404 Not Found</div>} ></Route>
     </Routes>
    </BrowserRouter>
  )
}

export default App;