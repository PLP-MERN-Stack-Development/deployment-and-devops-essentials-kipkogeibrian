import React from "react";

const searchFilterStyles = {
  container: {
    marginBottom: "1rem"
  },
  title: {
    marginBottom: "1.5rem",
    color: "#4a5568",
    borderBottom: "2px solid #e2e8f0",
    paddingBottom: "0.5rem"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "1rem",
    marginTop: "1rem"
  },
  input: {
    padding: "0.75rem",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    width: "100%"
  },
  select: {
    padding: "0.75rem",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    width: "100%"
  }
};

function SearchAndFilter({ filters, onFiltersChange }) {
  const handleSearchChange = (e) => {
    onFiltersChange({
      ...filters,
      search: e.target.value
    });
  };

  const handleStatusChange = (e) => {
    onFiltersChange({
      ...filters,
      status: e.target.value
    });
  };

  return React.createElement("div", null,
    React.createElement("h2", { style: searchFilterStyles.title }, "🔍 Search & Filter"),
    React.createElement("div", { style: searchFilterStyles.grid },
      React.createElement("input", {
        type: "text",
        placeholder: "Search by title, author, or genre...",
        value: filters.search || "",
        onChange: handleSearchChange,
        style: searchFilterStyles.input
      }),
      React.createElement("select", {
        value: filters.status || "all",
        onChange: handleStatusChange,
        style: searchFilterStyles.select
      },
        React.createElement("option", { value: "all" }, "All Books"),
        React.createElement("option", { value: "available" }, "Available"),
        React.createElement("option", { value: "borrowed" }, "Borrowed"),
        React.createElement("option", { value: "overdue" }, "Overdue")
      )
    )
  );
}

export default SearchAndFilter;
