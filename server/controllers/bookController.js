const Book = require("../models/Book");
const User = require("../models/User");

// Penalty rate per day
const PENALTY_RATE = 5;

// Get all books with filtering
const getBooks = async (req, res) => {
  try {
    const { status, search } = req.query;
    let filter = {};
    
    if (status && status !== "all") {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
        { genre: { $regex: search, $options: "i" } }
      ];
    }
    
    const books = await Book.find(filter).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error("Get books error:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
};

// Get library stats
const getStats = async (req, res) => {
  try {
    const totalBooks = await Book.countDocuments();
    const availableBooks = await Book.countDocuments({ available: true });
    const borrowedBooks = await Book.countDocuments({ available: false });
    const overdueBooks = await Book.countDocuments({ 
      dueDate: { $lt: new Date() },
      available: false 
    });
    
    const totalUnpaidPenalties = await Book.aggregate([
      { $match: { penaltyAmount: { $gt: 0 }, penaltyPaid: false } },
      { $group: { _id: null, total: { $sum: "$penaltyAmount" } } }
    ]);
    
    const totalPaidPenalties = await Book.aggregate([
      { $match: { penaltyPaid: true } },
      { $group: { _id: null, total: { $sum: "$penaltyAmount" } } }
    ]);
    
    res.json({
      totalBooks,
      availableBooks,
      borrowedBooks,
      overdueBooks,
      totalUnpaidPenalties: totalUnpaidPenalties[0]?.total || 0,
      totalPaidPenalties: totalPaidPenalties[0]?.total || 0
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};

// Add new book
const createBook = async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    console.error("Create book error:", error);
    if (error.code === 11000) {
      res.status(400).json({ error: "Book with this ISBN already exists" });
    } else {
      res.status(400).json({ error: "Failed to create book" });
    }
  }
};

// Update book
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json(book);
  } catch (error) {
    console.error("Update book error:", error);
    res.status(400).json({ error: "Failed to update book" });
  }
};

// Delete book
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete book error:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
};

// Borrow book
const borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (!book.available) return res.status(400).json({ error: "Book already borrowed" });
    
    const borrowedDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);
    
    const currentUser = await User.findById(req.user.userId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }
    
    book.available = false;
    book.borrower = currentUser.name;
    book.borrowerEmail = currentUser.email;
    book.borrowerId = currentUser._id;
    book.borrowedDate = borrowedDate;
    book.dueDate = dueDate;
    book.status = "borrowed";
    await book.save();
    
    res.json(book);
  } catch (error) {
    console.error("Borrow book error:", error);
    res.status(400).json({ error: "Failed to borrow book" });
  }
};

// Return book
const returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: "Book not found" });
    if (book.available) return res.status(400).json({ error: "Book is not borrowed" });
    
    const returnDate = new Date();
    const daysOverdue = Math.max(0, Math.ceil((returnDate - book.dueDate) / (1000 * 60 * 60 * 24)));
    const penaltyAmount = daysOverdue * PENALTY_RATE;
    
    book.available = true;
    book.borrower = null;
    book.borrowerEmail = null;
    book.borrowerId = null;
    book.borrowedDate = null;
    book.dueDate = null;
    book.returnDate = returnDate;
    book.daysOverdue = daysOverdue;
    book.penaltyAmount = penaltyAmount;
    book.penaltyPaid = false;
    book.status = "returned";
    await book.save();
    
    res.json(book);
  } catch (error) {
    console.error("Return book error:", error);
    res.status(400).json({ error: "Failed to return book" });
  }
};

// Get books borrowed by current user
const getMyBorrowedBooks = async (req, res) => {
  try {
    const borrowedBooks = await Book.find({ 
      borrowerId: req.user.userId,
      available: false 
    }).sort({ borrowedDate: -1 });
    
    res.json(borrowedBooks);
  } catch (error) {
    console.error("Get my borrowed books error:", error);
    res.status(500).json({ error: "Failed to fetch borrowed books" });
  }
};

module.exports = {
  getBooks,
  getStats,
  createBook,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
  getMyBorrowedBooks
};