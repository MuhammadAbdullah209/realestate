const cloudinary = require("../Utils/Cloudinary.js");
const Listing = require("../Models/Listing.Model.js");

const uploadListingImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const listingId = req.params.id;
    const imageUrls = [];

    // Upload each file buffer to Cloudinary
    for (const file of req.files) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "listings" }, 
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(file.buffer);
      });

      imageUrls.push(uploadResult.secure_url);
    }

    // Update listing with Cloudinary URLs
    const updatedListing = await Listing.findByIdAndUpdate(
      listingId,
      { $push: { imageUrls: { $each: imageUrls } } },
      { new: true }
    );

    if (!updatedListing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed", error: error.message });
  }
};

module.exports = { uploadListingImages };
