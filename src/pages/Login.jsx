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

  useEffect(() => {
    fetch("/api/auth/setup-status", { credentials: "include" })
      .then((response) => response.json())
      .then((body) => setSetupRequired(Boolean(body.setupRequired)))
      .catch(() => setError("Không thể kết nối đến máy chủ đăng nhập."))
      .finally(() => setReady(true));
  }, []);

  const submit = async (event) => {
    event.preventDefault(); setError(""); setSubmitting(true);
    try {
      const response = await fetch(setupRequired ? "/api/auth/bootstrap" : "/api/auth/login", { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify(setupRequired ? form : { email: form.email, password: form.password }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.errors?.[0] || body.error || "Không thể đăng nhập");
      navigate("/");
    } catch (requestError) { setError(requestError.message); } finally { setSubmitting(false); }
  };

  return <main className="auth-page"><section className="auth-card">
    <Link className="brand-link" to="/"><BrandLogo /></Link>
    <p className="auth-eyebrow">BThander Workspace</p>
    <h1>{setupRequired ? "Tạo tài khoản quản trị" : "Đăng nhập"}</h1>
    <p>{setupRequired ? "Thiết lập quản trị viên đầu tiên cho hệ thống." : "Đăng nhập để quản lý dự án và yêu cầu hỗ trợ."}</p>
    {!ready ? <p>Đang kiểm tra hệ thống...</p> : <form onSubmit={submit} className="auth-form">
      {setupRequired && <label>Họ và tên<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>}
      <label>Email<input required type="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
      <label>Mật khẩu<input required type="password" minLength="10" autoComplete={setupRequired ? "new-password" : "current-password"} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
      {setupRequired && <small>Mật khẩu cần tối thiểu 10 ký tự.</small>}
      {error && <p className="form-message form-error">{error}</p>}
      <button className="btn-primary" disabled={submitting}>{submitting ? "Đang xử lý..." : setupRequired ? "Tạo tài khoản" : "Đăng nhập"}</button>
    </form>}
  </section></main>;
}
