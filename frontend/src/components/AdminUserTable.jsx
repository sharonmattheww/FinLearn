import React from "react";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function AdminUserTable({ users }) {
  if (users.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2.5rem", color: "#9ca3af" }}>
        <p>No users found matching your search.</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Lessons Done</th>
            <th>Certificates</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
                {index + 1}
              </td>
              <td>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                  }}
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor:
                        user.role === "admin" ? "#fef3c7" : "#eff6ff",
                      color: user.role === "admin" ? "#92400e" : "#1e40af",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "0.85rem",
                      flexShrink: 0,
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: "600", color: "#1e3a5f" }}>
                    {user.name}
                  </span>
                </div>
              </td>
              <td style={{ color: "#6b7280", fontSize: "0.85rem" }}>
                {user.email}
              </td>
              <td>
                <span
                  style={{
                    fontSize: "0.78rem",
                    fontWeight: "700",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "20px",
                    backgroundColor:
                      user.role === "admin" ? "#fef3c7" : "#f0fdf4",
                    color: user.role === "admin" ? "#92400e" : "#166534",
                  }}
                >
                  {user.role === "admin" ? "Admin" : "Student"}
                </span>
              </td>
              <td>
                <span
                  style={{
                    fontWeight: "700",
                    color:
                      parseInt(user.lessons_completed, 10) > 0
                        ? "#2563eb"
                        : "#9ca3af",
                  }}
                >
                  {user.lessons_completed}
                </span>
              </td>
              <td>
                <span
                  style={{
                    fontWeight: "700",
                    color:
                      parseInt(user.certificates_earned, 10) > 0
                        ? "#16a34a"
                        : "#9ca3af",
                  }}
                >
                  {parseInt(user.certificates_earned, 10) > 0
                    ? `Certificate: ${user.certificates_earned}`
                    : "-"}
                </span>
              </td>
              <td
                style={{
                  color: "#6b7280",
                  fontSize: "0.82rem",
                  whiteSpace: "nowrap",
                }}
              >
                {formatDate(user.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUserTable;
