import mongoose from "mongoose";
import app from "./app";
import config from "./config";

async function connectDB() {
  try {
    await mongoose.connect(config.database_url as string);
    console.log("Database connection is successful.");
    app.listen(config.port, () => {
      console.log(`Server is listening on ${config.port}.`);
    });
  } catch (error) {
    console.log("Failed to connect database");
  }
}

connectDB();
