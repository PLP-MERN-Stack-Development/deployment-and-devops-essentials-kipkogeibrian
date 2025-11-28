import React, { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import ProtectedRoute from "./ProtectedRoute";
import { bookAPI, healthCheck } from "../services/api";
import Header from "./Header";
import StatsDashboard from "./StatsDashboard";
import Reports from "./Reports";
import SearchAndFilter from "./SearchAndFilter";
import BookForm from "./BookForm";
import BorrowerInput from "./BorrowerInput";
import BooksTable from "./BooksTable";
import BookList from "./BookList";
import Notifications from "./Notifications";
import AdminUsers from "./AdminUsers";
import UserDetail from "./UserDetail";

const styles = {
  app: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  main: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "2rem",
    position: "relative"
  },
  section: {
    background: "white",
    margin: "2rem 0",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
  },
  viewToggle: {
    display: "flex",
    gap: "1rem",
    margin: "1rem 0",
    justifyContent: "center"
  },
  toggleButton: {
    padding: "0.5rem 1rem",
    border: "2px solid #667eea",
    background: "white",
    color: "#667eea",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s",
    fontSize: "14px",
    fontWeight: "600"
  },
  toggleButtonActive: {
    background: "#667eea",
    color: "white"
  },
  errorMessage: {
    background: "#fed7d7",
    color: "#742a2a",
    padding: "1rem",
    borderRadius: "8px",
    margin: "1rem 0",
    border: "1px solid #feb2b2",
    textAlign: "center"
  },
  adminPanel: {
    background: "white",
    margin: "2rem 0",
    padding: "2rem",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
  },
  adminPanelTitle: {
    marginBottom: "1rem",
    color: "#2d3748",
    fontSize: "1.5rem"
  },
  adminNav: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap"
  },
  adminNavButton: {
    padding: "0.75rem 1.5rem",
    border: "2px solid #667eea",
    background: "white",
    color: "#667eea",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s",
    fontSize: "14px",
    fontWeight: "600",
    textDecoration: "none",
    display: "inline-block"
  },
  adminNavButtonActive: {
    background: "#667eea",
    color: "white"
  }
};

// Enhanced AdminPenalties component
const AdminPenalties = ({ onBack }) => {
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  const styles = {
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
    backButton: {
      padding: "0.5rem 1rem",
      background: "#718096",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer"
    }
  };

  useEffect(() => {
    loadPenalties();
    loadStats();
  }, []);

  const loadPenalties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/penalties', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPenalties(data);
      }
    } catch (error) {
      console.error("Error loading penalties:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/penalties-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading penalty stats:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return React.createElement("div", { style: styles.container },
    React.createElement("div", { style: styles.header },
      React.createElement("h1", { style: styles.title }, "💰 Penalty Management"),
      React.createElement("button", {
        style: styles.backButton,
        onClick: onBack
      }, "← Back to Library")
    ),

    // Statistics Cards
    React.createElement("div", { style: styles.statsGrid },
      React.createElement("div", { style: styles.statCard },
        React.createElement("div", { style: styles.statLabel }, "Total Penalties"),
        React.createElement("div", { style: styles.statNumber }, stats.totalPenalties || 0)
      ),
      React.createElement("div", { style: styles.statCard },
        React.createElement("div", { style: styles.statLabel }, "Total Amount"),
        React.createElement("div", { style: styles.statNumber }, formatCurrency(stats.totalAmount))
      ),
      React.createElement("div", { style: styles.statCard },
        React.createElement("div", { style: styles.statLabel }, "Unpaid Penalties"),
        React.createElement("div", { style: styles.statNumber }, stats.unpaidCount || 0)
      ),
      React.createElement("div", { style: styles.statCard },
        React.createElement("div", { style: styles.statLabel }, "Unpaid Amount"),
        React.createElement("div", { style: styles.statNumber }, formatCurrency(stats.unpaidAmount))
      )
    ),

    React.createElement("div", { style: { textAlign: "center", color: "#718096", padding: "2rem" } }, 
      "Detailed penalty management interface with payment tracking and waiver system - to be fully implemented"
    )
  );
};

// Enhanced AdminReports component
const AdminReports = ({ onBack }) => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});

  const styles = {
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
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
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
    backButton: {
      padding: "0.5rem 1rem",
      background: "#718096",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer"
    },
    reportSection: {
      marginBottom: "2rem"
    },
    reportCard: {
      background: "white",
      padding: "1.5rem",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      border: "1px solid #e2e8f0",
      marginBottom: "1rem"
    }
  };

  useEffect(() => {
    loadReportStats();
  }, []);

  const loadReportStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/admin/reports-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Error loading report stats:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return React.createElement("div", { style: styles.container },
    React.createElement("div", { style: styles.header },
      React.createElement("h1", { style: styles.title }, "📊 Advanced Reports"),
      React.createElement("button", {
        style: styles.backButton,
        onClick: onBack
      }, "← Back to Library")
    ),

    // Statistics Cards
    React.createElement("div", { style: styles.statsGrid },
      React.createElement("div", { style: styles.statCard },
        React.createElement("div", { style: styles.statLabel }, "Monthly Borrows"),
        React.createElement("div", { style: styles.statNumber }, stats.monthlyBorrows || 0)
      ),
      React.createElement("div", { style: styles.statCard },
        React.createElement("div", { style: styles.statLabel }, "Active Users"),
        React.createElement("div", { style: styles.statNumber }, stats.activeUsers || 0)
      ),
      React.createElement("div", { style: styles.statCard },
        React.createElement("div", { style: styles.statLabel }, "Revenue This Month"),
        React.createElement("div", { style: styles.statNumber }, formatCurrency(stats.monthlyRevenue))
      ),
      React.createElement("div", { style: styles.statCard },
        React.createElement("div", { style: styles.statLabel }, "Popular Genres"),
        React.createElement("div", { style: styles.statNumber }, stats.topGenres || 0)
      )
    ),

    // Report Sections
    React.createElement("div", { style: styles.reportSection },
      React.createElement("div", { style: styles.reportCard },
        React.createElement("h3", null, "📈 Usage Analytics"),
        React.createElement("p", null, "Detailed usage patterns and user behavior analytics")
      ),
      React.createElement("div", { style: styles.reportCard },
        React.createElement("h3", null, "📚 Collection Insights"),
        React.createElement("p", null, "Book popularity, genre distribution, and acquisition recommendations")
      ),
      React.createElement("div", { style: styles.reportCard },
        React.createElement("h3", null, "💰 Financial Reports"),
        React.createElement("p", null, "Revenue tracking, penalty collection rates, and financial forecasting")
      )
    )
  );
};

function LibraryApp() {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState({});
  const [borrowerName, setBorrowerName] = useState("");
  const [borrowerEmail, setBorrowerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("checking");
  const [viewMode, setViewMode] = useState("table");
  const [filters, setFilters] = useState({
    search: "",
    status: "all"
  });
  const [error, setError] = useState("");
  // Add state for admin view
  const [currentView, setCurrentView] = useState("main");
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    checkBackendConnection();
    fetchBooks();
    fetchStats();
    
    // Add event listener for admin navigation
    const handleAdminNavigation = (event) => {
      const { view } = event.detail;
      setCurrentView(view);
    };

    window.addEventListener('adminNavigation', handleAdminNavigation);
    
    return () => {
      window.removeEventListener('adminNavigation', handleAdminNavigation);
    };
  }, [filters]);

  const checkBackendConnection = async () => {
    try {
      await healthCheck();
      setConnectionStatus("connected");
      setError("");
    } catch (error) {
      setConnectionStatus("disconnected");
      setError("Backend server is not available. Please make sure the backend is running on port 5000.");
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await bookAPI.getAll(filters);
      setBooks(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Failed to load books from database.");
    }
  };

  const fetchStats = async () => {
    try {
      const response = await bookAPI.getStats();
      setStats(response.data);
      setError("");
    } catch (error) {
      console.error("Error fetching stats:", error);
      setError("Failed to load statistics from database.");
    }
  };

  const addBook = async (bookData) => {
    setLoading(true);
    try {
      await bookAPI.create(bookData);
      await fetchBooks();
      await fetchStats();
      alert("Book added successfully!");
      setError("");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to add book";
      alert(errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const borrowBook = async (bookId) => {
    if (!borrowerName.trim()) {
      alert("Please enter your name first");
      return;
    }
    try {
      await bookAPI.borrow(bookId, {
        borrower: borrowerName,
        borrowerEmail: borrowerEmail
      });
      setBorrowerName("");
      setBorrowerEmail("");
      await fetchBooks();
      await fetchStats();
      alert("Book borrowed successfully! Due in 2 weeks.");
      setError("");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to borrow book";
      alert(errorMsg);
      setError(errorMsg);
    }
  };

  const returnBook = async (bookId) => {
    try {
      const response = await bookAPI.return(bookId);
      const book = response.data;
      await fetchBooks();
      await fetchStats();
      
      if (book.penaltyAmount > 0) {
        alert(`Book returned successfully! Penalty: $${book.penaltyAmount}`);
      } else {
        alert("Book returned successfully!");
      }
      setError("");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to return book";
      alert(errorMsg);
      setError(errorMsg);
    }
  };

  const payPenalty = async (bookId) => {
    try {
      await bookAPI.payPenalty(bookId);
      await fetchBooks();
      await fetchStats();
      alert("Penalty paid successfully!");
      setError("");
    } catch (error) {
      const errorMsg = error.response?.data?.error || "Failed to process payment";
      alert(errorMsg);
      setError(errorMsg);
    }
  };

  const deleteBook = async (bookId) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        await bookAPI.delete(bookId);
        await fetchBooks();
        await fetchStats();
        alert("Book deleted successfully!");
        setError("");
      } catch (error) {
        const errorMsg = error.response?.data?.error || "Failed to delete book";
        alert(errorMsg);
        setError(errorMsg);
      }
    }
  };

  // Add handler for back to main view
  const handleBackToMain = () => {
    setCurrentView("main");
    setSelectedUserId(null);
  };

  // Add handler for back to admin users
  const handleBackToAdminUsers = () => {
    setCurrentView("adminUsers");
    setSelectedUserId(null);
  };

  // Add handler for viewing user detail
  const handleViewUserDetail = (userId) => {
    setSelectedUserId(userId);
    setCurrentView("userDetail");
  };

  // Render different views
  const renderCurrentView = () => {
    switch (currentView) {
      case "adminUsers":
        return React.createElement(AdminUsers, { 
          onViewUser: handleViewUserDetail,
          onBack: handleBackToMain 
        });
      
      case "userDetail":
        return React.createElement(UserDetail, { 
          userId: selectedUserId,
          onBack: handleBackToAdminUsers 
        });
      
      case "adminPenalties":
        return React.createElement(AdminPenalties, { 
          onBack: handleBackToMain 
        });
      
      case "adminReports":
        return React.createElement(AdminReports, { 
          onBack: handleBackToMain 
        });
      
      case "main":
      default:
        return [
          React.createElement(Notifications, { books, key: "notifications" }),
          React.createElement(StatsDashboard, { stats, key: "stats" }),
          React.createElement(Reports, { books, stats, key: "reports" }),
          
          // Add Admin Panel section
          isAdmin && React.createElement("div", { style: styles.adminPanel, key: "adminPanel" },
            React.createElement("h2", { style: styles.adminPanelTitle }, "Admin Panel"),
            React.createElement("div", { style: styles.adminNav },
              React.createElement("button", {
                onClick: () => setCurrentView("adminUsers"),
                style: styles.adminNavButton
              }, "👥 Manage Users"),
              React.createElement("button", {
                onClick: () => setCurrentView("adminPenalties"),
                style: styles.adminNavButton
              }, "💰 Manage Penalties"),
              React.createElement("button", {
                onClick: () => setCurrentView("adminReports"),
                style: styles.adminNavButton
              }, "📊 Advanced Reports")
            )
          ),
          
          React.createElement("div", { style: styles.viewToggle, key: "viewToggle" },
            React.createElement("button", {
              onClick: () => setViewMode("table"),
              style: viewMode === "table" ? { ...styles.toggleButton, ...styles.toggleButtonActive } : styles.toggleButton
            }, "📊 Table View"),
            React.createElement("button", {
              onClick: () => setViewMode("grid"),
              style: viewMode === "grid" ? { ...styles.toggleButton, ...styles.toggleButtonActive } : styles.toggleButton
            }, "🔄 Grid View")
          ),
          
          React.createElement("div", { style: styles.section, key: "search" },
            React.createElement(SearchAndFilter, { 
              filters, 
              onFiltersChange: setFilters 
            })
          ),
          
          React.createElement(ProtectedRoute, { requireAdmin: true, key: "bookForm" },
            React.createElement("div", { style: styles.section },
              React.createElement(BookForm, { onBookAdded: addBook, loading })
            )
          ),
          
          React.createElement("div", { style: styles.section, key: "borrower" },
            React.createElement(BorrowerInput, { 
              borrowerName, 
              setBorrowerName,
              borrowerEmail,
              setBorrowerEmail
            })
          ),
          
          React.createElement("div", { style: styles.section, key: "books" },
            viewMode === "table" 
              ? React.createElement(BooksTable, {
                  books,
                  onBorrow: borrowBook,
                  onReturn: returnBook,
                  onDelete: deleteBook,
                  onPayPenalty: payPenalty,
                  borrowerName
                })
              : React.createElement(BookList, {
                  books,
                  borrowerName,
                  onBorrow: borrowBook,
                  onReturn: returnBook,
                  onDelete: deleteBook,
                  onPayPenalty: payPenalty
                })
          )
        ];
    }
  };

  const currentViewContent = renderCurrentView();

  return React.createElement("div", { style: styles.app },
    React.createElement("main", { style: styles.main },
      error && React.createElement("div", { style: styles.errorMessage },
        React.createElement("strong", null, "Error: "),
        error
      ),
      
      React.createElement(Header, { 
        connectionStatus,
        currentView,
        onBack: currentView !== "main" ? handleBackToMain : null
      }),
      
      Array.isArray(currentViewContent) 
        ? currentViewContent
        : currentViewContent
    )
  );
}

export default LibraryApp;