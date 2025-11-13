// src/pages/Login.tsx
import { type FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, registerCandidate } = useAuth();
  const navigate = useNavigate();

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regName, setRegName] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const authUser = await login(loginEmail, loginPassword);

      // ✅ 按角色跳转
      if (authUser.role === "HR") {
        navigate("/dash/hr");
      } else if (authUser.role === "LEAD") {
        navigate("/dash/lead");
      } else {
        // CANDIDATE 或其他角色
        navigate("/jobs");
      }
    } catch (err: any) {
      setError(
        err?.message ||
          err?.response?.data?.error ||
          "登录失败"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const authUser = await registerCandidate(
        regEmail,
        regPassword,
        regName,
      );
      // ✅ 注册候选人后直接去“我的投递”或职位页
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
          "注册失败"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth">
      <div className="auth__card">
        <h1 className="auth__title">员工 / 候选人登录</h1>
        {error && <div className="auth__error">{error}</div>}

        <div className="auth__grid">
          {/* 登录 */}
          <section>
            <h2>登录</h2>
            <p className="auth__hint">
              HR / LEAD 用后端 seed 的测试账号；
              候选人用注册的邮箱和密码。
            </p>
            <form onSubmit={handleLogin} className="auth__form">
              <label>
                邮箱
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                密码
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="btn-pop" disabled={loading}>
                {loading ? "处理中..." : "登录"}
              </button>
            </form>
          </section>

          {/* 注册候选人 */}
          <section>
            <h2>注册成为候选人</h2>
            <p className="auth__hint">
              快速生成一个 Candidate 账号，直接在 HireHub 内部投递。
            </p>
            <form onSubmit={handleRegister} className="auth__form">
              <label>
                姓名（可选）
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="例如：Yanqing"
                />
              </label>
              <label>
                邮箱
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </label>
              <label>
                密码（至少 6 位）
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  minLength={6}
                  required
                />
              </label>
              <button type="submit" className="btn-ghost" disabled={loading}>
                {loading ? "处理中..." : "注册并登录"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Login;
