import { NextResponse } from "next/server";

import CustomerRequest from "@/models/Request";
import { connectToDatabase } from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/adminAuth";

const VALID_STATUSES = [
  "Pending",
  "In Progress",
  "Resolved",
  "Rejected",
] as const;

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: globalThis.Request,
  context: RouteContext
) {
  try {
    const isAdmin = await isAdminAuthenticated();

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    await connectToDatabase();

    const customerRequest =
      await CustomerRequest.findById(id).lean();

    if (!customerRequest) {
      return NextResponse.json(
        { message: "Request not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: {
        ...customerRequest,
        _id: customerRequest._id.toString(),
        customer: customerRequest.customer.toString(),
        createdAt: customerRequest.createdAt.toISOString(),
        updatedAt: customerRequest.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Get request error:", error);

    return NextResponse.json(
      {
        message: "Unable to load the request.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: globalThis.Request,
  context: RouteContext
) {
  try {
    const isAdmin = await isAdminAuthenticated();

    if (!isAdmin) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    const body = await request.json();
    const status = String(body.status || "");

    if (
      !VALID_STATUSES.includes(
        status as (typeof VALID_STATUSES)[number]
      )
    ) {
      return NextResponse.json(
        {
          message: "Invalid request status.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const customerRequest =
      await CustomerRequest.findByIdAndUpdate(
        id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      ).lean();

    if (!customerRequest) {
      return NextResponse.json(
        {
          message: "Request not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Request status updated successfully.",
      data: {
        ...customerRequest,
        _id: customerRequest._id.toString(),
        customer: customerRequest.customer.toString(),
        createdAt: customerRequest.createdAt.toISOString(),
        updatedAt: customerRequest.updatedAt.toISOString(),
      },
    });
  } catch (error) {
    console.error("Update request error:", error);

    return NextResponse.json(
      {
        message: "Unable to update the request.",
      },
      { status: 500 }
    );
  }
}