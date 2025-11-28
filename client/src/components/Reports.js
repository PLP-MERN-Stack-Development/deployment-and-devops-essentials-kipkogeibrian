import React from "react";
import { Bar, Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const reportStyles = {
  container: {
    background: "white",
    margin: "2rem 0",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
  },
  title: {
    textAlign: "center",
    color: "#4a5568",
    marginBottom: "1.5rem"
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
    gap: "2rem",
    marginTop: "1rem"
  },
  chartContainer: {
    padding: "1rem",
    border: "1px solid #e2e8f0",
    borderRadius: "10px"
  }
};

function Reports({ books, stats }) {
  // Monthly borrowing trend data
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Books Borrowed',
        data: [65, 59, 80, 81, 56, 55, 40, 45, 60, 70, 75, 80],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }
    ]
  };

  // Genre popularity data
  const genreData = {
    labels: ['Fiction', 'Science', 'Technology', 'History', 'Biography', 'Literature'],
    datasets: [
      {
        label: 'Books per Genre',
        data: [12, 19, 8, 15, 7, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)'
        ]
      }
    ]
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Borrowing Trends'
      }
    }
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Genre Popularity'
      }
    }
  };

  return React.createElement("div", { style: reportStyles.container },
    React.createElement("h2", { style: reportStyles.title }, "📈 Advanced Analytics"),
    React.createElement("div", { style: reportStyles.chartsGrid },
      React.createElement("div", { style: reportStyles.chartContainer },
        React.createElement(Line, { data: monthlyData, options: lineOptions })
      ),
      React.createElement("div", { style: reportStyles.chartContainer },
        React.createElement(Bar, { data: genreData, options: barOptions })
      )
    ),
    React.createElement("div", { style: { marginTop: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" } },
      React.createElement("div", { style: { background: "#e6fffa", padding: "1rem", borderRadius: "8px" } },
        React.createElement("h4", null, "📚 Most Popular Book"),
        React.createElement("p", { style: { margin: 0 } }, "The Great Gatsby")
      ),
      React.createElement("div", { style: { background: "#fffaf0", padding: "1rem", borderRadius: "8px" } },
        React.createElement("h4", null, "⭐ Top Borrower"),
        React.createElement("p", { style: { margin: 0 } }, "John Doe (12 books)")
      ),
      React.createElement("div", { style: { background: "#f0fff4", padding: "1rem", borderRadius: "8px" } },
        React.createElement("h4", null, "💰 Revenue This Month"),
        React.createElement("p", { style: { margin: 0 } }, "$45.00")
      )
    )
  );
}

export default Reports;
