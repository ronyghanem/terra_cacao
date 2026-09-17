import { NextResponse } from "next/server";

import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserSession } from "@/lib/userAuth";

export async function PATCH(request: Request) {
  try {
    const userId = await getUserSession();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (name.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Name must be at least 2 characters long.",
        },
        { status: 400 }
      );
    }

    if (name.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Name cannot exceed 100 characters.",
        },
        { status: 400 }
      );
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "This email address is already in use.",
        },
        { status: 409 }
      );
    }

    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        {
          name,
          email,
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("name email");

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Your account has been updated successfully.",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
      },
    });
  } catch (error) {
    console.error("Customer update error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while updating your account.",
      },
      { status: 500 }
    );
  }
}