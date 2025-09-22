const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middleware/auth.middleware");
const User = require("../models/user.model");

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Upload & optimize
router.post("/upload", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const inputPath = req.file.path;
    const timestamp = Date.now();

    const formats = [
      { suffix: "low", quality: 30 },
      { suffix: "medium", quality: 60 },
      { suffix: "high", quality: 80 },
      { suffix: "original", quality: 100 },
    ];

    const optimizedFiles = [];

    for (const f of formats) {
      const outputDir = path.join("uploads", f.suffix);
      if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

      const outputPath = path.join(outputDir, `${timestamp}-${f.suffix}.jpg`);
      await sharp(inputPath).jpeg({ quality: f.quality }).toFile(outputPath);

      optimizedFiles.push({
        filename: path.basename(outputPath),
        path: outputPath,
        size: fs.statSync(outputPath).size,
        format: "jpeg",
        optimized: f.suffix !== "original",
      });
    }

    const user = await User.findById(req.user.id);
    user.images.push(...optimizedFiles);
    await user.save();

    res.json({ message: "Image uploaded & stored by quality", files: optimizedFiles });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all images
router.get("/my-images", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("images");
    res.json({ images: user.images || [] });
  } catch (error) {
    console.error("Fetch Images Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Download an image
router.get("/download/:filename", authMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    const user = await User.findById(req.user.id);
    const image = user.images.find((img) => img.filename === filename);
    if (!image) return res.status(404).json({ message: "Image not found" });

    res.download(image.path, image.filename, (err) => {
      if (err) {
        console.error("Download Error:", err);
        res.status(500).json({ message: "Error downloading file" });
      }
    });
  } catch (error) {
    console.error("Download Route Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete an image
router.delete("/delete/:filename", authMiddleware, async (req, res) => {
  try {
    const { filename } = req.params;
    const user = await User.findById(req.user.id);

    const imageIndex = user.images.findIndex((img) => img.filename === filename);
    if (imageIndex === -1) return res.status(404).json({ message: "Image not found" });

    const image = user.images[imageIndex];

    // Remove from DB
    user.images.splice(imageIndex, 1);
    await user.save();

    // Remove from filesystem
    if (fs.existsSync(image.path)) fs.unlinkSync(image.path);

    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete Route Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
