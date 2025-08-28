const multer = require("multer");

// configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure 'uploads' folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const uploadMiddleware = multer({ storage });

// controller function
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // file path that will be saved in DB (you can also prepend server URL if needed)
    const filePath = `/uploads/${req.file.filename}`;

    // find user and update avatar
    const updatedUser = await User.findByIdAndUpdate(
       req.user.id,
      
      // console.log(req.user.id), // <-- req.user.id should come from auth middleware (JWT/session)
      { avatar: filePath },
      { new: true } 
    );

    res.json({
      message: "File uploaded and avatar updated successfully",
      avatar: updatedUser.avatar,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
};


module.exports = { uploadMiddleware, uploadProfileImage };

