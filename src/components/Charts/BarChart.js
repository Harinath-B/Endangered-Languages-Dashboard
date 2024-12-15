import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const BarChart = ({ data }) => {
  const chartRef = useRef(null);
  const legendRef = useRef(null);

  const [modalData, setModalData] = useState(null);
  const [showModal, setShowModal] = useState(false);

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

  useEffect(() => {
    if (!data || data.length === 0) return;
    const uniqueData = data.reduce((acc, lang) => {
      if (!acc.has(lang.name)) {
        acc.set(lang.name, lang); 
      }
      return acc;
    }, new Map());

    const uniqueLanguages = Array.from(uniqueData.values());
    const groupedData = d3.group(uniqueLanguages, (d) => d.languageFamily);
    const formattedData = Array.from(groupedData, ([key, values]) => {
      const endangermentCounts = d3.rollup(
        values,
        (v) => v.length,
        (d) => d.endangermentStatus
      );
      return {
        family: key,
        languages: values,
        ...Object.fromEntries(endangermentCounts),
      };
    });

    const endangermentStatuses = Object.keys(statusColors);
    
    d3.select(chartRef.current).selectAll("*").remove();
    d3.select(legendRef.current).selectAll("*").remove();

    const margin = { top: 40, right: 20, bottom: 180, left: 60 };
    const width = chartRef.current.offsetWidth - margin.left - margin.right;
    const height = chartRef.current.offsetHeight - margin.top - margin.bottom;

    const svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
    
    const xScale = d3
      .scaleBand()
      .domain(formattedData.map((d) => d.family))
      .range([0, width])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(formattedData, (d) =>
          d3.sum(endangermentStatuses.map((key) => d[key] || 0))
        ),
      ])
      .range([height, 0]);

    const stackGenerator = d3.stack().keys(endangermentStatuses);
    const stackedData = stackGenerator(formattedData);
    
    const tooltip = d3
      .select(chartRef.current)
      .append("div")
      .style("position", "absolute")
      .style("background", "rgba(0, 0, 0, 0.7)")
      .style("color", "#fff")
      .style("padding", "5px 10px")
      .style("border-radius", "5px")
      .style("opacity", 0)
      .style("pointer-events", "none");
    
    svg
      .selectAll("g")
      .data(stackedData)
      .join("g")
      .attr("fill", (d) => statusColors[d.key] || "#A9A9A9")
      .selectAll("rect")
      .data((d) => d)
      .join("rect")
      .attr("x", (d) => xScale(d.data.family))
      .attr("y", (d) => yScale(d[1]))
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>${d.data.family}</strong><br/>Endangerment Status: ${d3.select(
              event.target.parentNode
            ).datum().key}<br/>Languages: ${d[1] - d[0]}`
          )
          .style("left", `${event.pageX}px`)
          .style("top", `${event.pageY}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      })
      .on("click", (event, d) => {
        const clickedStatus = d3.select(event.target.parentNode).datum().key;

        const languages = d.data.languages.filter(
          (lang) => lang.endangermentStatus === clickedStatus
        );
        setModalData({
          family: d.data.family,
          status: clickedStatus,
          languages: Array.from(new Set(languages.map((lang) => lang.name))).map(
            (name) => ({ name })
          ),
        });
        setShowModal(true);
      });
    
    svg
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("fill", "#ffffff");

    svg
      .append("g")
      .call(d3.axisLeft(yScale))
      .selectAll("text")
      .style("fill", "#ffffff");

    const legend = d3
      .select(legendRef.current)
      .append("svg")
      .attr("width", 180)
      .attr("height", endangermentStatuses.length * 20);

    const legendGroup = legend
      .selectAll("g")
      .data(endangermentStatuses)
      .join("g")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`);

    legendGroup
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d) => statusColors[d]);

    legendGroup
      .append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", "0.35em")
      .text((d) => d);
  }, [data]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);  

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div ref={chartRef} style={{ width: "100%", height: "100%" }}></div>
      <div
        ref={legendRef}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          backgroundColor: "white",
          border: "1px solid #ccc",
          borderRadius: "5px",
          padding: "10px",
          boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
        }}
      ></div>

      {showModal && modalData && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h2>
              {modalData.family} - {modalData.status}
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {modalData.languages.map((lang, idx) => (
                <li key={idx}>{lang.name}</li>
              ))}
            </ul>
            <button style={styles.closeButton} onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
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
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    maxWidth: "400px",
    textAlign: "center",
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

export default BarChart;
