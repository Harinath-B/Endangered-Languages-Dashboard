# **Endangered Languages Dashboard**

This project visualizes endangered languages worldwide using multiple interactive components:
- A 3D Globe with language locations
- A Choropleth Map displaying aggregated endangered languages per country
- A Bar Chart grouped by regions

Check out this project at [Endangered-Languages-dashboard](https://endangered-languages-dashboard.vercel.app/)

## **Features**
1. **3D Globe**  
   Displays languages with colored markers based on their endangerment status.
2. **Choropleth Map**  
   A map view with aggregated data per country.
3. **Bar Chart**  
   Compares endangered languages across families.
5. **Filters**  
   Allows filtering by:
   - Endangerment Status
   - Region
   - Language Family

---

## **Technologies Used**
- **React** (Frontend)
- **Three.js** for 3D Globe
- **D3.js** for visualizations (Map, Bar Chart)
- **CSV Parsing**: done with `papaparse` 
- **GeoJSON** for map data

---

## **Prerequisites**
- Node.js (v14+)
- npm or yarn installed

---

## **Setup Instructions**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Harinath-B/endangered-languages-dashboard.git
   cd endangered-languages-dashboard
   ```

2. **Install Dependencies**
   Run the following command to install all required dependencies:
   ```bash
   npm install
   ```
   OR, if using yarn:
   ```bash
   yarn install
   ```

3. **Run the Development Server**
   Start the development server with:
   ```bash
   npm start
   ```
   OR, for yarn:
   ```bash
   yarn start
   ```
   This will open the project at `http://localhost:3000` in your browser.

---

## **Key Files**
- **`App.js`**: Main entry point managing navigation and state.
- **`Globe.js`**: Displays a 3D rotating globe with data points.
- **`ChoroplethMap.js`**: Renders the choropleth map with tooltips.
- **`BarChart.js`**: Interactive bar chart with region filters.
- **`Filters.js`**: Sidebar filters for data manipulation.

---

## **Running Production Build**
1. Create a production build:
   ```bash
   npm run build
   ```
   OR, for yarn:
   ```bash
   yarn build
   ```

2. Serve the build locally:
   ```bash
   serve -s build
   ```
   Open `http://localhost:3000` to view the optimized build.

---
