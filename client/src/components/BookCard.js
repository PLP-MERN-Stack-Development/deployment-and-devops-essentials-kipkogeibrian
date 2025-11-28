import React from "react";

const cardStyles = {
  card: {
    border: "2px solid #e2e8f0",
    borderRadius: "12px",
    padding: "1.5rem",
    transition: "transform 0.3s, box-shadow 0.3s",
    background: "white"
  },
  cardAvailable: {
    borderLeft: "4px solid #48bb78"
  },
  cardBorrowed: {
    borderLeft: "4px solid #ed8936"
  },
  cardOverdue: {
    borderLeft: "4px solid #f56565"
  },
  cardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.15)"
  },
  bookInfo: {
    marginBottom: "1rem"
  },
  title: {
    color: "#2d3748",
    marginBottom: "1rem",
    fontSize: "1.3rem"
  },
  text: {
    margin: "0.5rem 0",
    color: "#4a5568"
  },
  status: {
    fontWeight: "bold",
    marginTop: "1rem",
    padding: "0.5rem",
    borderRadius: "6px",
    textAlign: "center"
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
    gap: "0.5rem",
    marginTop: "1rem"
  },
  actionBtn: {
    flex: "1",
    padding: "0.5rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
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
  }
};

function BookCard({ book, onBorrow, onReturn, onDelete, onPayPenalty, borrowerName }) {
  const [isHovered, setIsHovered] = React.useState(false);

  const handleBorrow = () => {
    if (!borrowerName.trim()) {
      alert("Please enter your name in the borrower section above");
      return;
    }
    onBorrow(book._id);
  };

  const handleReturn = () => {
    onReturn(book._id);
  };

  const handlePayPenalty = () => {
    onPayPenalty(book._id);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this book?")) {
      onDelete(book._id);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  const getStatus = () => {
    if (book.available) return "available";
    if (book.dueDate && new Date(book.dueDate) < new Date()) return "overdue";
    return "borrowed";
  };

  const status = getStatus();

  const getCardStyle = () => {
    const baseStyle = { ...cardStyles.card };
    const hoverStyle = isHovered ? cardStyles.cardHover : {};
    
    switch(status) {
      case "available": return { ...baseStyle, ...cardStyles.cardAvailable, ...hoverStyle };
      case "borrowed": return { ...baseStyle, ...cardStyles.cardBorrowed, ...hoverStyle };
      case "overdue": return { ...baseStyle, ...cardStyles.cardOverdue, ...hoverStyle };
      default: return { ...baseStyle, ...hoverStyle };
    }
  };

  const getStatusStyle = () => {
    switch(status) {
      case "available": return { ...cardStyles.status, ...cardStyles.statusAvailable };
      case "borrowed": return { ...cardStyles.status, ...cardStyles.statusBorrowed };
      case "overdue": return { ...cardStyles.status, ...cardStyles.statusOverdue };
      default: return cardStyles.status;
    }
  };

  const getStatusText = () => {
    switch(status) {
      case "available": return "✅ Available";
      case "borrowed": return "📖 Borrowed";
      case "overdue": return "⏰ Overdue";
      default: return "Unknown";
    }
  };

  return React.createElement("div", { 
    style: getCardStyle(),
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  },
    React.createElement("div", { style: cardStyles.bookInfo },
      React.createElement("h3", { style: cardStyles.title }, book.title),
      React.createElement("p", { style: cardStyles.text }, 
        React.createElement("strong", null, "Author: "), 
        book.author
      ),
      book.isbn && React.createElement("p", { style: cardStyles.text },
        React.createElement("strong", null, "ISBN: "),
        book.isbn
      ),
      book.publishedYear && React.createElement("p", { style: cardStyles.text },
        React.createElement("strong", null, "Year: "),
        book.publishedYear
      ),
      book.genre && React.createElement("p", { style: cardStyles.text },
        React.createElement("strong", null, "Genre: "),
        book.genre
      ),
      !book.available && React.createElement("p", { style: cardStyles.text },
        React.createElement("strong", null, "Borrower: "),
        book.borrower
      ),
      !book.available && React.createElement("p", { style: cardStyles.text },
        React.createElement("strong", null, "Due Date: "),
        formatDate(book.dueDate)
      ),
      book.penaltyAmount > 0 && React.createElement("p", { style: cardStyles.text },
        React.createElement("strong", null, "Penalty: "),
        `$${book.penaltyAmount}`
      ),
      React.createElement("p", { style: getStatusStyle() }, getStatusText())
    ),
    React.createElement("div", { style: cardStyles.actions },
      book.available 
        ? React.createElement("button", {
            onClick: handleBorrow,
            disabled: !borrowerName.trim(),
            style: !borrowerName.trim() 
              ? { ...cardStyles.actionBtn, ...cardStyles.disabledBtn }
              : { ...cardStyles.actionBtn, ...cardStyles.borrowBtn },
            title: borrowerName.trim() ? "Borrow this book" : "Enter your name to borrow"
          }, "Borrow")
        : React.createElement("button", {
            onClick: handleReturn,
            style: { ...cardStyles.actionBtn, ...cardStyles.returnBtn },
            title: "Return this book"
          }, "Return"),
      book.penaltyAmount > 0 && 
        React.createElement("button", {
          onClick: handlePayPenalty,
          style: { ...cardStyles.actionBtn, ...cardStyles.payBtn },
          title: "Pay penalty"
        }, "Pay"),
      React.createElement("button", {
        onClick: handleDelete,
        style: { ...cardStyles.actionBtn, ...cardStyles.deleteBtn },
        title: "Delete book"
      }, "Delete")
    )
  );
}

export default BookCard;
