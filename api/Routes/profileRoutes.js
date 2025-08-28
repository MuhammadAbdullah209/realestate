const express = require("express");
const multer = require("multer");
const cloudinary = require("../Utils/Cloudinary");
const User = require("../Models/user.model"); 
const router = express.Router();

// Use memory storage so req.file.buffer is available for upload_stream
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload-profile/:id", upload.single("profile"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: "real-estate/profiles" },
                (error, uploaded) => {
                    if (error) return reject(error);
                    resolve(uploaded);
                }
            );
            stream.end(req.file.buffer);
        });

        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { avatar: result.secure_url },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.json({
            success: true,
            message: "Profile picture uploaded and saved",
            url: result.secure_url,
            user,
        });
    } catch (err) {
        console.error("Upload/Update error:", err);
        if (err.name === "CastError") {
            return res.status(400).json({ error: "Invalid user id" });
        }
        return res.status(500).json({ error: "Upload failed", details: err.message });
    }
});

module.exports = router;
