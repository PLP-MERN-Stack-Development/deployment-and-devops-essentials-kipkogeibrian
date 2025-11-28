import React from "react";
import PieChart from "./PieChart";

const statsDashboardStyles = {
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
    marginBottom: "1.5rem",
    fontSize: "1.8rem",
    fontWeight: "bold"
  },
  chartsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "2rem",
    marginTop: "1rem"
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem"
  },
  statCard: {
    padding: "1.5rem",
    borderRadius: "10px",
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },
  statNumber: {
    fontSize: "2rem",
    margin: "0.5rem 0 0 0"
  }
};

function StatsDashboard({ stats }) {
  // Book Status Distribution Pie Chart Data
  const bookStatusData = {
    labels: ["Available", "Borrowed", "Overdue"],
    values: [
      stats.availableBooks || 0,
      (stats.borrowedBooks || 0) - (stats.overdueBooks || 0),
      stats.overdueBooks || 0
    ],
    colors: ["#48bb78", "#ed8936", "#f56565"],
    borderColors: ["#38a169", "#dd7723", "#e53e3e"]
  };

  // Book Categories Distribution (Mock data - you can replace with real genre data)
  const bookCategoriesData = {
    labels: ["Fiction", "Non-Fiction", "Science", "Technology", "Literature"],
    values: [25, 20, 15, 30, 10],
    colors: ["#667eea", "#9f7aea", "#f6ad55", "#fc8181", "#4fd1c7"],
    borderColors: ["#5a6fd8", "#805ad5", "#ed8936", "#f56565", "#38b2ac"]
  };

  // Penalty Distribution Pie Chart Data
  const penaltyData = {
    labels: ["Paid Penalties", "Unpaid Penalties"],
    values: [
      Math.round((stats.totalPenalty || 0) * 0.3), // Mock paid amount (30%)
      Math.round((stats.totalPenalty || 0) * 0.7)  // Mock unpaid amount (70%)
    ],
    colors: ["#68d391", "#fc8181"],
    borderColors: ["#48bb78", "#f56565"]
  };

  // Borrowing Activity (Mock data)
  const borrowingActivityData = {
    labels: ["This Month", "Last Month", "Older"],
    values: [45, 30, 25],
    colors: ["#4299e1", "#667eea", "#9f7aea"],
    borderColors: ["#3182ce", "#5a6fd8", "#805ad5"]
  };

  return React.createElement("div", { style: statsDashboardStyles.container },
    React.createElement("h2", { style: statsDashboardStyles.title }, "📊 Library Analytics Dashboard"),
    
    // Statistics Cards
    React.createElement("div", { style: statsDashboardStyles.statsGrid },
      React.createElement("div", { style: { ...statsDashboardStyles.statCard, background: "#667eea" } },
        React.createElement("h3", null, "Total Books"),
        React.createElement("p", { style: statsDashboardStyles.statNumber }, stats.totalBooks || 0)
      ),
      React.createElement("div", { style: { ...statsDashboardStyles.statCard, background: "#48bb78" } },
        React.createElement("h3", null, "Available"),
        React.createElement("p", { style: statsDashboardStyles.statNumber }, stats.availableBooks || 0)
      ),
      React.createElement("div", { style: { ...statsDashboardStyles.statCard, background: "#ed8936" } },
        React.createElement("h3", null, "Borrowed"),
        React.createElement("p", { style: statsDashboardStyles.statNumber }, stats.borrowedBooks || 0)
      ),
      React.createElement("div", { style: { ...statsDashboardStyles.statCard, background: "#f56565" } },
        React.createElement("h3", null, "Overdue"),
        React.createElement("p", { style: statsDashboardStyles.statNumber }, stats.overdueBooks || 0)
      ),
      React.createElement("div", { style: { ...statsDashboardStyles.statCard, background: "#9f7aea" } },
        React.createElement("h3", null, "Total Penalty"),
        React.createElement("p", { style: statsDashboardStyles.statNumber }, `$${stats.totalPenalty || 0}`)
      )
    ),

    // Pie Charts Grid
    React.createElement("div", { style: statsDashboardStyles.chartsGrid },
      React.createElement(PieChart, {
        data: bookStatusData,
        title: "📚 Book Status Distribution"
      }),
      React.createElement(PieChart, {
        data: bookCategoriesData,
        title: "🏷️ Book Categories"
      }),
      React.createElement(PieChart, {
        data: penaltyData,
        title: "💰 Penalty Status"
      }),
      React.createElement(PieChart, {
        data: borrowingActivityData,
        title: "📈 Borrowing Activity"
      })
    )
  );
}

export default StatsDashboard;
