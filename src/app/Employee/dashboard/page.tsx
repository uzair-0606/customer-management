import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

import EmployeeSidebar from "@/components/layout/employeesidebar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default async function EmployeeDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "EMPLOYEE") {
    redirect("/Super_Admin");
  }

  const employeeId = session.user.id;

  /*
   Get employee's customers
   */
  const customers = await prisma.customer.findMany({
    where: {
      createdById: employeeId,
    },

    orderBy: {
      createdAt: "desc",
    },

    take: 5,
  });

  /*
    Total customers created by employee
   */
  const totalCustomers =
    await prisma.customer.count({
      where: {
        createdById: employeeId,
      },
    });

  /*
    Customers added today
   */
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const customersAddedToday =
    await prisma.customer.count({
      where: {
        createdById: employeeId,

        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

  /*
    Customer full name
   */
  const getCustomerName = (
    customer: {
      firstName: string;
      middleName: string | null;
      lastName: string;
    }
  ) => {
    return [
      customer.firstName,
      customer.middleName,
      customer.lastName,
    ]
      .filter(Boolean)
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Employee Sidebar */}
      <EmployeeSidebar />

      <main className="ml-64 p-8">

        {/* Header */}
        <header className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Employee
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Welcome back, {session.user.name}.
          </p>
        </header>


        {/* Statistics */}
        <div className="grid gap-5 md:grid-cols-3">

          {/* My Customers */}
          <Card className="gap-2 py-5">
            <CardHeader className="gap-1 px-5">
              <CardDescription>My Customers</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-900">
                {totalCustomers}
              </CardTitle>
              <p className="text-xs text-slate-500">
                Customers added by you
              </p>
            </CardHeader>
          </Card>

          {/* Added Today */}
          <Card className="gap-2 py-5">
            <CardHeader className="gap-1 px-5">
              <CardDescription>Added Today</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-900">
                {customersAddedToday}
              </CardTitle>
              <p className="text-xs text-slate-500">
                Customer records added today
              </p>
            </CardHeader>
          </Card>

          {/* Emails */}
          <Card className="gap-2 py-5">
            <CardHeader className="gap-1 px-5">
              <CardDescription>Emails Sent</CardDescription>
              <CardTitle className="text-3xl font-bold text-slate-900">
                0
              </CardTitle>
              <p className="text-xs text-slate-500">
                Customer emails sent successfully
              </p>
            </CardHeader>
          </Card>

        </div>


        {/* Quick Actions */}
        <section className="mt-10">

          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Quick Actions
          </h2>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Add Customer */}
            <Link href="/Employee/customers/add" className="block">
              <Card className="border-none bg-blue-600 py-6 text-white shadow-sm transition hover:bg-blue-700">
                <CardContent>
                  <h3 className="text-lg font-semibold">Add Customer</h3>
                  <p className="mt-2 text-sm text-blue-100">
                    Add a new customer record.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* View Customers */}
            <Link href="/Employee/customers" className="block">
              <Card className="py-6 shadow-sm transition hover:bg-slate-50">
                <CardContent>
                  <h3 className="text-lg font-semibold text-slate-900">
                    My Customers
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    View and manage your customer records.
                  </p>
                </CardContent>
              </Card>
            </Link>

          </div>

        </section>


        {/* Recent Customers */}
        <Card className="mt-10">

          <CardHeader>
            <CardTitle className="text-lg font-semibold text-slate-900">
              Recent Customers
            </CardTitle>
            <CardDescription>Your recently added customers.</CardDescription>
          </CardHeader>

          <CardContent>
            {customers.length === 0 ? (

              <div className="rounded-lg border border-dashed p-10 text-center">

                <p className="text-sm font-medium text-slate-700">
                  No customers yet
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Start by adding your first customer.
                </p>

                <Button
                  render={<Link href="/Employee/customers/add" />}
              nativeButton={false}
                  className="mt-4"
                >
                  Add Customer
                </Button>

              </div>

            ) : (

              <div className="overflow-hidden rounded-lg border">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Added</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium text-slate-900">
                          {getCustomerName(customer)}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {customer.email}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {customer.contactNumber1}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          <Button
                            render={
                              <Link href={`/Employee/customers/${customer.id}`} />
                            }
                            variant="link"
                            className="h-auto p-0 font-medium"
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

            )}
          </CardContent>

        </Card>

      </main>

    </div>
  );
}