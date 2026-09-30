import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { setUserSession } from "@/lib/userAuth";
import { ROLES } from "@/lib/rbac";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email and password are required.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    // Reject accounts with an invalid/missing role.
    if (
      user.role !== ROLES.ADMIN &&
      user.role !== ROLES.EMPLOYEE
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User account has an invalid role.",
        },
        { status: 403 }
      );
    }

    await setUserSession(
      user._id.toString()
    );

    return NextResponse.json(
      {
        success: true,
        message: "Login successful.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "User login error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process login.",
      },
      { status: 500 }
    );
  }
}