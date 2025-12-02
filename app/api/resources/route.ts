import { NextResponse } from "next/server";
import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import PublicResource from "@/models/PublicResource";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
};

// GET → fetch all resources
export async function GET() {
  try {
    await connectToDatabase();
    const resources = await PublicResource.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ resources });
  } catch (error) {
    console.error("Fetch resources error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST → create new resource
export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const headersList = await headers();
    const cookieHeader = headersList.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin")
      return NextResponse.json({ message: "Forbidden", status: 403 });

    const { title, type, category, fileUrl, description } = await request.json();

    if (!title || !type || !category || !fileUrl)
      return NextResponse.json({ message: "Missing required fields", status: 400 });

    const resource = await PublicResource.create({ title, type, category, fileUrl, description });
    return NextResponse.json({ message: "Resource created", resource }, { status: 201 });
  } catch (error) {
    console.error("Create resource error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PATCH → update resource
export async function PATCH(request: Request) {
  try {
    await connectToDatabase();

    const headersList = await headers();
    const cookieHeader = headersList.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin")
      return NextResponse.json({ message: "Forbidden", status: 403 });

    const { id, title, type, category, fileUrl, description } = await request.json();
    if (!id) return NextResponse.json({ message: "Resource ID required", status: 400 });

    const updatedResource = await PublicResource.findByIdAndUpdate(
      id,
      { title, type, category, fileUrl, description },
      { new: true }
    );

    if (!updatedResource) return NextResponse.json({ message: "Resource not found", status: 404 });

    return NextResponse.json({ message: "Resource updated", resource: updatedResource }, { status: 200 });
  } catch (error) {
    console.error("Update resource error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE → delete resource
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();

    const headersList = await headers();
    const cookieHeader = headersList.get("cookie");
    const token = cookieHeader?.split("token=")[1]?.split(";")[0];
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== "admin")
      return NextResponse.json({ message: "Forbidden", status: 403 });

    const { id } = await request.json();
    if (!id) return NextResponse.json({ message: "Resource ID required", status: 400 });

    const deletedResource = await PublicResource.findByIdAndDelete(id);
    if (!deletedResource) return NextResponse.json({ message: "Resource not found", status: 404 });

    return NextResponse.json({ message: "Resource deleted" }, { status: 200 });
  } catch (error) {
    console.error("Delete resource error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}