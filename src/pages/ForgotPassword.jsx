import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Eye, EyeOff, KeyRound, Mail, RefreshCw, ShieldCheck } from "lucide-react";
import BrandLogo from "../components/ui/BrandLogo.jsx";

/* ============================================================
   STEP INDICATOR
   ============================================================ */
function StepBar({ step }) {
  const steps = ["Nhập email", "Xác nhận OTP", "Mật khẩu mới"];
  return (
    <div className="fp-steps">
      {steps.map((label, idx) => (
        <React.Fragment key={idx}>
          <div className={`fp-step ${idx < step ? "fp-step-done" : idx === step ? "fp-step-active" : ""}`}>
            <div className="fp-step-dot">
              {idx < step ? <CheckCircle size={14} /> : idx + 1}
            </div>
            <span>{label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`fp-step-line ${idx < step ? "fp-step-line-done" : ""}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

/* ============================================================
   STEP 1 – Enter email
   ============================================================ */
function StepEmail({ onNext }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Không thể gửi OTP");
      /* DEV mode: backend returns otp directly */
      onNext(email.trim().toLowerCase(), body.otp || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-icon-wrap">
        <Mail size={26} />
      </div>
      <h1>Quên mật khẩu</h1>
      <p className="auth-subtitle">
        Nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi mã OTP 6 số để xác nhận danh tính.
      </p>
      <form onSubmit={submit} className="auth-form">
        <label>
          Email
          <input
            required
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ban@example.com"
          />
        </label>
        {error && <p className="form-message form-error">{error}</p>}
        <button className="btn-primary" disabled={loading}>
          {loading ? "Đang gửi…" : "Gửi mã OTP"}
        </button>
      </form>
    </>
  );
}

/* ============================================================
   STEP 2 – Enter OTP
   ============================================================ */
function StepOtp({ email, devOtp, onNext }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
    /* DEV: pre-fill if otp returned from server */
    if (devOtp) {
      setOtp(devOtp.split("").slice(0, 6).concat(Array(6).fill("")).slice(0, 6));
    }
  }, [devOtp]);

  /* Countdown for resend */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleKey = (idx, e) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleChange = (idx, val) => {
    const digit = val.replace(/\D/, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    if (digit && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      inputRefs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const submit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) { setError("Vui lòng nhập đủ 6 chữ số"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Mã OTP không đúng");
      onNext(body.resetToken);
    } catch (err) {
      setError(err.message);
      setOtp(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (countdown > 0) return;
    setResending(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Không thể gửi lại OTP");
      setSuccess("Đã gửi lại mã OTP mới!");
      setCountdown(60);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      <div className="auth-icon-wrap fp-icon-otp">
        <ShieldCheck size={26} />
      </div>
      <h1>Nhập mã OTP</h1>
      <p className="auth-subtitle">
        Chúng tôi đã gửi mã 6 chữ số tới <strong>{email}</strong>.
        Mã có hiệu lực trong <strong>10 phút</strong>.
      </p>
      <form onSubmit={submit} className="auth-form">
        <div className="otp-boxes" onPaste={handlePaste}>
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              className="otp-box"
              type="text"
              aria-label={`Chữ số OTP ${idx + 1}`}
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKey(idx, e)}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {error && <p className="form-message form-error">{error}</p>}
        {success && <p className="form-message form-success">{success}</p>}

        <button className="btn-primary" disabled={loading}>
          {loading ? "Đang xác nhận…" : "Xác nhận OTP"}
        </button>
      </form>

      <div className="fp-resend">
        <button
          className="fp-resend-btn"
          onClick={resend}
          disabled={countdown > 0 || resending}
        >
          <RefreshCw size={13} />
          {resending ? "Đang gửi lại…" : countdown > 0 ? `Gửi lại sau ${countdown}s` : "Gửi lại mã OTP"}
        </button>
      </div>
    </>
  );
}

/* ============================================================
   STEP 3 – New password
   ============================================================ */
function StepNewPassword({ email, resetToken, onDone }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Password strength */
  const strength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return s;
  })();
  const strengthLabel = ["", "Yếu", "Trung bình", "Khá", "Mạnh"][strength];
  const strengthColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"][strength];

  const submit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { setError("Mật khẩu xác nhận không khớp"); return; }
    if (password.length < 10) { setError("Mật khẩu phải có ít nhất 10 ký tự"); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, resetToken, newPassword: password }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Không thể đặt lại mật khẩu");
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-icon-wrap fp-icon-key">
        <KeyRound size={26} />
      </div>
      <h1>Mật khẩu mới</h1>
      <p className="auth-subtitle">
        Đặt mật khẩu mới cho tài khoản <strong>{email}</strong>.
        Tối thiểu 10 ký tự.
      </p>
      <form onSubmit={submit} className="auth-form">
        <label>
          Mật khẩu mới
          <div className="password-field">
            <input
              required
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tối thiểu 10 ký tự"
              autoComplete="new-password"
            />
            <button type="button" className="password-toggle" aria-label={showPass ? "Ẩn mật khẩu mới" : "Hiện mật khẩu mới"} onClick={() => setShowPass((v) => !v)}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {/* Strength bar */}
          {password && (
            <div className="fp-strength">
              <div className="fp-strength-bar">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="fp-strength-seg"
                    style={{ background: i <= strength ? strengthColor : "#e2e8f0" }}
                  />
                ))}
              </div>
              <span style={{ color: strengthColor, fontSize: 11.5, fontWeight: 700 }}>
                {strengthLabel}
              </span>
            </div>
          )}
        </label>

        <label>
          Xác nhận mật khẩu
          <div className="password-field">
            <input
              required
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
            />
            <button type="button" className="password-toggle" aria-label={showConfirm ? "Ẩn mật khẩu xác nhận" : "Hiện mật khẩu xác nhận"} onClick={() => setShowConfirm((v) => !v)}>
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {confirm && password !== confirm && (
            <span style={{ color: "#ef4444", fontSize: 12, marginTop: 4, display: "block" }}>
              Mật khẩu không khớp
            </span>
          )}
        </label>

        {error && <p className="form-message form-error">{error}</p>}
        <button className="btn-primary" disabled={loading}>
          {loading ? "Đang lưu…" : "Đặt lại mật khẩu"}
        </button>
      </form>
    </>
  );
}

/* ============================================================
   STEP 4 – Success
   ============================================================ */
function StepSuccess() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/login", { replace: true }), 4000);
    return () => clearTimeout(t);
  }, [navigate]);
  return (
    <>
      <div className="auth-icon-wrap fp-icon-success">
        <CheckCircle size={30} />
      </div>
      <h1>Thành công!</h1>
      <p className="auth-subtitle" style={{ textAlign: "center" }}>
        Mật khẩu của bạn đã được đặt lại thành công.
        <br />
        Đang chuyển hướng đến trang đăng nhập…
      </p>
      <Link to="/login" className="btn-primary" style={{ textAlign: "center", marginTop: 8 }}>
        Đăng nhập ngay
      </Link>
    </>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */
export default function ForgotPassword() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [devOtp, setDevOtp] = useState(null);
  const [resetToken, setResetToken] = useState("");

  return (
    <main className="auth-page">
      <section className="auth-card fp-card">
        <Link className="brand-link" to="/">
          <BrandLogo />
        </Link>

        <StepBar step={step} />

        {step === 0 && (
          <StepEmail
            onNext={(em, otp) => {
              setEmail(em);
              setDevOtp(otp);
              setStep(1);
            }}
          />
        )}
        {step === 1 && (
          <StepOtp
            email={email}
            devOtp={devOtp}
            onNext={(token) => {
              setResetToken(token);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <StepNewPassword
            email={email}
            resetToken={resetToken}
            onDone={() => setStep(3)}
          />
        )}
        {step === 3 && <StepSuccess />}

        {step < 3 && (
          <p className="auth-switch" style={{ marginTop: 16 }}>
            <Link className="auth-link" to="/login" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
              <ArrowLeft size={13} /> Quay lại đăng nhập
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
