import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import {
  userHasPermission,
  PERMISSIONS,
} from "@/lib/rbac";
import Service from "@/models/Service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
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

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid service ID." },
        { status: 400 }
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

    const service = await Service.findByIdAndUpdate(
      id,
      {
        title,
        category,
        description,
        price,
        duration,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Service updated successfully.",
        data: service,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update service error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update service." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
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

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid service ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return NextResponse.json(
        { success: false, message: "Service not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Service deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete service error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete service." },
      { status: 500 }
    );
  }
}
