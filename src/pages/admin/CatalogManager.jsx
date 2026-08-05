import React, { useEffect, useState } from "react";
import { Package, Users } from "lucide-react";

export default function CatalogManager({ kind }) {
  const [items, setItems] = useState([]); const [error, setError] = useState("");
  const config = kind === "products" ? { endpoint: "/api/products", title: "Sản phẩm", icon: Package, rows: (item) => [item.name, item.product_type === "sale" ? "Bán" : "Trải nghiệm", item.status, new Intl.NumberFormat("vi-VN", { style: "currency", currency: item.currency || "VND", maximumFractionDigits: 0 }).format(item.price)] } : { endpoint: "/api/team", title: "Đội ngũ", icon: Users, rows: (item) => [item.name, item.title, item.status] };
  useEffect(() => { fetch(config.endpoint, { credentials: "include" }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error); setItems(body.data); }).catch(() => setError("Không tải được dữ liệu.")); }, [config.endpoint]);
  const Icon = config.icon;
  return <div><div className="admin-toolbar"><h2 className="admin-section-title">{config.title} ({items.length})</h2></div><p className="admin-note">API D1 đã sẵn sàng: GET, POST, PATCH và DELETE tại <code>{config.endpoint}</code>.</p>{error ? <p className="form-error">{error}</p> : <div className="admin-table-wrap"><table className="admin-table"><thead><tr>{(kind === "products" ? ["Sản phẩm", "Loại", "Trạng thái", "Giá"] : ["Thành viên", "Vai trò", "Trạng thái"]).map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{items.map((item) => <tr key={item.id}>{config.rows(item).map((value, index) => <td key={index}>{index === 0 ? <div className="admin-table-item"><span className="admin-table-icon"><Icon size={15} /></span><strong>{value}</strong></div> : value}</td>)}</tr>)}{!items.length && <tr><td colSpan="4" className="admin-table-empty">Chưa có dữ liệu.</td></tr>}</tbody></table></div>}</div>;
}
