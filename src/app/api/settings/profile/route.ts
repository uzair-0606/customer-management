import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
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

  const employee = await prisma.employee.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
    },
  });

  if (!employee) {
    return NextResponse.json(
      { message: "Admin account not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    employee,
  });
}

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

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required." },
        { status: 400 }
      );
    }

    const existingEmployee =
      await prisma.employee.findFirst({
        where: {
          email,
          NOT: {
            id: session.user.id,
          },
        },
      });

    if (existingEmployee) {
      return NextResponse.json(
        { message: "Email is already in use." },
        { status: 409 }
      );
    }

    const employee =
      await prisma.employee.update({
        where: {
          id: session.user.id,
        },
        data: {
          name,
          email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          status: true,
        },
      });

    return NextResponse.json({
      message: "Profile updated successfully.",
      employee,
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error
    );

    return NextResponse.json(
      { message: "Failed to update profile." },
      { status: 500 }
    );
  }
}