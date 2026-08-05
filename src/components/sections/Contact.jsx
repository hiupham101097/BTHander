import React, { useState } from "react";
import { ChevronRight, Send } from "lucide-react";
import Reveal from "../ui/Reveal.jsx";
import SectionEyebrow from "../ui/SectionEyebrow.jsx";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
const initialForm = { name: "", email: "", phone: "", company: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const response = await fetch(`${apiBaseUrl}/api/support`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.errors?.[0] || body.error || "Không thể gửi yêu cầu");
      setForm(initialForm);
      setStatus("sent");
    } catch (requestError) {
      setError(requestError.message);
      setStatus("error");
    }
  };

  return (
    <section className="section contact-section" id="contact">
      <div className="wrap contact-layout">
        <Reveal>
          <div className="contact-copy">
            <SectionEyebrow label="Liên hệ" />
            <h2 className="section-title">Cùng đưa ý tưởng của bạn vào vận hành.</h2>
            <p className="section-sub">Gửi nhu cầu của bạn, đội ngũ Aurix sẽ liên hệ để tư vấn giải pháp phù hợp.</p>
            <div className="contact-note"><ChevronRight size={18} /> Phản hồi trong ngày làm việc.</div>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <form className="contact-form" onSubmit={submit}>
            <div className="contact-form-grid">
              <label>Họ và tên<input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>
              <label>Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
              <label>Số điện thoại<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} /></label>
              <label>Công ty<input value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} /></label>
            </div>
            <label>Nội dung cần hỗ trợ<textarea required rows="4" value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label>
            {status === "sent" && <p className="form-message form-success">Cảm ơn bạn! Yêu cầu đã được gửi thành công.</p>}
            {status === "error" && <p className="form-message form-error">{error}</p>}
            <button className="btn-primary" disabled={status === "sending"} type="submit"><Send size={16} /> {status === "sending" ? "Đang gửi..." : "Gửi yêu cầu"}</button>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
