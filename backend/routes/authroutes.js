const express = require("express");
const signupcontroller = require("../controllers/signup.controller");
const logincontroller = require("../controllers/login.controller");
const authMiddleware = require("../middleware/auth.middleware");
const User = require("../models/user.model");

const router = express.Router();

// Signup
router.post("/signup", signupcontroller);

// Login
router.post("/login", logincontroller);

// Logout
router.post("/logout", (req, res) => {
  res.clearCookie("token").json({ message: "Logged out successfully" });
});

// Profile (protected)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ message: "User profile fetched", user });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//restore session
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ user });
  } catch (error) {
    console.error("Session Restore Error:", error);
    res.status(500).json({ message: "Failed to restore session" });
  }
});


module.exports = router;
