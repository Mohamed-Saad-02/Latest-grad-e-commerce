import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "../app.js";

dotenv.config({ path: "./config.env" });

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
});

const DB = process.env.DATABASE_LOCAL;

// Connect DB
mongoose.connect(DB).then(() => console.log("Connected DB 📒"));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

// Handle Async Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => process.exit(1));
});
