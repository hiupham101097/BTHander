import React, { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";

export default function UsersManager() {
  const [accounts, setAccounts] = useState([]); const [error, setError] = useState("");
  const load = () => fetch("/api/accounts", { credentials: "include" }).then(async (response) => { const body = await response.json(); if (!response.ok) throw new Error(body.error); setAccounts(body.data); }).catch(() => setError("Không tải được tài khoản."));
  useEffect(() => { load(); }, []);
  const changeRole = async (id, role) => { const response = await fetch(`/api/accounts/${id}`, { method: "PATCH", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ role }) }); if (!response.ok) { const body = await response.json(); setError(body.error || "Không thể cập nhật quyền."); return; } load(); };

  const admins = accounts.filter(a => a.role === 'admin');
  const staffs = accounts.filter(a => a.role === 'staff');
  const users = accounts.filter(a => a.role === 'user');

  const renderTable = (list, title) => (
    <div className="admin-table-wrap" style={{ marginBottom: '24px' }}>
      <h3 style={{ padding: '16px', margin: 0, borderBottom: '1px solid var(--border)', fontSize: '15px' }}>{title} ({list.length})</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>Tài khoản</th>
            <th>Email</th>
            <th>Quyền</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr><td colSpan="3" style={{ textAlign: 'center', padding: '24px' }}>Không có tài khoản nào</td></tr>
          ) : list.map((account) => (
            <tr key={account.id}>
              <td>
                <div className="admin-table-item">
                  <span className="admin-table-icon"><ShieldCheck size={15} /></span>
                  <strong>{account.name}</strong>
                </div>
              </td>
              <td>{account.email}</td>
              <td>
                <select className="admin-select" value={account.role} onChange={(event) => changeRole(account.id, event.target.value)}>
                  <option value="user">Người dùng</option>
                  <option value="staff">Nhân viên</option>
                  <option value="admin">Quản lý</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div>
      <div className="admin-toolbar">
        <h2 className="admin-section-title">Quản lý phân quyền</h2>
      </div>
      <p className="admin-note">Phân nhóm tài khoản theo 3 vai trò: Quản lý (Admin), Nhân viên (Staff), và Người dùng (User).</p>
      {error && <p className="form-error">{error}</p>}
      
      {renderTable(admins, "Quản lý (Admin)")}
      {renderTable(staffs, "Nhân viên (Staff)")}
      {renderTable(users, "Người dùng (User)")}
    </div>
  );
}
