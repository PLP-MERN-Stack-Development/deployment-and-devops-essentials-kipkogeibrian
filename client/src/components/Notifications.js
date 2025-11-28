import React from "react";

const notificationStyles = {
  container: {
    background: "white",
    margin: "1rem 0",
    padding: "1rem",
    borderRadius: "10px",
    border: "2px solid #f6ad55"
  },
  title: {
    color: "#744210",
    marginBottom: "0.5rem"
  },
  list: {
    listStyle: "none",
    padding: 0
  },
  listItem: {
    padding: "0.5rem",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },
  urgent: {
    background: "#fed7d7",
    color: "#742a2a"
  },
  warning: {
    background: "#fefcbf",
    color: "#744210"
  }
};

function Notifications({ books }) {
  const today = new Date();
  const notifications = books.filter(book => 
    !book.available && book.dueDate && new Date(book.dueDate) < new Date()
  ).map(book => {
    const dueDate = new Date(book.dueDate);
    const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
    return {
      ...book,
      daysOverdue,
      isUrgent: daysOverdue > 7
    };
  });

  if (notifications.length === 0) {
    return null;
  }

  return React.createElement("div", { style: notificationStyles.container },
    React.createElement("h3", { style: notificationStyles.title }, "⏰ Overdue Books"),
    React.createElement("ul", { style: notificationStyles.list },
      notifications.map(book => 
        React.createElement("li", { 
          key: book._id, 
          style: { 
            ...notificationStyles.listItem,
            ...(book.isUrgent ? notificationStyles.urgent : notificationStyles.warning)
          }
        },
          React.createElement("span", null, 
            `${book.title} - ${book.borrower}`
          ),
          React.createElement("span", { style: { fontWeight: "bold" } }, 
            `${book.daysOverdue} days overdue`
          )
        )
      )
    )
  );
}

export default Notifications;
