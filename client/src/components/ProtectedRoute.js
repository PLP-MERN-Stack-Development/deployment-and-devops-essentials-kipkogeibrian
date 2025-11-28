import React from "react";
import { useAuth } from "./Auth";

const protectedStyles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  message: {
    background: "white",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "500px"
  },
  title: {
    color: "#4a5568",
    marginBottom: "1rem"
  },
  text: {
    color: "#718096",
    marginBottom: "1rem"
  }
};

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return React.createElement("div", { style: protectedStyles.container },
      React.createElement("div", { style: protectedStyles.message },
        React.createElement("h2", { style: protectedStyles.title }, "🔐 Loading..."),
        React.createElement("p", { style: protectedStyles.text }, "Checking authentication...")
      )
    );
  }

  if (!user) {
    return React.createElement("div", { style: protectedStyles.container },
      React.createElement("div", { style: protectedStyles.message },
        React.createElement("h2", { style: protectedStyles.title }, "🔐 Authentication Required"),
        React.createElement("p", { style: protectedStyles.text }, "Please log in to access the library system.")
      )
    );
  }

  if (requireAdmin && !isAdmin) {
    return React.createElement("div", { style: protectedStyles.container },
      React.createElement("div", { style: protectedStyles.message },
        React.createElement("h2", { style: protectedStyles.title }, "⛔ Access Denied"),
        React.createElement("p", { style: protectedStyles.text }, "Admin privileges required to access this page."),
        React.createElement("p", { style: { ...protectedStyles.text, fontSize: "0.9rem" } }, 
          "You are logged in as a regular user."
        )
      )
    );
  }

  return children;
}

export default ProtectedRoute;
