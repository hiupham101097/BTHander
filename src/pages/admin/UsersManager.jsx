import React, { useEffect, useState, useMemo } from "react";
import { Search, ShieldCheck, User, UserCog } from "lucide-react";

const ROLES = [
  { value: "admin", label: "Quản trị viên", badge: "role-badge-admin" },
  { value: "staff", label: "Nhân viên", badge: "role-badge-staff" },
  { value: "user", label: "Người dùng", badge: "role-badge-user" },
];

function RoleIcon({ role }) {
  if (role === "admin") return <ShieldCheck size={15} />;
  if (role === "staff") return <UserCog size={15} />;
  return <User size={15} />;
}

export default function UsersManager() {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  useEffect(() => { loadAccounts(); }, []);

  async function loadAccounts() {
    try {
      setError("");
      const response = await fetch("/api/accounts", { credentials: "include" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setAccounts(body.data);
    } catch {
      setError("Không tải được tài khoản.");
    }
  }

  async function changeRole(id, role) {
    try {
      setError("");
      const response = await fetch(`/api/accounts/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const body = await response.json();
      if (!response.ok) { setError(body.error || "Không thể cập nhật quyền."); return; }
      loadAccounts();
    } catch {
      setError("Không thể cập nhật quyền.");
    }
  }

  const filtered = useMemo(() => {
    return accounts.filter((acc) => {
      const matchRole = filterRole === "all" || acc.role === filterRole;
      const q = search.toLowerCase();
      const matchSearch = !q || acc.name?.toLowerCase().includes(q) || acc.email?.toLowerCase().includes(q);
      return matchRole && matchSearch;
    });
  }, [accounts, search, filterRole]);

  return (
    <div>
      <div className="admin-toolbar">
        <h2 className="admin-section-title">
          Tài khoản ({accounts.length})
        </h2>
        <div className="admin-toolbar-right">
          {/* Search */}
          <div className="admin-search">
            <Search size={14} />
            <input
              placeholder="Tìm theo tên, email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {/* Filter by role */}
          <select
            className="admin-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">Tất cả quyền</option>
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      <p className="admin-note">
        Tài khoản được tạo từ trang đăng ký. Thay đổi quyền tại đây sẽ ảnh hưởng đến những gì người dùng có thể truy cập trong hệ thống.
        <br />
        <strong>Nhân viên</strong> có thể viết blog cá nhân và quản lý dự án bản thân.&nbsp;
        <strong>Quản trị viên</strong> có toàn quyền.
      </p>

      {error && <p className="form-error" style={{ marginBottom: 16 }}>{error}</p>}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Tài khoản</th>
              <th>Email</th>
              <th>Ngày tạo</th>
              <th>Quyền</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((account) => {
              const roleInfo = ROLES.find((r) => r.value === account.role) || ROLES[2];
              return (
                <tr key={account.id}>
                  <td>
                    <div className="admin-table-item" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className="admin-table-avatar">
                        {account.name?.slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="admin-table-name">{account.name}</div>
                        <span className={`role-badge ${roleInfo.badge}`}>{roleInfo.label}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "#64748b", fontSize: 13 }}>{account.email}</td>
                  <td style={{ color: "#94a3b8", fontSize: 13 }}>
                    {account.created_at
                      ? new Date(account.created_at).toLocaleDateString("vi-VN")
                      : "—"}
                  </td>
                  <td>
                    <select
                      className="admin-select"
                      value={account.role}
                      onChange={(e) => changeRole(account.id, e.target.value)}
                    >
                      {ROLES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="4" className="admin-table-empty">
                  Không tìm thấy tài khoản nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}