import React, { useState } from "react";

const formStyles = {
  container: {
    marginBottom: "1rem",
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
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "1rem"
  },
  input: {
    padding: "0.75rem",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    transition: "border-color 0.3s",
    width: "100%",
    boxSizing: "border-box"
  },
  inputFocus: {
    outline: "none",
    borderColor: "#667eea"
  },
  submitBtn: {
    gridColumn: "1 / -1",
    padding: "0.75rem",
    background: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "background 0.3s"
  },
  submitBtnHover: {
    background: "#5a6fd8"
  },
  submitBtnDisabled: {
    background: "#a0aec0",
    cursor: "not-allowed"
  },
  error: {
    gridColumn: "1 / -1",
    background: "#fed7d7",
    color: "#742a2a",
    padding: "0.75rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    border: "1px solid #feb2b2"
  },
  success: {
    gridColumn: "1 / -1",
    background: "#c6f6d5",
    color: "#22543d",
    padding: "0.75rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    border: "1px solid #9ae6b4"
  }
};

function BookForm({ onBookAdded }) {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    publishedYear: "",
    genre: ""
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [focusedField, setFocusedField] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.title.trim() || !formData.author.trim()) {
      setMessage({
        type: "error",
        text: "Title and Author are required fields"
      });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      console.log("Submitting book data to database:", formData);
      
      // Prepare the data for the backend database
      const bookData = {
        title: formData.title.trim(),
        author: formData.author.trim(),
        isbn: formData.isbn.trim() || undefined,
        publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : undefined,
        genre: formData.genre.trim() || undefined,
        available: true,
        status: "available"
      };

      console.log("Sending to MongoDB database via API:", bookData);

      // Make the POST request to add the book to MongoDB
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      const token = localStorage.getItem("token");
      
      // Check if user is authenticated
      if (!token) {
        throw new Error("Please log in to add books to the database");
      }

      const response = await fetch(`${API_BASE}/books`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bookData)
      });

      // Handle different HTTP status codes
      if (response.status === 401) {
        throw new Error("Authentication failed. Please log in again.");
      } else if (response.status === 403) {
        throw new Error("Admin access required to add books.");
      } else if (response.status === 400) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Invalid book data");
      } else if (response.status === 500) {
        throw new Error("Database server error. Please try again later.");
      } else if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newBook = await response.json();
      console.log("Book successfully saved to MongoDB database:", newBook);

      // Show success message
      setMessage({
        type: "success",
        text: `Book "${newBook.title}" successfully Added!`
      });

      // Reset form
      setFormData({
        title: "",
        author: "",
        isbn: "",
        publishedYear: "",
        genre: ""
      });

      // Notify parent component to refresh data from database
      if (onBookAdded) {
        onBookAdded(newBook);
      }

    } catch (error) {
      console.error("Error saving book to database:", error);
      
      // More specific error messages
      let errorMessage = error.message || "Failed to save book to database. Please try again.";
      
      // Handle specific error cases
      if (error.message.includes("Authentication failed") || error.message.includes("Please log in")) {
        errorMessage = "Please log in as admin to add books to the database.";
      } else if (error.message.includes("Admin access required")) {
        errorMessage = "Only administrators can add books to the database.";
      } else if (error.message.includes("ISBN")) {
        errorMessage = "A book with this ISBN already exists in the database.";
      } else if (error.message.includes("Database server error")) {
        errorMessage = "Database connection error. Please check if MongoDB is running.";
      }

      setMessage({
        type: "error",
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: "", text: "" });
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField("");
  };

  const getInputStyle = (fieldName) => {
    const isFocused = focusedField === fieldName;
    return isFocused 
      ? { ...formStyles.input, ...formStyles.inputFocus }
      : formStyles.input;
  };

  const getSubmitStyle = () => {
    const baseStyle = formStyles.submitBtn;
    const isDisabled = loading || !formData.title.trim() || !formData.author.trim();
    
    if (isDisabled) {
      return { ...baseStyle, ...formStyles.submitBtnDisabled };
    }
    
    return baseStyle;
  };

  return React.createElement("div", { style: formStyles.container },
    React.createElement("h2", { style: formStyles.title }, "Add New Book to Database"),
    
    message.text && React.createElement("div", { 
      style: message.type === "error" ? formStyles.error : formStyles.success 
    }, message.text),
    
    React.createElement("form", { onSubmit: handleSubmit, style: formStyles.form },
      React.createElement("input", {
        type: "text",
        name: "title",
        placeholder: "Title *",
        value: formData.title,
        onChange: handleChange,
        onFocus: () => handleFocus("title"),
        onBlur: handleBlur,
        style: getInputStyle("title"),
        required: true,
        disabled: loading
      }),
      
      React.createElement("input", {
        type: "text",
        name: "author",
        placeholder: "Author *",
        value: formData.author,
        onChange: handleChange,
        onFocus: () => handleFocus("author"),
        onBlur: handleBlur,
        style: getInputStyle("author"),
        required: true,
        disabled: loading
      }),
      
      React.createElement("input", {
        type: "text",
        name: "isbn",
        placeholder: "ISBN (optional)",
        value: formData.isbn,
        onChange: handleChange,
        onFocus: () => handleFocus("isbn"),
        onBlur: handleBlur,
        style: getInputStyle("isbn"),
        disabled: loading
      }),
      
      React.createElement("input", {
        type: "number",
        name: "publishedYear",
        placeholder: "Published Year (optional)",
        value: formData.publishedYear,
        onChange: handleChange,
        onFocus: () => handleFocus("publishedYear"),
        onBlur: handleBlur,
        style: getInputStyle("publishedYear"),
        min: "1000",
        max: new Date().getFullYear().toString(),
        disabled: loading
      }),
      
      React.createElement("input", {
        type: "text",
        name: "genre",
        placeholder: "Genre (optional)",
        value: formData.genre,
        onChange: handleChange,
        onFocus: () => handleFocus("genre"),
        onBlur: handleBlur,
        style: getInputStyle("genre"),
        disabled: loading
      }),
      
      React.createElement("button", { 
        type: "submit", 
        disabled: loading || !formData.title.trim() || !formData.author.trim(),
        style: getSubmitStyle()
      }, loading ? "Adding Book..." : "Add Book")
    ),
    
    React.createElement("div", { 
      style: { 
        fontSize: "0.875rem", 
        color: "#718096",
        marginTop: "0.5rem"
      } 
    }, "* Required fields. Please fill!.")
  );
}

export default BookForm;