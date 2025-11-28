import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const pieChartStyles = {
  container: {
    background: "white",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    margin: "2rem 0"
  },
  title: {
    textAlign: "center",
    color: "#4a5568",
    marginBottom: "1.5rem",
    fontSize: "1.5rem",
    fontWeight: "bold"
  },
  chartContainer: {
    maxWidth: "500px",
    margin: "0 auto"
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "2rem",
    marginTop: "1rem"
  }
};

function PieChart({ data, title }) {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.values,
        backgroundColor: data.colors,
        borderColor: data.borderColors || data.colors,
        borderWidth: 2,
        hoverOffset: 8
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
            weight: "bold"
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return React.createElement("div", { style: pieChartStyles.container },
    React.createElement("h2", { style: pieChartStyles.title }, title),
    React.createElement("div", { style: pieChartStyles.chartContainer },
      React.createElement(Pie, { data: chartData, options: options })
    )
  );
}

export default PieChart;
