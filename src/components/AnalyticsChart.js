import { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import React from "react";
import data from "../constants/data.json";

const AnalyticsChart = () => {
  const [selectedDataset, setSelectedDataset] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [targetValue, setTargetValue] = useState(0);
  const [targetColor, setTargetColor] = useState("#000000"); // Default color is black
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10; // Number of items to display per page

  const uniqueCategories = [...new Set(data.map((item) => item.App))];

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("/");
    return new Date(`${year}-${month}-${day}`);
  };

  const datasets = uniqueCategories.map((App) => {
    const filteredData = data.filter((item) => item.App === App);
    return {
      id: App,
      data: filteredData
        .filter((item) => {
          if (startDate && endDate) {
            const itemDate = formatDate(item.Date);
            return (
              itemDate >= formatDate(startDate) &&
              itemDate <= formatDate(endDate)
            );
          }
          return true;
        })
        .map((item) => {
          return { x: item?.Date, y: item?.["Daily Users"], ...item };
        }),
    };
  });

  const handleDatasetChange = (index) => {
    setSelectedDataset(index);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
  };

  const handleTargetValueChange = (event) => {
    setTargetValue(Number(event.target.value));
  };

  const handleTargetColorChange = (event) => {
    setTargetColor(event.target.value);
  };


  const pageCount = Math.ceil(
    datasets[selectedDataset].data.length / itemsPerPage
  );
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = datasets[selectedDataset].data.slice(
    startIndex,
    endIndex
  );

  return (
    <div>
      <div>
        <p className="category__title">Category</p>
        <select
          className="main__select"
          value={selectedDataset}
          onChange={(e) => handleDatasetChange(e.target.value)}
        >
          {uniqueCategories.map((category, index) => (
            <option value={index} key={index}>
              {category}
            </option>
          ))}
        </select>
        <div className="daterange__container">
          <div>
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
            />
          </div>
          <div>
            <label>End Date:</label>
            <input type="date" value={endDate} onChange={handleEndDateChange} />
          </div>
        </div>
        <div className="target__container">
          <div>
            <label>Target Value:</label>
            <input
              type="number"
              value={targetValue}
              onChange={handleTargetValueChange}
            />
          </div>
          <div>
            <label>Target Color:</label>
            <input
              type="color"
              value={targetColor}
              onChange={handleTargetColorChange}
            />
          </div>
        </div>
      </div>
      <h1>Chart</h1>
      <div className="chart__container">
        <ResponsiveLine
          data={[datasets[selectedDataset]]}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{
            type: "linear",
            min: "auto",
            max: "auto",
            stacked: true,
            reverse: false,
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Date",
            legendOffset: 36,
            legendPosition: "middle",
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Daily User",
            legendOffset: -40,
            legendPosition: "middle",
          }}
          pointSize={10}
          pointColor={{ theme: "background" }}
          pointBorderWidth={2}
          pointBorderColor={{ from: "serieColor" }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: "left-to-right",
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: "circle",
              symbolBorderColor: "rgba(0, 0, 0, .5)",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemBackground: "rgba(0, 0, 0, .03)",
                    itemOpacity: 1,
                  },
                },
              ],
            },
          ]}
          layers={[
            "grid",
            "markers",
            "axes",
            "areas",
            "crosshair",
            "lines",
            "points",
            "slices",
            "mesh",
            "legends",
            () => (
              <g>
                <line
                  x1="0"
                  x2="91%"
                  y1={targetValue}
                  y2={targetValue}
                  stroke={targetColor}
                  strokeWidth={2}
                  strokeDasharray="4"
                />
              </g>
            ),
          ]}
        />
      </div>
      <h1>Table</h1>
      <div className="table__container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Country</th>
              <th>App</th>
              <th>Platform</th>
              <th>Ad Network"</th>
              <th>Daily Users</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item, index) => (
              <tr key={`${item.Date}-${index}`}>
                <td>{item.x}</td>
                <td>{item.Country}</td>
                <td>{item.App}</td>
                <td>{item.Platform}</td>
                <td>{item?.["Ad Network"]}</td>
                <td>{item?.y}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {paginatedData?.length > 9 && (
          <div className="pagination">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span>{currentPage + 1}</span>
            <button
              disabled={currentPage === pageCount - 1}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsChart;
