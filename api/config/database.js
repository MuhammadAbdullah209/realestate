const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
  try {
    const connectionOptions = {
      serverSelectionTimeoutMS: 30000, // 30 seconds
      socketTimeoutMS: 45000, // 45 seconds
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 30000,
      family: 4, // Use IPv4, skip trying IPv6
    };

    const conn = await mongoose.connect(process.env.MONGO, connectionOptions);

    // Handle connection events
    mongoose.connection.on("connected", () => {
      console.log("📡 Mongoose connected to MongoDB".cyan);
    });

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("📴 MongoDB disconnected".yellow);
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄 MongoDB reconnected".green);
    });

    // Handle application termination
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        console.log("👋 MongoDB connection closed through app termination".red);
        process.exit(0);
      } catch (error) {
        console.error("Error closing MongoDB connection:", error);
        process.exit(1);
      }
    });

    process.on("SIGTERM", async () => {
      try {
        await mongoose.connection.close();
        console.log(
          "👋 MongoDB connection closed through app termination (SIGTERM)".red
        );
        process.exit(0);
      } catch (error) {
        console.error("Error closing MongoDB connection:", error);
        process.exit(1);
      }
    });

    // Handle uncaught exceptions
    process.on("uncaughtException", (error) => {
      console.error("Uncaught Exception:", error);
      mongoose.connection.close(() => {
        process.exit(1);
      });
    });

    process.on("unhandledRejection", (error) => {
      console.error("Unhandled Rejection:", error);
      mongoose.connection.close(() => {
        process.exit(1);
      });
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    console.error(
      "Connection string:",
      process.env.MONGO ? "Provided" : "Missing"
    );
    process.exit(1);
  }
};

module.exports = { connectDB };
