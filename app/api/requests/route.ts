import { NextResponse } from "next/server";

import CustomerRequest from "@/models/Request";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import { getUserSession } from "@/lib/userAuth";
import { isAdminAuthenticated } from "@/lib/adminAuth";

export async function POST(
  request: globalThis.Request
) {
  try {
    const userId = await getUserSession();

    if (!userId) {
      return NextResponse.json(
        {
          message:
            "You must be logged in to submit a request.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const subject = String(
      body.subject || ""
    ).trim();

    const message = String(
      body.message || ""
    ).trim();

    if (!subject || !message) {
      return NextResponse.json(
        {
          message:
            "Subject and message are required.",
        },
        { status: 400 }
      );
    }

    if (
      subject.length < 3 ||
      subject.length > 150
    ) {
      return NextResponse.json(
        {
          message:
            "Subject must be between 3 and 150 characters.",
        },
        { status: 400 }
      );
    }

    if (
      message.length < 10 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        {
          message:
            "Message must be between 10 and 5000 characters.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(userId).select(
      "name email"
    );

    if (!user) {
      return NextResponse.json(
        {
          message: "Customer account not found.",
        },
        { status: 404 }
      );
    }

    const customerRequest =
      await CustomerRequest.create({
        customer: user._id,
        customerName: user.name,
        customerEmail: user.email,
        subject,
        message,
        status: "Pending",
      });

    return NextResponse.json(
      {
        message:
          "Your request has been submitted successfully.",
        data: {
          id: customerRequest._id.toString(),
          status: customerRequest.status,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Create request error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to submit your request. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const isAdmin =
      await isAdminAuthenticated();

    await connectToDatabase();

    let requests;

    if (isAdmin) {
      requests = await CustomerRequest.find()
        .sort({ createdAt: -1 })
        .lean();
    } else {
      const userId = await getUserSession();

      if (!userId) {
        return NextResponse.json(
          {
            message: "Unauthorized.",
          },
          { status: 401 }
        );
      }

      requests =
        await CustomerRequest.find({
          customer: userId,
        })
          .sort({ createdAt: -1 })
          .lean();
    }

    return NextResponse.json({
      data: requests.map((item) => ({
        ...item,
        _id: item._id.toString(),
        customer: item.customer.toString(),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error(
      "Get requests error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to load customer requests.",
      },
      { status: 500 }
    );
  }
}