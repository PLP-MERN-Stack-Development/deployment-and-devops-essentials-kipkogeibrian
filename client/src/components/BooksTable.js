import React from "react";

const tableStyles = {
  container: {
    overflowX: "auto"
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem"
  },
  th: {
    padding: "1rem",
    textAlign: "left",
    borderBottom: "1px solid #e2e8f0",
    background: "#f7fafc",
    fontWeight: "600",
    color: "#4a5568"
  },
  td: {
    padding: "1rem",
    textAlign: "left",
    borderBottom: "1px solid #e2e8f0"
  },
  availableRow: {
    background: "#f0fff4"
  },
  borrowedRow: {
    background: "#fffaf0"
  },
  overdueRow: {
    background: "#fed7d7"
  },
  statusBadge: {
    padding: "0.25rem 0.5rem",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
    display: "inline-block"
  },
  statusAvailable: {
    background: "#c6f6d5",
    color: "#22543d"
  },
  statusBorrowed: {
    background: "#fefcbf",
    color: "#744210"
  },
  statusOverdue: {
    background: "#fed7d7",
    color: "#742a2a"
  },
  actions: {
    display: "flex",
    gap: "0.5rem"
  },
  actionBtn: {
    padding: "0.5rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "all 0.3s"
  },
  borrowBtn: {
    background: "#48bb78",
    color: "white"
  },
  returnBtn: {
    background: "#ed8936",
    color: "white"
  },
  payBtn: {
    background: "#9f7aea",
    color: "white"
  },
  deleteBtn: {
    background: "#f56565",
    color: "white"
  },
  disabledBtn: {
    background: "#a0aec0",
    color: "white",
    cursor: "not-allowed"
  },
  emptyState: {
    textAlign: "center",
    padding: "3rem",
    color: "#718096",
    fontSize: "1.1rem"
  }
};

function BooksTable({ books, onBorrow, onReturn, onDelete, onPayPenalty, borrowerName }) {
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const getStatusBadge = (book) => {
    if (book.available) {
      return React.createElement("span", { 
        style: { ...tableStyles.statusBadge, ...tableStyles.statusAvailable } 
      }, "Available");
    } else if (book.dueDate && new Date(book.dueDate) < new Date()) {
      return React.createElement("span", { 
        style: { ...tableStyles.statusBadge, ...tableStyles.statusOverdue } 
      }, "Overdue");
    } else {
      return React.createElement("span", { 
        style: { ...tableStyles.statusBadge, ...tableStyles.statusBorrowed } 
      }, "Borrowed");
    }
  };

  const getRowStyle = (book) => {
    if (book.available) return tableStyles.availableRow;
    if (book.dueDate && new Date(book.dueDate) < new Date()) return tableStyles.overdueRow;
    return tableStyles.borrowedRow;
  };

  if (books.length === 0) {
    return React.createElement("div", { style: tableStyles.emptyState },
      React.createElement("p", null, "No books found matching your criteria.")
    );
  }

  return React.createElement("div", { style: tableStyles.container },
    React.createElement("table", { style: tableStyles.table },
      React.createElement("thead", null,
        React.createElement("tr", null,
          React.createElement("th", { style: tableStyles.th }, "Title"),
          React.createElement("th", { style: tableStyles.th }, "Author"),
          React.createElement("th", { style: tableStyles.th }, "Genre"),
          React.createElement("th", { style: tableStyles.th }, "Status"),
          React.createElement("th", { style: tableStyles.th }, "Borrower"),
          React.createElement("th", { style: tableStyles.th }, "Due Date"),
          React.createElement("th", { style: tableStyles.th }, "Penalty"),
          React.createElement("th", { style: tableStyles.th }, "Actions")
        )
      ),
      React.createElement("tbody", null,
        books.map(book => 
          React.createElement("tr", { key: book._id, style: getRowStyle(book) },
            React.createElement("td", { style: tableStyles.td }, book.title),
            React.createElement("td", { style: tableStyles.td }, book.author),
            React.createElement("td", { style: tableStyles.td }, book.genre || "N/A"),
            React.createElement("td", { style: tableStyles.td }, getStatusBadge(book)),
            React.createElement("td", { style: tableStyles.td }, book.borrower || "N/A"),
            React.createElement("td", { style: tableStyles.td }, formatDate(book.dueDate)),
            React.createElement("td", { style: tableStyles.td }, 
              book.penaltyAmount > 0 ? `$${book.penaltyAmount}` : "N/A"
            ),
            React.createElement("td", { style: tableStyles.td },
              React.createElement("div", { style: tableStyles.actions },
                book.available 
                  ? React.createElement("button", {
                      onClick: () => onBorrow(book._id),
                      disabled: !borrowerName.trim(),
                      style: !borrowerName.trim() 
                        ? { ...tableStyles.actionBtn, ...tableStyles.disabledBtn }
                        : { ...tableStyles.actionBtn, ...tableStyles.borrowBtn },
                      title: borrowerName.trim() ? "Borrow this book" : "Enter your name to borrow"
                    }, "📖 Borrow")
                  : React.createElement("button", {
                      onClick: () => onReturn(book._id),
                      style: { ...tableStyles.actionBtn, ...tableStyles.returnBtn },
                      title: "Return this book"
                    }, "↩️ Return"),
                book.penaltyAmount > 0 && 
                  React.createElement("button", {
                    onClick: () => onPayPenalty(book._id),
                    style: { ...tableStyles.actionBtn, ...tableStyles.payBtn },
                    title: "Pay penalty"
                  }, "💳 Pay"),
                React.createElement("button", {
                  onClick: () => onDelete(book._id),
                  style: { ...tableStyles.actionBtn, ...tableStyles.deleteBtn },
                  title: "Delete book"
                }, "🗑️")
              )
            )
          )
        )
      )
    )
  );
}

export default BooksTable;
