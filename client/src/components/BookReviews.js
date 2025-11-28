import React, { useState } from "react";

const reviewStyles = {
  container: {
    marginTop: "1rem",
    padding: "1rem",
    background: "#f7fafc",
    borderRadius: "8px"
  },
  title: {
    marginBottom: "0.5rem",
    color: "#4a5568"
  },
  reviewForm: {
    marginBottom: "1rem"
  },
  textarea: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #e2e8f0",
    borderRadius: "4px",
    marginBottom: "0.5rem",
    resize: "vertical"
  },
  rating: {
    display: "flex",
    gap: "0.25rem",
    marginBottom: "0.5rem"
  },
  star: {
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#e2e8f0"
  },
  starActive: {
    color: "#f6ad55"
  },
  reviewItem: {
    background: "white",
    padding: "0.75rem",
    marginBottom: "0.5rem",
    borderRadius: "4px",
    border: "1px solid #e2e8f0"
  },
  reviewHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "0.25rem"
  }
};

function BookReviews({ bookId, reviews = [] }) {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmitReview = (e) => {
    e.preventDefault();
    // In real app, send to backend
    console.log("Review submitted:", { bookId, rating, comment });
    setShowForm(false);
    setRating(0);
    setComment("");
  };

  const StarRating = ({ currentRating, onRate }) => {
    return React.createElement("div", { style: reviewStyles.rating },
      [1, 2, 3, 4, 5].map(star => 
        React.createElement("span", {
          key: star,
          style: {
            ...reviewStyles.star,
            ...(star <= currentRating ? reviewStyles.starActive : {})
          },
          onClick: () => onRate(star),
          onMouseEnter: () => {/* Add hover effect */}
        }, "⭐")
      )
    );
  };

  return React.createElement("div", { style: reviewStyles.container },
    React.createElement("h4", { style: reviewStyles.title }, "📝 Reviews"),
    
    !showForm ? 
      React.createElement("button", {
        onClick: () => setShowForm(true),
        style: { 
          background: "#667eea", 
          color: "white", 
          border: "none", 
          padding: "0.5rem 1rem", 
          borderRadius: "4px",
          cursor: "pointer"
        }
      }, "Add Review")
    :
      React.createElement("form", { onSubmit: handleSubmitReview, style: reviewStyles.reviewForm },
        React.createElement(StarRating, {
          currentRating: rating,
          onRate: setRating
        }),
        React.createElement("textarea", {
          placeholder: "Write your review...",
          value: comment,
          onChange: (e) => setComment(e.target.value),
          style: reviewStyles.textarea,
          rows: 3,
          required: true
        }),
        React.createElement("div", { style: { display: "flex", gap: "0.5rem" } },
          React.createElement("button", { 
            type: "submit",
            style: { 
              background: "#48bb78", 
              color: "white", 
              border: "none", 
              padding: "0.5rem 1rem", 
              borderRadius: "4px",
              cursor: "pointer"
            }
          }, "Submit"),
          React.createElement("button", {
            type: "button",
            onClick: () => setShowForm(false),
            style: { 
              background: "#a0aec0", 
              color: "white", 
              border: "none", 
              padding: "0.5rem 1rem", 
              borderRadius: "4px",
              cursor: "pointer"
            }
          }, "Cancel")
        )
      ),
    
    reviews.map((review, index) => 
      React.createElement("div", { key: index, style: reviewStyles.reviewItem },
        React.createElement("div", { style: reviewStyles.reviewHeader },
          React.createElement("strong", null, review.user),
          React.createElement("span", null, "⭐".repeat(review.rating))
        ),
        React.createElement("p", { style: { margin: 0 } }, review.comment)
      )
    )
  );
}

export default BookReviews;
