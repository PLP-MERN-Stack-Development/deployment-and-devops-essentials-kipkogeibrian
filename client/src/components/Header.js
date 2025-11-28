import React from "react";
import { useAuth } from "./Auth";

const headerStyles = {
  header: {
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
    padding: "2rem",
    textAlign: "center",
    color: "white",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
    marginBottom: "2rem"
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
    cursor: "pointer"
  },
  subtitle: {
    fontSize: "1.1rem",
    opacity: "0.9",
    marginBottom: "0.5rem"
  },
  statusContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
    marginTop: "1rem"
  },
  status: {
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.9rem",
    fontWeight: "600",
    display: "inline-block"
  },
  statusConnected: {
    background: "#c6f6d5",
    color: "#22543d"
  },
  statusDisconnected: {
    background: "#fed7d7",
    color: "#742a2a"
  },
  userInfo: {
    background: "rgba(255, 255, 255, 0.2)",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    fontSize: "0.9rem",
    marginTop: "0.5rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem"
  },
  logoutButton: {
    background: "#e53e3e",
    color: "white",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "15px",
    fontSize: "0.8rem",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.2s ease"
  },
  logoutButtonHover: {
    background: "#c53030",
    transform: "scale(1.05)"
  },
  userRole: {
    fontWeight: "600",
    color: "#90cdf4"
  },
  adminNav: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    marginTop: "1rem"
  },
  adminLink: {
    color: "white",
    textDecoration: "none",
    padding: "0.5rem 1rem",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
    transition: "all 0.2s ease",
    cursor: "pointer",
    border: "none",
    fontSize: "0.9rem",
    fontFamily: "inherit"
  },
  adminLinkHover: {
    background: "rgba(255, 255, 255, 0.3)",
    transform: "scale(1.05)"
  },
  backButton: {
    color: "white",
    textDecoration: "none",
    padding: "0.5rem 1rem",
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "10px",
    transition: "all 0.2s ease",
    cursor: "pointer",
    border: "none",
    fontSize: "0.9rem",
    fontFamily: "inherit",
    marginBottom: "1rem"
  }
};

function Header({ connectionStatus, currentView, onBack }) {
  const { user, logout, isAdmin } = useAuth();
  const [isHovered, setIsHovered] = React.useState(false);
  const [hoveredLink, setHoveredLink] = React.useState(null);

  const getStatusStyle = () => {
    switch(connectionStatus) {
      case "connected": return { ...headerStyles.status, ...headerStyles.statusConnected };
      case "disconnected": return { ...headerStyles.status, ...headerStyles.statusDisconnected };
      default: return headerStyles.status;
    }
  };

  const getStatusText = () => {
    switch(connectionStatus) {
      case "connected": return "✅ Backend Connected";
      case "disconnected": return "❌ Backend Disconnected";
      default: return "🔍 Checking Connection...";
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  const getLogoutButtonStyle = () => {
    return {
      ...headerStyles.logoutButton,
      ...(isHovered && headerStyles.logoutButtonHover)
    };
  };

  const getAdminLinkStyle = (linkName) => {
    return {
      ...headerStyles.adminLink,
      ...(hoveredLink === linkName && headerStyles.adminLinkHover)
    };
  };

  const handleAdminNavigation = (view) => {
    // This will be handled by the parent component via callback
    if (typeof onBack === 'function') {
      // If we're already in a sub-view and clicking the same link, go back to main
      if (currentView === view) {
        onBack();
      } else {
        // Navigate to the specific admin view
        window.dispatchEvent(new CustomEvent('adminNavigation', { 
          detail: { view } 
        }));
      }
    }
  };

  const handleTitleClick = () => {
    // Navigate to main view when title is clicked
    if (currentView !== "main" && typeof onBack === 'function') {
      onBack();
    }
  };

  const handleBackClick = () => {
    if (typeof onBack === 'function') {
      onBack();
    }
  };

  return React.createElement("header", { style: headerStyles.header },
    // Back button for non-main views
    currentView !== "main" && React.createElement("button", {
      style: headerStyles.backButton,
      onClick: handleBackClick
    }, "← Back to Library"),
    
    React.createElement("h1", { 
      style: headerStyles.title,
      onClick: handleTitleClick
    }, "📚 Library Management System"),
    
    React.createElement("p", { style: headerStyles.subtitle }, "Professional Library System with MongoDB"),
    
    // Add admin navigation
    isAdmin && React.createElement("div", { style: headerStyles.adminNav },
      React.createElement("button", {
        style: getAdminLinkStyle("users"),
        onClick: () => handleAdminNavigation("adminUsers"),
        onMouseEnter: () => setHoveredLink("users"),
        onMouseLeave: () => setHoveredLink(null)
      }, "👥 Manage Users"),
      React.createElement("button", {
        style: getAdminLinkStyle("penalties"),
        onClick: () => handleAdminNavigation("adminPenalties"),
        onMouseEnter: () => setHoveredLink("penalties"),
        onMouseLeave: () => setHoveredLink(null)
      }, "💰 Manage Penalties"),
      React.createElement("button", {
        style: getAdminLinkStyle("reports"),
        onClick: () => handleAdminNavigation("adminReports"),
        onMouseEnter: () => setHoveredLink("reports"),
        onMouseLeave: () => setHoveredLink(null)
      }, "📊 Advanced Reports")
    ),
    
    React.createElement("div", { style: headerStyles.statusContainer },
      React.createElement("div", { style: getStatusStyle() }, getStatusText()),
      
      user && React.createElement("div", { style: headerStyles.userInfo },
        React.createElement("span", null, 
          `Welcome, ${user.name} `,
          React.createElement("span", { style: headerStyles.userRole }, `(${user.role})`)
        ),
        React.createElement("button", { 
          style: getLogoutButtonStyle(),
          onClick: handleLogout,
          onMouseEnter: () => setIsHovered(true),
          onMouseLeave: () => setIsHovered(false),
          title: "Logout from system"
        }, "🚪 Logout")
      )
    )
  );
}

export default Header;