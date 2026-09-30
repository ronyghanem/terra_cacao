import { NextResponse } from "next/server";

import CustomerRequest from "@/models/Request";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb";
import {
  getCurrentUser,
  userHasPermission,
  PERMISSIONS,
} from "@/lib/rbac";

const REQUEST_STATUSES = [
  "Pending",
  "In Progress",
  "Resolved",
  "Rejected",
] as const;

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function POST(
  request: globalThis.Request
) {
  try {
    const currentUser = await getCurrentUser();

if (
  !currentUser ||
  !(await userHasPermission(
    PERMISSIONS.CREATE_REQUEST
  ))
) {
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

    const user = await User.findById(
  currentUser.id
).select("name email");

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

export async function GET(
  request: globalThis.Request
) {
  try {
    const currentUser = await getCurrentUser();

if (!currentUser) {
  return NextResponse.json(
    { message: "Unauthorized." },
    { status: 401 }
  );
}

const canViewAllRequests =
  await userHasPermission(
    PERMISSIONS.VIEW_ALL_REQUESTS
  );

    const { searchParams } = new URL(
      request.url
    );

    const search = searchParams
      .get("search")
      ?.trim();

    const status = searchParams
      .get("status")
      ?.trim();

    const dateFrom = searchParams
      .get("dateFrom")
      ?.trim();

    const dateTo = searchParams
      .get("dateTo")
      ?.trim();

    /*
     * Validate status filter
     */
    if (
      status &&
      !REQUEST_STATUSES.includes(
        status as (typeof REQUEST_STATUSES)[number]
      )
    ) {
      return NextResponse.json(
        {
          message: "Invalid request status filter.",
        },
        { status: 400 }
      );
    }

    const filters: Record<string, unknown> = {};

    /*
     * Search across:
     * - customer name
     * - customer email
     * - subject
     * - message
     */
    if (search) {
      const safeSearch =
        escapeRegex(search);

      const searchRegex = new RegExp(
        safeSearch,
        "i"
      );

      filters.$or = [
        {
          customerName: searchRegex,
        },
        {
          customerEmail: searchRegex,
        },
        {
          subject: searchRegex,
        },
        {
          message: searchRegex,
        },
      ];
    }

    /*
     * Status filter
     */
    if (status) {
      filters.status = status;
    }

    /*
     * Date range filter
     */
    if (dateFrom || dateTo) {
      const createdAt: Record<
        string,
        Date
      > = {};

      if (dateFrom) {
        const startDate = new Date(
          `${dateFrom}T00:00:00.000Z`
        );

        if (
          Number.isNaN(
            startDate.getTime()
          )
        ) {
          return NextResponse.json(
            {
              message:
                "Invalid start date filter.",
            },
            { status: 400 }
          );
        }

        createdAt.$gte = startDate;
      }

      if (dateTo) {
        const endDate = new Date(
          `${dateTo}T23:59:59.999Z`
        );

        if (
          Number.isNaN(
            endDate.getTime()
          )
        ) {
          return NextResponse.json(
            {
              message:
                "Invalid end date filter.",
            },
            { status: 400 }
          );
        }

        createdAt.$lte = endDate;
      }

      if (
        createdAt.$gte &&
        createdAt.$lte &&
        createdAt.$gte > createdAt.$lte
      ) {
        return NextResponse.json(
          {
            message:
              "The start date cannot be after the end date.",
          },
          { status: 400 }
        );
      }

      filters.createdAt = createdAt;
    }

    await connectToDatabase();

    let requests;

    /*
     * Admin:
     * Search/filter all customer requests.
     */
   if (canViewAllRequests) {
      requests =
        await CustomerRequest.find(
          filters
        )
          .sort({
            createdAt: -1,
          })
          .lean();
    } else {
      /*
       * Customer:
       * Only search/filter their own requests.
       */
      
   requests = await CustomerRequest.find({
  ...filters,
  customer: currentUser.id,
})
  .sort({
    createdAt: -1,
  })
  .lean();;
    }

    return NextResponse.json({
      data: requests.map((item) => ({
        ...item,
        _id: item._id.toString(),
        customer:
          item.customer.toString(),
        createdAt:
          item.createdAt.toISOString(),
        updatedAt:
          item.updatedAt.toISOString(),
      })),
      total: requests.length,
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