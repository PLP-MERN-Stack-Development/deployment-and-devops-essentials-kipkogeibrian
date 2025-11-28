import React from "react";

const borrowerStyles = {
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
    gridTemplateColumns: "1fr 1fr",
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
  info: {
    background: "#e6fffa",
    padding: "1rem",
    borderRadius: "8px",
    marginTop: "1rem",
    border: "1px solid #81e6d9"
  }
};

function BorrowerInput({ borrowerName, setBorrowerName, borrowerEmail, setBorrowerEmail }) {
  return React.createElement("div", null,
    React.createElement("h2", { style: borrowerStyles.title }, "👤 Borrower Information"),
    React.createElement("div", { style: borrowerStyles.grid },
      React.createElement("input", {
        type: "text",
        placeholder: "Your Full Name *",
        value: borrowerName,
        onChange: (e) => setBorrowerName(e.target.value),
        style: borrowerStyles.input,
        required: true
      }),
      React.createElement("input", {
        type: "email",
        placeholder: "Your Email Address",
        value: borrowerEmail,
        onChange: (e) => setBorrowerEmail(e.target.value),
        style: borrowerStyles.input
      })
    ),
    React.createElement("div", { style: borrowerStyles.info },
      React.createElement("p", { style: { margin: 0, color: "#234e52" } }, 
        "💡 Enter your name above to activate the borrow buttons. Email is optional but recommended for notifications."
      )
    )
  );
}

export default BorrowerInput;
