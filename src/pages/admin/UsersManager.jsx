import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function UsersManager() {
  const [accounts, setAccounts] = useState([]); const [error, setError] = useState("");
  const load = () => fetch("/api/accounts", { credentials: "include" }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error); setAccounts(body.data); }).catch(() => setError("Không tải được tài khoản."));
  useEffect(() => { load(); }, []);
  const changeRole = async (id, role) => { const response = await fetch(`/api/accounts/${id}`, { method: "PATCH", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ role }) }); if (!response.ok) { const body = await response.json(); setError(body.error || "Không thể cập nhật quyền."); return; } load(); };
  return <div><div className="admin-toolbar"><h2 className="admin-section-title">Tài khoản ({accounts.length})</h2></div><p className="admin-note">Tài khoản người dùng được tạo từ trang đăng ký. Bạn có thể thay đổi quyền tại đây.</p>{error && <p className="form-error">{error}</p>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Tài khoản</th><th>Email</th><th>Quyền</th></tr></thead><tbody>{accounts.map((account) => <tr key={account.id}><td><div className="admin-table-item"><span className="admin-table-icon"><ShieldCheck size={15} /></span><strong>{account.name}</strong></div></td><td>{account.email}</td><td><select className="admin-select" value={account.role} onChange={(event) => changeRole(account.id, event.target.value)}><option value="staff">Người dùng</option><option value="admin">Quản lý</option></select></td></tr>)}</tbody></table></div></div>;
}
