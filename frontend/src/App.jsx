import { useEffect, useState } from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const TOKEN_KEY = "auth_token";

const defaultForm = {
  email: "admin@example.com",
  password: "123456"
};

export default function App() {
  const [form, setForm] = useState(defaultForm);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY) || "");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(Boolean(token));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setCheckingSession(false);
      return;
    }

    const restoreSession = async () => {
      setCheckingSession(true);

      try {
        const response = await fetch(`${API_BASE_URL}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Khong the khoi phuc phien dang nhap.");
        }

        setUser(data.user);
        setMessage("Da khoi phuc phien dang nhap.");
      } catch (restoreError) {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setUser(null);
        setError(restoreError.message);
      } finally {
        setCheckingSession(false);
      }
    };

    restoreSession();
  }, [token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Dang nhap that bai.");
      }

      localStorage.setItem(TOKEN_KEY, data.token);
      setToken(data.token);
      setUser(data.user);
      setMessage(data.message);
    } catch (submitError) {
      setUser(null);
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      localStorage.removeItem(TOKEN_KEY);
      setToken("");
      setUser(null);
      setForm(defaultForm);
      setMessage("Dang xuat thanh cong.");
    } catch (_logoutError) {
      localStorage.removeItem(TOKEN_KEY);
      setToken("");
      setUser(null);
      setMessage("Da xoa phien dang nhap tren trinh duyet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">React + Node.js Authentication</p>
        <h1>Chuc nang dang nhap co the chay ngay</h1>
        <p className="subtitle">
          Backend cung cap API dang nhap, frontend React goi API va luu token
          trong localStorage.
        </p>
      </section>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Thong tin demo</h2>
            <p>
              Email: <strong>admin@example.com</strong>
            </p>
            <p>
              Mat khau: <strong>123456</strong>
            </p>
          </div>
          <span className="badge">{user ? "Da dang nhap" : "Chua dang nhap"}</span>
        </div>

        {checkingSession ? (
          <p className="status">Dang kiem tra phien dang nhap...</p>
        ) : user ? (
          <div className="profile-card">
            <h3>Xin chao, {user.name}</h3>
            <p>Email: {user.email}</p>
            <p className="token">Token: {token.slice(0, 18)}...</p>
            <button className="primary-button" onClick={handleLogout} disabled={loading}>
              {loading ? "Dang xu ly..." : "Dang xuat"}
            </button>
          </div>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Nhap email"
                required
              />
            </label>

            <label>
              Mat khau
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Nhap mat khau"
                required
              />
            </label>

            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? "Dang dang nhap..." : "Dang nhap"}
            </button>
          </form>
        )}

        {message ? <p className="status success">{message}</p> : null}
        {error ? <p className="status error">{error}</p> : null}
      </section>
    </main>
  );
}
