import React, { useState, useEffect } from "react";

const AdminUsers = ({ onViewUser, onBack }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    role: "all",
    status: "all"
  });
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Add user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    isActive: true
  });

  // Edit user form state
  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "user",
    isActive: true,
    notes: ""
  });

  const adminStyles = {
    container: {
      padding: "2rem",
      maxWidth: "1200px",
      margin: "0 auto",
      background: "white",
      borderRadius: "15px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
      marginTop: "2rem"
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      borderBottom: "2px solid #e2e8f0",
      paddingBottom: "1rem"
    },
    title: {
      color: "#2d3748",
      fontSize: "2rem",
      margin: 0
    },
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      marginBottom: "2rem"
    },
    statCard: {
      background: "white",
      padding: "1.5rem",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      textAlign: "center",
      border: "1px solid #e2e8f0"
    },
    statNumber: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#2d3748",
      margin: "0.5rem 0"
    },
    statLabel: {
      color: "#718096",
      fontSize: "0.9rem"
    },
    filters: {
      display: "flex",
      gap: "1rem",
      marginBottom: "1.5rem",
      flexWrap: "wrap"
    },
    input: {
      padding: "0.5rem",
      border: "1px solid #cbd5e0",
      borderRadius: "4px",
      fontSize: "1rem",
      width: "200px"
    },
    select: {
      padding: "0.5rem",
      border: "1px solid #cbd5e0",
      borderRadius: "4px",
      fontSize: "1rem",
      background: "white"
    },
    table: {
      width: "100%",
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      overflow: "hidden",
      border: "1px solid #e2e8f0"
    },
    tableHeader: {
      background: "#f7fafc",
      padding: "1rem",
      borderBottom: "1px solid #e2e8f0",
      fontWeight: "600",
      color: "#4a5568"
    },
    tableRow: {
      borderBottom: "1px solid #e2e8f0"
    },
    tableCell: {
      padding: "1rem",
      textAlign: "left"
    },
    badge: {
      padding: "0.25rem 0.5rem",
      borderRadius: "12px",
      fontSize: "0.75rem",
      fontWeight: "600"
    },
    badgeAdmin: {
      background: "#fed7d7",
      color: "#c53030"
    },
    badgeUser: {
      background: "#c6f6d5",
      color: "#276749"
    },
    badgeActive: {
      background: "#c6f6d5",
      color: "#276749"
    },
    badgeInactive: {
      background: "#fed7d7",
      color: "#c53030"
    },
    button: {
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "0.9rem",
      marginRight: "0.5rem"
    },
    buttonPrimary: {
      background: "#4299e1",
      color: "white"
    },
    buttonDanger: {
      background: "#f56565",
      color: "white"
    },
    buttonSuccess: {
      background: "#48bb78",
      color: "white"
    },
    buttonWarning: {
      background: "#ed8936",
      color: "white"
    },
    loading: {
      textAlign: "center",
      padding: "2rem",
      color: "#718096"
    },
    error: {
      background: "#fed7d7",
      color: "#c53030",
      padding: "1rem",
      borderRadius: "4px",
      marginBottom: "1rem"
    },
    // Modal styles
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000
    },
    modal: {
      background: "white",
      padding: "2rem",
      borderRadius: "8px",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
      width: "90%",
      maxWidth: "500px",
      maxHeight: "90vh",
      overflowY: "auto"
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
      borderBottom: "1px solid #e2e8f0",
      paddingBottom: "1rem"
    },
    modalTitle: {
      margin: 0,
      color: "#2d3748",
      fontSize: "1.5rem"
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#718096"
    },
    formGroup: {
      marginBottom: "1rem"
    },
    label: {
      display: "block",
      marginBottom: "0.5rem",
      fontWeight: "600",
      color: "#4a5568"
    },
    formInput: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #cbd5e0",
      borderRadius: "4px",
      fontSize: "1rem",
      boxSizing: "border-box"
    },
    formSelect: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #cbd5e0",
      borderRadius: "4px",
      fontSize: "1rem",
      background: "white"
    },
    formTextarea: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #cbd5e0",
      borderRadius: "4px",
      fontSize: "1rem",
      boxSizing: "border-box",
      minHeight: "80px",
      resize: "vertical"
    },
    checkboxGroup: {
      display: "flex",
      alignItems: "center",
      gap: "0.5rem"
    },
    checkbox: {
      width: "auto",
      margin: 0
    },
    modalActions: {
      display: "flex",
      gap: "1rem",
      justifyContent: "flex-end",
      marginTop: "1.5rem",
      borderTop: "1px solid #e2e8f0",
      paddingTop: "1.5rem"
    },
    buttonSecondary: {
      background: "#718096",
      color: "white"
    }
  };

  useEffect(() => {
    loadUsers();
    loadStats();
  }, [filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication required");
        return;
      }

      // Build query parameters
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.role !== 'all') params.append('role', filters.role);
      if (filters.status !== 'all') params.append('status', filters.status);

      const response = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Access denied. Admin privileges required.");
        }
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      const usersData = await response.json();
      setUsers(usersData);
      setError("");
    } catch (error) {
      console.error("Error loading users:", error);
      setError("Failed to load users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/admin/users-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const statsData = await response.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getBadgeStyle = (type, value) => {
    const baseStyle = adminStyles.badge;
    if (type === "role") {
      return value === "admin" 
        ? { ...baseStyle, ...adminStyles.badgeAdmin }
        : { ...baseStyle, ...adminStyles.badgeUser };
    }
    if (type === "status") {
      return value 
        ? { ...baseStyle, ...adminStyles.badgeActive }
        : { ...baseStyle, ...adminStyles.badgeInactive };
    }
    return baseStyle;
  };

  const handleViewUser = (userId) => {
    if (onViewUser) {
      onViewUser(userId);
    }
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
    // Reset form
    setNewUser({
      name: "",
      email: "",
      password: "",
      role: "user",
      isActive: true
    });
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      notes: user.notes || ""
    });
    setShowEditUserModal(true);
  };

  const handleResetPassword = async (userId, userName) => {
    if (confirm(`Reset password for ${userName}? A temporary password will be generated and emailed to the user.`)) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          alert(`Password reset successfully for ${userName}. Temporary password has been sent to their email.`);
        } else {
          throw new Error('Failed to reset password');
        }
      } catch (error) {
        console.error("Error resetting password:", error);
        alert("Failed to reset password: " + error.message);
      }
    }
  };

  // New function to handle adding a user
  const handleSubmitAddUser = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (newUser.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setAddingUser(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to add user: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Close modal and refresh users list
      setShowAddUserModal(false);
      await loadUsers();
      await loadStats();
      
      alert(`User "${newUser.name}" added successfully!`);
      
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to add user: " + error.message);
    } finally {
      setAddingUser(false);
    }
  };

  const handleSubmitEditUser = async (e) => {
    e.preventDefault();
    
    if (!editUser.name.trim() || !editUser.email.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setEditingUser(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editUser)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update user: ${response.statusText}`);
      }

      // Close modal and refresh users list
      setShowEditUserModal(false);
      await loadUsers();
      
      alert(`User "${editUser.name}" updated successfully!`);
      
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user: " + error.message);
    } finally {
      setEditingUser(false);
    }
  };

  const handleNewUserChange = (field, value) => {
    setNewUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEditUserChange = (field, value) => {
    setEditUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Add User Modal Component
  const AddUserModal = () => {
    if (!showAddUserModal) return null;

    return React.createElement("div", { style: adminStyles.modalOverlay },
      React.createElement("div", { style: adminStyles.modal },
        React.createElement("div", { style: adminStyles.modalHeader },
          React.createElement("h2", { style: adminStyles.modalTitle }, "Add New User"),
          React.createElement("button", {
            style: adminStyles.closeButton,
            onClick: () => setShowAddUserModal(false),
            disabled: addingUser
          }, "×")
        ),

        React.createElement("form", { onSubmit: handleSubmitAddUser },
          React.createElement("div", { style: adminStyles.formGroup },
            React.createElement("label", { 
              htmlFor: "name", 
              style: adminStyles.label 
            }, "Full Name *"),
            React.createElement("input", {
              type: "text",
              id: "name",
              value: newUser.name,
              onChange: (e) => handleNewUserChange("name", e.target.value),
              style: adminStyles.formInput,
              placeholder: "Enter full name",
              required: true,
              disabled: addingUser
            })
          ),

          React.createElement("div", { style: adminStyles.formGroup },
            React.createElement("label", { 
              htmlFor: "email", 
              style: adminStyles.label 
            }, "Email Address *"),
            React.createElement("input", {
              type: "email",
              id: "email",
              value: newUser.email,
              onChange: (e) => handleNewUserChange("email", e.target.value),
              style: adminStyles.formInput,
              placeholder: "Enter email address",
              required: true,
              disabled: addingUser
            })
          ),

          React.createElement("div", { style: adminStyles.formGroup },
            React.createElement("label", { 
              htmlFor: "password", 
              style: adminStyles.label 
            }, "Password *"),
            React.createElement("input", {
              type: "password",
              id: "password",
              value: newUser.password,
              onChange: (e) => handleNewUserChange("password", e.target.value),
              style: adminStyles.formInput,
              placeholder: "Enter password (min. 6 characters)",
              required: true,
              minLength: 6,
              disabled: addingUser
            })
          ),

          React.createElement("div", { style: adminStyles.formGroup },
            React.createElement("label", { 
              htmlFor: "role", 
              style: adminStyles.label 
            }, "Role"),
            React.createElement("select", {
              id: "role",
              value: newUser.role,
              onChange: (e) => handleNewUserChange("role", e.target.value),
              style: adminStyles.formSelect,
              disabled: addingUser
            },
              React.createElement("option", { value: "user" }, "User"),
              React.createElement("option", { value: "admin" }, "Admin")
            )
          ),

          React.createElement("div", { style: adminStyles.formGroup },
            React.createElement("div", { style: adminStyles.checkboxGroup },
              React.createElement("input", {
                type: "checkbox",
                id: "isActive",
                checked: newUser.isActive,
                onChange: (e) => handleNewUserChange("isActive", e.target.checked),
                style: { ...adminStyles.formInput, ...adminStyles.checkbox },
                disabled: addingUser
              }),
              React.createElement("label", { 
                htmlFor: "isActive", 
                style: adminStyles.label 
              }, "Active User")
            )
          ),

          React.createElement("div", { style: adminStyles.modalActions },
            React.createElement("button", {
              type: "button",
              onClick: () => setShowAddUserModal(false),
              style: { ...adminStyles.button, ...adminStyles.buttonSecondary },
              disabled: addingUser
            }, "Cancel"),
            React.createElement("button", {
              type: "submit",
              style: { ...adminStyles.button, ...adminStyles.buttonSuccess },
              disabled: addingUser
            }, addingUser ? "Adding..." : "Add User")
          )
        )
      )
    );
  };

  // Edit User Modal Component
  const EditUserModal = () => {
    if (!showEditUserModal || !selectedUser) return null;

    return React.createElement("div", { style: adminStyles.modalOverlay },
      React.createElement("div", { style: adminStyles.modal },
        React.createElement("div", { style: adminStyles.modalHeader },
          React.createElement("h2", { style: adminStyles.modalTitle }, `Edit User: ${selectedUser.name}`),
          React.createElement("button", {
            style: adminStyles.closeButton,
            onClick: () => setShowEditUserModal(false),
            disabled: editingUser
          }, "×")
        ),

        React.createElement("form", { onSubmit: handleSubmitEditUser },
          React.createElement("div", { style: adminStyles.formGroup },
            React.createElement("label", { style: adminStyles.label }, "Full Name *"),
            React.createElement("input", {
              type: "text",
              value: editUser.name,
              onChange: (e) => handleEditUserChange("name", e.target.value),
              style: adminStyles.formInput,
              required: true,
              disabled: editingUser
            })
          ),

          React.createElement("div", { style: adminStyles.formGroup },
            React.createElement("label", { style: adminStyles.label }, "Email Address *"),
            React.createElement("input", {
              type: "email",
              value: editUser.email,
              onChange: (e) => handleEditUserChange("email", e.target.value),
              style: adminStyles.formInput,
              required: true,
              disabled: editingUser
            })
          ),

          React.createElement("div", { style: adminStyles.formGroup },
            React.createElement("label", { style: adminStyles.label }, "Role"),
            React.createElement("select", {
              value: editUser.role,
              onChange: (e) => handleEditUserChange("role", e.target.value),
              style: adminStyles.formSelect,
              disabled: editingUser
            },
              React.createElement("option", { value: "user" }, "User"),
              React.createElement("option", { value: "admin" }, "Admin")
            )
          ),

          React.createElement("div", { style: adminStyles.formGroup },
            React.createElement("div", { style: adminStyles.checkboxGroup },
              React.createElement("input", {
                type: "checkbox",
                checked: editUser.isActive,
                onChange: (e) => handleEditUserChange("isActive", e.target.checked),
                style: { ...adminStyles.formInput, ...adminStyles.checkbox },
                disabled: editingUser
              }),
              React.createElement("label", { style: adminStyles.label }, "Active User")
            )
          ),

          React.createElement("div", { style: adminStyles.formGroup },
            React.createElement("label", { style: adminStyles.label }, "Notes"),
            React.createElement("textarea", {
              value: editUser.notes,
              onChange: (e) => handleEditUserChange("notes", e.target.value),
              style: adminStyles.formTextarea,
              placeholder: "Additional notes about this user...",
              disabled: editingUser
            })
          ),

          React.createElement("div", { style: adminStyles.modalActions },
            React.createElement("button", {
              type: "button",
              onClick: () => setShowEditUserModal(false),
              style: { ...adminStyles.button, ...adminStyles.buttonSecondary },
              disabled: editingUser
            }, "Cancel"),
            React.createElement("button", {
              type: "submit",
              style: { ...adminStyles.button, ...adminStyles.buttonPrimary },
              disabled: editingUser
            }, editingUser ? "Saving..." : "Save Changes")
          )
        )
      )
    );
  };

  if (loading && users.length === 0) {
    return React.createElement("div", { style: adminStyles.loading }, "Loading users...");
  }

  return React.createElement("div", { style: adminStyles.container },
    React.createElement("div", { style: adminStyles.header },
      React.createElement("h1", { style: adminStyles.title }, "👥 User Management"),
      React.createElement("div", { style: { display: "flex", gap: "1rem" } },
        React.createElement("button", {
          style: { ...adminStyles.button, ...adminStyles.buttonSecondary },
          onClick: onBack
        }, "← Back to Library"),
        React.createElement("button", {
          style: { ...adminStyles.button, ...adminStyles.buttonSuccess },
          onClick: handleAddUser
        }, "➕ Add New User")
      )
    ),

    error && React.createElement("div", { style: adminStyles.error }, error),

    // Statistics Cards
    React.createElement("div", { style: adminStyles.statsGrid },
      React.createElement("div", { style: adminStyles.statCard },
        React.createElement("div", { style: adminStyles.statLabel }, "Total Users"),
        React.createElement("div", { style: adminStyles.statNumber }, stats.totalUsers || 0)
      ),
      React.createElement("div", { style: adminStyles.statCard },
        React.createElement("div", { style: adminStyles.statLabel }, "Active Users"),
        React.createElement("div", { style: adminStyles.statNumber }, stats.activeUsers || 0)
      ),
      React.createElement("div", { style: adminStyles.statCard },
        React.createElement("div", { style: adminStyles.statLabel }, "Admins"),
        React.createElement("div", { style: adminStyles.statNumber }, stats.adminUsers || 0)
      ),
      React.createElement("div", { style: adminStyles.statCard },
        React.createElement("div", { style: adminStyles.statLabel }, "Recent Registrations"),
        React.createElement("div", { style: adminStyles.statNumber }, stats.recentRegistrations || 0)
      )
    ),

    // Filters
    React.createElement("div", { style: adminStyles.filters },
      React.createElement("input", {
        type: "text",
        placeholder: "Search users...",
        value: filters.search,
        onChange: (e) => handleFilterChange("search", e.target.value),
        style: adminStyles.input
      }),
      React.createElement("select", {
        value: filters.role,
        onChange: (e) => handleFilterChange("role", e.target.value),
        style: adminStyles.select
      },
        React.createElement("option", { value: "all" }, "All Roles"),
        React.createElement("option", { value: "admin" }, "Admins"),
        React.createElement("option", { value: "user" }, "Users")
      ),
      React.createElement("select", {
        value: filters.status,
        onChange: (e) => handleFilterChange("status", e.target.value),
        style: adminStyles.select
      },
        React.createElement("option", { value: "all" }, "All Status"),
        React.createElement("option", { value: "active" }, "Active"),
        React.createElement("option", { value: "inactive" }, "Inactive")
      )
    ),

    // Users Table
    React.createElement("div", { style: adminStyles.table },
      React.createElement("div", { style: adminStyles.tableHeader },
        React.createElement("div", { style: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 2fr" } },
          React.createElement("span", null, "User"),
          React.createElement("span", null, "Role"),
          React.createElement("span", null, "Status"),
          React.createElement("span", null, "Borrowed"),
          React.createElement("span", null, "Penalties"),
          React.createElement("span", null, "Actions")
        )
      ),

      loading ? (
        React.createElement("div", { style: adminStyles.loading }, "Loading users...")
      ) : users.length === 0 ? (
        React.createElement("div", { style: { padding: "2rem", textAlign: "center", color: "#718096" } }, 
          "No users found matching your criteria."
        )
      ) : (
        users.map(user => 
          React.createElement("div", { 
            key: user._id, 
            style: { ...adminStyles.tableRow, display: "block" }
          },
            React.createElement("div", { 
              style: { 
                display: "grid", 
                gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 2fr",
                alignItems: "center"
              } 
            },
              React.createElement("div", { style: adminStyles.tableCell },
                React.createElement("div", { style: { fontWeight: "600", marginBottom: "0.25rem" } }, user.name),
                React.createElement("div", { style: { color: "#718096", fontSize: "0.9rem", marginBottom: "0.25rem" } }, user.email),
                React.createElement("div", { style: { color: "#718096", fontSize: "0.8rem" } }, 
                  `Joined: ${formatDate(user.createdAt)}`
                )
              ),
              
              React.createElement("div", { style: adminStyles.tableCell },
                React.createElement("span", { 
                  style: getBadgeStyle("role", user.role) 
                }, user.role)
              ),
              
              React.createElement("div", { style: adminStyles.tableCell },
                React.createElement("span", { 
                  style: getBadgeStyle("status", user.isActive) 
                }, user.isActive ? "Active" : "Inactive")
              ),
              
              React.createElement("div", { style: adminStyles.tableCell },
                React.createElement("span", { 
                  style: { 
                    fontWeight: "600",
                    color: user.borrowedBooksCount > 0 ? "#2d3748" : "#718096"
                  } 
                }, user.borrowedBooksCount || 0)
              ),
              
              React.createElement("div", { style: adminStyles.tableCell },
                React.createElement("span", { 
                  style: { 
                    color: user.unpaidPenaltiesTotal > 0 ? "#e53e3e" : "#718096", 
                    fontWeight: "600" 
                  } 
                }, formatCurrency(user.unpaidPenaltiesTotal || 0))
              ),
              
              React.createElement("div", { style: adminStyles.tableCell },
                React.createElement("button", {
                  style: { ...adminStyles.button, ...adminStyles.buttonPrimary },
                  onClick: () => handleViewUser(user._id)
                }, "View"),
                React.createElement("button", {
                  style: { ...adminStyles.button, ...adminStyles.buttonPrimary },
                  onClick: () => handleEditUser(user)
                }, "Edit"),
                React.createElement("button", {
                  style: { ...adminStyles.button, ...adminStyles.buttonWarning },
                  onClick: () => handleResetPassword(user._id, user.name)
                }, "Reset Password")
              )
            )
          )
        )
      )
    ),

    // Add User Modal
    React.createElement(AddUserModal),
    // Edit User Modal
    React.createElement(EditUserModal)
  );
};

export default AdminUsers;