import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/ui/BrandLogo.jsx";

const initialForm = { name: "", email: "", password: "" };

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [setupRequired, setSetupRequired] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/setup-status", { credentials: "include" })
      .then((response) => response.json())
      .then((body) => {
        if (!cancelled) setSetupRequired(Boolean(body.setupRequired));
      })
      .catch(() => {
        if (!cancelled) setError("Không thể kết nối đến máy chủ đăng nhập.");
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const endpoint = setupRequired ? "/api/auth/bootstrap" : "/api/auth/login";
      const payload = setupRequired
        ? form
        : { email: form.email, password: form.password };

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await response.json();
      if (!response.ok) {
        throw new Error(body.errors?.[0] || body.error || "Không thể đăng nhập");
      }
      navigate("/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand-link" to="/">
          <BrandLogo />
        </Link>

        <p className="auth-eyebrow">BThander Workspace</p>
        <h1>{setupRequired ? "Tạo tài khoản quản trị" : "Đăng nhập"}</h1>
        <p className="auth-subtitle">
          {setupRequired
            ? "Thiết lập quản trị viên đầu tiên cho hệ thống."
            : "Đăng nhập để quản lý dự án và yêu cầu hỗ trợ."}
        </p>

        {!ready ? (
          <p className="auth-loading">Đang kiểm tra hệ thống...</p>
        ) : (
          <form onSubmit={submit} className="auth-form" noValidate>
            {setupRequired && (
              <label>
                Họ và tên
                <input
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={updateField("name")}
                  placeholder="Nguyễn Văn A"
                />
              </label>
            )}

            <label>
              Email
              <input
                required
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={updateField("email")}
                placeholder="ban@example.com"
              />
            </label>

            <label>
              Mật khẩu
              <div className="password-field">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  minLength={10}
                  autoComplete={setupRequired ? "new-password" : "current-password"}
                  value={form.password}
                  onChange={updateField("password")}
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? "Ẩn" : "Hiện"}
                </button>
              </div>
            </label>

            {setupRequired && (
              <small>Mật khẩu cần tối thiểu 10 ký tự.</small>
            )}

            {error && <p className="form-message form-error">{error}</p>}

            <button className="btn-primary" disabled={submitting}>
              {submitting
                ? "Đang xử lý..."
                : setupRequired
                ? "Tạo tài khoản"
                : "Đăng nhập"}
            </button>
          </form>
        )}
      </section>
    </main>
  );
}