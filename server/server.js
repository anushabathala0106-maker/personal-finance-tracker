const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const transactionRoutes = require("./routes/transactions");

// Default to in-memory storage for development
global.USE_MEMORY_DB = true;
global.DB_STATUS = "Using in-memory storage";

const mongoUrl = process.env.MONGO_URL;
if (mongoUrl) {
  mongoose
    .connect(mongoUrl, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log("✓ MongoDB Connected");
      global.USE_MEMORY_DB = false;
      global.DB_STATUS = "Using MongoDB";
    })
    .catch((err) => {
      console.warn("⚠ MongoDB unavailable:", err.message.split("\n")[0]);
      console.log("📦 Using in-memory storage for development.");
    });
} else {
  console.log("📦 MONGO_URL not configured. Using in-memory storage.");
}

app.get("/", (req, res) => {
  res.json({ status: "Running", database: global.DB_STATUS });
});

app.get("/test", (req, res) => {
  console.log("[TEST] Endpoint hit");
  res.json({ test: "working", useMemoryDB: global.USE_MEMORY_DB });
});

app.use("/transactions", transactionRoutes);

app.listen(5000, () => {
  console.log("✓ Server running on port 5000");
});
