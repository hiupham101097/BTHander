import React, { useEffect, useState } from "react";
import { FolderKanban, Pencil, Plus, Trash2, X, Image as ImageIcon, Type, Eye, EyeOff } from "lucide-react";

/* ── Block helpers ── */
const makeText = () => ({ type: "text", content: "" });
const makeHeading = () => ({ type: "heading", content: "" });
const makeImage = () => ({ type: "image", url: "", caption: "" });

function blocksToString(blocks) { return JSON.stringify(blocks); }
function stringToBlocks(raw) {
  if (!raw) return [makeText()];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.length ? parsed : [makeText()];
  } catch { /* legacy text */ }
  return [{ type: "text", content: raw }];
}

/* ── Block Editor ── */
function BlockEditor({ blocks, onChange }) {
  const update = (idx, patch) => onChange(blocks.map((b, i) => (i === idx ? { ...b, ...patch } : b)));
  const remove = (idx) => onChange(blocks.filter((_, i) => i !== idx));
  const add = (factory) => onChange([...blocks, factory()]);

  const uploadImage = async (idx, file) => {
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/media", { method: "POST", credentials: "include", body: data });
    const body = await res.json();
    if (res.ok) update(idx, { url: body.data.url });
    else alert("Lỗi tải ảnh: " + (body.error || ""));
  };

  return (
    <div className="block-editor">
      {blocks.map((block, idx) => (
        <div className="block-editor-item" key={idx}>
          <div className="block-editor-item-header">
            <span className={`block-type-badge${block.type === "image" ? " block-type-badge-image" : ""}`}>
              {block.type === "text" ? <><Type size={11} /> Văn bản</> :
               block.type === "heading" ? <><Type size={11} /> Tiêu đề</> :
               <><ImageIcon size={11} /> Hình ảnh</>}
            </span>
            <button type="button" className="icon-btn icon-danger" onClick={() => remove(idx)}>
              <Trash2 size={13} />
            </button>
          </div>

          {block.type === "text" && (
            <textarea rows={4} value={block.content} onChange={(e) => update(idx, { content: e.target.value })}
              placeholder="Nội dung đoạn văn…"
              style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", font: "inherit", resize: "vertical" }} />
          )}
          {block.type === "heading" && (
            <input value={block.content} onChange={(e) => update(idx, { content: e.target.value })}
              placeholder="Tiêu đề mục…"
              style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", font: "inherit", fontWeight: 700 }} />
          )}
          {block.type === "image" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label className="image-upload-button" style={{ cursor: "pointer" }}>
                <ImageIcon size={14} /> {block.url ? "Đổi ảnh" : "Tải ảnh lên"}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => uploadImage(idx, e.target.files?.[0])} />
              </label>
              {block.url && <img src={block.url} alt="preview" className="block-image-preview" />}
              <input value={block.caption} onChange={(e) => update(idx, { caption: e.target.value })}
                placeholder="Chú thích ảnh (tuỳ chọn)…"
                style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", font: "inherit", fontSize: 13 }} />
            </div>
          )}
        </div>
      ))}
      <div className="block-add-row">
        <button type="button" className="block-add-btn" onClick={() => add(makeText)}><Type size={13} /> + Đoạn văn</button>
        <button type="button" className="block-add-btn" onClick={() => add(makeHeading)}><Type size={13} /> + Tiêu đề</button>
        <button type="button" className="block-add-btn" onClick={() => add(makeImage)}><ImageIcon size={13} /> + Ảnh</button>
      </div>
    </div>
  );
}

const createConfigItem = () => ({ key: "", value: "" });
const createGalleryItem = () => ({ label: "", image_url: "" });
const createRoadmapItem = () => ({ phase: "", title: "", desc: "", status: "upcoming" });

const createDefaultForm = () => ({
  name: "",
  category: "web",
  description: "",
  detail_tag: "",
  full_description: [makeText()],
  languages: "",
  configuration: [createConfigItem()],
  gallery: [],
  roadmap: [],
  price: "0",
  currency: "VND",
});

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(createDefaultForm);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/projects", { credentials: "include" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setProjects(body.data || []);
    } catch {
      setError("Không tải được danh sách dự án.");
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const handleFieldChange = (field) => (event) => setForm((v) => ({ ...v, [field]: event.target.value }));

  const handleItemChange = (listName, index, field) => (event) => {
    const { value } = event.target;
    setForm((v) => ({
      ...v,
      [listName]: v[listName].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  };

  const addItem = (listName, createItem) => setForm((v) => ({ ...v, [listName]: [...v[listName], createItem()] }));
  const removeItem = (listName, index) => setForm((v) => ({ ...v, [listName]: v[listName].filter((_, i) => i !== index) }));

  const openCreateForm = () => {
    setForm(createDefaultForm());
    setEditingId(null);
    setError("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setError("");
  };

  const openEditForm = (project) => {
    setForm({
      name: project.name || "",
      category: project.category || "web",
      description: project.description || "",
      detail_tag: project.detail_tag || "",
      full_description: stringToBlocks(project.full_description),
      languages: (project.languages || []).join(", "),
      configuration: Object.entries(project.configuration || {}).map(([key, value]) => ({ key, value: String(value) })),
      gallery: project.gallery || [],
      roadmap: project.roadmap || [],
      price: String(project.price || 0),
      currency: project.currency || "VND",
    });
    setEditingId(project.id);
    setError("");
    setIsFormOpen(true);
  };

  const handleImageUpload = (index) => async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/media", { method: "POST", credentials: "include", body: data });
      const body = await response.json();
      if (response.ok) {
        setForm((v) => ({
          ...v,
          gallery: v.gallery.map((item, i) => (i === index ? { ...item, image_url: body.data.url } : item)),
        }));
      } else alert("Lỗi tải ảnh: " + (body.error || ""));
    } catch (error) {
      alert("Lỗi tải ảnh: " + error.message);
    } finally {
      event.target.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const gallery = form.gallery.filter((item) => item.label.trim() && item.image_url).map((item) => ({ label: item.label.trim(), image_url: item.image_url.trim() }));
    const roadmap = form.roadmap.filter((item) => item.phase || item.title || item.desc);
    if (roadmap.some((item) => !item.phase || !item.title || !item.desc)) {
      setError("Mỗi bước lộ trình cần điền đủ thông tin (Giai đoạn, Tiêu đề, Mô tả).");
      return;
    }

    const payload = {
      ...form,
      full_description: blocksToString(form.full_description),
      languages: form.languages.split(",").map((language) => language.trim()).filter(Boolean),
      configuration: Object.fromEntries(form.configuration.filter((item) => item.key.trim()).map((item) => [item.key.trim(), item.value])),
      gallery,
      roadmap,
      price: Number(form.price),
      currency: form.currency.trim().toUpperCase(),
    };

    const url = editingId ? `/api/projects/${editingId}` : "/api/projects";
    const method = editingId ? "PATCH" : "POST";

    setSaving(true);
    try {
      const response = await fetch(url, { method, credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || body.errors?.[0] || "Không thể lưu dự án.");
      closeForm();
      await loadProjects();
    } catch (submitError) {
      setError(submitError.message || "Không thể lưu dự án.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Xóa dự án này?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE", credentials: "include" });
    loadProjects();
  };

  return (
    <div>
      <div className="admin-toolbar">
        <h2 className="admin-section-title">Quản lý dự án ({projects.length})</h2>
        <button type="button" className="btn-primary admin-add" onClick={openCreateForm}>
          <Plus size={17} /> Thêm dự án
        </button>
      </div>

      {isFormOpen && (
        <div className="admin-modal-backdrop" onMouseDown={closeForm}>
          <form className="admin-form admin-modal" onSubmit={handleSubmit} onMouseDown={(e) => e.stopPropagation()} style={{ maxWidth: 900 }}>
            <div className="admin-form-header">
              <h3>{editingId ? "Chỉnh sửa dự án" : "Thêm dự án mới"}</h3>
              <button type="button" className="icon-btn" onClick={closeForm}><X size={17} /></button>
            </div>

            {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

            <div className="admin-form-grid">
              <label>
                Tên dự án
                <input required value={form.name} onChange={handleFieldChange("name")} />
              </label>

              <label>
                Loại dự án
                <select required value={form.category} onChange={handleFieldChange("category")}>
                  <option value="web">Website</option>
                  <option value="mobile">Mobile App</option>
                  <option value="software">Phần mềm</option>
                </select>
              </label>

              <label>
                Ngôn ngữ / Công nghệ
                <input required value={form.languages} onChange={handleFieldChange("languages")} placeholder="React, Node.js" />
              </label>

              <label>
                Giá & Đơn vị (0 = Liên hệ)
                <div style={{ display: "flex", gap: 8 }}>
                  <input required type="number" min="0" value={form.price} onChange={handleFieldChange("price")} style={{ flex: 1 }} />
                  <input required value={form.currency} onChange={handleFieldChange("currency")} style={{ width: 80 }} placeholder="VND" />
                </div>
              </label>

              <label className="admin-form-full">
                Mô tả ngắn (Hiển thị thẻ dự án)
                <textarea value={form.description} onChange={handleFieldChange("description")} rows={2} />
              </label>

              <label className="admin-form-full">
                Dòng tag giới thiệu (Hiển thị trang chi tiết)
                <input value={form.detail_tag} onChange={handleFieldChange("detail_tag")} />
              </label>
            </div>

            {/* Chi tiết bằng Block Editor */}
            <section className="admin-repeat" style={{ marginTop: 20 }}>
              <div className="admin-repeat-head">
                <h4>Nội dung mô tả chi tiết</h4>
              </div>
              <BlockEditor blocks={form.full_description} onChange={(blocks) => setForm({ ...form, full_description: blocks })} />
            </section>

            {/* Hình ảnh */}
            <section className="admin-repeat">
              <div className="admin-repeat-head">
                <h4>Hình ảnh Demo ({form.category === "mobile" ? "Hiển thị khung điện thoại" : "Hiển thị khung trình duyệt"})</h4>
                <button type="button" className="text-action" onClick={() => addItem("gallery", createGalleryItem)}>+ Thêm hình ảnh</button>
              </div>
              {form.gallery.map((item, index) => (
                <div className="gallery-editor" key={index}>
                  <div className="admin-repeat-row gallery-inputs">
                    <input value={item.label} onChange={handleItemChange("gallery", index, "label")} placeholder="Chú thích ảnh..." />
                    <input type="file" accept="image/*" onChange={handleImageUpload(index)} />
                    <button type="button" className="icon-btn icon-danger" onClick={() => removeItem("gallery", index)}><Trash2 size={15} /></button>
                  </div>
                  {item.image_url && <img className="gallery-admin-preview" src={item.image_url} alt={item.label} />}
                </div>
              ))}
            </section>

            {/* Cấu hình kỹ thuật */}
            <section className="admin-repeat">
              <div className="admin-repeat-head">
                <h4>Cấu hình kỹ thuật</h4>
                <button type="button" className="text-action" onClick={() => addItem("configuration", createConfigItem)}>+ Thêm cấu hình</button>
              </div>
              {form.configuration.map((item, index) => (
                <div className="admin-repeat-row config-row" key={index}>
                  <input value={item.key} onChange={handleItemChange("configuration", index, "key")} placeholder="Tên thông số" />
                  <input value={item.value} onChange={handleItemChange("configuration", index, "value")} placeholder="Giá trị" />
                  <button type="button" className="icon-btn icon-danger" onClick={() => removeItem("configuration", index)}><Trash2 size={15} /></button>
                </div>
              ))}
            </section>

            {/* Lộ trình */}
            <section className="admin-repeat">
              <div className="admin-repeat-head">
                <h4>Lộ trình phát triển</h4>
                <button type="button" className="text-action" onClick={() => addItem("roadmap", createRoadmapItem)}>+ Thêm giai đoạn</button>
              </div>
              {form.roadmap.map((item, index) => (
                <div className="roadmap-editor" key={index} style={{ background: "#f8fafc", padding: 12, borderRadius: 8, marginBottom: 12 }}>
                  <div className="admin-repeat-row roadmap-top">
                    <input value={item.phase} onChange={handleItemChange("roadmap", index, "phase")} placeholder="Giai đoạn (VD: Phase 1)" />
                    <input value={item.title} onChange={handleItemChange("roadmap", index, "title")} placeholder="Tiêu đề" />
                    <select value={item.status} onChange={handleItemChange("roadmap", index, "status")}>
                      <option value="done">Đã xong</option>
                      <option value="current">Đang làm</option>
                      <option value="upcoming">Sắp tới</option>
                    </select>
                    <button type="button" className="icon-btn icon-danger" onClick={() => removeItem("roadmap", index)}><Trash2 size={15} /></button>
                  </div>
                  <textarea value={item.desc} onChange={handleItemChange("roadmap", index, "desc")} placeholder="Mô tả công việc thực hiện" rows={2} style={{ width: "100%", marginTop: 8 }} />
                </div>
              ))}
            </section>

            <button type="submit" className="btn-primary admin-add" disabled={saving} style={{ marginTop: 20 }}>
              {saving ? "Đang lưu…" : "Lưu dự án"}
            </button>
          </form>
        </div>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Dự án</th>
              <th>Loại</th>
              <th>Ngôn ngữ</th>
              <th>Giá</th>
              <th aria-label="Thao tác" />
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id}>
                <td>
                  <div className="admin-table-item">
                    <span className="admin-table-icon">
                      <FolderKanban size={15} />
                    </span>
                    <div>
                      <strong>{project.name}</strong>
                      <div className="admin-table-sub">{project.description}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-pill status-pill-${project.category === "mobile" ? "published" : "draft"}`}>
                    {project.category === "mobile" ? "Mobile App" : project.category === "software" ? "Phần mềm" : "Website"}
                  </span>
                </td>
                <td>{(project.languages || []).join(", ")}</td>
                <td>
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: project.currency || "VND", maximumFractionDigits: 0 }).format(project.price || 0)}
                </td>
                <td style={{ display: "flex", gap: 6 }}>
                  <button type="button" className="icon-btn" onClick={() => openEditForm(project)}><Pencil size={15} /></button>
                  <button type="button" className="icon-btn icon-danger" onClick={() => deleteProject(project.id)}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}