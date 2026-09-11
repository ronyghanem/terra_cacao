import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import Content from "@/models/Content";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: Request,
  { params }: RouteContext
) {
  try {
    // Check admin authentication
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid content ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      title,
      category,
      description,
      price,
      weight,
      cacao,
      style,
      ferment,
      notes,
      status,
    } = body;

    // Clean required fields
    const cleanTitle = String(title || "").trim();
    const cleanCategory = String(category || "").trim();
    const cleanDescription = String(description || "").trim();

    // Clean optional fields
    const cleanPrice = String(price || "").trim();
    const cleanWeight = String(weight || "").trim();
    const cleanCacao = String(cacao || "").trim();
    const cleanStyle = String(style || "").trim();
    const cleanFerment = String(ferment || "").trim();
    const cleanNotes = String(notes || "").trim();

    // Only allow valid status values
    const cleanStatus =
      status === "published" ? "published" : "draft";

    // Validate required fields
    if (
      !cleanTitle ||
      !cleanCategory ||
      !cleanDescription
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Title, category, and description are required.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updatedContent =
      await Content.findByIdAndUpdate(
        id,
        {
          title: cleanTitle,
          category: cleanCategory,
          description: cleanDescription,
          price: cleanPrice,
          weight: cleanWeight,
          cacao: cleanCacao,
          style: cleanStyle,
          ferment: cleanFerment,
          notes: cleanNotes,
          status: cleanStatus,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedContent) {
      return NextResponse.json(
        {
          success: false,
          message: "Content not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Content updated successfully.",
        data: updatedContent,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update content error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update content.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    // Check admin authentication
    const authenticated = await isAdminAuthenticated();

    if (!authenticated) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid content ID.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deletedContent =
      await Content.findByIdAndDelete(id);

    if (!deletedContent) {
      return NextResponse.json(
        {
          success: false,
          message: "Content not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Content deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete content error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete content.",
      },
      { status: 500 }
    );
  }
}