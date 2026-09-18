import React, { useEffect, useState } from "react";
import {
  FileText,
  Image,
  Pencil,
  Plus,
  Trash2,
  Type,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

/* ── Block helpers ── */
const makeText = () => ({ type: "text", content: "" });
const makeHeading = () => ({ type: "heading", content: "" });
const makeImage = () => ({ type: "image", url: "", caption: "" });

function blocksToString(blocks) {
  return JSON.stringify(blocks);
}

function stringToBlocks(raw) {
  if (!raw) return [makeText()];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.length ? parsed : [makeText()];
  } catch { /* legacy plain text */ }
  return [{ type: "text", content: raw }];
}

/* ── Block Editor ── */
function BlockEditor({ blocks, onChange }) {
  const update = (idx, patch) => {
    onChange(blocks.map((b, i) => (i === idx ? { ...b, ...patch } : b)));
  };
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
               <><Image size={11} /> Hình ảnh</>}
            </span>
            <div className="block-editor-actions">
              <button type="button" className="icon-btn icon-danger" onClick={() => remove(idx)}>
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {block.type === "text" && (
            <textarea
              rows={4}
              value={block.content}
              onChange={(e) => update(idx, { content: e.target.value })}
              placeholder="Nội dung đoạn văn…"
              style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", font: "inherit", resize: "vertical" }}
            />
          )}

          {block.type === "heading" && (
            <input
              value={block.content}
              onChange={(e) => update(idx, { content: e.target.value })}
              placeholder="Tiêu đề mục…"
              style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "10px 12px", font: "inherit", fontWeight: 700 }}
            />
          )}

          {block.type === "image" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <label className="image-upload-button" style={{ cursor: "pointer" }}>
                <Image size={14} /> {block.url ? "Đổi ảnh" : "Tải ảnh lên"}
                <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => uploadImage(idx, e.target.files?.[0])} />
              </label>
              {block.url && (
                <img src={block.url} alt="preview" className="block-image-preview" />
              )}
              <input
                value={block.caption}
                onChange={(e) => update(idx, { caption: e.target.value })}
                placeholder="Chú thích ảnh (tuỳ chọn)…"
                style={{ border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "8px 12px", font: "inherit", fontSize: 13 }}
              />
            </div>
          )}
        </div>
      ))}

      <div className="block-add-row">
        <button type="button" className="block-add-btn" onClick={() => add(makeText)}>
          <Type size={13} /> + Thêm đoạn văn
        </button>
        <button type="button" className="block-add-btn" onClick={() => add(makeHeading)}>
          <Type size={13} /> + Tiêu đề mục
        </button>
        <button type="button" className="block-add-btn" onClick={() => add(makeImage)}>
          <Image size={13} /> + Hình ảnh
        </button>
      </div>
    </div>
  );
}

/* ── Empty form ── */
const emptyForm = () => ({
  title: "",
  blocks: [makeText()],
  excerpt: "",
  thumbnail: "",
  status: "draft",
});

export default function BlogManager() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const load = () =>
    fetch("/api/posts", { credentials: "include" })
      .then(async (r) => {
        const b = await r.json();
        if (!r.ok) throw new Error(b.error || "Không tải được danh sách bài viết");
        setPosts(b.data || []);
        setError("");
      })
      .catch((err) =>
        setError(err.message || "Không tải được danh sách bài viết.")
      );

  useEffect(() => { load(); }, []);

  const update = (field) => (e) => setForm((v) => ({ ...v, [field]: e.target.value }));

  const create = () => {
    setError("");
    setForm(emptyForm());
    setEditingId(null);
    setPreview(false);
    setOpen(true);
  };

  const edit = (post) => {
    setError("");
    setForm({
      title: post.title,
      blocks: stringToBlocks(post.content),
      excerpt: post.excerpt || "",
      thumbnail: post.thumbnail || "",
      status: post.status,
    });
    setEditingId(post.id);
    setPreview(false);
    setOpen(true);
  };

  const uploadThumbnail = async (file) => {
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/media", { method: "POST", credentials: "include", body: data });
    const body = await res.json();
    if (res.ok) setForm((v) => ({ ...v, thumbnail: body.data.url }));
    else alert("Lỗi: " + (body.error || ""));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        content: blocksToString(form.blocks),
        excerpt: form.excerpt,
        thumbnail: form.thumbnail,
        status: form.status,
      };
      const res = await fetch(
        editingId ? `/api/posts/${editingId}` : "/api/posts",
        {
          method: editingId ? "PATCH" : "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const body = await res.json();
      if (!res.ok) throw new Error(body.errors?.[0] || body.error || "Không thể lưu bài viết.");
      setOpen(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Xóa bài viết này?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE", credentials: "include" });
    if (!res.ok) { setError("Không thể xóa bài viết."); return; }
    load();
  };

  return (
    <div>
      <div className="admin-toolbar">
        <h2 className="admin-section-title">Blog của tôi ({posts.length})</h2>
        <button className="btn-primary admin-add" onClick={create}>
          <Plus size={17} /> Viết bài
        </button>
      </div>

      {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

      {/* Editor Modal */}
      {open && (
        <div className="admin-modal-backdrop" onMouseDown={() => setOpen(false)}>
          <form
            className="admin-form admin-modal"
            onSubmit={submit}
            onMouseDown={(e) => e.stopPropagation()}
            style={{ maxWidth: 820 }}
          >
            <div className="admin-form-header">
              <h3>{editingId ? "Chỉnh sửa bài viết" : "Viết bài mới"}</h3>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  className="icon-btn"
                  title={preview ? "Ẩn xem trước" : "Xem trước"}
                  onClick={() => setPreview((v) => !v)}
                >
                  {preview ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                <button type="button" className="icon-btn" onClick={() => setOpen(false)}>
                  <X size={17} />
                </button>
              </div>
            </div>

            {error && <p className="form-error" style={{ marginBottom: 14 }}>{error}</p>}

            <div className="admin-form-grid">
              <label className="admin-form-full">
                Tiêu đề bài viết
                <input required value={form.title} onChange={update("title")} placeholder="Tiêu đề hấp dẫn…" />
              </label>

              <label className="admin-form-full">
                Tóm tắt (excerpt)
                <textarea rows={2} value={form.excerpt} onChange={update("excerpt")} placeholder="Mô tả ngắn hiển thị ở trang danh sách…" />
              </label>

              <label>
                Ảnh bìa (thumbnail)
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                  <label className="image-upload-button" style={{ cursor: "pointer" }}>
                    <Image size={13} /> Tải ảnh bìa
                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => uploadThumbnail(e.target.files?.[0])} />
                  </label>
                  {form.thumbnail && (
                    <img src={form.thumbnail} alt="thumb" style={{ height: 44, borderRadius: 6, objectFit: "cover" }} />
                  )}
                </div>
              </label>

              <label>
                Trạng thái
                <select value={form.status} onChange={update("status")}>
                  <option value="draft">Bản nháp</option>
                  <option value="published">Công khai</option>
                </select>
              </label>
            </div>

            {/* Block Editor */}
            <div style={{ marginTop: 20, borderTop: "1px solid #f1f5f9", paddingTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#475569", marginBottom: 8 }}>
                NỘI DUNG BÀI VIẾT
              </div>
              {!preview ? (
                <BlockEditor blocks={form.blocks} onChange={(blocks) => setForm((v) => ({ ...v, blocks }))} />
              ) : (
                <div style={{ border: "1.5px solid #e2e8f0", borderRadius: 10, padding: 20, background: "#fafafa" }}>
                  <p style={{ color: "#94a3b8", fontSize: 12, marginBottom: 16 }}>Xem trước nội dung:</p>
                  {form.blocks.map((b, idx) => {
                    if (b.type === "heading") return <h2 key={idx} style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 22, margin: "24px 0 12px" }}>{b.content}</h2>;
                    if (b.type === "image") return (
                      <div key={idx} style={{ margin: "16px 0", borderRadius: 10, overflow: "hidden" }}>
                        {b.url && <img src={b.url} alt={b.caption} style={{ width: "100%", objectFit: "cover" }} />}
                        {b.caption && <p style={{ background: "#f8fafc", padding: "8px 14px", fontSize: 13, color: "#64748b", fontStyle: "italic" }}>{b.caption}</p>}
                      </div>
                    );
                    return <p key={idx} style={{ fontSize: 15.5, lineHeight: 1.85, color: "#1e293b", whiteSpace: "pre-line", marginBottom: 16 }}>{b.content}</p>;
                  })}
                </div>
              )}
            </div>

            <button className="btn-primary admin-add" style={{ marginTop: 20 }} disabled={saving}>
              {saving ? "Đang lưu…" : "Lưu bài viết"}
            </button>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Bài viết</th>
              <th>Trạng thái</th>
              <th>Ngày tạo</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {post.thumbnail ? (
                      <img src={post.thumbnail} alt="" style={{ width: 44, height: 32, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
                    ) : (
                      <div className="admin-table-icon"><FileText size={15} /></div>
                    )}
                    <div>
                      <div className="admin-table-name">{post.title}</div>
                      {post.excerpt && <div className="admin-table-sub" style={{ maxWidth: 300 }}>{post.excerpt.slice(0, 60)}…</div>}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-pill ${post.status === "published" ? "status-pill-published" : "status-pill-draft"}`}>
                    {post.status === "published" ? "Công khai" : "Nháp"}
                  </span>
                </td>
                <td style={{ color: "#94a3b8", fontSize: 13 }}>
                  {new Date(post.created_at).toLocaleDateString("vi-VN")}
                </td>
                <td className="admin-actions">
                  <button className="icon-btn" title="Sửa" onClick={() => edit(post)}>
                    <Pencil size={15} />
                  </button>
                  <button className="icon-btn icon-danger" title="Xóa" onClick={() => remove(post.id)}>
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
            {!posts.length && (
              <tr>
                <td colSpan="4" className="admin-table-empty">
                  Chưa có bài viết nào. Bắt đầu viết ngay!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
