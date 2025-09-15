const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config({ path: "./config.env" });

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const userManagementRoutes = require("./routes/user-management");

const app = express();

// Middleware
app.use(helmet());
app.use(morgan("combined"));

// Custom request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  console.log(`Headers:`, req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`Body:`, req.body);
  }

  // Log response
  const originalSend = res.send;
  res.send = function (data) {
    console.log(
      `[${new Date().toISOString()}] Response ${res.statusCode} for ${
        req.method
      } ${req.url}`
    );
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log(`Response data:`, parsed);
      } catch (e) {
        console.log(`Response data:`, data);
      }
    }
    originalSend.call(this, data);
  };

  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:4200",
      "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/users", userManagementRoutes);

// Handle CORS preflight requests
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    console.log(
      `[${new Date().toISOString()}] CORS Preflight: ${req.method} ${req.url}`
    );
    res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  console.log(`[${new Date().toISOString()}] Health check requested`);
  const response = {
    status: "OK",
    message: "Evoluna API is running",
    timestamp: new Date().toISOString(),
  };
  console.log(`[${new Date().toISOString()}] Health check response:`, response);
  res.json(response);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Evoluna server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
