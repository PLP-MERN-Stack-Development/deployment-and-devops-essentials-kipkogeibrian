import React, { useState, useEffect } from "react";

const booksStyles = {
  container: {
    padding: "1.5rem",
    background: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  title: {
    marginBottom: "1.5rem",
    color: "#4a5568",
    borderBottom: "2px solid #e2e8f0",
    paddingBottom: "0.5rem"
  },
  error: {
    background: "#fed7d7",
    color: "#742a2a",
    padding: "0.75rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    border: "1px solid #feb2b2"
  },
  loading: {
    textAlign: "center",
    padding: "2rem",
    color: "#718096"
  },
  booksGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "1rem"
  },
  bookCard: {
    border: "1px solid #e2e8f0",
    borderRadius: "8px",
    padding: "1rem",
    background: "#f7fafc"
  },
  bookTitle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#2d3748"
  },
  bookAuthor: {
    color: "#4a5568",
    marginBottom: "0.5rem"
  },
  bookDetails: {
    fontSize: "0.875rem",
    color: "#718096"
  },
  statusAvailable: {
    color: "#38a169",
    fontWeight: "bold"
  },
  statusBorrowed: {
    color: "#e53e3e",
    fontWeight: "bold"
  }
};

function BooksList() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");
      
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      
      // Try multiple possible token storage keys
      const token = localStorage.getItem("token") || 
                    localStorage.getItem("accessToken") ||
                    localStorage.getItem("authToken");
      
      console.log("Fetching books with token:", token ? "Token found" : "No token found");
      
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const response = await fetch(`${API_BASE}/books`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Books API Error Response:", errorData);
        
        if (response.status === 401 || response.status === 403) {
          throw new Error("Authentication failed. Please log in again.");
        }
        throw new Error(errorData.error || `Failed to fetch books. Status: ${response.status}`);
      }

      const booksData = await response.json();
      console.log("Books fetched successfully:", booksData);
      setBooks(booksData);

    } catch (error) {
      console.error("Error fetching books:", error);
      
      let errorMessage = "Failed to load books. Please try again.";
      
      if (error.message.includes("No authentication token") || error.message.includes("Authentication failed")) {
        errorMessage = "Please log in to view books.";
      } else if (error.message.includes("401") || error.message.includes("403")) {
        errorMessage = "Authentication failed. Please log in again.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const refreshBooks = () => {
    fetchBooks();
  };

  if (loading) {
    return React.createElement("div", { style: booksStyles.container },
      React.createElement("h2", { style: booksStyles.title }, "Books Library"),
      React.createElement("div", { style: booksStyles.loading }, "Loading books...")
    );
  }

  if (error) {
    return React.createElement("div", { style: booksStyles.container },
      React.createElement("h2", { style: booksStyles.title }, "Books Library"),
      React.createElement("div", { style: booksStyles.error }, error),
      React.createElement("button", { 
        onClick: refreshBooks,
        style: {
          padding: "0.5rem 1rem",
          background: "#667eea",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer"
        }
      }, "Retry")
    );
  }

  return React.createElement("div", { style: booksStyles.container },
    React.createElement("div", { 
      style: { 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "1.5rem" 
      } 
    },
      React.createElement("h2", { style: booksStyles.title }, `Books Library (${books.length})`),
      React.createElement("button", { 
        onClick: refreshBooks,
        style: {
          padding: "0.5rem 1rem",
          background: "#48bb78",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "0.875rem"
        }
      }, "Refresh")
    ),
    
    books.length === 0 ? 
      React.createElement("div", { style: booksStyles.loading }, "No books found in the library.") :
      React.createElement("div", { style: booksStyles.booksGrid },
        books.map(book => 
          React.createElement("div", { 
            key: book._id || book.id, 
            style: booksStyles.bookCard 
          },
            React.createElement("div", { style: booksStyles.bookTitle }, book.title),
            React.createElement("div", { style: booksStyles.bookAuthor }, `by ${book.author}`),
            React.createElement("div", { style: booksStyles.bookDetails },
              book.isbn && `ISBN: ${book.isbn}`
            ),
            React.createElement("div", { style: booksStyles.bookDetails },
              book.publishedYear && `Year: ${book.publishedYear}`
            ),
            React.createElement("div", { style: booksStyles.bookDetails },
              book.genre && `Genre: ${book.genre}`
            ),
            React.createElement("div", { 
              style: book.available ? booksStyles.statusAvailable : booksStyles.statusBorrowed 
            },
              book.available ? "Available" : "Borrowed"
            )
          )
        )
      )
  );
}

export default BooksList;