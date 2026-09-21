import React, { useState } from "react";
import { ImagePlus, LoaderCircle, X } from "lucide-react";

export default function ImageUpload({ value, onChange, label = "Tải ảnh lên" }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const upload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const data = new FormData();
      data.append("file", file);
      const response = await fetch("/api/media", { method: "POST", credentials: "include", body: data });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Không thể tải ảnh.");
      onChange(body.data.url);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="image-upload">
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <label className="image-upload-button" style={{ margin: 0 }}>
          <input type="file" accept="image/*" onChange={upload} disabled={uploading} />
          {uploading ? <LoaderCircle size={16} className="spin" /> : <ImagePlus size={16} />}
          {uploading ? "Đang tải ảnh…" : (value ? "Đổi ảnh khác" : label)}
        </label>
        {value && (
          <button
            type="button"
            className="icon-btn icon-danger"
            onClick={() => onChange("")}
            title="Xóa ảnh"
            style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "7px 10px", fontSize: 13, border: "1px solid #fca5a5", borderRadius: 4, background: "#fef2f2", color: "#dc2626", cursor: "pointer" }}
          >
            <X size={14} /> Xóa ảnh
          </button>
        )}
      </div>
      {value && <img className="image-upload-preview" src={value} alt="Xem trước" style={{ marginTop: 6 }} />}
      {error && <small className="form-error">{error}</small>}
    </div>
  );
}
