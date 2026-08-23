import React, { useEffect, useState } from "react";
import { FolderKanban, Pencil, Plus, Trash2, X, Link2 } from "lucide-react";

/*
 * Staff "Dự án của tôi" – quản lý dự án cá nhân gắn với profile.
 * Sử dụng featured_projects field trong team_members (mỗi dòng = một mục).
 * Khi save sẽ cập nhật qua PATCH /api/team/:id (yêu cầu account_id khớp).
 */

const emptyProject = { name: "", role: "", description: "", link: "", year: "" };

export default function MyProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [memberId, setMemberId] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [editingIdx, setEditingIdx] = useState(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [loadState, setLoadState] = useState("loading");

  useEffect(() => {
    loadMyProfile();
  }, []);

  async function loadMyProfile() {
    setLoadState("loading");
    try {
      /* Fetch my linked team member */
      const res = await fetch("/api/team/me", { credentials: "include" });
      if (!res.ok) {
        /* If no linked profile, show info */
        setLoadState("no-profile");
        return;
      }
      const body = await res.json();
      const member = body.data;
      setMemberId(member.id);

      /* Parse featured_projects array → list of project objects */
      const raw = Array.isArray(member.featured_projects) ? member.featured_projects : [];
      const parsed = raw.map((entry) => {
        try { return typeof entry === "object" ? entry : JSON.parse(entry); }
        catch { return { name: entry, role: "", description: "", link: "", year: "" }; }
      });
      setProjects(parsed);
      setLoadState("ready");
    } catch {
      setLoadState("no-profile");
    }
  }

  async function save() {
    if (!memberId) return;
    setSaving(true);
    setError("");
    try {
      const payload = {
        featured_projects: projects.map((p) => JSON.stringify(p)),
      };
      const res = await fetch(`/api/team/${memberId}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Không thể lưu.");
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  function openCreate() {
    setForm(emptyProject);
    setEditingIdx(null);
    setOpen(true);
  }

  function openEdit(idx) {
    setForm({ ...projects[idx] });
    setEditingIdx(idx);
    setOpen(true);
  }

  function submitForm(e) {
    e.preventDefault();
    let updated;
    if (editingIdx !== null) {
      updated = projects.map((p, i) => (i === editingIdx ? { ...form } : p));
    } else {
      updated = [...projects, { ...form }];
    }
    setProjects(updated);
    setOpen(false);
    /* Auto-save */
    save();
  }

  function remove(idx) {
    if (!window.confirm("Xóa dự án này?")) return;
    const updated = projects.filter((_, i) => i !== idx);
    setProjects(updated);
    save();
  }

  const update = (field) => (e) => setForm((v) => ({ ...v, [field]: e.target.value }));

  /* ── Render ── */
  if (loadState === "loading") {
    return <p className="api-state">Đang tải hồ sơ…</p>;
  }

  if (loadState === "no-profile") {
    return (
      <div>
        <h2 className="admin-section-title">Dự án của tôi</h2>
        <div className="admin-note" style={{ marginTop: 16 }}>
          <strong>Tài khoản của bạn chưa được liên kết với một hồ sơ nhân viên.</strong>
          <br />
          Vui lòng liên hệ Admin để được liên kết tài khoản với hồ sơ thành viên đội ngũ.
          Sau khi liên kết, bạn có thể quản lý dự án cá nhân tại đây.
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="admin-toolbar">
        <h2 className="admin-section-title">Dự án của tôi ({projects.length})</h2>
        <button className="btn-primary admin-add" onClick={openCreate}>
          <Plus size={17} /> Thêm dự án
        </button>
      </div>

      <p className="admin-note">
        Danh sách dự án cá nhân của bạn sẽ hiển thị trên trang Profile công khai.
        Mỗi thay đổi được lưu tự động sau khi bạn xác nhận.
      </p>

      {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

      {/* Form Modal */}
      {open && (
        <div className="admin-modal-backdrop" onMouseDown={() => setOpen(false)}>
          <form
            className="admin-form admin-modal"
            onSubmit={submitForm}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="admin-form-header">
              <h3>{editingIdx !== null ? "Chỉnh sửa dự án" : "Thêm dự án mới"}</h3>
              <button type="button" className="icon-btn" onClick={() => setOpen(false)}>
                <X size={17} />
              </button>
            </div>

            <div className="admin-form-grid">
              <label className="admin-form-full">
                Tên dự án
                <input required value={form.name} onChange={update("name")} placeholder="Ví dụ: Website BTHander" />
              </label>
              <label>
                Vai trò của bạn
                <input value={form.role} onChange={update("role")} placeholder="Ví dụ: Frontend Developer" />
              </label>
              <label>
                Năm / Giai đoạn
                <input value={form.year} onChange={update("year")} placeholder="Ví dụ: 2024 – 2025" />
              </label>
              <label className="admin-form-full">
                Mô tả ngắn
                <textarea rows={3} value={form.description} onChange={update("description")} placeholder="Dự án làm gì, bạn đóng góp gì…" />
              </label>
              <label className="admin-form-full">
                Link dự án (tuỳ chọn)
                <input value={form.link} onChange={update("link")} placeholder="https://…" type="url" />
              </label>
            </div>

            <button className="btn-primary admin-add" style={{ marginTop: 18 }} disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu dự án"}
            </button>
          </form>
        </div>
      )}

      {/* Project cards */}
      <div className="my-projects-grid">
        {projects.map((proj, idx) => (
          <div className="my-project-card" key={idx}>
            <div className="my-project-icon">
              <FolderKanban size={20} />
            </div>
            <div className="my-project-info">
              <div className="my-project-name">{proj.name || "Chưa có tên"}</div>
              {proj.role && <div className="my-project-role">{proj.role}</div>}
              {proj.year && <div style={{ fontSize: 12, color: "#94a3b8", marginBottom: 4 }}>{proj.year}</div>}
              {proj.description && <div className="my-project-desc">{proj.description}</div>}
              {proj.link && (
                <a href={proj.link} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 8, color: "var(--accent)", fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>
                  <Link2 size={12} /> Xem dự án
                </a>
              )}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <button className="icon-btn" onClick={() => openEdit(idx)}><Pencil size={14} /></button>
              <button className="icon-btn icon-danger" onClick={() => remove(idx)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
            <FolderKanban size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontSize: 14 }}>Chưa có dự án nào. Thêm dự án đầu tiên của bạn!</p>
          </div>
        )}
      </div>
    </div>
  );
}
