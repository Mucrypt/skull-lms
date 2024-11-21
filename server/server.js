require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require('./routes/auth-routes/index')


const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Enable CORS with specific origin for frontend communication
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Allow only frontend URL from environment variable
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);  // No need for options anymore
    console.log("MongoDB connection established");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1); // Exit process if database connections fail
  }
};


//routes 
app.use('/auth', authRoutes)

connectDB();
