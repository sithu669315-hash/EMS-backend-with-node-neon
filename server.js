const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./config/db");
const employeeRoutes = require("./routes/employeeroutes");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.use(express.json());

// Test API
app.get("/", (req, res) => {
  res.json({
    message: "Employee Management API is running",
  });
});

// Employee API Routes
app.use("/api/employees", employeeRoutes);

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await pool.query("SELECT 1");

    console.log("Neon Database Connected Successfully");

    app.listen(PORT, () => {
      console.log(`Server running at ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
