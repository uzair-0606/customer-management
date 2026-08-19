import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (session.user.role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { message: "Forbidden" },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const currentPassword =
      typeof body.currentPassword === "string"
        ? body.currentPassword
        : "";

    const newPassword =
      typeof body.newPassword === "string"
        ? body.newPassword
        : "";

    const confirmPassword =
      typeof body.confirmPassword === "string"
        ? body.confirmPassword
        : "";

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return NextResponse.json(
        {
          message:
            "All password fields are required.",
        },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          message:
            "New password and confirmation do not match.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          message:
            "New password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const employee =
      await prisma.employee.findUnique({
        where: {
          id: session.user.id,
        },
        select: {
          passwordHash: true,
        },
      });

    if (!employee) {
      return NextResponse.json(
        { message: "Admin account not found." },
        { status: 404 }
      );
    }

    const passwordValid =
      await bcrypt.compare(
        currentPassword,
        employee.passwordHash
      );

    if (!passwordValid) {
      return NextResponse.json(
        {
          message:
            "Current password is incorrect.",
        },
        { status: 400 }
      );
    }

    const newPasswordHash =
      await bcrypt.hash(newPassword, 12);

    await prisma.employee.update({
      where: {
        id: session.user.id,
      },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    return NextResponse.json({
      message:
        "Password changed successfully.",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to change password.",
      },
      { status: 500 }
    );
  }
}