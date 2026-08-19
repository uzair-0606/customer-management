import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

/*
 * GET /api/employees/[id]
 *
 * Get one employee by ID.
 */
export async function GET(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee ID is required",
        },
        { status: 400 }
      );
    }

    const employee =
      await prisma.employee.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    if (!employee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error(
      "Get employee failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch employee",
      },
      { status: 500 }
    );
  }
}

/*
 * PUT /api/employees/[id]
 *
 * Update employee information.
 */
export async function PUT(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee ID is required",
        },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      name,
      email,
      password,
      phone,
      status,
    } = body;

    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name and email are required",
        },
        { status: 400 }
      );
    }

    const existingEmployee =
      await prisma.employee.findUnique({
        where: {
          id,
        },
      });

    if (!existingEmployee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        { status: 404 }
      );
    }

    /*
     * Check whether another employee
     * already uses this email.
     */
    const emailOwner =
      await prisma.employee.findFirst({
        where: {
          email: String(email)
            .trim()
            .toLowerCase(),
          NOT: {
            id,
          },
        },
      });

    if (emailOwner) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Another employee already uses this email",
        },
        { status: 409 }
      );
    }

    const updateData: {
      name: string;
      email: string;
      phone: string | null;
      status?: "ACTIVE" | "INACTIVE";
      passwordHash?: string;
    } = {
      name: String(name).trim(),

      email: String(email)
        .trim()
        .toLowerCase(),

      phone: phone
        ? String(phone).trim()
        : null,
    };

    if (
      status === "ACTIVE" ||
      status === "INACTIVE"
    ) {
      updateData.status = status;
    }

    /*
     * Only change password if a new password
     * was actually supplied.
     */
  if (
  password &&
  String(password).trim()
) {
  updateData.passwordHash =
    await bcrypt.hash(
      String(password),
      10
    );
}

    const employee =
      await prisma.employee.update({
        where: {
          id,
        },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return NextResponse.json({
      success: true,
      employee,
    });
  } catch (error) {
    console.error(
      "Update employee failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update employee",
      },
      { status: 500 }
    );
  }
}

/*
 * DELETE /api/employees/[id]
 *
 * Delete an employee.
 */
export async function DELETE(
  request: Request,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee ID is required",
        },
        { status: 400 }
      );
    }

    const existingEmployee =
      await prisma.employee.findUnique({
        where: {
          id,
        },
      });

    if (!existingEmployee) {
      return NextResponse.json(
        {
          success: false,
          message: "Employee not found",
        },
        { status: 404 }
      );
    }

    /*
     * Do not allow deleting an employee
     * who still has customers assigned to them.
     */
    const customerCount =
      await prisma.customer.count({
        where: {
          createdById: id,
        },
      });

    if (customerCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cannot delete this employee because customers are assigned to them",
        },
        { status: 409 }
      );
    }

    await prisma.employee.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete employee failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete employee",
      },
      { status: 500 }
    );
  }
}