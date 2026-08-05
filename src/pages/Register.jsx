import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BrandLogo from "../components/ui/BrandLogo.jsx";

const initialForm = { name: "", email: "", password: "", confirmPassword: "" };

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const update = (field) => (event) => setForm({ ...form, [field]: event.target.value });

  const submit = async (event) => {
    event.preventDefault(); setError("");
    if (form.password !== form.confirmPassword) { setError("Mật khẩu xác nhận không khớp."); return; }
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, password: form.password }) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.errors?.[0] || body.error || "Không thể đăng ký");
      navigate("/");
    } catch (requestError) { setError(requestError.message); } finally { setSubmitting(false); }
  };

  return <main className="auth-page"><section className="auth-card">
    <Link className="brand-link" to="/"><BrandLogo /></Link>
    <p className="auth-eyebrow">BThander · Brave Trust Hander</p>
    <h1>Đăng ký người dùng</h1>
    <p className="auth-subtitle">Tạo tài khoản người dùng để bắt đầu sử dụng.</p>
    <form onSubmit={submit} className="auth-form">
      <label>Họ và tên<input required autoComplete="name" value={form.name} onChange={update("name")} placeholder="Nguyễn Văn A" /></label>
      <label>Email<input required type="email" autoComplete="email" value={form.email} onChange={update("email")} placeholder="ban@example.com" /></label>
      <label>Mật khẩu<div className="password-field"><input required minLength="10" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.password} onChange={update("password")} placeholder="••••••••••" /><button className="password-toggle" type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Ẩn" : "Hiện"}</button></div></label>
      <label>Xác nhận mật khẩu<input required minLength="10" type={showPassword ? "text" : "password"} autoComplete="new-password" value={form.confirmPassword} onChange={update("confirmPassword")} placeholder="••••••••••" /></label>
      <small>Mật khẩu cần tối thiểu 10 ký tự.</small>
      {error && <p className="form-message form-error">{error}</p>}
      <button className="btn-primary" disabled={submitting}>{submitting ? "Đang xử lý..." : "Đăng ký"}</button>
    </form>
    <p className="auth-switch">Đã có tài khoản? <Link className="auth-link" to="/login">Đăng nhập</Link></p>
  </section></main>;
}
