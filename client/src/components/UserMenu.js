import React, { useState } from "react";
import { useAuth } from "./Auth";

const userMenuStyles = {
  container: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    background: "white",
    padding: "0.5rem 1rem",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    zIndex: 1000
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem"
  },
  adminBadge: {
    background: "#f56565",
    color: "white",
    padding: "0.25rem 0.5rem",
    borderRadius: "10px",
    fontSize: "0.8rem",
    fontWeight: "bold"
  },
  userBadge: {
    background: "#667eea",
    color: "white",
    padding: "0.25rem 0.5rem",
    borderRadius: "10px",
    fontSize: "0.8rem",
    fontWeight: "bold"
  },
  logoutBtn: {
    background: "#f56565",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
    transition: "all 0.3s"
  },
  logoutBtnHover: {
    background: "#e53e3e",
    transform: "scale(1.05)"
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    right: "0",
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "0.5rem",
    marginTop: "0.5rem",
    minWidth: "150px"
  },
  dropdownItem: {
    padding: "0.5rem",
    cursor: "pointer",
    borderRadius: "4px",
    transition: "background 0.2s"
  },
  dropdownItemHover: {
    background: "#f7fafc"
  }
};

function UserMenu() {
  const { user, logout } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      logout();
    }
  };

  const getLogoutStyle = () => {
    return isHovered 
      ? { ...userMenuStyles.logoutBtn, ...userMenuStyles.logoutBtnHover }
      : userMenuStyles.logoutBtn;
  };

  const getDropdownItemStyle = (isHoveredItem = false) => {
    return isHoveredItem 
      ? { ...userMenuStyles.dropdownItem, ...userMenuStyles.dropdownItemHover }
      : userMenuStyles.dropdownItem;
  };

  if (!user) return null;

  return React.createElement("div", { style: { position: "relative" } },
    React.createElement("div", { style: userMenuStyles.container },
      React.createElement("div", { 
        style: userMenuStyles.userInfo,
        onClick: () => setShowDropdown(!showDropdown)
      },
        React.createElement("span", { style: { cursor: "pointer" } }, `👋 ${user.name}`),
        user.role === "admin" 
          ? React.createElement("span", { style: userMenuStyles.adminBadge }, "Admin")
          : React.createElement("span", { style: userMenuStyles.userBadge }, "User")
      ),
      
      React.createElement("button", { 
        onClick: handleLogout,
        style: getLogoutStyle(),
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        title: "Logout"
      }, "🚪 Logout")
    ),
    
    showDropdown && React.createElement("div", { style: userMenuStyles.dropdown },
      React.createElement("div", { 
        style: getDropdownItemStyle(),
        onClick: () => setShowDropdown(false)
      },
        React.createElement("strong", null, "Logged in as:"),
        React.createElement("div", null, user.name),
        React.createElement("div", { style: { fontSize: "0.8rem", color: "#718096" } }, user.email)
      ),
      React.createElement("div", { style: { height: "1px", background: "#e2e8f0", margin: "0.5rem 0" } }),
      React.createElement("div", { 
        style: getDropdownItemStyle(),
        onClick: handleLogout
      }, "🚪 Logout")
    )
  );
}

export default UserMenu;
