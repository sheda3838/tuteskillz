// src/components/AdminTable.jsx
import React from "react";
import "../styles/Admin/admin.css";

const AdminTable = ({ title, columns, data, onActionClick }) => {
  return (
    <div className="admin-table-container">
      <div className="admin-table-header">
        <h2 className="admin-table-title">{title}</h2>
        <div className="table-filters">
          <input
            type="text"
            placeholder={`Search ${title} Here`}
            className="table-search"
          />
        </div>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data && data.length > 0 ? (
            data.map((row, index) => (
              <tr key={index}>
                {columns.map((col) => {
                  if (col.key === "profilePic") {
                    return (
                      <td key={col.key}>
                        <img
                          src={row[col.key]}
                          alt="Profile"
                          className="profile-pic"
                        />
                      </td>
                    );
                  } else if (col.key === "status") {
                    const status = row[col.key]?.toLowerCase();
                    return (
                      <td key={col.key}>
                        <span className={`session-status ${status}`}>
                          {row[col.key]}
                        </span>
                      </td>
                    );
                  } else if (col.key === "actions") {
                    return (
                      <td key={col.key}>
                        <button
                          className="view-btn"
                          onClick={() => onActionClick?.(row)}
                        >
                          View
                        </button>
                      </td>
                    );
                  } else if (col.key === "date" || col.key === "uploadedDate") {
                    const formatted = new Date(row[col.key]).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    );
                    return <td key={col.key}>{formatted}</td>;
                  } else {
                    return <td key={col.key}>{row[col.key] || "-"}</td>;
                  }
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="no-data">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
