import React, { useEffect, useRef, useState } from "react";
import { FolderKanban, ImagePlus, Pencil, Plus, Trash2, X } from "lucide-react";

const emptyForm = { name: "", description: "", languages: "", configuration: "{}", price: "0", currency: "VND" };

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInput = useRef(null);

  const load = () => fetch("/api/projects").then(async (response) => {
    const body = await response.json();
    if (!response.ok) throw new Error(body.error);
    setProjects(body.data);
  }).catch(() => setError("Không tải được danh sách dự án."));

  const loadImages = async (id) => {
    const response = await fetch(`/api/projects/${id}`);
    const body = await response.json();
    if (!response.ok) throw new Error(body.error);
    setImages(body.data.images || []);
  };

  useEffect(() => { load(); }, []);
  const update = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const create = () => { setError(""); setForm(emptyForm); setImages([]); setEditingId(null); setOpen(true); };
  const edit = async (project) => {
    setError("");
    setForm({ name: project.name, description: project.description || "", languages: project.languages.join(", "), configuration: JSON.stringify(project.configuration, null, 2), price: String(project.price), currency: project.currency || "VND" });
    setEditingId(project.id); setOpen(true);
    try { await loadImages(project.id); } catch { setError("Không tải được ảnh dự án."); }
  };

  const submit = async (event) => {
    event.preventDefault(); setError("");
    let configuration;
    try { configuration = JSON.parse(form.configuration); if (!configuration || Array.isArray(configuration)) throw new Error(); }
    catch { setError("Cấu hình phải là JSON object hợp lệ."); return; }
    const payload = { name: form.name, description: form.description, languages: form.languages.split(",").map((item) => item.trim()).filter(Boolean), configuration, price: Number(form.price), currency: form.currency.toUpperCase() };
    setSaving(true);
    try {
      const response = await fetch(editingId ? `/api/projects/${editingId}` : "/api/projects", { method: editingId ? "PATCH" : "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.errors?.[0] || body.error || "Không thể lưu dự án.");
      if (!editingId) { setEditingId(body.data.id); setImages([]); }
      load();
    } catch (requestError) { setError(requestError.message); }
    finally { setSaving(false); }
  };

  const uploadImages = async (event) => {
    const files = [...event.target.files];
    event.target.value = "";
    if (!editingId || !files.length) return;
    if (images.length + files.length > 100) { setError(`Chỉ có thể thêm ${100 - images.length} ảnh nữa.`); return; }
    setUploading(true); setError("");
    try {
      for (const file of files) {
        const data = new FormData(); data.append("image", file);
        const response = await fetch(`/api/projects/${editingId}/images`, { method: "POST", credentials: "include", body: data });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || `Không thể tải ảnh ${file.name}.`);
      }
      await loadImages(editingId);
    } catch (requestError) { setError(requestError.message); }
    finally { setUploading(false); }
  };

  const removeImage = async (imageId) => {
    if (!window.confirm("Xóa ảnh này?")) return;
    const response = await fetch(`/api/projects/${editingId}/images/${imageId}`, { method: "DELETE", credentials: "include" });
    if (!response.ok) { setError("Không thể xóa ảnh."); return; }
    setImages((current) => current.filter((image) => image.id !== imageId));
  };

  const remove = async (id) => {
    if (!window.confirm("Xóa dự án này và toàn bộ ảnh?")) return;
    const response = await fetch(`/api/projects/${id}`, { method: "DELETE", credentials: "include" });
    if (!response.ok) { setError("Không thể xóa dự án."); return; }
    load();
  };

  return <div>
    <div className="admin-toolbar"><h2 className="admin-section-title">Quản lý dự án ({projects.length})</h2><button className="btn-primary admin-add" onClick={create}><Plus size={17} />Thêm dự án</button></div>
    {error && <p className="form-error">{error}</p>}
    {open && <form className="admin-form" onSubmit={submit}>
      <div className="admin-form-header"><h3>{editingId ? "Chỉnh sửa dự án" : "Thêm dự án"}</h3><button className="icon-btn" type="button" onClick={() => setOpen(false)}><X size={17} /></button></div>
      <div className="admin-form-grid">
        <label>Tên dự án<input required value={form.name} onChange={update("name")} /></label>
        <label>Ngôn ngữ (cách nhau bằng dấu phẩy)<input required value={form.languages} onChange={update("languages")} placeholder="React, Cloudflare D1" /></label>
        <label className="admin-form-full">Mô tả<textarea value={form.description} onChange={update("description")} rows="3" /></label>
        <label className="admin-form-full">Cấu hình (JSON)<textarea required value={form.configuration} onChange={update("configuration")} rows="4" /></label>
        <label>Giá<input required min="0" type="number" value={form.price} onChange={update("price")} /></label>
        <label>Đơn vị tiền<input required maxLength="3" value={form.currency} onChange={update("currency")} /></label>
      </div>
      <button className="btn-primary admin-add" disabled={saving}>{saving ? "Đang lưu…" : editingId ? "Lưu dự án" : "Tạo dự án để thêm ảnh"}</button>
      {editingId && <section className="admin-project-images">
        <div className="admin-images-heading"><div><h4>Ảnh dự án</h4><span>{images.length}/100 ảnh · tối đa 10 MB/ảnh</span></div><button type="button" className="btn-secondary" disabled={uploading || images.length >= 100} onClick={() => fileInput.current?.click()}><ImagePlus size={16} />{uploading ? "Đang tải…" : "Thêm ảnh"}</button></div>
        <input ref={fileInput} hidden multiple type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={uploadImages} />
        {images.length > 0 && <div className="admin-image-grid">{images.map((image) => <div className="admin-image-card" key={image.id}><img src={image.url} alt={image.file_name} /><button type="button" title="Xóa ảnh" onClick={() => removeImage(image.id)}><Trash2 size={15} /></button></div>)}</div>}
      </section>}
    </form>}
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Dự án</th><th>Ngôn ngữ</th><th>Cấu hình</th><th>Giá</th><th></th></tr></thead><tbody>
      {projects.map((project) => <tr key={project.id}><td><div className="admin-table-item"><span className="admin-table-icon"><FolderKanban size={15} /></span><div><div className="admin-table-name">{project.name}</div><div className="admin-table-sub">{project.description || "Chưa có mô tả"}</div></div></div></td><td>{project.languages?.join(", ")}</td><td>{Object.entries(project.configuration || {}).map(([key, value]) => `${key}: ${value}`).join(" · ") || "–"}</td><td>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: project.currency || "VND", maximumFractionDigits: 0 }).format(project.price)}</td><td className="admin-actions"><button className="icon-btn" title="Sửa" onClick={() => edit(project)}><Pencil size={15} /></button><button className="icon-btn icon-danger" title="Xóa" onClick={() => remove(project.id)}><Trash2 size={15} /></button></td></tr>)}
      {!projects.length && <tr><td colSpan="5" className="admin-table-empty">Chưa có dự án nào.</td></tr>}
    </tbody></table></div>
  </div>;
}
