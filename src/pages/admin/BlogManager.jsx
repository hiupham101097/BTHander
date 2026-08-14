import React, { useEffect, useState } from "react";
import { FileText, Pencil, Plus, Trash2, X } from "lucide-react";

const emptyForm = { title: "", content: "", status: "draft" };

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => fetch("/api/posts", { credentials: "include" }).then(async (response) => {
    const body = await response.json();
    if (!response.ok) throw new Error(body.error);
    setPosts(body.data);
  }).catch(() => setError("Không tải được danh sách bài viết. (Có thể bạn chưa được liên kết với hồ sơ nhân viên nào)"));

  useEffect(() => { load(); }, []);

  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const create = () => { setError(""); setForm(emptyForm); setEditingId(null); setOpen(true); };
  
  const edit = (post) => {
    setError("");
    setForm({ title: post.title, content: post.content, status: post.status });
    setEditingId(post.id); 
    setOpen(true);
  };

  const submit = async (event) => {
    event.preventDefault(); setError("");
    setSaving(true);
    try {
      const response = await fetch(editingId ? `/api/posts/${editingId}` : "/api/posts", { 
        method: editingId ? "PATCH" : "POST", 
        credentials: "include", 
        headers: { "content-type": "application/json" }, 
        body: JSON.stringify(form) 
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.errors?.[0] || body.error || "Không thể lưu bài viết.");
      setOpen(false);
      load();
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Xóa bài viết này?")) return;
    const response = await fetch(`/api/posts/${id}`, { method: "DELETE", credentials: "include" });
    if (!response.ok) { setError("Không thể xóa bài viết."); return; }
    load();
  };

  return <div>
    <div className="admin-toolbar"><h2 className="admin-section-title">Blog của tôi ({posts.length})</h2><button className="btn-primary admin-add" onClick={create}><Plus size={17} />Viết bài</button></div>
    {error && <p className="form-error">{error}</p>}
    {open && <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-header"><h3>{editingId ? "Chỉnh sửa bài viết" : "Viết bài mới"}</h3><button className="icon-btn" type="button" onClick={() => setOpen(false)}><X size={17} /></button></div>
      <div className="admin-form-grid">
        <label className="admin-form-full">Tiêu đề<input required value={form.title} onChange={update("title")} /></label>
        <label className="admin-form-full">Nội dung<textarea required value={form.content} onChange={update("content")} rows="10" /></label>
        <label>Trạng thái
          <select value={form.status} onChange={update("status")}>
            <option value="draft">Bản nháp</option>
            <option value="published">Công khai</option>
          </select>
        </label>
      </div>
      <button className="btn-primary admin-add" disabled={saving}>{saving ? "Đang lưu…" : "Lưu bài viết"}</button>
    </form>}
    
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Bài viết</th><th>Trạng thái</th><th>Ngày tạo</th><th></th></tr></thead><tbody>
      {posts.map((post) => <tr key={post.id}>
        <td>
          <div className="admin-table-item">
            <span className="admin-table-icon"><FileText size={15} /></span>
            <div><div className="admin-table-name">{post.title}</div></div>
          </div>
        </td>
        <td>{post.status === 'published' ? 'Công khai' : 'Nháp'}</td>
        <td>{new Date(post.created_at).toLocaleDateString('vi-VN')}</td>
        <td className="admin-actions">
          <button className="icon-btn" title="Sửa" onClick={() => edit(post)}><Pencil size={15} /></button>
          <button className="icon-btn icon-danger" title="Xóa" onClick={() => remove(post.id)}><Trash2 size={15} /></button>
        </td>
      </tr>)}
      {!posts.length && <tr><td colSpan="4" className="admin-table-empty">Chưa có bài viết nào.</td></tr>}
    </tbody></table></div>
  </div>;
}
