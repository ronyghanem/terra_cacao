import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Service from "@/models/Service";

export async function GET() {
  try {
    await connectToDatabase();

    const services = await Service.find({
      status: "published",
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, data: services },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Get published services error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve published services.",
      },
      { status: 500 }
    );
  }
}
