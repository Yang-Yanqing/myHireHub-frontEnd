// src/pages/Login.tsx
import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const authUser = await login(loginEmail, loginPassword);

      if (authUser.role === "HR") {
        navigate("/dash/hr");
      } else if (authUser.role === "LEAD") {
        navigate("/dash/lead");
      } else {
        navigate("/profile");
      }
    } catch (err: any) {
      setError(
        err?.message ||
          err?.response?.data?.error ||
          "Sign-in failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Sign in to HireHub</h1>
        {error && <div className="auth__error">{error}</div>}

        <form onSubmit={handleLogin} className="auth__form">
          <label>
            Email
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn-pop" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="auth__hint">
          Don&apos;t have an account yet?{" "}
          <Link to="/register">Create a candidate account</Link>
        </p>
      </div>
    </main>
  );
};

export default Login;
