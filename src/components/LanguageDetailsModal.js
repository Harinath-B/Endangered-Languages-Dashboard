import React, { useEffect, useState } from "react";

const LanguageDetailsModal = ({ country, data, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => { 
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    setIsVisible(true);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      style={{
        ...styles.overlay,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
      onClick={onClose}
    >
      <div
        style={{
          ...styles.modal,
          transform: isVisible ? "translateY(0)" : "translateY(-20px)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button style={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2 style={styles.header}>Endangered Languages in {country}</h2>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Language Name</th>
              <th style={styles.th}>Endangerment Status</th>
              <th style={styles.th}>Estimated Speakers</th>
              <th style={styles.th}>Language Family</th>
              <th style={styles.th}>Alternate Names</th>
              <th style={styles.th}>Other Information</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                <td style={styles.td}>{row.name}</td>
                <td style={styles.td}>{row.endangermentStatus}</td>
                <td style={styles.td}>{row.estimatedSpeakers}</td>
                <td style={styles.td}>{row.languageFamily}</td>
                <td style={styles.td}>{row.alternateNames}</td>
                <td style={styles.td}>{row.info}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    transition: "opacity 0.3s ease",
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    width: "80%",
    maxHeight: "90%",
    overflowY: "auto",
    position: "relative",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transform: "translateY(-20px)", 
    transition: "transform 0.3s ease, opacity 0.3s ease",
  },
  closeButton: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
  },
  header: {
    marginBottom: "20px",
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#f4f4f4",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
};

export default LanguageDetailsModal;
