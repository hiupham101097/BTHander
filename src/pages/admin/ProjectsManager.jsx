import React, { useEffect, useState } from "react";
import {
  FolderKanban,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";

/* =========================================================
 * Default data
 * ======================================================= */

const createConfigItem = () => ({
  key: "",
  value: "",
});

const createGalleryItem = () => ({
  label: "",
  image_url: "",
});

const createRoadmapItem = () => ({
  phase: "",
  title: "",
  desc: "",
  status: "upcoming",
});

const createDefaultForm = () => ({
  name: "",
  description: "",
  detail_tag: "",
  full_description: "",
  languages: "",
  configuration: [createConfigItem()],
  gallery: [],
  roadmap: [],
  price: "0",
  currency: "VND",
});

/* =========================================================
 * Component
 * ======================================================= */

export default function ProjectsManager() {
  /* -------------------------
   * State
   * ----------------------- */

  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(createDefaultForm);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  /* -------------------------
   * API
   * ----------------------- */

  const loadProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const body = await response.json();

      if (!response.ok) {
        throw new Error(body.error);
      }

      setProjects(body.data || []);
    } catch {
      setError("Không tải được danh sách dự án.");
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  /* -------------------------
   * Form helpers
   * ----------------------- */

  const handleFieldChange = (field) => (event) => {
    const { value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleItemChange = (listName, index, field) => (event) => {
    const { value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [listName]: currentForm[listName].map((item, itemIndex) =>
        itemIndex === index
          ? {
            ...item,
            [field]: value,
          }
          : item,
      ),
    }));
  };

  const addItem = (listName, createItem) => {
    setForm((currentForm) => ({
      ...currentForm,
      [listName]: [...currentForm[listName], createItem()],
    }));
  };

  const removeItem = (listName, index) => {
    setForm((currentForm) => ({
      ...currentForm,
      [listName]: currentForm[listName].filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));
  };

  /* -------------------------
   * Form actions
   * ----------------------- */

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
      description: project.description || "",
      detail_tag: project.detail_tag || "",
      full_description: project.full_description || "",
      languages: (project.languages || []).join(", "),
      configuration: Object.entries(project.configuration || {}).map(
        ([key, value]) => ({
          key,
          value: String(value),
        }),
      ),
      gallery: project.gallery || [],
      roadmap: project.roadmap || [],
      price: String(project.price || 0),
      currency: project.currency || "VND",
    });

    setEditingId(project.id);
    setError("");
    setIsFormOpen(true);
  };

  /* -------------------------
   * Image upload
   * ----------------------- */

  const handleImageUpload = (index) => async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = new FormData();
      data.append("file", file);
      
      const response = await fetch("/api/media", { 
        method: "POST", 
        credentials: "include", 
        body: data 
      });
      
      const body = await response.json();
      
      if (response.ok) {
        setForm((currentForm) => ({
          ...currentForm,
          gallery: currentForm.gallery.map((item, itemIndex) =>
            itemIndex === index
              ? {
                ...item,
                image_url: body.data.url,
              }
              : item,
          ),
        }));
      } else {
        alert("Lỗi tải ảnh: " + (body.error || ""));
      }
    } catch (error) {
      alert("Lỗi tải ảnh: " + error.message);
    } finally {
      event.target.value = "";
    }
  };

  /* -------------------------
   * Submit
   * ----------------------- */

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const gallery = form.gallery
      .filter((item) => item.label.trim())
      .map((item) => ({
        label: item.label.trim(),
        image_url: item.image_url.trim(),
      }));

    const roadmap = form.roadmap.filter(
      (item) => item.phase || item.title || item.desc,
    );

    const hasInvalidRoadmap = roadmap.some(
      (item) => !item.phase || !item.title || !item.desc,
    );

    if (hasInvalidRoadmap) {
      setError("Mỗi bước lộ trình cần điền đủ thông tin.");
      return;
    }

    const payload = {
      ...form,
      languages: form.languages
        .split(",")
        .map((language) => language.trim())
        .filter(Boolean),

      configuration: Object.fromEntries(
        form.configuration
          .filter((item) => item.key.trim())
          .map((item) => [item.key.trim(), item.value]),
      ),

      gallery,
      roadmap,
      price: Number(form.price),
      currency: form.currency.trim().toUpperCase(),
    };

    const url = editingId
      ? `/api/projects/${editingId}`
      : "/api/projects";

    const method = editingId ? "PATCH" : "POST";

    setSaving(true);

    try {
      const response = await fetch(url, {
        method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = await response.json();

      if (!response.ok) {
        throw new Error(
          body.error ||
          body.errors?.[0] ||
          "Không thể lưu dự án.",
        );
      }

      closeForm();
      await loadProjects();
    } catch (submitError) {
      setError(submitError.message || "Không thể lưu dự án.");
    } finally {
      setSaving(false);
    }
  };

  /* -------------------------
   * Render
   * ----------------------- */

  return (
    <div>
      <div className="admin-toolbar">
        <h2 className="admin-section-title">
          Quản lý dự án ({projects.length})
        </h2>

        <button
          type="button"
          className="btn-primary admin-add"
          onClick={openCreateForm}
        >
          <Plus size={17} />
          Thêm dự án
        </button>
      </div>

      {error && <p className="form-error">{error}</p>}

      {isFormOpen && (
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-header">
            <h3>
              {editingId ? "Chỉnh sửa dự án" : "Thêm dự án"}
            </h3>

            <button
              type="button"
              className="icon-btn"
              onClick={closeForm}
              aria-label="Đóng biểu mẫu"
            >
              <X size={17} />
            </button>
          </div>

          <div className="admin-form-grid">
            <label>
              Tên dự án
              <input
                required
                value={form.name}
                onChange={handleFieldChange("name")}
              />
            </label>

            <label>
              Ngôn ngữ
              <input
                required
                value={form.languages}
                onChange={handleFieldChange("languages")}
                placeholder="Unity, C#"
              />
            </label>

            <label className="admin-form-full">
              Mô tả ngắn
              <textarea
                value={form.description}
                onChange={handleFieldChange("description")}
                rows={3}
              />
            </label>

            <label className="admin-form-full">
              Dòng giới thiệu
              <input
                value={form.detail_tag}
                onChange={handleFieldChange("detail_tag")}
              />
            </label>

            <label className="admin-form-full">
              Mô tả chi tiết
              <textarea
                value={form.full_description}
                onChange={handleFieldChange("full_description")}
                rows={5}
              />
            </label>

            <label>
              Giá
              <input
                required
                type="number"
                min="0"
                value={form.price}
                onChange={handleFieldChange("price")}
              />
            </label>

            <label>
              Đơn vị tiền
              <input
                required
                value={form.currency}
                onChange={handleFieldChange("currency")}
              />
            </label>
          </div>

          {/* Cấu hình */}
          <section className="admin-repeat">
            <div className="admin-repeat-head">
              <h4>Cấu hình</h4>

              <button
                type="button"
                className="text-action"
                onClick={() =>
                  addItem("configuration", createConfigItem)
                }
              >
                + Thêm
              </button>
            </div>

            {form.configuration.map((item, index) => (
              <div
                className="admin-repeat-row config-row"
                key={index}
              >
                <input
                  value={item.key}
                  onChange={handleItemChange(
                    "configuration",
                    index,
                    "key",
                  )}
                  placeholder="Tên"
                />

                <input
                  value={item.value}
                  onChange={handleItemChange(
                    "configuration",
                    index,
                    "value",
                  )}
                  placeholder="Giá trị"
                />

                <button
                  type="button"
                  className="icon-btn icon-danger"
                  onClick={() =>
                    removeItem("configuration", index)
                  }
                  aria-label="Xóa cấu hình"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </section>

          {/* Hình ảnh */}
          <section className="admin-repeat">
            <div className="admin-repeat-head">
              <h4>Hình ảnh dự án</h4>

              <button
                type="button"
                className="text-action"
                onClick={() =>
                  addItem("gallery", createGalleryItem)
                }
              >
                + Thêm hình ảnh
              </button>
            </div>

            {form.gallery.map((item, index) => (
              <div className="gallery-editor" key={index}>
                <div className="admin-repeat-row gallery-inputs">
                  <input
                    value={item.label}
                    onChange={handleItemChange(
                      "gallery",
                      index,
                      "label",
                    )}
                    placeholder="Chú thích ảnh"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload(index)}
                  />

                  <button
                    type="button"
                    className="icon-btn icon-danger"
                    onClick={() => removeItem("gallery", index)}
                    aria-label="Xóa hình ảnh"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {item.image_url && (
                  <img
                    className="gallery-admin-preview"
                    src={item.image_url}
                    alt={item.label || "Xem trước"}
                  />
                )}
              </div>
            ))}
          </section>

          {/* Lộ trình */}
          <section className="admin-repeat">
            <div className="admin-repeat-head">
              <h4>Lộ trình</h4>

              <button
                type="button"
                className="text-action"
                onClick={() =>
                  addItem("roadmap", createRoadmapItem)
                }
              >
                + Thêm giai đoạn
              </button>
            </div>

            {form.roadmap.map((item, index) => (
              <div className="roadmap-editor" key={index}>
                <div className="admin-repeat-row roadmap-top">
                  <input
                    value={item.phase}
                    onChange={handleItemChange(
                      "roadmap",
                      index,
                      "phase",
                    )}
                    placeholder="Giai đoạn"
                  />

                  <input
                    value={item.title}
                    onChange={handleItemChange(
                      "roadmap",
                      index,
                      "title",
                    )}
                    placeholder="Tiêu đề"
                  />

                  <select
                    value={item.status}
                    onChange={handleItemChange(
                      "roadmap",
                      index,
                      "status",
                    )}
                  >
                    <option value="done">Đã xong</option>
                    <option value="current">Đang làm</option>
                    <option value="upcoming">Sắp tới</option>
                  </select>

                  <button
                    type="button"
                    className="icon-btn icon-danger"
                    onClick={() => removeItem("roadmap", index)}
                    aria-label="Xóa giai đoạn"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <textarea
                  value={item.desc}
                  onChange={handleItemChange(
                    "roadmap",
                    index,
                    "desc",
                  )}
                  placeholder="Mô tả"
                  rows={2}
                />
              </div>
            ))}
          </section>

          <button
            type="submit"
            className="btn-primary admin-add"
            disabled={saving}
          >
            {saving ? "Đang lưu…" : "Lưu dự án"}
          </button>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Dự án</th>
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

                      <div className="admin-table-sub">
                        {project.description}
                      </div>
                    </div>
                  </div>
                </td>

                <td>{(project.languages || []).join(", ")}</td>

                <td>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: project.currency || "VND",
                    maximumFractionDigits: 0,
                  }).format(project.price || 0)}
                </td>

                <td>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={() => openEditForm(project)}
                    aria-label={`Chỉnh sửa ${project.name}`}
                  >
                    <Pencil size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}