import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import {
  userHasPermission,
  PERMISSIONS,
} from "@/lib/rbac";
import Service from "@/models/Service";

export async function GET() {
  try {
    if (
  !(await userHasPermission(
    PERMISSIONS.MANAGE_SERVICES
  ))
) {
  return NextResponse.json(
    {
      success: false,
      message: "You do not have permission to manage services.",
    },
    { status: 403 }
  );
}

    await connectToDatabase();

    const services = await Service.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, data: services },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Get services error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to retrieve services." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
   if (
  !(await userHasPermission(
    PERMISSIONS.MANAGE_SERVICES
  ))
) {
  return NextResponse.json(
    {
      success: false,
      message: "You do not have permission to manage services.",
    },
    { status: 403 }
  );
}

    const body = await request.json();

    const title = String(body.title || "").trim();
    const category = String(body.category || "Service").trim();
    const description = String(body.description || "").trim();
    const price = String(body.price || "").trim();
    const duration = String(body.duration || "").trim();
    const status = body.status === "published" ? "published" : "draft";

    if (!title || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "Title and description are required.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const service = await Service.create({
      title,
      category,
      description,
      price,
      duration,
      status,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service created successfully.",
        data: service,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create service error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create service." },
      { status: 500 }
    );
  }
}
