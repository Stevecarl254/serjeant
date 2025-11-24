import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;

async function testDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

testDB();
