// FILE: routes/listing.routes.js
const express = require("express");
const routerr = express.Router();
const upload = require("../Utils/multer.js");
const { uploadListingImages } = require("../Controllers/ListingImagecontroller.js");
const { VerifyToken } = require("../Utils/VerifiedUser.js");
const multer = require("multer");



// Upload multiple images
routerr.post(
  "/upload/:id", // pass listing id
  upload.array("images", 6), // max 6 images
  uploadListingImages
);

module.exports = routerr;
