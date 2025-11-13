// src/App.tsx
import { Route, Routes, Link, NavLink } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import CandidateProfile from "./pages/CandidateProfile";
import HrDashboard from "./pages/HrDashboard";
import LeadDashboard from "./pages/LeadDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

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

          {user && user.role === "CANDIDATE" && (
            <NavLink to="/profile" className="nav-link">
              我的投递
            </NavLink>
          )}

          {user && user.role === "HR" && (
            <NavLink to="/dash/hr" className="nav-link">
              HR 面板
            </NavLink>
          )}

          {user && user.role === "LEAD" && (
            <NavLink to="/dash/lead" className="nav-link">
              Lead 面板
            </NavLink>
          )}

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

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/login" element={<Login />} />

     
        <Route
          path="/profile"
          element={
            <ProtectedRoute roles={["CANDIDATE"]}>
              <CandidateProfile />
            </ProtectedRoute>
          }
        />

      
        <Route
          path="/dash/hr"
          element={
            <ProtectedRoute roles={["HR"]}>
              <HrDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dash/lead"
          element={
            <ProtectedRoute roles={["LEAD"]}>
              <LeadDashboard />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
};

export default App;
