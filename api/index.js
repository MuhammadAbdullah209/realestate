const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const colors = require("colors");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routes
const userRoutes = require("./Routes/user.route.js");
const profileRoutes = require("./Routes/profileRoutes.js");
const listingRoutes = require("./Routes/listing.route.js");
const routerr = require("./Routes/listingimage.route.js");

const app = express();
dotenv.config();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

// DB Connection
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("✅ DB Connected Successfully!".green))
  .catch((err) => console.log("❌ DB Connection Error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Routes
app.use("/Api/Auth", userRoutes);
app.use("/Api/Profile", profileRoutes);
app.use("/Api/Listings", listingRoutes);
app.use("/Api/Listing-uploads", routerr);

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Unknown Error Occurred";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Server
app.listen(8000, () => {
  console.log("🚀 Server is running on port 8000!".green);
});
