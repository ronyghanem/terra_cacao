import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Content from "@/models/Content";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function GET() {
  try {
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

    await connectToDatabase();

    // Admin needs to see BOTH drafts and published content
    const content = await Content.find({})
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
    console.error("Get content error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to retrieve content.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
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

    const cleanTitle = String(title || "").trim();
    const cleanCategory = String(category || "").trim();
    const cleanDescription = String(description || "").trim();

    const cleanPrice = String(price || "").trim();
    const cleanWeight = String(weight || "").trim();
    const cleanCacao = String(cacao || "").trim();
    const cleanStyle = String(style || "").trim();
    const cleanFerment = String(ferment || "").trim();
    const cleanNotes = String(notes || "").trim();

    const cleanStatus =
      status === "published" ? "published" : "draft";

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

    const content = await Content.create({
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
    });

    return NextResponse.json(
      {
        success: true,
        message: "Content created successfully.",
        data: content,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create content error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create content.",
      },
      { status: 500 }
    );
  }
}