import { NextResponse } from "next/server";

import { clearUserSession } from "@/lib/userAuth";

export async function POST(request: Request) {
  try {
    await clearUserSession();

    const url = new URL("/login", request.url);

    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to log out.",
      },
      { status: 500 }
    );
  }
}