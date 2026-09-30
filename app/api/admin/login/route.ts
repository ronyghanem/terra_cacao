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

    const adminEmail = process.env.ADMIN_EMAIL
      ?.trim()
      .toLowerCase();

    const adminPassword =
      process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error(
        "Admin credentials are not configured."
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Admin authentication is not configured.",
        },
        { status: 500 }
      );
    }

    // Keep your existing admin credentials.
    if (
      email !== adminEmail ||
      password !== adminPassword
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Find the admin account in the User collection.
    let user = await User.findOne({
      email: adminEmail,
    });

    // If it does not exist yet, create it.
    if (!user) {
      const hashedPassword =
        await bcrypt.hash(
          adminPassword,
          12
        );

      user = await User.create({
        name: "Administrator",
        email: adminEmail,
        password: hashedPassword,
        role: ROLES.ADMIN,
      });
    } else if (
      user.role !== ROLES.ADMIN
    ) {
      // The environment admin credentials identify
      // the administrator account.
      user.role = ROLES.ADMIN;

      await user.save();
    }

    // Use the SAME user session as normal users.
    await setUserSession(
      user._id.toString()
    );

    return NextResponse.json(
      {
        success: true,
        message:
          "Admin login successful.",
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
      "Admin login error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to process admin login.",
      },
      { status: 500 }
    );
  }
}