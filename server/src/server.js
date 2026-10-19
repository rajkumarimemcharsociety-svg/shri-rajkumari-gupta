
import "dotenv/config";
import mongoose from "mongoose";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing from the server .env file.");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  console.log("MongoDB connected successfully.");

  app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Unable to start the API:", error.message);
  process.exit(1);
});
