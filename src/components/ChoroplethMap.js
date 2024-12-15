import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import GeojsonFile from "../data/countries.geojson";
import dataset from "../data/dataset.csv";
import { parseCSV } from "../utils/csvUtils";
import LanguageDetailsModal from "./LanguageDetailsModal";

const ChoroplethMap = () => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryData, setCountryData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    parseCSV(dataset)
      .then((csvData) => {       
        const uniqueData = Array.from(
          new Map(csvData.map((item) => [item.name, item])).values()
        );     
        const aggregatedData = uniqueData.reduce((acc, row) => {
          const country = row.country?.trim();
          if (country) {
            if (!acc[country]) {
              acc[country] = { numEndangeredLanguages: 0 };
            }
            acc[country].numEndangeredLanguages += 1;
          }
          return acc;
        }, {});

        const width = window.innerWidth;
        const height = window.innerHeight;
        
        d3.select("#choropleth-map svg").remove();

        const svg = d3
          .select("#choropleth-map")
          .append("svg")
          .attr("width", "100%")
          .attr("height", "100%")
          .attr("viewBox", `0 0 ${width} ${height}`)
          .attr("preserveAspectRatio", "xMidYMid meet");

        const colorScale = d3
          .scaleSequential(d3.interpolateReds)
          .domain([
            0,
            d3.max(Object.values(aggregatedData), (d) => d.numEndangeredLanguages) || 1,
          ]);

        d3.json(GeojsonFile).then((geojson) => {
          const countries = geojson.features.filter(
            (feature) => feature.properties.name.trim() !== "Antarctica"
          );

          countries.forEach((feature) => {
            const countryName = feature.properties.name.trim();
            const countryData = aggregatedData[countryName];
            feature.properties.numEndangeredLanguages = countryData
              ? countryData.numEndangeredLanguages
              : 0;
          });

          const projection = d3
            .geoMercator()
            .scale(width / 7.5) 
            .translate([width / 2, height / 1.5]);

          const path = d3.geoPath(projection);

          svg
            .selectAll(".country")
            .data(countries)
            .join("path")
            .attr("class", "country")
            .attr("d", path)
            .attr("fill", (d) =>
              colorScale(d.properties.numEndangeredLanguages || 0)
            )
            .attr("stroke", "#ccc")
            .on("mouseover", (event, d) => {
              const tooltip = d3.select("#tooltip");
              tooltip
                .style("opacity", 1)
                .html(
                  `<strong>${d.properties.name}</strong><br/>Endangered Languages: ${d.properties.numEndangeredLanguages}`
                )
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY + 10}px`);
            })
            .on("mouseout", () => {
              d3.select("#tooltip").style("opacity", 0);
            })
            .on("click", (event, d) => {
              setSelectedCountry(d.properties.name);
              const filteredData = Array.from(
                new Map(
                  csvData
                    .filter((row) => row.country?.trim() === d.properties.name)
                    .map((item) => [item.name, item])
                ).values()
              );
              setCountryData(filteredData);
              setShowModal(true);
            });
        });
      })
      .catch((error) => console.error("Error loading CSV data:", error));
  }, []);

  return (
    <div
      id="choropleth-map"
      style={{
        position: "relative",
        width: "90vw",
        height: "90vh",
        overflow: "hidden",
      }}
    >
      <div
        id="tooltip"
        style={{
          position: "absolute",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          padding: "5px",
          borderRadius: "5px",
          opacity: 0,
          pointerEvents: "none",
          transform: "translate(-50%, -100%)",
        }}
      ></div>
      {showModal && (
        <LanguageDetailsModal
          country={selectedCountry}
          data={countryData}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ChoroplethMap;
