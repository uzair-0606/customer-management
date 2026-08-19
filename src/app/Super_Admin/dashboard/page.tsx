import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  /*
   * Current date
   */
  const now = new Date();

  /*
   * Start of today
   */
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  /*
   * Start of tomorrow
   */
  const startOfTomorrow = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1
  );

  /*
   * Start of this month
   */
  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  /*
   * Get dashboard statistics
   */

  const totalCustomers =
    await prisma.customer.count();

  const newCustomersThisMonth =
    await prisma.customer.count({
      where: {
        createdAt: {
          gte: startOfMonth,
        },
      },
    });

  const totalEmployees =
    await prisma.employee.count({
      where: {
        role: "EMPLOYEE",
      },
    });

  const todaysEntries =
    await prisma.customer.count({
      where: {
        createdAt: {
          gte: startOfToday,
          lt: startOfTomorrow,
        },
      },
    });

  /*
   * Get recent customers
   */
  const recentCustomers =
    await prisma.customer.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    });

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 p-8">

        {/* Header */}
        <header className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Super Admin
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Overview of the customer management application.
          </p>
        </header>

        {/* Statistics */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total Customers */}
          <Card className="gap-2 py-5">
            <CardHeader className="px-5">
              <CardDescription>Total Customers</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-900">
                {totalCustomers}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* New Customers This Month */}
          <Card className="gap-2 py-5">
            <CardHeader className="px-5">
              <CardDescription>New Customers This Month</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-900">
                {newCustomersThisMonth}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Total Employees */}
          <Card className="gap-2 py-5">
            <CardHeader className="px-5">
              <CardDescription>Total Employees</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-900">
                {totalEmployees}
              </CardTitle>
            </CardHeader>
          </Card>

          {/* Today's Entries */}
          <Card className="gap-2 py-5">
            <CardHeader className="px-5">
              <CardDescription>Today&apos;s Entries</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-900">
                {todaysEntries}
              </CardTitle>
            </CardHeader>
          </Card>

        </section>

        {/* Recent Customers */}
        <Card className="mt-8 gap-0 py-0">

          <CardHeader className="border-b px-6 py-5">
            <CardTitle className="text-lg font-semibold text-slate-900">
              Recent Customers
            </CardTitle>

            <CardDescription>
              The latest customers added to the system.
            </CardDescription>
          </CardHeader>

          {recentCustomers.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-500">
                No customers have been added yet.
              </p>
            </div>
          ) : (
            <div className="divide-y">

              {recentCustomers.map((customer) => {
                const fullName = [
                  customer.firstName,
                  customer.middleName,
                  customer.lastName,
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <div
                    key={customer.id}
                    className="flex items-center justify-between px-6 py-5"
                  >
                    <div>
                      <p className="font-medium text-slate-900">
                        {fullName}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {customer.email}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-700">
                        {customer.contactNumber1}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(
                          customer.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}

            </div>
          )}

          {recentCustomers.length > 0 && (
            <div className="border-t px-6 py-4">
              <Link
                href="/Super_Admin/customers"
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                View all customers →
              </Link>
            </div>
          )}

        </Card>

        {/* Quick Actions */}
        <Card className="mt-8">

          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Quick Actions
            </CardTitle>

            <CardDescription>
              Frequently used customer management actions.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-wrap gap-3">

            <Button render={<Link href="/Super_Admin/customers/add" />}
              nativeButton={false} size="lg">
              + Add Customer
            </Button>

            <Button
              render={<Link href="/Super_Admin/customers" />}
              nativeButton={false}
              variant="outline"
              size="lg"
            >
              View Customers
            </Button>

            <Button
              render={<Link href="/Super_Admin/employees" />}
              nativeButton={false}
              variant="outline"
              size="lg"
            >
              Manage Employees
            </Button>

          </CardContent>

        </Card>

      </main>
    </div>
  );
}