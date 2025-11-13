// src/App.tsx
import { Route, Routes, Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetail from "./pages/JobDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateProfile from "./pages/CandidateProfile";
import HrDashboard from "./pages/HrDashboard";
import LeadDashboard from "./pages/LeadDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleAvatarClick() {
    if (!user) return;
    if (user.role === "HR") {
      navigate("/dash/hr");
    } else if (user.role === "LEAD") {
      navigate("/dash/lead");
    } else {
      navigate("/profile");
    }
  }

  const displayInitial =
    (user?.name || user?.email || "?").trim().charAt(0).toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar__inner">
        <NavLink to="/" className="brand">
          HireHub
        </NavLink>
        <nav>
          <NavLink to="/jobs" className="nav-link">
            Jobs
          </NavLink>

          {user && user.role === "CANDIDATE" && (
            <NavLink to="/profile" className="nav-link">
              My applications
            </NavLink>
          )}

          {user && user.role === "HR" && (
            <NavLink to="/dash/hr" className="nav-link">
              HR dashboard
            </NavLink>
          )}

          {user && user.role === "LEAD" && (
            <NavLink to="/dash/lead" className="nav-link">
              Lead dashboard
            </NavLink>
          )}

          {user ? (
            <>
              <button
                type="button"
                className="nav-avatar-btn"
                onClick={handleAvatarClick}
                title={`${user.name || user.email} (${user.role})`}
              >
                {user.photoUrl ? (
                  <img
                    src={user.photoUrl}
                    alt={user.name || user.email}
                    className="nav-avatar-img"
                  />
                ) : (
                  <div className="nav-avatar-fallback">{displayInitial}</div>
                )}
              </button>
              <button
                type="button"
                className="btn-ghost sm"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost sm">
                Log in
              </Link>
              <Link to="/register" className="btn-pop sm">
                Sign up
              </Link>
            </>
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
        <Route path="/register" element={<Register />} />

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
