const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
require("dotenv").config();

// Import models
const User = require("./models/User");
const Book = require("./models/Book");
const Payment = require("./models/Payment");

// Import routes
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");
const adminRoutes = require("./routes/admin");
const paymentRoutes = require("./routes/payments");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000
});
app.use(limiter);

// MongoDB connection - REQUIRED
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI ;
    
    const maskedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log(`🔗 Connecting to MongoDB: ${maskedURI}`);
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    
    // Initialize admin user after successful connection
    await initializeAdmin();
    await initializeSampleBooks();
    
  } catch (error) {
    console.error("❌ MongoDB connection FAILED:", error.message);
    console.error("💥 MongoDB is REQUIRED. Please ensure MongoDB is running.");
    console.error("📖 Check your MongoDB Atlas connection string in .env file");
    console.error("💡 Make sure your password is properly URL encoded");
    process.exit(1);
  }
};

// Initialize admin user
const initializeAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@library.com" });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 12);
      const admin = new User({
        name: "System Administrator",
        email: "admin@library.com",
        password: hashedPassword,
        role: "admin"
      });
      await admin.save();
      console.log("✅ Admin user created: admin@library.com / admin123");
    } else {
      console.log("✅ Admin user already exists");
    }
  } catch (error) {
    console.error("❌ Failed to create admin user:", error);
  }
};

// Initialize sample books
const initializeSampleBooks = async () => {
  try {
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      // Get sample users for borrowing
      const johnUser = await User.findOne({ email: "john@example.com" });
      const janeUser = await User.findOne({ email: "jane@example.com" });
      const testUser = await User.findOne({ email: "test@example.com" });
      
      // Create sample users if they don't exist
      let johnUserId, janeUserId, testUserId;
      
      if (!johnUser) {
        const hashedPassword = await bcrypt.hash("password123", 12);
        const newJohn = new User({
          name: "John Doe",
          email: "john@example.com",
          password: hashedPassword,
          role: "user"
        });
        await newJohn.save();
        johnUserId = newJohn._id;
        console.log("✅ Sample user created: john@example.com");
      } else {
        johnUserId = johnUser._id;
      }
      
      if (!janeUser) {
        const hashedPassword = await bcrypt.hash("password123", 12);
        const newJane = new User({
          name: "Jane Smith",
          email: "jane@example.com",
          password: hashedPassword,
          role: "user"
        });
        await newJane.save();
        janeUserId = newJane._id;
        console.log("✅ Sample user created: jane@example.com");
      } else {
        janeUserId = janeUser._id;
      }

      if (!testUser) {
        const hashedPassword = await bcrypt.hash("password123", 12);
        const newTest = new User({
          name: "Test User",
          email: "test@example.com",
          password: hashedPassword,
          role: "user"
        });
        await newTest.save();
        testUserId = newTest._id;
        console.log("✅ Sample user created: test@example.com");
      } else {
        testUserId = testUser._id;
      }

      const sampleBooks = [
        {
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          isbn: "9780743273565",
          publishedYear: 1925,
          genre: "Fiction",
          available: true,
          status: "available"
        },
        {
          title: "To Kill a Mockingbird",
          author: "Harper Lee", 
          isbn: "9780061120084",
          publishedYear: 1960,
          genre: "Fiction",
          available: false,
          borrower: "John Doe",
          borrowerEmail: "john@example.com",
          borrowerId: johnUserId,
          borrowedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          status: "borrowed"
        },
        {
          title: "1984",
          author: "George Orwell",
          isbn: "9780451524935",
          publishedYear: 1949,
          genre: "Science Fiction",
          available: false,
          borrower: "Jane Smith",
          borrowerEmail: "jane@example.com",
          borrowerId: janeUserId,
          borrowedDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          daysOverdue: 7,
          penaltyAmount: 35,
          status: "overdue"
        },
        {
          title: "Pride and Prejudice",
          author: "Jane Austen",
          isbn: "9780141439518",
          publishedYear: 1813,
          genre: "Romance",
          available: true,
          status: "available"
        },
        {
          title: "The Hobbit",
          author: "J.R.R. Tolkien",
          isbn: "9780547928227",
          publishedYear: 1937,
          genre: "Fantasy",
          available: true,
          status: "available"
        },
        {
          title: "Test Overdue Book for Payment",
          author: "Test Author",
          isbn: "9780000000001",
          publishedYear: 2024,
          genre: "Testing",
          available: false,
          borrower: "Test User",
          borrowerEmail: "test@example.com",
          borrowerId: testUserId,
          borrowedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          dueDate: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
          daysOverdue: 16,
          penaltyAmount: 80,
          penaltyPaid: false,
          status: "overdue"
        }
      ];
      
      await Book.insertMany(sampleBooks);
      console.log(`✅ ${sampleBooks.length} sample books created`);
      console.log("🧪 Test overdue book added for payment testing:");
      console.log("   - Title: Test Overdue Book for Payment");
      console.log("   - Borrower: test@example.com / password123");
      console.log("   - Penalty: $80 (16 days overdue)");
      console.log("   - ISBN: 9780000000001");
    } else {
      console.log(`✅ ${bookCount} books already exist in database`);
    }
  } catch (error) {
    console.error("❌ Failed to create sample books:", error);
  }
};

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api", bookRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", paymentRoutes);

// Initialize database connection
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 Library API: http://localhost:${PORT}/api`);
  console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
  console.log(`💾 Database: MongoDB ONLY`);
  console.log(`🔐 Admin login: admin@library.com / admin123`);
  console.log(`🧪 Test user: test@example.com / password123`);
  console.log(`📖 Test overdue book: "Test Overdue Book for Payment" - $80 penalty`);
  console.log(`👤 User Management: Admin can now view and manage all users`);
  console.log(`💳 Payment system: Multiple payment methods available for penalties`);
});