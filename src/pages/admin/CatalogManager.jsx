import React, { useCallback, useEffect, useState } from "react";
import { Gift, Package, Pencil, Plus, ShoppingBag, Trash2, Users, X } from "lucide-react";
import ImageUpload from "../../components/ui/ImageUpload.jsx";

const productBlank = { name: "", description: "", product_type: "trial", price: "0", currency: "VND", specifications: "", status: "published" };
const teamBlank = { name: "", email: "", password: "", title: "", bio: "", avatar_url: "", profile_intro: "", skills: "", experience: "", featured_projects: "", articles: "", sort_order: "0", status: "active" };

function TeamFields({ form, update, editing }) {
  return <>
    <label>Họ và tên<input required value={form.name} onChange={update("name")} /></label>
    {!editing && <><label>Email đăng nhập<input required type="email" value={form.email} onChange={update("email")} /></label><label>Mật khẩu khởi tạo<input required type="text" minLength="10" value={form.password} onChange={update("password")} /></label></>}
    <label>Chức danh<input required value={form.title} onChange={update("title")} /></label>
    <label className="admin-form-full">Giới thiệu ngắn<textarea rows="3" value={form.bio} onChange={update("bio")} /></label>
    <label className="admin-form-full">Giới thiệu profile<textarea rows="5" value={form.profile_intro} onChange={update("profile_intro")} /></label>
    <div className="admin-form-full"><span className="form-label">Ảnh đại diện</span><ImageUpload value={form.avatar_url} onChange={(url) => update("avatar_url")({ target: { value: url } })} label="Tải ảnh đại diện" /></div>
    <label>Kỹ năng, ngôn ngữ<input value={form.skills} onChange={update("skills")} placeholder="React, Node.js, Figma" /></label>
    <label>Thứ tự hiển thị<input required type="number" min="0" value={form.sort_order} onChange={update("sort_order")} /></label>
    <label className="admin-form-full">Kinh nghiệm (mỗi dòng một mục)<textarea rows="4" value={form.experience} onChange={update("experience")} /></label>
    <label className="admin-form-full">Dự án tiêu biểu<textarea rows="3" value={form.featured_projects} onChange={update("featured_projects")} /></label>
    <label className="admin-form-full">Góc chia sẻ<textarea rows="3" value={form.articles} onChange={update("articles")} /></label>
    <label>Trạng thái<select value={form.status} onChange={update("status")}><option value="active">Hiển thị</option><option value="inactive">Ẩn</option></select></label>
  </>;
}

export default function CatalogManager({ kind }) {
  const product = kind === "products";
  const endpoint = product ? "/api/products" : "/api/team";
  const Icon = product ? Package : Users;
  const [items, setItems] = useState([]);
  const [productTab, setProductTab] = useState("trial");
  const [form, setForm] = useState(product ? productBlank : teamBlank);
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => fetch(endpoint, { credentials: "include" }).then((r) => r.json()).then((b) => setItems(b.data || [])), [endpoint]);
  useEffect(() => { load(); }, [load]);
  const update = (field) => (event) => setForm((value) => ({ ...value, [field]: event.target.value }));
  const visibleItems = product ? items.filter((item) => item.product_type === productTab) : items;

  const create = () => {
    setForm(product ? { ...productBlank, product_type: productTab } : teamBlank);
    setEditing(null); setError(""); setOpen(true);
  };

  const edit = (item) => {
    setEditing(item.id);
    setForm(product ? { name: item.name, description: item.description || "", product_type: item.product_type, price: String(item.price), currency: item.currency, specifications: item.specifications.join(", "), status: item.status } : { name: item.name, title: item.title, bio: item.bio || "", avatar_url: item.avatar_url || "", profile_intro: item.profile_intro || "", skills: (item.skills || []).join(", "), experience: (item.experience || []).join("\n"), featured_projects: (item.featured_projects || []).join("\n"), articles: (item.articles || []).join("\n"), sort_order: String(item.sort_order), status: item.status });
    if (product) setProductTab(item.product_type);
    setError(""); setOpen(true);
  };

  const save = async (event) => {
    event.preventDefault();
    const lines = (value) => value.split("\n").map((v) => v.trim()).filter(Boolean);
    const payload = product ? { ...form, price: Number(form.price), currency: form.currency.toUpperCase(), specifications: form.specifications.split(",").map((v) => v.trim()).filter(Boolean) } : { ...form, sort_order: Number(form.sort_order), skills: form.skills.split(",").map((v) => v.trim()).filter(Boolean), experience: lines(form.experience), featured_projects: lines(form.featured_projects), articles: lines(form.articles) };
    setSaving(true);
    try {
      const response = await fetch(editing ? `${endpoint}/${editing}` : endpoint, { method: editing ? "PATCH" : "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || body.errors?.[0]);
      setOpen(false); load();
    } catch (cause) { setError(cause.message || "Không thể lưu."); }
    finally { setSaving(false); }
  };

  const remove = async (id) => {
    if (!window.confirm("Xóa mục này?")) return;
    await fetch(`${endpoint}/${id}`, { method: "DELETE", credentials: "include" });
    load();
  };

  const title = product ? "Sản phẩm" : "Đội ngũ";
  const addLabel = product ? (productTab === "trial" ? "ứng dụng miễn phí" : "sản phẩm bán") : "thành viên";

  return <div>
    <div className="admin-toolbar"><div><h2 className="admin-section-title">{title}</h2>{product && <p className="admin-toolbar-note">Quản lý nội dung hiển thị trên trang chủ theo từng nhóm.</p>}</div><button className="btn-primary admin-add" onClick={create}><Plus size={17} />Thêm {addLabel}</button></div>
    {product && <div className="catalog-tabs"><button className={productTab === "trial" ? "active" : ""} onClick={() => setProductTab("trial")}><Gift size={17} /><span>Ứng dụng miễn phí<small>{items.filter((item) => item.product_type === "trial").length} mục</small></span></button><button className={productTab === "sale" ? "active" : ""} onClick={() => setProductTab("sale")}><ShoppingBag size={17} /><span>Sản phẩm bán<small>{items.filter((item) => item.product_type === "sale").length} mục</small></span></button></div>}
    {error && !open && <p className="form-error">{error}</p>}
    {open && <div className="admin-modal-backdrop" onMouseDown={() => setOpen(false)}><form className="admin-form admin-modal" onSubmit={save} onMouseDown={(e) => e.stopPropagation()}><div className="admin-form-header"><h3>{editing ? "Chỉnh sửa" : "Thêm mới"} {addLabel}</h3><button className="icon-btn" type="button" onClick={() => setOpen(false)}><X size={17} /></button></div>{error && <p className="form-error">{error}</p>}<div className="admin-form-grid">{product ? <><label>Tên ứng dụng/sản phẩm<input required value={form.name} onChange={update("name")} /></label><label>Nhóm hiển thị<select value={form.product_type} onChange={update("product_type")}><option value="trial">Ứng dụng miễn phí</option><option value="sale">Sản phẩm bán</option></select></label><label className="admin-form-full">Mô tả<textarea rows="3" value={form.description} onChange={update("description")} /></label><label>Đặc điểm (phân cách bằng dấu phẩy)<input value={form.specifications} onChange={update("specifications")} /></label><label>Giá<input required type="number" min="0" value={form.price} onChange={update("price")} disabled={form.product_type === "trial"} /></label><label>Trạng thái<select value={form.status} onChange={update("status")}><option value="published">Xuất bản</option><option value="draft">Bản nháp</option></select></label></> : <TeamFields form={form} update={update} editing={editing} />}</div><button className="btn-primary admin-add" disabled={saving}>{saving ? "Đang lưu…" : "Lưu và hiển thị"}</button></form></div>}
    <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>{product ? (productTab === "trial" ? "Ứng dụng miễn phí" : "Sản phẩm bán") : "Thành viên"}</th><th>{product ? "Trạng thái" : "Chức danh"}</th><th></th></tr></thead><tbody>{visibleItems.map((item) => <tr key={item.id}><td><div className="admin-table-item"><span className="admin-table-icon"><Icon size={15} /></span><div><strong>{item.name}</strong><div className="admin-table-sub">{product ? item.description : item.bio}</div></div></div></td><td>{product ? (item.status === "published" ? "Đang hiển thị" : "Bản nháp") : item.title}</td><td><button className="icon-btn" onClick={() => edit(item)}><Pencil size={15} /></button><button className="icon-btn icon-danger" onClick={() => remove(item.id)}><Trash2 size={15} /></button></td></tr>)}</tbody></table>{visibleItems.length === 0 && <div className="catalog-empty">Chưa có mục nào trong tab này.</div>}</div>
  </div>;
}
