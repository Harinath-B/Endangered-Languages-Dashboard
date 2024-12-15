import Papa from "papaparse";

export const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    Papa.parse(filePath, {
      header: true,
      download: true,
      dynamicTyping: true,
      complete: (results) => {
        console.log("csv", results)
        const cleanedData = results.data.map((row) => {
          let info = "";
        
          if (row["Additional Information"] && row["Additional Information"] !== "None") {
            info += row["Additional Information"] + "\n";
          }
        
          if (row["Notes"] && row["Notes"] !== "None") {
            info += row["Notes"];
          }

          if (info == "") {info = "-";}
        
          return {
            id: row.ID,
            code: row.Code,
            name: row["Language Name"],
            alternateNames: row["Alternate Names"],
            endangermentStatus: row["Endangerment Status"],
            estimatedSpeakers: row["Estimated Speakers"],
            languageFamily: row["Language Family"],
            region: row.Region,
            country: row.Country,
            variants: row["Dialects/Variants"],
            info: info.trim(),
            latitude: parseFloat(row.Latitude),
            longitude: parseFloat(row.Longitude),
          };
        });
        
        resolve(cleanedData);
      },
      error: (error) => reject(error),
    });
  });
};
