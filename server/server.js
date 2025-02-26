// Load environment variables
require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const basicRoutes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");
const { connectDB } = require("./config/database");
const cors = require("cors");
const passport = require('./config/passport');
const googleAuthRoutes = require('./routes/googleAuthRoutes');

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL variables in .env missing.");
  process.exit(-1);
}

const app = express();
const port = process.env.PORT || 5000;
// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

// Add CORS configuration before other middleware
app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

// Authentication routes
app.use(authRoutes);

// Database connection
connectDB();

app.on("error", (error) => {
  console.error(`Server error: ${error.message}`);
  console.error(error.stack);
});

// Basic Routes
app.use(basicRoutes);
// Authentication Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', googleAuthRoutes);
// Task Routes
app.use('/api/tasks', require('./routes/taskRoutes'));
// Post Routes
app.use('/api/posts', require('./routes/postRoutes'));

// If no routes handled the request, it's a 404
app.use((req, res, next) => {
  res.status(404).send("Page not found.");
});

// Error handling
app.use((err, req, res, next) => {
  console.error(`Unhandled application error: ${err.message}`);
  console.error(err.stack);
  res.status(500).send("There was an error serving your request.");
});

// Ensure server listens on all interfaces
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});