require("dotenv").config();
const express = require("express");
const morgan = require("morgan"); // HTTP request logger
const helmet = require("helmet"); // Security middleware
const compression = require("compression"); // Response compression

const app = express();

// Initialize middleware stack
app.use(morgan("dev")); // Log HTTP requests in development format
app.use(helmet()); // Add security headers
app.use(compression()); // Compress response bodies
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Initialize MongoDB database connection
require("./dbs/init.mongodb");

// Mount API routes
app.use("", require("./routes"));

// Global error handler middleware
app.use((error, req, res, next) => {
  console.log("[ERROR]::", error);
  const statusCode = error.status || 500;

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
