import React, { useState, useEffect } from "react";
import Globe from "./components/Globe";
import ChoroplethMap from "./components/ChoroplethMap";
import BarChart from "./components/Charts/BarChart";
import Filters from "./components/Filters";
import dataset from "./data/dataset.csv";
import { parseCSV } from "./utils/csvUtils";
import { FiGlobe, FiMap, FiBarChart2 } from "react-icons/fi"; 

const statusColors = {
  Vulnerable: "#FFCA28", 
  Endangered: "#FF7043", 
  "Critically Endangered": "#D84315", 
  Dormant: "#42A5F5", 
  Threatened: "#FFB74D", 
  "Severely Endangered": "#8E24AA", 
  "At risk": "#66BB6A", 
  Unknown: "#9E9E9E", 
  Awakening: "#00ACC1", 
};

const Instructions = ({ activeComponent }) => {
  const instructions = {
    globe: [
      "Hover over points to see language details.",
      "Click on a point to view more information.",
      "Scroll down to zoom in and scroll up to zoom out.",
      "Click and move mouse to rotate the globe",
    ],
    map: [
      "Hover over countries to see the number of endangered languages.",
      "Click on the countries to leearn more about the countries languages",
      "The darker the color, the higher the number of endangered languages.",
    ],
    barchart: [
      "Select a region from the dropdown filter.",
      "View the distribution of endangered languages by language families.",
      "Hover over bars to see detailed counts.",
      "Click on a bar to see the list of languages",
    ],
  };

  return (
    <div style={styles.instructionsContainer}>
      <h4 style={styles.instructionsTitle}>Instructions</h4>
      <ul style={styles.instructionsList}>
        {instructions[activeComponent]?.map((instruction, idx) => (
          <li key={idx}>{instruction}</li>
        ))}
      </ul>
    </div>
  );
};

const Legend = ({ statusColors }) => {
  return (
    <div style={styles.legendContainer}>
      <h4 style={styles.legendTitle}>Legend</h4>
      <ul style={styles.legendList}>
        {Object.entries(statusColors).map(([status, color]) => (
          <li key={status} style={{ ...styles.legendItem, color }}>
            <span style={{ ...styles.legendDot, backgroundColor: color }}></span>
            {status}
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [data, setData] = useState([]);
  const [filteredDataGlobe, setFilteredDataGlobe] = useState([]);
  const [filteredDataBarChart, setFilteredDataBarChart] = useState([]);
  const [activeComponent, setActiveComponent] = useState("globe");
  const [headerTitle, setHeaderTitle] = useState("Distribution of Endangered languages around the Globe");
  const [selectedRegionBarChart, setSelectedRegionBarChart] = useState("Africa");

  useEffect(() => {
    parseCSV(dataset)
      .then((parsedData) => {
        setData(parsedData);
        setFilteredDataGlobe(parsedData);
        setFilteredDataBarChart(parsedData.filter((d) => d.region === "Africa"));
      })
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  const handleComponentChange = (component) => {
    if (component === "globe") {
      setHeaderTitle("Distribution of Endangered languages around the Globe");
      setFilteredDataGlobe(data);
    } else if (component === "map") {
      setHeaderTitle("Map of the number of Endangered languages by Country");
    } else if (component === "barchart") {
      setHeaderTitle("Distribution of Endangered languages at diferent levels over Language families (by region)");
    }
    setActiveComponent(component);
  };

  const handleRegionChangeBarChart = (event) => {
    const region = event.target.value;
    setSelectedRegionBarChart(region);
    setFilteredDataBarChart(data.filter((d) => d.region === region));
  };

  const regions = [...new Set(data.map((d) => d.region))];

  return (
    <div style={styles.appContainer}>
      
      <header style={styles.header}>
        <h1 style={styles.title}>{headerTitle}</h1>
        <div style={styles.navBar}>
          <button
            title="Globe"
            style={{
              ...styles.button,
              backgroundColor: activeComponent === "globe" ? "#0056b3" : "#007bff",
            }}
            onClick={() => handleComponentChange("globe")}
          >
            <FiGlobe size={20} color="#fff" />
          </button>
          <button
            title="Map"
            style={{
              ...styles.button,
              backgroundColor: activeComponent === "map" ? "#0056b3" : "#007bff",
            }}
            onClick={() => handleComponentChange("map")}
          >
            <FiMap size={20} color="#fff" />
          </button>
          <button
            title="Bar Graph"
            style={{
              ...styles.button,
              backgroundColor: activeComponent === "barchart" ? "#0056b3" : "#007bff",
            }}
            onClick={() => handleComponentChange("barchart")}
          >
            <FiBarChart2 size={20} color="#fff" />
          </button>
        </div>
      </header>

      
      <Instructions activeComponent={activeComponent} />
      <div style={styles.mainLayout}>
        {activeComponent === "globe" && (
          <div style={styles.contentContainer}>
            <Globe data={filteredDataGlobe} />
            <Legend statusColors={statusColors} />
            <div style={styles.filtersContainer}>
              <Filters data={data} setFilteredData={setFilteredDataGlobe} />
            </div>
          </div>
        )}
        {activeComponent === "map" && (
          <div style={styles.contentContainer}>
            <ChoroplethMap data={data} />
          </div>
        )}
        {activeComponent === "barchart" && (
          <div style={styles.barContentContainer}>
            <div style={styles.filterContainer}>
              <label style={styles.filterLabel}>Region:</label>
              <select
                value={selectedRegionBarChart}
                onChange={handleRegionChangeBarChart}
                style={styles.filterSelect}
              >
                {regions.map((region, idx) => (
                  <option key={idx} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
            <BarChart data={filteredDataBarChart} />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  appContainer: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  header: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(to right, #6A11CB, #6A11CB)",
    color: "white",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    padding: "1rem",
    width: "100%",
  },
  title: {
    margin: 0,
    fontSize: "1.5rem",
    color: "#fff",
  },
  navBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginTop: "1rem",
  },
  button: {
    border: "none",
    color: "#0D47A1",
    fontSize: "1rem",
    fontWeight: "600",
    padding: "0.5rem 1rem",
    borderRadius: "0.25rem",
    cursor: "pointer",
  },
  mainLayout: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    width: "100%",
    height: "100%",
  },
  contentContainer: {
    flex: 1,
    display: "flex",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  barContentContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  filtersContainer: {
    width: "250px",
    backgroundColor: "#f9f9f9",
    borderLeft: "1px solid #ddd",
    overflowY: "auto",
  },
  filterLabel: {
    color: "#fff"
  },
  legendContainer: {
    position: "fixed",
    bottom: "1rem",
    left: "1rem",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  legendTitle: {
    margin: 0,
    marginBottom: "5px",
    fontSize: "0.9rem",
    fontWeight: "bold",
    color: "#333",
  },
  legendList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  legendItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: "5px",
    fontSize: "0.9rem",
    color: "#333",
  },
  legendDot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    marginRight: "8px",
  },

  instructionsContainer: {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "10px 15px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    zIndex: 100,
    maxWidth: "300px",
  },
  instructionsTitle: { 
    marginBottom: "5px", fontSize: "1rem", fontWeight: "bold", color: "#333" 
  },
  instructionsList: { 
    margin: 0, paddingLeft: "1rem", fontSize: "0.9rem", color: "#555" 
  },
};

export default App;
