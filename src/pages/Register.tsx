// src/pages/Register.tsx
import { type FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type RegisterRole = "CANDIDATE" | "HR" | "LEAD";

const Register = () => {
  const { registerCandidate } = useAuth();
  const navigate = useNavigate();

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regPhotoUrl, setRegPhotoUrl] = useState("");
  const [role, setRole] = useState<RegisterRole>("CANDIDATE");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Currently only candidate registration is supported.
      const authUser = await registerCandidate(
        regEmail,
        regPassword,
        regName,
        regPhotoUrl
      );

      if (authUser.role === "CANDIDATE") {
        navigate("/profile");
      } else {
        navigate("/jobs");
      }
    } catch (err: any) {
      setError(
        err?.message ||
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Sign-up failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Create your HireHub account</h1>
        {error && <div className="auth__error">{error}</div>}

        <form onSubmit={handleRegister} className="auth__form">
          <fieldset className="auth__role-group">
            <legend>Role (currently only Candidate is available)</legend>
            <label className="auth__role-option">
              <input
                type="radio"
                name="role"
                value="CANDIDATE"
                checked={role === "CANDIDATE"}
                onChange={() => setRole("CANDIDATE")}
              />
              Candidate
            </label>

            <label className="auth__role-option auth__role-option--disabled">
              <input type="radio" name="role" value="HR" disabled />
              HR (coming soon)
            </label>

            <label className="auth__role-option auth__role-option--disabled">
              <input type="radio" name="role" value="LEAD" disabled />
              Lead (coming soon)
            </label>
          </fieldset>

          <label>
            Full name (optional)
            <input
              type="text"
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              placeholder="e.g. Yanqing Yang"
            />
          </label>

          <label>
            Avatar URL (optional)
            <input
              type="url"
              value={regPhotoUrl}
              onChange={(e) => setRegPhotoUrl(e.target.value)}
              placeholder="https://example.com/avatar.png"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />
          </label>

          <label>
            Password (min. 6 characters)
            <input
              type="password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              minLength={6}
              required
            />
          </label>

          <button type="submit" className="btn-pop" disabled={loading}>
            {loading ? "Creating account..." : "Sign up and sign in"}
          </button>
        </form>

        <p className="auth__hint">
          Already have an account?{" "}
          <Link to="/login">Go to sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default Register;
