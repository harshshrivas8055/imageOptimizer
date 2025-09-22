const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/uploads/original", express.static(path.join(__dirname, "uploads/original")));
app.use("/uploads/high", express.static(path.join(__dirname, "uploads/high")));
app.use("/uploads/medium", express.static(path.join(__dirname, "uploads/medium")));
app.use("/uploads/low", express.static(path.join(__dirname, "uploads/low")));

// MongoDB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

// Routes
app.use("/api/auth", require("./routes/authroutes"));
app.use("/api/images", require("./routes/imageroutes"));

// Default route
app.get("/", (req, res) => res.send("Hello from server"));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
