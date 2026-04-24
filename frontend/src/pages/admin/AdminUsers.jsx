import React, { useState, useEffect, useMemo } from "react";
import adminService from "../../services/adminService";
import AdminUserTable from "../../components/AdminUserTable";
import Loader from "../../components/Loader";
import "../../styles/admin.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data.users);
      } catch {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filtered = useMemo(() => {
    let result = users;

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query),
      );
    }

    return result;
  }, [search, roleFilter, users]);

  if (loading) return <Loader message="Loading users..." />;

  const studentCount = users.filter((user) => user.role === "student").length;
  const adminCount = users.filter((user) => user.role === "admin").length;

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ color: "#1e3a5f", margin: "0 0 0.2rem" }}>
          User Management
        </h1>
        <p style={{ color: "#6b7280", margin: 0, fontSize: "0.88rem" }}>
          {studentCount} students | {adminCount} admins | {users.length} total
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ marginBottom: "1rem" }}>
          {error}
        </div>
      )}

      <div className="card" style={{ marginBottom: "1rem" }}>
        <div
          style={{
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            className="admin-search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: "220px" }}
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              padding: "0.6rem 0.8rem",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "0.9rem",
              color: "#374151",
            }}
          >
            <option value="all">All Roles</option>
            <option value="student">Students Only</option>
            <option value="admin">Admins Only</option>
          </select>
          {(search || roleFilter !== "all") && (
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
              }}
              style={{
                fontSize: "0.85rem",
                padding: "0.5rem 0.9rem",
                whiteSpace: "nowrap",
              }}
            >
              Clear Filters
            </button>
          )}
          <span
            style={{
              color: "#9ca3af",
              fontSize: "0.82rem",
              whiteSpace: "nowrap",
            }}
          >
            Showing {filtered.length} of {users.length}
          </span>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <AdminUserTable users={filtered} />
      </div>
    </div>
  );
}

export default AdminUsers;
