import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

/* Check authentication and employee authorization */
async function getAuthorizedEmployee() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      authorized: false,
      status: 401,
      message: "Unauthorized",
      employee: null,
    };
  }

  /*
    Get the actual employee from the database.
   
    Your Prisma schema uses Employee, not User.
   */
  const employee = await prisma.employee.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (!employee) {
    return {
      authorized: false,
      status: 401,
      message: "Employee account not found",
      employee: null,
    };
  }

  /* Only active employees/admins can access customers. */
  if (employee.status !== "ACTIVE") {
    return {
      authorized: false,
      status: 403,
      message: "Employee account is inactive",
      employee: null,
    };
  }

  /* Both roles are allowed to manage customers.*/
  if (
    employee.role !== "SUPER_ADMIN" &&
    employee.role !== "EMPLOYEE"
  ) {
    return {
      authorized: false,
      status: 403,
      message: "Forbidden",
      employee: null,
    };
  }

  return {
    authorized: true,
    status: 200,
    message: "",
    employee,
  };
}

/* GET - Get single customer */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const authResult =
      await getAuthorizedEmployee();

    if (!authResult.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.message,
        },
        {
          status: authResult.status,
        }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer ID is required",
        },
        { status: 400 }
      );
    }

    const customer =
      await prisma.customer.findUnique({
        where: {
          id,
        },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      customer,
    });
  } catch (error) {
    console.error(
      "Get customer failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch customer",
      },
      { status: 500 }
    );
  }
}

/* PUT - Update single customer */
export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const authResult =
      await getAuthorizedEmployee();

    if (!authResult.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.message,
        },
        {
          status: authResult.status,
        }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer ID is required",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      firstName,
      middleName,
      lastName,
      age,
      contactNumber1,
      contactNumber2,
      email,
      address,
    } = body;

    /* Validate required fields*/
    if (
      !firstName ||
      !lastName ||
      age === undefined ||
      age === null ||
      !contactNumber1 ||
      !email ||
      !address
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Required fields are missing",
        },
        { status: 400 }
      );
    }

    /* Validate age */
    const numericAge = Number(age);

    if (
      !Number.isInteger(numericAge) ||
      numericAge <= 0 ||
      numericAge > 150
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid age",
        },
        { status: 400 }
      );
    }

    /* Check that customer exists */
    const existingCustomer =
      await prisma.customer.findUnique({
        where: {
          id,
        },
      });

    if (!existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found",
        },
        { status: 404 }
      );
    }

    /* Update customer */
    const customer =
      await prisma.customer.update({
        where: {
          id,
        },

        data: {
          firstName:
            String(firstName).trim(),

          middleName:
            middleName &&
            String(middleName).trim()
              ? String(middleName).trim()
              : null,

          lastName:
            String(lastName).trim(),

          age: numericAge,

          contactNumber1:
            String(contactNumber1).trim(),

          contactNumber2:
            contactNumber2 &&
            String(contactNumber2).trim()
              ? String(contactNumber2).trim()
              : null,

          email:
            String(email)
              .trim()
              .toLowerCase(),

          address:
            String(address).trim(),
        },

        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      });

    return NextResponse.json({
      success: true,
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    console.error(
      "Update customer failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update customer",
      },
      { status: 500 }
    );
  }
}

/* DELETE - Delete single customer */
export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const authResult =
      await getAuthorizedEmployee();

    if (!authResult.authorized) {
      return NextResponse.json(
        {
          success: false,
          message: authResult.message,
        },
        {
          status: authResult.status,
        }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer ID is required",
        },
        { status: 400 }
      );
    }

    /* Check that customer exists*/
    const existingCustomer =
      await prisma.customer.findUnique({
        where: {
          id,
        },
      });

    if (!existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found",
        },
        { status: 404 }
      );
    }

    /* Delete customer */
    await prisma.customer.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete customer failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete customer",
      },
      { status: 500 }
    );
  }
}