import Link from "next/link";

import Sidebar from "@/components/layout/sidebar";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

type EmployeeDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EmployeeDetailsPage({
  params,
}: EmployeeDetailsPageProps) {
  const { id } = await params;

  const session = await auth();

  // Authentication
  if (!session?.user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Unauthorized
          </h1>

          <p className="mt-2 text-slate-500">
            You must be logged in to view employee details.
          </p>

          <Button render={<Link href="/login" />}
              nativeButton={false} className="mt-6">
              Go to Login
            </Button>
        </main>
      </div>
    );
  }

  // Only Super Admin can view employees
  if (session.user.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Access Denied
          </h1>

          <p className="mt-2 text-slate-500">
            You do not have permission to view employee details.
          </p>

          <Button render={<Link href="/Super_Admin/dashboard" />}
              nativeButton={false} className="mt-6">
              Back to Dashboard
            </Button>
        </main>
      </div>
    );
  }

  // Fetch directly from Prisma
  const employee = await prisma.employee.findUnique({
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
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Employee Not Found
          </h1>

          <p className="mt-2 text-slate-500">
            The employee you are looking for does not exist.
          </p>

          <Button render={<Link href="/Super_Admin/employees" />}
              nativeButton={false} className="mt-6">
              Back to Employees
            </Button>
        </main>
      </div>
    );
  }

  const joinedDate = employee.createdAt
    ? new Date(employee.createdAt)
        .toISOString()
        .split("T")[0]
    : "";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">

        {/* Header */}
        <header className="mb-8">
          <Button
            render={<Link href="/Super_Admin/employees" />}
              nativeButton={false}
            variant="link"
            className="h-auto p-0 text-sm font-medium"
          >
            ← Back to Employees
          </Button>

          <div className="mt-5">
            <p className="text-sm font-medium text-blue-600">
              Super Admin
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              {employee.name}
            </h1>

            <p className="mt-2 text-slate-500">
              Employee ID #{employee.id}
            </p>
          </div>
        </header>

        <div className="space-y-6">

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Personal Information
              </CardTitle>
              <CardDescription>
                Basic employee information.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">

              <div>
                <p className="text-sm text-slate-500">
                  Full Name
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {employee.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Employee ID
                </p>

                <p className="mt-1 break-all font-medium text-slate-900">
                  #{employee.id}
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Contact Information
              </CardTitle>
              <CardDescription>
                Employee contact details.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">

              <div>
                <p className="text-sm text-slate-500">
                  Email Address
                </p>

                <p className="mt-1 break-all font-medium text-slate-900">
                  {employee.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Contact Number
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {employee.phone || "Not provided"}
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Account Information
              </CardTitle>
              <CardDescription>
                Employee account and access information.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-3">

              <div>
                <p className="text-sm text-slate-500">
                  Role
                </p>

                <Badge className="mt-1 bg-blue-50 text-blue-600 hover:bg-blue-50">
                  {employee.role}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Status
                </p>

                <Badge
                  className={
                    employee.status === "ACTIVE"
                      ? "mt-1 bg-green-50 text-green-600 hover:bg-green-50"
                      : "mt-1 bg-slate-100 text-slate-500 hover:bg-slate-100"
                  }
                >
                  {employee.status}
                </Badge>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Joined Date
                </p>

                <p className="mt-1 font-medium text-slate-900">
                  {joinedDate || "Not available"}
                </p>
              </div>

            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

            <Button
              render={<Link href="/Super_Admin/employees" />}
              nativeButton={false}
              variant="outline"
            >
              Back
            </Button>

            <Button
              render={<Link href={`/Super_Admin/employees/${employee.id}/edit`} />}
            >
              Edit Employee
            </Button>

          </div>

        </div>
      </main>
    </div>
  );
}