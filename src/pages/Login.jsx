import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/ui/BrandLogo.jsx";

const initialForm = { name: "", email: "", password: "", confirmPassword: "" };

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [setupRequired, setSetupRequired] = useState(false);
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/setup-status", { credentials: "include" })
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body.error || "Máy chủ đăng nhập chưa sẵn sàng.");
        return body;
      })
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

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setForm(initialForm);
  };

  const isRegister = !setupRequired && mode === "register";
  const isBootstrap = setupRequired;
  const needsName = isBootstrap || isRegister;

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (needsName && form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setSubmitting(true);
    try {
      let endpoint = "/api/auth/login";
      let payload = { email: form.email, password: form.password };

      if (isBootstrap) {
        endpoint = "/api/auth/register";
        payload = { name: form.name, email: form.email, password: form.password };
      } else if (isRegister) {
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

  const title = isBootstrap
    ? "Đăng ký tài khoản quản trị"
    : isRegister
    ? "Đăng ký tài khoản"
    : "Đăng nhập";

  const subtitle = isBootstrap
    ? "Tài khoản đầu tiên sẽ được lưu vào database với quyền quản trị viên."
    : isRegister
    ? "Tạo tài khoản mới để bắt đầu sử dụng."
    : "Đăng nhập để quản lý dự án và yêu cầu hỗ trợ.";

  const submitLabel = isBootstrap
    ? "Đăng ký tài khoản"
    : isRegister
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

        {!ready ? (
          <p className="auth-loading">Đang kiểm tra hệ thống...</p>
        ) : (
          <>
            <form onSubmit={submit} className="auth-form" noValidate>
              {needsName && (
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
                    autoComplete={needsName ? "new-password" : "current-password"}
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

              {needsName && (
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

              {needsName && <small>Mật khẩu cần tối thiểu 10 ký tự.</small>}

              {error && <p className="form-message form-error">{error}</p>}

              <button className="btn-primary" disabled={submitting}>
                {submitting ? "Đang xử lý..." : submitLabel}
              </button>
            </form>

            {!isBootstrap && (
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
            )}
          </>
        )}
      </section>
    </main>
  );
}
