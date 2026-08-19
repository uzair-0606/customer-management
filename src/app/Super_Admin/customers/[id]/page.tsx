import Link from "next/link";
import { cookies } from "next/headers";

import Sidebar from "@/components/layout/sidebar";

import CustomerPersonalInfo from "@/components/customers/details/customerpersonalinfo";
import CustomerContactInfo from "@/components/customers/details/customercontactinfo";
import CustomerAddress from "@/components/customers/details/customeradress";
import CustomerEmployeeInfo from "@/components/customers/details/customeremployeeinfo";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import type {
  Customer,
  EmailStatus,
} from "@/types/customer";

type CustomerDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerDetailsPage({
  params,
}: CustomerDetailsPageProps) {
  const { id } = await params;

  let customer: Customer | null = null;

  try {
    const cookieStore = await cookies();

    const cookieHeader = cookieStore
      .getAll()
      .map(
        (cookie) =>
          `${cookie.name}=${cookie.value}`
      )
      .join("; ");

    const baseUrl =
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/customers/${id}`,
      {
        cache: "no-store",
        headers: {
          Cookie: cookieHeader,
        },
      }
    );

    const data = await response.json();

    if (response.ok && data.success) {
      customer = data.customer;
    } else {
      console.error(
        "Failed to load customer:",
        data?.message || response.status
      );
    }
  } catch (error) {
    console.error(
      "Failed to load customer:",
      error
    );
  }

  /*
   * Customer not found
   */
  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">
          <div className="max-w-3xl">
            <h1 className="text-2xl font-bold text-slate-900">
              Customer Not Found
            </h1>

            <p className="mt-2 text-slate-500">
              The customer you are looking for
              could not be loaded.
            </p>

            <Button
              render={<Link href="/Super_Admin/customers" />}
              nativeButton={false}
              className="mt-6"
            >
              Back to Customers
            </Button>
          </div>
        </main>
      </div>
    );
  }

  /*
   * Full customer name
   */
  const fullName = [
    customer.firstName,
    customer.middleName,
    customer.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  /*
   * Email status
   */
  const emailStatus: EmailStatus =
    customer.emailStatus ?? "PENDING";

  const emailStatusLabel =
    emailStatus === "SENT"
      ? "Sent"
      : emailStatus === "FAILED"
      ? "Failed"
      : "Pending";

  const emailStatusClass =
    emailStatus === "SENT"
      ? "border-green-200 bg-green-100 text-green-700 hover:bg-green-100"
      : emailStatus === "FAILED"
      ? "border-red-200 bg-red-100 text-red-700 hover:bg-red-100"
      : "border-yellow-200 bg-yellow-100 text-yellow-700 hover:bg-yellow-100";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">
        {/* Header */}
        <header className="mb-8">
          <Button
            render={<Link href="/Super_Admin/customers" />}
              nativeButton={false}
            variant="link"
            className="h-auto p-0 text-sm font-medium"
          >
            ← Back to Customers
          </Button>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
            <div>
              <p className="text-sm font-medium text-blue-600">
                Super Admin
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-900">
                {fullName}
              </h1>

              <p className="mt-2 text-slate-500">
                Customer ID #{customer.id}
              </p>
            </div>

            {/* Edit Customer */}
            <Button
              render={<Link href={`/Super_Admin/customers/${customer.id}/edit`} />}
              nativeButton={false}
            >
              Edit Customer
            </Button>
          </div>
        </header>

        {/* Customer Information */}
        <div className="space-y-6">
          <CustomerPersonalInfo
            customer={customer}
          />

          <CustomerContactInfo
            customer={customer}
          />

          <CustomerAddress
            customer={customer}
          />

          <CustomerEmployeeInfo
            customer={customer}
          />

          {/* System Information */}
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                System Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Customer record and email delivery
                information.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Customer ID */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Customer ID
                </p>

                <p className="mt-1 break-all text-sm font-medium text-slate-900">
                  {customer.id}
                </p>
              </div>

              {/* Added By */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Added By
                </p>

                <p className="mt-1 break-all text-sm font-medium text-slate-900">
                  {customer.createdById}
                </p>
              </div>

              {/* Created Date */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Created Date
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {new Date(
                    customer.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              {/* Updated Date */}
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Updated Date
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {new Date(
                    customer.updatedAt
                  ).toLocaleString()}
                </p>
              </div>

              {/* Email Status */}
              <div className="md:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email Status
                </p>

                <div className="mt-2">
                  <Badge
                    variant="outline"
                    className={`px-3 py-1.5 text-sm font-medium ${emailStatusClass}`}
                  >
                    <span
                      className={`mr-2 h-2 w-2 rounded-full ${
                        emailStatus === "SENT"
                          ? "bg-green-500"
                          : emailStatus ===
                            "FAILED"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    />

                    {emailStatusLabel}
                  </Badge>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}