import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

const createSuperAdmin = async () => {
  try {
    // 1. Connect to DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("⚡ Connected to DB");

    // 2. Check if an admin exists already
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("❌ Super admin already exists. Aborting.");
      process.exit(0);
    }

    // 3. Create the admin
    const adminData = {
      fullName: "Super Admin",
      email: "superadmin@serjeant.ke",
      phone: "0700000000",
      password:"Admin12345!",
      role: "admin",
    };

    const admin = await User.create(adminData);

    console.log("✅ Super admin created:");
    console.log({
      id: admin._id.toString(),
      email: admin.email,
      password: "Admin12345!", // shown only once for login
    });

    console.log("⚠️  Remember to delete this file now!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating super admin:", err.message);
    process.exit(1);
  }
};

createSuperAdmin();
