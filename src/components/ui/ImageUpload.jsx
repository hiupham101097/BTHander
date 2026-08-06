import React, { useState } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";

export default function ImageUpload({ value, onChange, label = "Tải ảnh lên" }) {
  const [uploading, setUploading] = useState(false); const [error, setError] = useState("");
  const upload = async (event) => { const file = event.target.files?.[0]; if (!file) return; setUploading(true); setError(""); try { const data = new FormData(); data.append("file", file); const response = await fetch("/api/media", { method: "POST", credentials: "include", body: data }); const body = await response.json(); if (!response.ok) throw new Error(body.error || "Không thể tải ảnh."); onChange(body.data.url); } catch (requestError) { setError(requestError.message); } finally { setUploading(false); event.target.value = ""; } };
  return <div className="image-upload"><label className="image-upload-button"><input type="file" accept="image/*" onChange={upload} disabled={uploading} />{uploading ? <LoaderCircle size={16} className="spin" /> : <ImagePlus size={16} />}{uploading ? "Đang tải ảnh…" : label}</label>{value && <img src={value} alt="Xem trước" />}{error && <small className="form-error">{error}</small>}</div>;
}
