import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/ui/BrandLogo.jsx";

const initialForm = { name: "", email: "", password: "", confirmPassword: "" };

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const updateField = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setForm(initialForm);
  };

  const isRegister = mode === "register";
  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (isRegister && form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setSubmitting(true);
    try {
      let endpoint = "/api/auth/login";
      let payload = { email: form.email, password: form.password };

      if (isRegister) {
        endpoint = "/api/auth/register";
        payload = { name: form.name, email: form.email, password: form.password };
      }

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body.errors?.[0] || body.error || "Không thể xử lý yêu cầu");
      }
      navigate("/");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };

  const title = isRegister ? "Đăng ký người dùng" : "Đăng nhập";
  const subtitle = isRegister
    ? "Tạo tài khoản người dùng để bắt đầu sử dụng."
    : "Đăng nhập để sử dụng các tính năng dành cho người dùng.";
  const submitLabel = isRegister
    ? "Đăng ký"
    : "Đăng nhập";

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="brand-link" to="/">
          <BrandLogo />
        </Link>

        <p className="auth-eyebrow">BThander · Brave Trust Hander</p>
        <h1>{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>

        <>
            <form onSubmit={submit} className="auth-form" noValidate>
              {isRegister && (
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
                  autoComplete={isRegister ? "new-password" : "current-password"}
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

              {isRegister && (
                <label>
                  Xác nhận mật khẩu
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    minLength={10}
                    autoComplete="new-password"
                    value={form.confirmPassword}
                    onChange={updateField("confirmPassword")}
                    placeholder="••••••••••"
                  />
                </label>
              )}

              {isRegister && <small>Mật khẩu cần tối thiểu 10 ký tự.</small>}

              {error && <p className="form-message form-error">{error}</p>}

              <button className="btn-primary" disabled={submitting}>
                {submitting ? "Đang xử lý..." : submitLabel}
              </button>
            </form>

            <p className="auth-switch">
                {mode === "login" ? (
                  <>
                    Chưa có tài khoản?{" "}
                    <button type="button" className="link-button" onClick={() => switchMode("register")}>
                      Đăng ký ngay
                    </button>
                  </>
                ) : (
                  <>
                    Đã có tài khoản?{" "}
                    <button type="button" className="link-button" onClick={() => switchMode("login")}>
                      Đăng nhập
                    </button>
                  </>
                )}
            </p>
        </>
      </section>
    </main>
  );
}
