import React, { useState } from "react";

const Filters = ({ data, setFilteredData }) => {
  const [status, setStatus] = useState("");
  const [region, setRegion] = useState("");
  const [family, setFamily] = useState("");
  const statuses = Array.from(new Set(data.map((d) => d.endangermentStatus)));
  const regions = Array.from(new Set(data.map((d) => d.region)));
  const families = Array.from(new Set(data.map((d) => d.languageFamily)));

  const handleFilter = () => {
    let filtered = data;
    if (status) {
      filtered = filtered.filter((d) => d.endangermentStatus === status);
    }
    if (region) {
      filtered = filtered.filter((d) => d.region === region);
    }
    if (family) {
      filtered = filtered.filter((d) => d.languageFamily === family);
    }
    setFilteredData(filtered);
  };

  return (
    <div style={styles.sidebarContainer}>
      <h3 style={styles.heading}>Filters</h3>
      <div style={styles.filterGroup}>
        <label style={styles.label}>
          Status:
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={styles.select}
          >
            <option value="">All</option>
            {statuses.map((s, idx) => (
              <option key={idx} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Region:
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            style={styles.select}
          >
            <option value="">All</option>
            {regions.map((r, idx) => (
              <option key={idx} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        <label style={styles.label}>
          Family:
          <select
            value={family}
            onChange={(e) => setFamily(e.target.value)}
            style={styles.select}
          >
            <option value="">All</option>
            {families.map((f, idx) => (
              <option key={idx} value={f}>
                {f}
              </option>
            ))}
          </select>
        </label>

        <button onClick={handleFilter} style={styles.button}>
          Apply
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebarContainer: {
    width: "250px",
    height: "calc(100vh - 50px)", 
    position: "fixed",
    right: 0,
    top: "60px", 
    backgroundColor: "#f9f9f9",
    borderLeft: "1px solid #ddd",
    boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.1)",
    overflowY: "auto",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch", 
    justifyContent: "flex-start", 
    boxSizing: "border-box", 
    marginTop: "2.4rem",
    background: "#1F1B24",
  },
  heading: {
    fontSize: "16px",
    marginBottom: "10px",
    color: "#fff",
    textAlign: "center", 
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "100%",
  },
  label: {
    display: "flex",
    flexDirection: "column",
    fontSize: "14px",
    color: "#fff",
  },
  select: {
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box", 
  },
  button: {
    padding: "8px 16px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
    fontSize: "14px",
    alignSelf: "center", 
  },
};

export default Filters;
