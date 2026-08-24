const encoder = new TextEncoder();
const json = (body, status = 200, headers = {}) => new Response(body === null ? null : JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", ...headers },
});
const projectFromRow = (row) => row && ({ ...row, languages: JSON.parse(row.languages), configuration: JSON.parse(row.configuration), gallery: JSON.parse(row.gallery || "[]"), roadmap: JSON.parse(row.roadmap || "[]") });
const productFromRow = (row) => row && ({ ...row, specifications: JSON.parse(row.specifications) });
const teamFromRow = (row) => row && ({ ...row, skills: JSON.parse(row.skills || "[]"), experience: JSON.parse(row.experience || "[]"), featured_projects: JSON.parse(row.featured_projects || "[]"), articles: JSON.parse(row.articles || "[]") });
const hex = (bytes) => [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
const randomHex = (length = 32) => hex(crypto.getRandomValues(new Uint8Array(length)));

/* ── Email sender (Resend API or MailChannels) ─────────────────────────
 *  Requires env variables:
 *    RESEND_API_KEY  – if using Resend (recommended, resend.com free tier)
 *    MAIL_FROM       – sender address (e.g. noreply@yourdomain.com)
 *  Falls back to MailChannels if RESEND_API_KEY not set.
 * ─────────────────────────────────────────────────────────────────── */
async function sendEmail(env, { to, subject, html }) {
  const from = env.MAIL_FROM || "noreply@bthander.com";

  /* ── Resend API ── */
  if (env.RESEND_API_KEY) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error("Email send failed: " + err);
    }
    return;
  }

  /* ── MailChannels (Cloudflare native, no API key needed) ── */
  const res = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }] }],
      from: { email: from, name: "BTHander" },
      subject,
      content: [{ type: "text/html", value: html }],
    }),
  });
  if (!res.ok && res.status !== 202) {
    throw new Error("Email send failed via MailChannels");
  }
}

/* ── Generate 6-digit OTP ── */
function generateOtp() {
  const digits = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(digits).map((d) => d % 10).join("");
}

/* ── OTP email HTML template ── */
function otpEmailHtml(otp, name) {
  return `<!DOCTYPE html>
<html lang="vi">
<head><meta charset="UTF-8"><title>Đặt lại mật khẩu BTHander</title></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Helvetica Neue',Arial,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:40px 16px">
    <table width="520" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)">
      <tr><td style="background:linear-gradient(135deg,#0f172a,#1e5f4e);padding:32px 40px;text-align:center">
        <div style="color:#fff;font-size:22px;font-weight:800;letter-spacing:-0.03em">BTHander</div>
        <div style="color:rgba(255,255,255,.6);font-size:13px;margin-top:4px">Brave Trust Hander</div>
      </td></tr>
      <tr><td style="padding:40px">
        <p style="margin:0 0 8px;font-size:16px;color:#0f172a">Xin chào<strong>${name ? " " + name : ""}</strong>,</p>
        <p style="margin:0 0 28px;font-size:14px;color:#64748b;line-height:1.6">Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Sử dụng mã OTP bên dưới — mã có hiệu lực trong <strong>10 phút</strong>.</p>
        <div style="text-align:center;margin:0 0 28px">
          <div style="display:inline-block;background:#f1f5f9;border:2px dashed #1e5f4e;border-radius:12px;padding:20px 40px">
            <div style="font-size:42px;font-weight:900;letter-spacing:0.18em;color:#0f172a;font-family:monospace">${otp}</div>
            <div style="font-size:12px;color:#94a3b8;margin-top:6px">Mã OTP – hiệu lực 10 phút</div>
          </div>
        </div>
        <p style="margin:0 0 8px;font-size:13px;color:#94a3b8">Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Tài khoản của bạn vẫn an toàn.</p>
      </td></tr>
      <tr><td style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0">
        <div style="font-size:12px;color:#94a3b8">© ${new Date().getFullYear()} BTHander · Brave Trust Hander</div>
      </td></tr>
    </table>
  </td></tr></table>
</body>
</html>`;
}

async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: encoder.encode(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
  return hex(bits);
}
async function tokenHash(token) { return hex(await crypto.subtle.digest("SHA-256", encoder.encode(token))); }
function cookieValue(request, name) {
  return request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}
function cleanAccount(account) { return account && { id: account.id, name: account.name, email: account.email, role: account.role }; }
function supportErrors(input) {
  const errors = [];
  if (typeof input.name !== "string" || !input.name.trim()) errors.push("name is required");
  if (typeof input.email !== "string" || !/^\S+@\S+\.\S+$/.test(input.email)) errors.push("email must be valid");
  if (typeof input.message !== "string" || !input.message.trim()) errors.push("message is required");
  return errors;
}
function accountErrors(input) {
  const errors = [];
  if (typeof input.name !== "string" || !input.name.trim()) errors.push("name is required");
  if (typeof input.email !== "string" || !/^\S+@\S+\.\S+$/.test(input.email)) errors.push("email must be valid");
  if (typeof input.password !== "string" || input.password.length < 10) errors.push("password must contain at least 10 characters");
  return errors;
}
function projectErrors(input, partial = false) {
  const errors = [];
  if ((!partial || "name" in input) && (typeof input.name !== "string" || !input.name.trim())) errors.push("name is required");
  if ((!partial || "category" in input) && !["web", "mobile", "software"].includes(input.category)) errors.push("category must be web, mobile or software");
  if ((!partial || "languages" in input) && (!Array.isArray(input.languages) || !input.languages.length || input.languages.some((item) => typeof item !== "string" || !item.trim()))) errors.push("languages must be a non-empty array of strings");
  if ((!partial || "configuration" in input) && (!input.configuration || Array.isArray(input.configuration) || typeof input.configuration !== "object")) errors.push("configuration must be an object");
  if ("description" in input && input.description != null && (typeof input.description !== "string" || input.description.length > 1000)) errors.push("description must be a string up to 1000 characters");
  if ("detail_tag" in input && (typeof input.detail_tag !== "string" || input.detail_tag.length > 200)) errors.push("detail_tag must be a string up to 200 characters");
  if ("full_description" in input && (typeof input.full_description !== "string" || input.full_description.length > 50000)) errors.push("full_description must be a string up to 50000 characters");
  if ("gallery" in input && (!Array.isArray(input.gallery) || input.gallery.some((item) => !item || typeof item.label !== "string" || !item.label.trim()))) errors.push("gallery must be an array of items with a label");
  if ("roadmap" in input && (!Array.isArray(input.roadmap) || input.roadmap.some((item) => !item || typeof item.phase !== "string" || typeof item.title !== "string" || typeof item.desc !== "string" || !["done", "current", "upcoming"].includes(item.status)))) errors.push("roadmap items must include phase, title, desc and status");
  if ((!partial || "price" in input) && (typeof input.price !== "number" || !Number.isFinite(input.price) || input.price < 0)) errors.push("price must be a non-negative number");
  if ("currency" in input && (typeof input.currency !== "string" || !/^[A-Z]{3}$/.test(input.currency))) errors.push("currency must be a 3-letter uppercase code");
  return errors;
}
function productErrors(input, partial = false) {
  const errors = [];
  if ((!partial || "name" in input) && (typeof input.name !== "string" || !input.name.trim())) errors.push("name is required");
  if ("description" in input && input.description != null && (typeof input.description !== "string" || input.description.length > 1000)) errors.push("description must be a string up to 1000 characters");
  if ("content" in input && input.content != null && (typeof input.content !== "string" || input.content.length > 50000)) errors.push("content must be a string up to 50000 characters");
  if ("image_url" in input && input.image_url != null && typeof input.image_url !== "string") errors.push("image_url must be a string");
  if ("app_url" in input && input.app_url != null && typeof input.app_url !== "string") errors.push("app_url must be a string");
  if ((!partial || "product_type" in input) && !["trial", "sale"].includes(input.product_type)) errors.push("product_type must be trial or sale");
  if ((!partial || "price" in input) && (typeof input.price !== "number" || !Number.isFinite(input.price) || input.price < 0)) errors.push("price must be a non-negative number");
  if ("currency" in input && (typeof input.currency !== "string" || !/^[A-Z]{3}$/.test(input.currency))) errors.push("currency must be a 3-letter uppercase code");
  if ((!partial || "specifications" in input) && (!Array.isArray(input.specifications) || input.specifications.some((item) => typeof item !== "string" || !item.trim()))) errors.push("specifications must be an array of strings");
  if ("status" in input && !["draft", "published"].includes(input.status)) errors.push("status must be draft or published");
  return errors;
}
function teamErrors(input, partial = false) {
  const errors = [];
  if (!partial) {
    if (typeof input.email !== "string" || !/^\S+@\S+\.\S+$/.test(input.email)) errors.push("email không hợp lệ");
    if (typeof input.password !== "string" || input.password.length < 10) errors.push("mật khẩu phải có ít nhất 10 ký tự");
  }
  if ((!partial || "name" in input) && (typeof input.name !== "string" || !input.name.trim())) errors.push("name is required");
  if ((!partial || "title" in input) && (typeof input.title !== "string" || !input.title.trim())) errors.push("title is required");
  if ("bio" in input && (typeof input.bio !== "string" || input.bio.length > 1000)) errors.push("bio must be a string up to 1000 characters");
  if ("avatar_url" in input && input.avatar_url !== null && typeof input.avatar_url !== "string") errors.push("avatar_url must be a string");
  if ("contact_info" in input && input.contact_info !== null && (typeof input.contact_info !== "string" || input.contact_info.length > 300)) errors.push("contact_info must be a string up to 300 characters");
  if ("profile_intro" in input && (typeof input.profile_intro !== "string" || input.profile_intro.length > 5000)) errors.push("profile_intro must be a string up to 5000 characters");
  for (const field of ["skills", "experience", "featured_projects", "articles"]) if (field in input && (!Array.isArray(input[field]) || input[field].some((item) => typeof item !== "string" || !item.trim()))) errors.push(`${field} must be an array of strings`);
  if ("sort_order" in input && (!Number.isInteger(input.sort_order) || input.sort_order < 0)) errors.push("sort_order must be a non-negative integer");
  if ("status" in input && !["active", "inactive"].includes(input.status)) errors.push("status must be active or inactive");
  return errors;
}
function articleErrors(input, partial = false) {
  const errors = [];
  if ((!partial || "team_member_id" in input) && (!Number.isInteger(input.team_member_id) || input.team_member_id < 1)) errors.push("team_member_id is required");
  if ((!partial || "title" in input) && (typeof input.title !== "string" || !input.title.trim())) errors.push("title is required");
  if (("excerpt" in input) && (typeof input.excerpt !== "string" || input.excerpt.length > 500)) errors.push("excerpt must be a string up to 500 characters");
  if ((!partial || "content" in input) && (typeof input.content !== "string" || !input.content.trim() || input.content.length > 10000)) errors.push("content is required");
  if ("status" in input && !["draft", "published"].includes(input.status)) errors.push("status must be draft or published");
  return errors;
}
async function currentAccount(request, env) {
  const token = cookieValue(request, "bthander_session") || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  return env.DB.prepare("SELECT a.id, a.name, a.email, a.role FROM sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=? AND s.expires_at>CURRENT_TIMESTAMP").bind(await tokenHash(token)).first();
}
async function requireRole(request, env, roles) {
  const account = await currentAccount(request, env);
  return account && roles.includes(account.role) ? account : null;
}
async function authRoutes(request, env, url) {
  const method = request.method;
  if (method === "GET" && url.pathname === "/api/auth/setup-status") {
    const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM accounts").first();
    return json({ setupRequired: Number(row.count) === 0 });
  }
  if (method === "POST" && url.pathname === "/api/auth/bootstrap") {
    const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM accounts").first();
    if (Number(row.count) > 0) return json({ error: "Initial administrator already exists" }, 403);
    const input = await request.json(), errors = accountErrors(input);
    if (errors.length) return json({ errors }, 422);
    const salt = randomHex(16), hash = await passwordHash(input.password, salt);
    const result = await env.DB.prepare("INSERT INTO accounts (name,email,password_hash,password_salt,role) VALUES (?,?,?,?, 'admin')").bind(input.name.trim(), input.email.trim().toLowerCase(), hash, salt).run();
    return createSession(env, result.meta.last_row_id, 201, url.protocol === "https:");
  }
  if (method === "POST" && url.pathname === "/api/auth/register") {
    const input = await request.json(), errors = accountErrors(input);
    if (errors.length) return json({ errors }, 422);
    const salt = randomHex(16), hash = await passwordHash(input.password, salt);
    try {
      const result = await env.DB.prepare("INSERT INTO accounts (name,email,password_hash,password_salt,role) VALUES (?,?,?,?, 'user')").bind(input.name.trim(), input.email.trim().toLowerCase(), hash, salt).run();
      return createSession(env, result.meta.last_row_id, 201, url.protocol === "https:");
    } catch (error) {
      if (String(error).includes("UNIQUE")) return json({ error: "Email này đã được đăng ký" }, 409);
      throw error;
    }
  }
  if (method === "POST" && url.pathname === "/api/auth/login") {
    const input = await request.json();
    if (typeof input.email !== "string" || typeof input.password !== "string") return json({ error: "email and password are required" }, 422);
    const account = await env.DB.prepare("SELECT * FROM accounts WHERE email=?").bind(input.email.trim().toLowerCase()).first();
    if (!account || await passwordHash(input.password, account.password_salt) !== account.password_hash) return json({ error: "Invalid email or password" }, 401);
    return createSession(env, account.id, 200, url.protocol === "https:");
  }
  if (method === "POST" && url.pathname === "/api/auth/logout") {
    const token = cookieValue(request, "bthander_session");
    if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await tokenHash(token)).run();
    return json({ ok: true }, 200, { "set-cookie": `bthander_session=; HttpOnly; ${url.protocol === "https:" ? "Secure; " : ""}SameSite=Lax; Path=/; Max-Age=0` });
  }
  if (method === "GET" && url.pathname === "/api/auth/me") {
    const account = await currentAccount(request, env);
    return account ? json({ data: cleanAccount(account) }) : json({ error: "Unauthorized" }, 401);
  }

  /* ── Forgot Password: send OTP ── */
  if (method === "POST" && url.pathname === "/api/auth/forgot-password") {
    const input = await request.json();
    if (typeof input.email !== "string" || !/^\S+@\S+\.\S+$/.test(input.email.trim())) {
      return json({ error: "Email không hợp lệ" }, 422);
    }
    const email = input.email.trim().toLowerCase();
    const account = await env.DB.prepare("SELECT id, name FROM accounts WHERE email=?").bind(email).first();

    /* Always return success to prevent email enumeration */
    if (!account) return json({ message: "Nếu email tồn tại, mã OTP đã được gửi" });

    /* Rate limit: max 3 OTPs per email in last 15 minutes */
    const recentCount = await env.DB.prepare(
      "SELECT COUNT(*) AS cnt FROM password_reset_otps WHERE email=? AND created_at > datetime('now','-15 minutes')"
    ).bind(email).first();
    if (recentCount && Number(recentCount.cnt) >= 3) {
      return json({ error: "Bạn đã yêu cầu quá nhiều lần. Vui lòng thử lại sau 15 phút." }, 429);
    }

    /* Invalidate old OTPs for this email */
    await env.DB.prepare("UPDATE password_reset_otps SET used=1 WHERE email=? AND used=0").bind(email).run();

    /* Generate OTP */
    const otp = generateOtp();
    const otpHashValue = hex(await crypto.subtle.digest("SHA-256", encoder.encode(otp + email)));
    await env.DB.prepare(
      "INSERT INTO password_reset_otps (email, otp_hash, expires_at) VALUES (?, ?, datetime('now', '+10 minutes'))"
    ).bind(email, otpHashValue).run();

    /* Send email */
    try {
      await sendEmail(env, {
        to: email,
        subject: "[BTHander] Mã OTP đặt lại mật khẩu",
        html: otpEmailHtml(otp, account.name),
      });
    } catch (emailError) {
      console.error("Email send error:", emailError);
      /* In dev/test: return OTP in response so it can be used without email */
      if (env.DEV_MODE === "true") {
        return json({ message: "[DEV] OTP đã tạo (không gửi email)", otp });
      }
      return json({ error: "Không thể gửi email. Vui lòng thử lại sau." }, 500);
    }

    return json({ message: "Nếu email tồn tại, mã OTP đã được gửi" });
  }

  /* ── Verify OTP ── */
  if (method === "POST" && url.pathname === "/api/auth/verify-otp") {
    const input = await request.json();
    if (typeof input.email !== "string" || typeof input.otp !== "string") {
      return json({ error: "email và otp là bắt buộc" }, 422);
    }
    const email = input.email.trim().toLowerCase();
    const otp = input.otp.trim();
    const otpHashValue = hex(await crypto.subtle.digest("SHA-256", encoder.encode(otp + email)));

    const record = await env.DB.prepare(
      "SELECT id FROM password_reset_otps WHERE email=? AND otp_hash=? AND used=0 AND expires_at > CURRENT_TIMESTAMP ORDER BY id DESC LIMIT 1"
    ).bind(email, otpHashValue).first();

    if (!record) return json({ error: "Mã OTP không hợp lệ hoặc đã hết hạn" }, 400);

    /* Issue a short-lived reset token (mark OTP as used) */
    const resetToken = randomHex(32);
    const resetTokenHash = hex(await crypto.subtle.digest("SHA-256", encoder.encode(resetToken)));
    await env.DB.prepare("UPDATE password_reset_otps SET used=1, otp_hash=? WHERE id=?").bind(resetTokenHash, record.id).run();

    return json({ resetToken, message: "OTP xác nhận thành công" });
  }

  /* ── Reset Password ── */
  if (method === "POST" && url.pathname === "/api/auth/reset-password") {
    const input = await request.json();
    if (typeof input.email !== "string" || typeof input.resetToken !== "string" || typeof input.newPassword !== "string") {
      return json({ error: "email, resetToken và newPassword là bắt buộc" }, 422);
    }
    if (input.newPassword.length < 10) {
      return json({ error: "Mật khẩu phải có ít nhất 10 ký tự" }, 422);
    }
    const email = input.email.trim().toLowerCase();
    const resetTokenHash = hex(await crypto.subtle.digest("SHA-256", encoder.encode(input.resetToken)));

    /* Find valid reset token (stored in otp_hash after verify-otp step) */
    const record = await env.DB.prepare(
      "SELECT id FROM password_reset_otps WHERE email=? AND otp_hash=? AND used=1 AND expires_at > datetime('now','-10 minutes') ORDER BY id DESC LIMIT 1"
    ).bind(email, resetTokenHash).first();

    if (!record) return json({ error: "Phiên đặt lại mật khẩu không hợp lệ hoặc đã hết hạn" }, 400);

    const account = await env.DB.prepare("SELECT id FROM accounts WHERE email=?").bind(email).first();
    if (!account) return json({ error: "Tài khoản không tồn tại" }, 404);

    const newSalt = randomHex(16);
    const newHash = await passwordHash(input.newPassword, newSalt);
    await env.DB.prepare(
      "UPDATE accounts SET password_hash=?, password_salt=?, updated_at=CURRENT_TIMESTAMP WHERE id=?"
    ).bind(newHash, newSalt, account.id).run();

    /* Invalidate all reset tokens for this email */
    await env.DB.prepare("DELETE FROM password_reset_otps WHERE email=?").bind(email).run();

    /* Revoke all existing sessions */
    await env.DB.prepare("DELETE FROM sessions WHERE account_id=?").bind(account.id).run();

    return json({ message: "Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại." });
  }

  return null;
}
async function createSession(env, accountId, status = 200, secure = true) {
  const token = randomHex(32);
  await env.DB.prepare("INSERT INTO sessions (account_id,token_hash,expires_at) VALUES (?, ?, datetime('now', '+1 day'))").bind(accountId, await tokenHash(token)).run();
  const account = await env.DB.prepare("SELECT id,name,email,role FROM accounts WHERE id=?").bind(accountId).first();
  return json({ data: cleanAccount(account) }, status, { "set-cookie": `bthander_session=${token}; HttpOnly; ${secure ? "Secure; " : ""}SameSite=Lax; Path=/; Max-Age=86400` });
}

export async function onRequest({ request, env, ctx }) {
  const url = new URL(request.url), parts = url.pathname.split("/").filter(Boolean), method = request.method;
  try {
    if (url.pathname.startsWith("/api/auth/")) return await authRoutes(request, env, url) || json({ error: "Route not found" }, 404);
    const supportRead = method === "GET" && url.pathname === "/api/support";
    const supportUpdate = method === "PATCH" && parts[1] === "support";
    const projectInterest = method === "POST" && parts[1] === "projects" && parts[3] === "interest";
    const projectAdmin = ["POST", "PATCH", "DELETE"].includes(method) && parts[1] === "projects" && !projectInterest;
    const catalogAdmin = ["POST", "PATCH", "DELETE"].includes(method) && ["products", "team", "accounts", "articles"].includes(parts[1]);
    const accountsRead = method === "GET" && url.pathname === "/api/accounts";
    const articlesRead = method === "GET" && url.pathname === "/api/articles";
    const account = (supportRead || supportUpdate || projectInterest || url.pathname === "/api/account-overview" || method === "POST" && url.pathname === "/api/support") ? await currentAccount(request, env) : null;
    if ((supportRead || supportUpdate || projectInterest || url.pathname === "/api/account-overview") && !account) return json({ error: "Unauthorized" }, 401);
    if (projectAdmin && !await requireRole(request, env, ["admin"])) return json({ error: "Unauthorized" }, 401);
    if (catalogAdmin && !await requireRole(request, env, ["admin"])) return json({ error: "Unauthorized" }, 401);
    if (accountsRead && !await requireRole(request, env, ["admin"])) return json({ error: "Unauthorized" }, 401);
    if (articlesRead && !await requireRole(request, env, ["admin"])) return json({ error: "Unauthorized" }, 401);

    if (method === "POST" && url.pathname === "/api/media") {
      if (!await requireRole(request, env, ["admin"])) return json({ error: "Unauthorized" }, 401);
      const form = await request.formData(), file = form.get("file");
      if (!file || typeof file === "string" || !file.type?.startsWith("image/") || file.size > 10 * 1024 * 1024) return json({ error: "Upload an image up to 10 MB" }, 422);
      const extension = file.type.split("/")[1]?.replace(/[^a-z0-9]/gi, "") || "jpg", key = `uploads/${randomHex(16)}.${extension}`;
      await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type }, customMetadata: { uploadedAt: new Date().toISOString() } });
      return json({ data: { key, url: `/media/${key}` } }, 201);
    }

    if (method === "POST" && url.pathname === "/api/support") {
      const input = await request.json(), errors = supportErrors(input);
      if (errors.length) return json({ errors }, 422);
      const result = await env.DB.prepare("INSERT INTO support_requests (name,email,phone,company,message,account_id) VALUES (?,?,?,?,?,?)").bind(input.name.trim(), input.email.trim().toLowerCase(), input.phone?.trim() || null, input.company?.trim() || null, input.message.trim(), account?.id || null).run();
      
      /* Lấy danh sách email của admin và staff */
      const staffQuery = await env.DB.prepare("SELECT email FROM accounts WHERE role IN ('admin', 'staff')").all();
      const staffEmails = staffQuery.results.map(row => row.email);
      
      if (staffEmails.length > 0) {
        const html = `
          <div style="font-family: sans-serif; line-height: 1.5; color: #333;">
            <h2>Yêu cầu liên hệ mới</h2>
            <p><strong>Tên khách hàng:</strong> ${input.name}</p>
            <p><strong>Email:</strong> ${input.email}</p>
            <p><strong>Số điện thoại:</strong> ${input.phone || "Không có"}</p>
            <p><strong>Công ty:</strong> ${input.company || "Không có"}</p>
            <p><strong>Nội dung:</strong></p>
            <blockquote style="border-left: 4px solid #ccc; padding-left: 10px; color: #555;">
              ${input.message.replace(/\n/g, "<br>")}
            </blockquote>
          </div>
        `;
        
        const emailPromises = staffEmails.map(email => 
          sendEmail(env, {
            to: email,
            subject: `[BTHander] Liên hệ mới từ ${input.name}`,
            html: html
          }).catch(err => console.error("Failed to send support email to", email, ":", err))
        );
        
        const sendAllPromise = Promise.all(emailPromises);
        
        if (ctx && ctx.waitUntil) {
          ctx.waitUntil(sendAllPromise);
        } else {
          await sendAllPromise;
        }
      }

      return json({ id: result.meta.last_row_id, message: "Support request received" }, 201);
    }
    if (method === "GET" && url.pathname === "/api/support") {
      const status = url.searchParams.get("status"), own = account.role !== "admin";
      const query = own ? (status ? env.DB.prepare("SELECT * FROM support_requests WHERE account_id=? AND status=? ORDER BY id DESC").bind(account.id, status) : env.DB.prepare("SELECT * FROM support_requests WHERE account_id=? ORDER BY id DESC").bind(account.id)) : (status ? env.DB.prepare("SELECT * FROM support_requests WHERE status=? ORDER BY id DESC").bind(status) : env.DB.prepare("SELECT * FROM support_requests ORDER BY id DESC"));
      return json({ data: (await query.all()).results });
    }
    if (method === "PATCH" && parts[1] === "support" && parts[2]) {
      if (account.role !== "admin") return json({ error: "Forbidden" }, 403);
      const input = await request.json();
      if (!["new", "in_progress", "resolved"].includes(input.status)) return json({ error: "status must be new, in_progress, or resolved" }, 422);
      const result = await env.DB.prepare("UPDATE support_requests SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(input.status, Number(parts[2])).run();
      return result.meta.changes ? json({ id: Number(parts[2]), status: input.status }) : json({ error: "Support request not found" }, 404);
    }
    if (method === "GET" && url.pathname === "/api/account-overview") {
      const own = account.role !== "admin";
      const interests = own ? env.DB.prepare("SELECT pi.*, p.name AS project_name FROM project_interests pi JOIN projects p ON p.id=pi.project_id WHERE pi.account_id=? ORDER BY pi.created_at DESC").bind(account.id) : env.DB.prepare("SELECT pi.*, p.name AS project_name, a.name AS account_name, a.email AS account_email FROM project_interests pi JOIN projects p ON p.id=pi.project_id JOIN accounts a ON a.id=pi.account_id ORDER BY pi.created_at DESC");
      const purchases = own ? env.DB.prepare("SELECT pp.*, p.name AS project_name FROM project_purchases pp JOIN projects p ON p.id=pp.project_id WHERE pp.account_id=? ORDER BY pp.created_at DESC").bind(account.id) : env.DB.prepare("SELECT pp.*, p.name AS project_name, a.name AS account_name, a.email AS account_email FROM project_purchases pp JOIN projects p ON p.id=pp.project_id JOIN accounts a ON a.id=pp.account_id ORDER BY pp.created_at DESC");
      const consultations = own ? env.DB.prepare("SELECT * FROM support_requests WHERE account_id=? ORDER BY id DESC").bind(account.id) : env.DB.prepare("SELECT sr.*, a.name AS account_name, a.email AS account_email FROM support_requests sr LEFT JOIN accounts a ON a.id=sr.account_id ORDER BY sr.id DESC");
      return json({ data: { profile: cleanAccount(account), interests: (await interests.all()).results, purchases: (await purchases.all()).results, consultations: (await consultations.all()).results } });
    }
    if (method === "GET" && url.pathname === "/api/projects") return json({ data: (await env.DB.prepare("SELECT * FROM projects ORDER BY id DESC").all()).results.map(projectFromRow) });
    if (method === "GET" && parts[1] === "projects" && parts[2]) {
      const project = await env.DB.prepare("SELECT * FROM projects WHERE id=?").bind(Number(parts[2])).first();
      return project ? json({ data: projectFromRow(project) }) : json({ error: "Project not found" }, 404);
    }
    if (projectInterest) {
      const projectId = Number(parts[2]);
      const project = await env.DB.prepare("SELECT id FROM projects WHERE id=?").bind(projectId).first();
      if (!project) return json({ error: "Project not found" }, 404);
      await env.DB.prepare("INSERT OR IGNORE INTO project_interests (account_id,project_id) VALUES (?,?)").bind(account.id, projectId).run();
      return json({ data: { project_id: projectId } }, 201);
    }
    if (method === "POST" && url.pathname === "/api/projects") {
      const input = await request.json(), errors = projectErrors(input);
      if (errors.length) return json({ errors }, 422);
      const result = await env.DB.prepare("INSERT INTO projects (name,category,description,languages,configuration,price,currency,detail_tag,full_description,gallery,roadmap) VALUES (?,?,?,?,?,?,?,?,?,?,?)").bind(input.name.trim(), input.category || 'web', input.description?.trim() || null, JSON.stringify(input.languages), JSON.stringify(input.configuration), input.price, input.currency || "VND", input.detail_tag?.trim() || null, input.full_description?.trim() || null, JSON.stringify(input.gallery || []), JSON.stringify(input.roadmap || [])).run();
      return json({ data: projectFromRow(await env.DB.prepare("SELECT * FROM projects WHERE id=?").bind(result.meta.last_row_id).first()) }, 201);
    }
    if ((method === "PATCH" || method === "DELETE") && parts[1] === "projects" && parts[2]) {
      const id = Number(parts[2]);
      if (method === "DELETE") { const result = await env.DB.prepare("DELETE FROM projects WHERE id=?").bind(id).run(); return result.meta.changes ? new Response(null, { status: 204 }) : json({ error: "Project not found" }, 404); }
      const input = await request.json(), errors = projectErrors(input, true);
      if (errors.length || !Object.keys(input).length) return json({ errors: errors.length ? errors : ["At least one field is required"] }, 422);
      const current = await env.DB.prepare("SELECT * FROM projects WHERE id=?").bind(id).first();
      if (!current) return json({ error: "Project not found" }, 404);
      const merged = { ...projectFromRow(current), ...input };
      await env.DB.prepare("UPDATE projects SET name=?,category=?,description=?,languages=?,configuration=?,price=?,currency=?,detail_tag=?,full_description=?,gallery=?,roadmap=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(merged.name.trim(), merged.category || 'web', merged.description?.trim() || null, JSON.stringify(merged.languages), JSON.stringify(merged.configuration), merged.price, merged.currency || "VND", merged.detail_tag?.trim() || null, merged.full_description?.trim() || null, JSON.stringify(merged.gallery || []), JSON.stringify(merged.roadmap || []), id).run();
      return json({ data: projectFromRow(await env.DB.prepare("SELECT * FROM projects WHERE id=?").bind(id).first()) });
    }
    if (method === "GET" && url.pathname === "/api/products") {
      const admin = await requireRole(request, env, ["admin"]);
      const query = admin ? env.DB.prepare("SELECT * FROM products ORDER BY id DESC") : env.DB.prepare("SELECT * FROM products WHERE status='published' ORDER BY id DESC");
      return json({ data: (await query.all()).results.map(productFromRow) });
    }
    if (method === "POST" && url.pathname === "/api/products") {
      const input = await request.json(), errors = productErrors(input);
      if (errors.length) return json({ errors }, 422);
      const result = await env.DB.prepare("INSERT INTO products (name,description,product_type,price,currency,specifications,status,image_url,content,app_url) VALUES (?,?,?,?,?,?,?,?,?,?)").bind(input.name.trim(), input.description?.trim() || null, input.product_type, input.price, input.currency || "VND", JSON.stringify(input.specifications), input.status || "published", input.image_url?.trim() || null, input.content?.trim() || null, input.app_url?.trim() || null).run();
      return json({ data: productFromRow(await env.DB.prepare("SELECT * FROM products WHERE id=?").bind(result.meta.last_row_id).first()) }, 201);
    }
    if ((method === "PATCH" || method === "DELETE") && parts[1] === "products" && parts[2]) {
      const id = Number(parts[2]);
      if (method === "DELETE") { const result = await env.DB.prepare("DELETE FROM products WHERE id=?").bind(id).run(); return result.meta.changes ? new Response(null, { status: 204 }) : json({ error: "Product not found" }, 404); }
      const input = await request.json(), errors = productErrors(input, true);
      if (errors.length || !Object.keys(input).length) return json({ errors: errors.length ? errors : ["At least one field is required"] }, 422);
      const current = await env.DB.prepare("SELECT * FROM products WHERE id=?").bind(id).first(); if (!current) return json({ error: "Product not found" }, 404);
      const merged = { ...productFromRow(current), ...input };
      await env.DB.prepare("UPDATE products SET name=?,description=?,product_type=?,price=?,currency=?,specifications=?,status=?,image_url=?,content=?,app_url=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(merged.name.trim(), merged.description?.trim() || null, merged.product_type, merged.price, merged.currency || "VND", JSON.stringify(merged.specifications), merged.status || "published", merged.image_url?.trim() || null, merged.content?.trim() || null, merged.app_url?.trim() || null, id).run();
      return json({ data: productFromRow(await env.DB.prepare("SELECT * FROM products WHERE id=?").bind(id).first()) });
    }
    if (method === "GET" && url.pathname === "/api/team") {
      const admin = await requireRole(request, env, ["admin"]);
      const query = admin ? env.DB.prepare("SELECT * FROM team_members ORDER BY sort_order, id") : env.DB.prepare("SELECT * FROM team_members WHERE status='active' ORDER BY sort_order, id");
      return json({ data: (await query.all()).results.map(teamFromRow) });
    }
    if (method === "GET" && parts[1] === "team" && parts[2] && !parts[3]) {
      const admin = await requireRole(request, env, ["admin"]);
      const query = admin ? env.DB.prepare("SELECT * FROM team_members WHERE id=?").bind(Number(parts[2])) : env.DB.prepare("SELECT * FROM team_members WHERE id=? AND status='active'").bind(Number(parts[2]));
      const member = await query.first(); return member ? json({ data: teamFromRow(member) }) : json({ error: "Team member not found" }, 404);
    }
    if (method === "GET" && parts[1] === "team" && parts[2] && parts[3] === "articles") {
      const admin = await requireRole(request, env, ["admin"]);
      const query = admin ? env.DB.prepare("SELECT * FROM team_articles WHERE team_member_id=? ORDER BY id DESC").bind(Number(parts[2])) : env.DB.prepare("SELECT * FROM team_articles WHERE team_member_id=? AND status='published' ORDER BY id DESC").bind(Number(parts[2]));
      return json({ data: (await query.all()).results });
    }
    if (method === "POST" && url.pathname === "/api/team") {
      const input = await request.json(), errors = teamErrors(input); if (errors.length) return json({ errors }, 422);
      
      const salt = randomHex(16), hash = await passwordHash(input.password, salt);
      let accountId;
      try {
        const accResult = await env.DB.prepare("INSERT INTO accounts (name,email,password_hash,password_salt,role) VALUES (?,?,?,?, 'staff')").bind(input.name.trim(), input.email.trim().toLowerCase(), hash, salt).run();
        accountId = accResult.meta.last_row_id;
      } catch (error) {
        if (String(error).includes("UNIQUE")) return json({ error: "Email này đã được sử dụng cho tài khoản khác." }, 409);
        throw error;
      }

      const result = await env.DB.prepare("INSERT INTO team_members (name,title,bio,avatar_url,contact_info,profile_intro,skills,experience,featured_projects,articles,sort_order,status,account_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(input.name.trim(), input.title.trim(), input.bio?.trim() || null, input.avatar_url?.trim() || null, input.contact_info?.trim() || null, input.profile_intro?.trim() || null, JSON.stringify(input.skills || []), JSON.stringify(input.experience || []), JSON.stringify(input.featured_projects || []), JSON.stringify(input.articles || []), input.sort_order || 0, input.status || "active", accountId).run();
      return json({ data: teamFromRow(await env.DB.prepare("SELECT * FROM team_members WHERE id=?").bind(result.meta.last_row_id).first()) }, 201);
    }
    if ((method === "PATCH" || method === "DELETE") && parts[1] === "team" && parts[2]) {
      const id = Number(parts[2]);
      if (method === "DELETE") { const result = await env.DB.prepare("DELETE FROM team_members WHERE id=?").bind(id).run(); return result.meta.changes ? new Response(null, { status: 204 }) : json({ error: "Team member not found" }, 404); }
      const input = await request.json(), errors = teamErrors(input, true); if (errors.length || !Object.keys(input).length) return json({ errors: errors.length ? errors : ["At least one field is required"] }, 422);
      const current = await env.DB.prepare("SELECT * FROM team_members WHERE id=?").bind(id).first(); if (!current) return json({ error: "Team member not found" }, 404);
      const merged = { ...current, ...input };
      await env.DB.prepare("UPDATE team_members SET name=?,title=?,bio=?,avatar_url=?,contact_info=?,profile_intro=?,skills=?,experience=?,featured_projects=?,articles=?,sort_order=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(merged.name.trim(), merged.title.trim(), merged.bio?.trim() || null, merged.avatar_url?.trim() || null, merged.contact_info?.trim() || null, merged.profile_intro?.trim() || null, JSON.stringify(merged.skills || []), JSON.stringify(merged.experience || []), JSON.stringify(merged.featured_projects || []), JSON.stringify(merged.articles || []), merged.sort_order, merged.status, id).run();
      return json({ data: teamFromRow(await env.DB.prepare("SELECT * FROM team_members WHERE id=?").bind(id).first()) });
    }
    if (method === "GET" && url.pathname === "/api/articles") {
      const rows = await env.DB.prepare("SELECT ta.*, tm.name AS member_name FROM team_articles ta JOIN team_members tm ON tm.id=ta.team_member_id ORDER BY ta.id DESC").all();
      return json({ data: rows.results });
    }
    if (method === "GET" && parts[1] === "articles" && parts[2]) {
      const admin = await requireRole(request, env, ["admin"]);
      const query = admin ? env.DB.prepare("SELECT ta.*, tm.name AS member_name, tm.title AS member_title FROM team_articles ta JOIN team_members tm ON tm.id=ta.team_member_id WHERE ta.id=?").bind(Number(parts[2])) : env.DB.prepare("SELECT ta.*, tm.name AS member_name, tm.title AS member_title FROM team_articles ta JOIN team_members tm ON tm.id=ta.team_member_id WHERE ta.id=? AND ta.status='published'").bind(Number(parts[2]));
      const article = await query.first(); return article ? json({ data: article }) : json({ error: "Article not found" }, 404);
    }
    if (method === "POST" && url.pathname === "/api/articles") {
      const input = await request.json(), errors = articleErrors(input); if (errors.length) return json({ errors }, 422);
      const result = await env.DB.prepare("INSERT INTO team_articles (team_member_id,title,excerpt,content,status) VALUES (?,?,?,?,?)").bind(input.team_member_id, input.title.trim(), input.excerpt?.trim() || null, input.content.trim(), input.status || "published").run();
      return json({ data: await env.DB.prepare("SELECT * FROM team_articles WHERE id=?").bind(result.meta.last_row_id).first() }, 201);
    }
    if ((method === "PATCH" || method === "DELETE") && parts[1] === "articles" && parts[2]) {
      const id = Number(parts[2]); if (method === "DELETE") { const result = await env.DB.prepare("DELETE FROM team_articles WHERE id=?").bind(id).run(); return result.meta.changes ? new Response(null, { status: 204 }) : json({ error: "Article not found" }, 404); }
      const input = await request.json(), errors = articleErrors(input, true); if (errors.length || !Object.keys(input).length) return json({ errors: errors.length ? errors : ["At least one field is required"] }, 422); const current = await env.DB.prepare("SELECT * FROM team_articles WHERE id=?").bind(id).first(); if (!current) return json({ error: "Article not found" }, 404); const merged = { ...current, ...input };
      await env.DB.prepare("UPDATE team_articles SET team_member_id=?,title=?,excerpt=?,content=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(merged.team_member_id, merged.title.trim(), merged.excerpt?.trim() || null, merged.content.trim(), merged.status || "published", id).run(); return json({ data: await env.DB.prepare("SELECT * FROM team_articles WHERE id=?").bind(id).first() });
    }
    if (method === "GET" && url.pathname === "/api/accounts") return json({ data: (await env.DB.prepare("SELECT id,name,email,role,created_at,updated_at FROM accounts ORDER BY id DESC").all()).results });
    if (method === "PATCH" && parts[1] === "accounts" && parts[2]) {
      const id = Number(parts[2]), input = await request.json();
      if (!['admin', 'staff', 'user'].includes(input.role)) return json({ error: "role must be admin, staff or user" }, 422);
      const actor = await requireRole(request, env, ["admin"]); if (!actor) return json({ error: "Unauthorized" }, 401);
      if (actor.id === id && input.role !== 'admin') return json({ error: "You cannot remove your own administrator role" }, 422);
      const result = await env.DB.prepare("UPDATE accounts SET role=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(input.role, id).run();
      return result.meta.changes ? json({ data: await env.DB.prepare("SELECT id,name,email,role,created_at,updated_at FROM accounts WHERE id=?").bind(id).first() }) : json({ error: "Account not found" }, 404);
    }
    /* ── Team: get my linked member profile ── */
    if (method === "GET" && url.pathname === "/api/team/me") {
      const account = await currentAccount(request, env);
      if (!account) return json({ error: "Unauthorized" }, 401);
      const member = await env.DB.prepare("SELECT * FROM team_members WHERE account_id=?").bind(account.id).first();
      return member ? json({ data: teamFromRow(member) }) : json({ error: "No linked team profile" }, 404);
    }

    return json({ error: "Route not found" }, 404);
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Bad request" }, 400); }
}
