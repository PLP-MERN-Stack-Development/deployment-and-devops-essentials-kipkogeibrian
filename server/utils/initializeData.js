const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Book = require("../models/Book");

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

const initializeSampleBooks = async () => {
  try {
    const bookCount = await Book.countDocuments();
    if (bookCount === 0) {
      const johnUser = await User.findOne({ email: "john@example.com" });
      const janeUser = await User.findOne({ email: "jane@example.com" });
      const testUser = await User.findOne({ email: "test@example.com" });
      
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

const initializeData = async () => {
  await initializeAdmin();
  await initializeSampleBooks();
};

module.exports = initializeData;