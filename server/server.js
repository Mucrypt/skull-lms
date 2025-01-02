require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Required for raw body handling in Stripe webhooks
const authRoutes = require('./routes/auth-routes/index');
const mediaRoutes = require('./routes/instructor-routes/media-routes');
const instructorCourseRoutes = require('./routes/instructor-routes/course-routes');
const studentViewCourseRoutes = require('./routes/student-routes/course-routes');
const studentViewOrderRoutes = require('./routes/student-routes/order-routes');
const studentCoursesRoutes = require('./routes/student-routes/student-courses-routes');
const studentCourseProgressRoutes = require("./routes/student-routes/course-progress-routes");


const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Parse the allowed origins from the .env file
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

// Middleware for CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Middleware for raw body parsing for Stripe webhook
app.use((req, res, next) => {
  if (req.originalUrl === '/student/order/stripe/webhook') {
    bodyParser.raw({ type: 'application/json' })(req, res, next);
  } else {
    express.json()(req, res, next); // Standard JSON parsing for other routes
  }
});

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI); // No need for deprecated options
    console.log('MongoDB connection established');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  }
};

// Routes
app.use('/auth', authRoutes);
app.use('/media', mediaRoutes);
app.use('/instructor/course', instructorCourseRoutes);
app.use('/student/course', studentViewCourseRoutes);
app.use('/student/order', studentViewOrderRoutes);
app.use('/student/courses-bought', studentCoursesRoutes);
app.use("/student/course-progress", studentCourseProgressRoutes);


// Connect to the database
connectDB();
