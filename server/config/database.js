const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb+srv://brian:B%4052677625t@cluster0.yerrftj.mongodb.net/?appName=Cluster0";
    
    // Log the connection URI (masked for security)
    const maskedURI = mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
    console.log(`🔗 Connecting to MongoDB: ${maskedURI}`);
    
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Database: ${mongoose.connection.db.databaseName}`);
    
  } catch (error) {
    console.error("❌ MongoDB connection FAILED:", error.message);
    console.error("💥 MongoDB is REQUIRED. Please ensure MongoDB is running.");
    process.exit(1);
  }
};

module.exports = connectDB;