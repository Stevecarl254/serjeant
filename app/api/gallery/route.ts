import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import GalleryItem from "@/models/GalleryItem";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Verify token helper
const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch (error) {
    return null;
  }
};

// GET all gallery items
export async function GET() {
  try {
    await connectToDatabase();
    const items = await GalleryItem.find({}).sort({ year: -1 });
    return NextResponse.json({ items }, { status: 200 });
  } catch (error) {
    console.error("Fetch gallery error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST a new gallery item
export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const headersList = headers();
    const cookieHeader = headersList.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admin only" }, { status: 403 });
    }

    const { title, image, category, year } = await request.json();

    if (!title || !image || !category || !year) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const item = await GalleryItem.create({ title, image, category, year });

    return NextResponse.json({ message: "Gallery item created", item }, { status: 201 });
  } catch (error) {
    console.error("Create gallery item error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE a gallery item
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();

    const headersList = headers();
    const cookieHeader = headersList.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ message: "Forbidden: Admin only" }, { status: 403 });
    }

    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return NextResponse.json({ message: "Item ID is required" }, { status: 400 });

    await GalleryItem.findByIdAndDelete(id);
    return NextResponse.json({ message: "Gallery item deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete gallery item error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}