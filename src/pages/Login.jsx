import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/ui/BrandLogo.jsx";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event) => {
    event.preventDefault(); setError(""); setSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, password }) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Không thể đăng nhập");
      navigate("/admin");
    } catch (requestError) { setError(requestError.message); } finally { setSubmitting(false); }
  };

  return <main className="auth-page"><section className="auth-card">
    <Link className="brand-link" to="/"><BrandLogo /></Link>
    <p className="auth-eyebrow">BThander · Brave Trust Hander</p>
    <h1>Đăng nhập</h1>
    <p className="auth-subtitle">Đăng nhập để sử dụng các tính năng dành cho người dùng.</p>
    <form onSubmit={submit} className="auth-form">
      <label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="ban@example.com" /></label>
      <label>Mật khẩu<div className="password-field"><input required type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••••" /><button className="password-toggle" type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Ẩn" : "Hiện"}</button></div></label>
      {error && <p className="form-message form-error">{error}</p>}
      <button className="btn-primary" disabled={submitting}>{submitting ? "Đang xử lý..." : "Đăng nhập"}</button>
    </form>
    <p className="auth-switch">Chưa có tài khoản? <Link className="auth-link" to="/register">Đăng ký ngay</Link></p>
  </section></main>;
}
