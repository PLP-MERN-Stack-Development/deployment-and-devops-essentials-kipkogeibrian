import React, { useState, useEffect } from "react";

const UserDetail = ({ userId, onBack }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(false);

  const [editUser, setEditUser] = useState({
    name: "",
    email: "",
    role: "user",
    isActive: true,
    notes: ""
  });

  const userDetailStyles = {
    container: {
      padding: "2rem",
      maxWidth: "1000px",
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
      fontSize: "1.8rem",
      margin: 0
    },
    backButton: {
      padding: "0.5rem 1rem",
      background: "#718096",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      textDecoration: "none"
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "2rem",
      marginBottom: "2rem"
    },
    card: {
      background: "white",
      padding: "1.5rem",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      border: "1px solid #e2e8f0"
    },
    cardTitle: {
      fontSize: "1.2rem",
      fontWeight: "600",
      marginBottom: "1rem",
      color: "#2d3748",
      borderBottom: "1px solid #e2e8f0",
      paddingBottom: "0.5rem"
    },
    userInfo: {
      display: "grid",
      gap: "1rem"
    },
    infoRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0.5rem 0",
      borderBottom: "1px solid #f7fafc"
    },
    infoLabel: {
      fontWeight: "600",
      color: "#4a5568"
    },
    infoValue: {
      color: "#718096"
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
    statsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "1rem",
      marginBottom: "1.5rem"
    },
    statItem: {
      textAlign: "center",
      padding: "1rem",
      background: "#f7fafc",
      borderRadius: "4px"
    },
    statNumber: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#2d3748"
    },
    statLabel: {
      color: "#718096",
      fontSize: "0.8rem"
    },
    section: {
      marginBottom: "2rem"
    },
    bookList: {
      maxHeight: "300px",
      overflowY: "auto"
    },
    bookItem: {
      padding: "0.75rem",
      borderBottom: "1px solid #e2e8f0"
    },
    paymentItem: {
      padding: "0.75rem",
      borderBottom: "1px solid #e2e8f0"
    },
    buttonGroup: {
      display: "flex",
      gap: "0.5rem",
      marginTop: "1rem"
    },
    button: {
      padding: "0.5rem 1rem",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "0.9rem"
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
      fontSize: "1.3rem"
    },
    closeButton: {
      background: "none",
      border: "none",
      fontSize: "1.5rem",
      cursor: "pointer",
      color: "#718096"
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
    emailStatus: {
      padding: "0.75rem",
      borderRadius: "4px",
      marginBottom: "1rem",
      textAlign: "center"
    },
    emailSuccess: {
      background: "#c6f6d5",
      color: "#276749",
      border: "1px solid #48bb78"
    },
    emailWarning: {
      background: "#fefcbf",
      color: "#744210",
      border: "1px solid #ecc94b"
    },
    temporaryPassword: {
      background: "#edf2f7",
      padding: "1rem",
      borderRadius: "4px",
      margin: "1rem 0",
      textAlign: "center",
      fontFamily: "monospace",
      fontSize: "1.1rem",
      fontWeight: "bold",
      border: "2px dashed #cbd5e0"
    },
    copyButton: {
      background: "#4299e1",
      color: "white",
      border: "none",
      padding: "0.5rem 1rem",
      borderRadius: "4px",
      cursor: "pointer",
      marginTop: "0.5rem",
      fontSize: "0.9rem"
    }
  };

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(`/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("User not found");
        } else if (response.status === 403) {
          throw new Error("Access denied. Admin privileges required.");
        } else {
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }
      }

      const userData = await response.json();
      setUserData(userData);
      setError("");
    } catch (error) {
      console.error("Error loading user data:", error);
      setError("Failed to load user data: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getBadgeStyle = (type, value) => {
    const baseStyle = userDetailStyles.badge;
    if (type === "role") {
      return value === "admin" 
        ? { ...baseStyle, ...userDetailStyles.badgeAdmin }
        : { ...baseStyle, ...userDetailStyles.badgeUser };
    }
    if (type === "status") {
      return value 
        ? { ...baseStyle, ...userDetailStyles.badgeActive }
        : { ...baseStyle, ...userDetailStyles.badgeInactive };
    }
    return baseStyle;
  };

  const handleEditUser = () => {
    if (userData && userData.user) {
      setEditUser({
        name: userData.user.name,
        email: userData.user.email,
        role: userData.user.role,
        isActive: userData.user.isActive,
        notes: userData.user.notes || ""
      });
      setShowEditModal(true);
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
      const response = await fetch(`/api/admin/users/${userId}`, {
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

      // Close modal and refresh user data
      setShowEditModal(false);
      await loadUserData();
      
      alert(`User "${editUser.name}" updated successfully!`);
      
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user: " + error.message);
    } finally {
      setEditingUser(false);
    }
  };

  const handleResetPassword = () => {
    setShowResetPasswordModal(true);
  };

  const handleConfirmResetPassword = async () => {
    setResettingPassword(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok) {
        if (result.emailSent) {
          alert(`✅ Password reset successfully for ${userData.user.name}!\n\nA temporary password has been sent to their email address: ${userData.user.email}`);
        } else {
          alert(`✅ Password reset successfully for ${userData.user.name}!\n\nTemporary password: ${result.temporaryPassword}\n\nPlease provide this password to the user manually as the email could not be sent.`);
        }
        setShowResetPasswordModal(false);
      } else {
        throw new Error(result.error || 'Failed to reset password');
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("❌ Failed to reset password: " + error.message);
    } finally {
      setResettingPassword(false);
    }
  };

  const handleEditUserChange = (field, value) => {
    setEditUser(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Temporary password copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  // Reset Password Modal
  const ResetPasswordModal = () => {
    if (!showResetPasswordModal) return null;

    return React.createElement("div", { style: userDetailStyles.modalOverlay },
      React.createElement("div", { style: userDetailStyles.modal },
        React.createElement("div", { style: userDetailStyles.modalHeader },
          React.createElement("h2", { style: userDetailStyles.modalTitle }, "🔐 Reset Password"),
          React.createElement("button", {
            style: userDetailStyles.closeButton,
            onClick: () => setShowResetPasswordModal(false),
            disabled: resettingPassword
          }, "×")
        ),

        React.createElement("div", null,
          React.createElement("p", { style: { marginBottom: "1rem" } }, 
            `Are you sure you want to reset the password for ${userData?.user?.name}?`
          ),
          React.createElement("div", { 
            style: { 
              ...userDetailStyles.emailStatus, 
              ...userDetailStyles.emailWarning 
            } 
          },
            React.createElement("strong", null, "📧 Email will be sent to:"),
            React.createElement("div", { style: { fontFamily: "monospace", marginTop: "0.5rem" } }, 
              userData?.user?.email
            )
          ),
          React.createElement("div", { 
            style: { 
              background: "#fffaf0", 
              padding: "1rem", 
              borderRadius: "4px", 
              border: "1px solid #fed7d7",
              fontSize: "0.9rem",
              color: "#744210"
            } 
          },
            React.createElement("strong", null, "⚠️ What happens next:"),
            React.createElement("ul", { style: { margin: "0.5rem 0", paddingLeft: "1.5rem" } },
              React.createElement("li", null, "A temporary password will be generated"),
              React.createElement("li", null, "It will be emailed to the user"),
              React.createElement("li", null, "User must change password on next login"),
              React.createElement("li", null, "Email includes security instructions")
            )
          )
        ),

        React.createElement("div", { style: userDetailStyles.modalActions },
          React.createElement("button", {
            style: { ...userDetailStyles.button, ...userDetailStyles.buttonSecondary },
            onClick: () => setShowResetPasswordModal(false),
            disabled: resettingPassword
          }, "Cancel"),
          React.createElement("button", {
            style: { 
              ...userDetailStyles.button, 
              ...userDetailStyles.buttonWarning,
              background: resettingPassword ? "#a0aec0" : "#ed8936"
            },
            onClick: handleConfirmResetPassword,
            disabled: resettingPassword
          }, resettingPassword ? "🔄 Sending Email..." : "📧 Reset & Send Email")
        )
      )
    );
  };

  // Edit User Modal
  const EditUserModal = () => {
    if (!showEditModal) return null;

    return React.createElement("div", { style: userDetailStyles.modalOverlay },
      React.createElement("div", { style: userDetailStyles.modal },
        React.createElement("div", { style: userDetailStyles.modalHeader },
          React.createElement("h2", { style: userDetailStyles.modalTitle }, "✏️ Edit User"),
          React.createElement("button", {
            style: userDetailStyles.closeButton,
            onClick: () => setShowEditModal(false),
            disabled: editingUser
          }, "×")
        ),

        React.createElement("form", { onSubmit: handleSubmitEditUser },
          React.createElement("div", { style: userDetailStyles.formGroup },
            React.createElement("label", { style: userDetailStyles.label }, "Full Name *"),
            React.createElement("input", {
              type: "text",
              value: editUser.name,
              onChange: (e) => handleEditUserChange("name", e.target.value),
              style: userDetailStyles.formInput,
              required: true,
              disabled: editingUser
            })
          ),

          React.createElement("div", { style: userDetailStyles.formGroup },
            React.createElement("label", { style: userDetailStyles.label }, "Email Address *"),
            React.createElement("input", {
              type: "email",
              value: editUser.email,
              onChange: (e) => handleEditUserChange("email", e.target.value),
              style: userDetailStyles.formInput,
              required: true,
              disabled: editingUser
            })
          ),

          React.createElement("div", { style: userDetailStyles.formGroup },
            React.createElement("label", { style: userDetailStyles.label }, "Role"),
            React.createElement("select", {
              value: editUser.role,
              onChange: (e) => handleEditUserChange("role", e.target.value),
              style: userDetailStyles.formSelect,
              disabled: editingUser
            },
              React.createElement("option", { value: "user" }, "👤 User"),
              React.createElement("option", { value: "admin" }, "👑 Admin")
            )
          ),

          React.createElement("div", { style: userDetailStyles.formGroup },
            React.createElement("div", { style: userDetailStyles.checkboxGroup },
              React.createElement("input", {
                type: "checkbox",
                checked: editUser.isActive,
                onChange: (e) => handleEditUserChange("isActive", e.target.checked),
                style: { ...userDetailStyles.formInput, ...userDetailStyles.checkbox },
                disabled: editingUser
              }),
              React.createElement("label", { style: userDetailStyles.label }, "✅ Active User")
            )
          ),

          React.createElement("div", { style: userDetailStyles.formGroup },
            React.createElement("label", { style: userDetailStyles.label }, "📝 Notes"),
            React.createElement("textarea", {
              value: editUser.notes,
              onChange: (e) => handleEditUserChange("notes", e.target.value),
              style: userDetailStyles.formTextarea,
              placeholder: "Additional notes about this user...",
              disabled: editingUser
            })
          ),

          React.createElement("div", { style: userDetailStyles.modalActions },
            React.createElement("button", {
              type: "button",
              onClick: () => setShowEditModal(false),
              style: { ...userDetailStyles.button, ...userDetailStyles.buttonSecondary },
              disabled: editingUser
            }, "Cancel"),
            React.createElement("button", {
              type: "submit",
              style: { 
                ...userDetailStyles.button, 
                ...userDetailStyles.buttonPrimary,
                background: editingUser ? "#a0aec0" : "#4299e1"
              },
              disabled: editingUser
            }, editingUser ? "💾 Saving..." : "💾 Save Changes")
          )
        )
      )
    );
  };

  if (loading) {
    return React.createElement("div", { style: userDetailStyles.loading }, 
      React.createElement("div", null, "🔄 Loading user data...")
    );
  }

  if (!userData) {
    return React.createElement("div", { style: userDetailStyles.error }, 
      error || "❌ User not found"
    );
  }

  const { user, borrowedBooks = [], paymentHistory = [], unpaidPenalties = [], stats = {} } = userData;

  return React.createElement("div", { style: userDetailStyles.container },
    React.createElement("div", { style: userDetailStyles.header },
      React.createElement("h1", { style: userDetailStyles.title }, 
        `👤 ${user.name}`
      ),
      React.createElement("button", {
        style: userDetailStyles.backButton,
        onClick: onBack
      }, "← Back to Users")
    ),

    error && React.createElement("div", { style: userDetailStyles.error }, error),

    React.createElement("div", { style: userDetailStyles.grid },
      // User Information Card
      React.createElement("div", { style: userDetailStyles.card },
        React.createElement("h2", { style: userDetailStyles.cardTitle }, "📋 User Information"),
        React.createElement("div", { style: userDetailStyles.userInfo },
          React.createElement("div", { style: userDetailStyles.infoRow },
            React.createElement("span", { style: userDetailStyles.infoLabel }, "👤 Name:"),
            React.createElement("span", { style: userDetailStyles.infoValue }, user.name)
          ),
          React.createElement("div", { style: userDetailStyles.infoRow },
            React.createElement("span", { style: userDetailStyles.infoLabel }, "📧 Email:"),
            React.createElement("span", { style: userDetailStyles.infoValue }, user.email)
          ),
          React.createElement("div", { style: userDetailStyles.infoRow },
            React.createElement("span", { style: userDetailStyles.infoLabel }, "🎭 Role:"),
            React.createElement("span", { 
              style: getBadgeStyle("role", user.role) 
            }, user.role === "admin" ? "👑 Admin" : "👤 User")
          ),
          React.createElement("div", { style: userDetailStyles.infoRow },
            React.createElement("span", { style: userDetailStyles.infoLabel }, "🔔 Status:"),
            React.createElement("span", { 
              style: getBadgeStyle("status", user.isActive) 
            }, user.isActive ? "✅ Active" : "❌ Inactive")
          ),
          React.createElement("div", { style: userDetailStyles.infoRow },
            React.createElement("span", { style: userDetailStyles.infoLabel }, "🕒 Last Login:"),
            React.createElement("span", { style: userDetailStyles.infoValue }, 
              formatDate(user.lastLogin)
            )
          ),
          React.createElement("div", { style: userDetailStyles.infoRow },
            React.createElement("span", { style: userDetailStyles.infoLabel }, "🔢 Login Count:"),
            React.createElement("span", { style: userDetailStyles.infoValue }, user.loginCount || 0)
          ),
          React.createElement("div", { style: userDetailStyles.infoRow },
            React.createElement("span", { style: userDetailStyles.infoLabel }, "📅 Account Created:"),
            React.createElement("span", { style: userDetailStyles.infoValue }, formatDate(user.createdAt))
          ),
          user.notes && React.createElement("div", { style: userDetailStyles.infoRow },
            React.createElement("span", { style: userDetailStyles.infoLabel }, "📝 Notes:"),
            React.createElement("span", { style: userDetailStyles.infoValue }, user.notes)
          )
        ),
        React.createElement("div", { style: userDetailStyles.buttonGroup },
          React.createElement("button", {
            style: { ...userDetailStyles.button, ...userDetailStyles.buttonPrimary },
            onClick: handleEditUser
          }, "✏️ Edit User"),
          React.createElement("button", {
            style: { ...userDetailStyles.button, ...userDetailStyles.buttonWarning },
            onClick: handleResetPassword
          }, "🔐 Reset Password")
        )
      ),

      // User Statistics Card
      React.createElement("div", { style: userDetailStyles.card },
        React.createElement("h2", { style: userDetailStyles.cardTitle }, "📊 User Statistics"),
        React.createElement("div", { style: userDetailStyles.statsGrid },
          React.createElement("div", { style: userDetailStyles.statItem },
            React.createElement("div", { style: userDetailStyles.statNumber }, stats.totalBorrowed || 0),
            React.createElement("div", { style: userDetailStyles.statLabel }, "📚 Books Borrowed")
          ),
          React.createElement("div", { style: userDetailStyles.statItem },
            React.createElement("div", { style: userDetailStyles.statNumber }, stats.totalPayments || 0),
            React.createElement("div", { style: userDetailStyles.statLabel }, "💳 Payments Made")
          ),
          React.createElement("div", { style: userDetailStyles.statItem },
            React.createElement("div", { style: userDetailStyles.statNumber }, formatCurrency(stats.totalPaid || 0)),
            React.createElement("div", { style: userDetailStyles.statLabel }, "💰 Total Paid")
          ),
          React.createElement("div", { style: userDetailStyles.statItem },
            React.createElement("div", { style: userDetailStyles.statNumber }, formatCurrency(stats.totalUnpaid || 0)),
            React.createElement("div", { style: userDetailStyles.statLabel }, "⚠️ Unpaid Penalties")
          )
        )
      )
    ),

    // Currently Borrowed Books
    React.createElement("div", { style: userDetailStyles.section },
      React.createElement("div", { style: userDetailStyles.card },
        React.createElement("h2", { style: userDetailStyles.cardTitle }, 
          `📚 Currently Borrowed Books (${borrowedBooks.length})`
        ),
        borrowedBooks.length === 0 ? (
          React.createElement("p", { style: { color: "#718096", textAlign: "center", padding: "2rem" } }, 
            "📭 No books currently borrowed."
          )
        ) : (
          React.createElement("div", { style: userDetailStyles.bookList },
            borrowedBooks.map(book => 
              React.createElement("div", { 
                key: book._id, 
                style: userDetailStyles.bookItem 
              },
                React.createElement("div", { style: { fontWeight: "600", marginBottom: "0.25rem" } }, book.title),
                React.createElement("div", { style: { color: "#718096", fontSize: "0.9rem", marginBottom: "0.25rem" } }, 
                  `by ${book.author}`
                ),
                React.createElement("div", { style: { color: "#4a5568", fontSize: "0.8rem" } }, 
                  `📅 Due: ${formatDate(book.dueDate)}`
                ),
                book.penaltyAmount > 0 && !book.penaltyPaid && 
                  React.createElement("div", { style: { color: "#e53e3e", fontSize: "0.8rem", fontWeight: "600", marginTop: "0.25rem" } }, 
                    `💸 Penalty: ${formatCurrency(book.penaltyAmount)}`
                  )
              )
            )
          )
        )
      )
    ),

    // Payment History
    React.createElement("div", { style: userDetailStyles.section },
      React.createElement("div", { style: userDetailStyles.card },
        React.createElement("h2", { style: userDetailStyles.cardTitle }, 
          `💳 Payment History (${paymentHistory.length})`
        ),
        paymentHistory.length === 0 ? (
          React.createElement("p", { style: { color: "#718096", textAlign: "center", padding: "2rem" } }, 
            "📭 No payment history."
          )
        ) : (
          React.createElement("div", { style: userDetailStyles.bookList },
            paymentHistory.map(payment => 
              React.createElement("div", { 
                key: payment._id, 
                style: userDetailStyles.paymentItem 
              },
                React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
                  React.createElement("div", { style: { flex: 1 } },
                    React.createElement("div", { style: { fontWeight: "600", marginBottom: "0.25rem" } }, 
                      payment.bookId?.title || "📖 Unknown Book"
                    ),
                    React.createElement("div", { style: { color: "#718096", fontSize: "0.9rem" } }, 
                      `${payment.paymentMethod} • ${formatDate(payment.paymentDate)}`
                    ),
                    payment.transactionId && React.createElement("div", { style: { color: "#a0aec0", fontSize: "0.8rem", fontFamily: "monospace" } }, 
                      `🔢 TXN: ${payment.transactionId}`
                    )
                  ),
                  React.createElement("div", { style: { fontWeight: "600", color: "#48bb78", marginLeft: "1rem" } }, 
                    formatCurrency(payment.amount)
                  )
                )
              )
            )
          )
        )
      )
    ),

    // Unpaid Penalties Section
    unpaidPenalties && unpaidPenalties.length > 0 && React.createElement("div", { style: userDetailStyles.section },
      React.createElement("div", { style: userDetailStyles.card },
        React.createElement("h2", { style: userDetailStyles.cardTitle }, 
          `⚠️ Unpaid Penalties (${unpaidPenalties.length})`
        ),
        React.createElement("div", { style: userDetailStyles.bookList },
          unpaidPenalties.map(book => 
            React.createElement("div", { 
              key: book._id, 
              style: { ...userDetailStyles.bookItem, borderLeft: "4px solid #e53e3e" } 
            },
              React.createElement("div", { style: { fontWeight: "600", marginBottom: "0.25rem" } }, book.title),
              React.createElement("div", { style: { color: "#718096", fontSize: "0.9rem", marginBottom: "0.25rem" } }, 
                `by ${book.author}`
              ),
              React.createElement("div", { style: { color: "#e53e3e", fontSize: "0.9rem", fontWeight: "600" } }, 
                `💸 Amount Due: ${formatCurrency(book.penaltyAmount)}`
              ),
              book.dueDate && React.createElement("div", { style: { color: "#a0aec0", fontSize: "0.8rem" } }, 
                `📅 Due: ${formatDate(book.dueDate)}`
              )
            )
          )
        )
      )
    ),

    // Modals
    React.createElement(ResetPasswordModal),
    React.createElement(EditUserModal)
  );
};

export default UserDetail;