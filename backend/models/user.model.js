const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  images: [
  {
    filename: String,
    path: String,
    size: Number,
    format: String,
    optimized: Boolean,
  }
],
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{ timestamps: true });

const User = mongoose.model("user", UserSchema);
module.exports = User;
