import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Content from "@/models/Content";

export async function GET() {
  try {
    await connectToDatabase();

    const content = await Content.find({
      status: "published",
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        data: content,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Get published content error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve published content.",
      },
      { status: 500 }
    );
  }
}