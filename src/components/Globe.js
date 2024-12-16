import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";

const earthTexture = new THREE.TextureLoader().load("/textures/earth.jpg");


const statusColors = {
  Vulnerable: "#FFD700",
  Endangered: "#FF4500",
  "Critically Endangered": "#B22222",
  Dormant: "#4682B4",
  Threatened: "#FFA500",
  "Severely Endangered": "#800080",
  "At risk": "#32CD32",
  Unknown: "#A9A9A9",
  Awakening: "#00CED1",
};

const Globe = ({ data }) => {
  const [hoveredLanguage, setHoveredLanguage] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        setSelectedLanguage(null);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const convertToCartesian = (latitude, longitude, radius = 3) => {
    const lat = (latitude * Math.PI) / 180;
    const lon = (longitude * Math.PI) / 180;

    const x = radius * Math.cos(lat) * Math.cos(-lon);
    const y = radius * Math.sin(lat);
    const z = radius * Math.cos(lat) * Math.sin(-lon);

    return [x, y, z];
  };

  return (
    <>
      <Canvas
        style={{ width: "100vw", height: "100vh" }}
        camera={{ position: [0, 0, 6], fov: 45 }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />

        <mesh>
          <sphereGeometry args={[3, 64, 64]} />
          <meshStandardMaterial map={earthTexture}/>
        </mesh>

        {data.map((language, idx) => {
          const { latitude, longitude, endangermentStatus, name, estimatedSpeakers, country, info, variants, languageFamily } =
            language;
          const color = statusColors[endangermentStatus] || "gray";
          const position = convertToCartesian(latitude, longitude);

          return (
            <mesh
              key={idx}
              position={position}
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredLanguage({
                  name,
                  estimatedSpeakers,
                  endangermentStatus,
                  country,
                  position,
                });
              }}
              onPointerOut={() => setHoveredLanguage(null)}
              onClick={() =>
                setSelectedLanguage({
                  name,
                  estimatedSpeakers,
                  endangermentStatus,
                  country,
                  info, variants, languageFamily
                })
              }
            >
              <sphereGeometry args={[0.015, 16, 16]} />
              <meshStandardMaterial color={color} />
            </mesh>
          );
        })}

        {hoveredLanguage && (
          <Html position={hoveredLanguage.position} distanceFactor={4}>
            <div
              style={{
                background: "rgba(0, 0, 0, 0.7)",
                color: "white",
                padding: "5px 10px",
                borderRadius: "5px",
                whiteSpace: "nowrap",
              }}
            >
              <strong>{hoveredLanguage.name}</strong>
              <br />
              Country: {hoveredLanguage.country}
              <br />
              Speakers: {hoveredLanguage.estimatedSpeakers}
              <br />
              Status: {hoveredLanguage.endangermentStatus}
            </div>
          </Html>
        )}

        <OrbitControls enableZoom={true} minDistance={4} maxDistance={10} target={[0, 0, 0]} />
      </Canvas>

      {selectedLanguage && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2 style={{ marginBottom: "1rem" }}>{selectedLanguage.name}</h2>
            <p>
              <strong>Country:</strong> {selectedLanguage.country}
            </p>
            <p>
              <strong>Speakers:</strong> {selectedLanguage.estimatedSpeakers}
            </p>
            <p>
              <strong>Status:</strong> {selectedLanguage.endangermentStatus}
            </p>
            <p>
              <strong>Family:</strong> {selectedLanguage.languageFamily}
            </p>
            <p>
              <strong>Variants:</strong> {selectedLanguage.variants}
            </p>
            <p>
              <strong>Additional info:</strong> {selectedLanguage.info}
            </p>
            <button style={styles.closeButton} onClick={() => setSelectedLanguage(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  modalOverlay: {
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
    animation: "fadeIn 0.3s ease",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    animation: "slideIn 0.3s ease",
  },
  closeButton: {
    marginTop: "1rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#FF4500",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Globe;
