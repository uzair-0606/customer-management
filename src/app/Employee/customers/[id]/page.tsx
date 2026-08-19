"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import EmployeeSidebar from "@/components/layout/employeesidebar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type Customer = {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  age: number;
  contactNumber1: string;
  contactNumber2: string | null;
  email: string;
  address: string;
  createdById: string;
  createdAt: string;
  createdBy?: {
    name: string;
    email: string;
  };
};

export default function EmployeeCustomerViewPage() {
  const params = useParams();

  const customerId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!customerId) {
      setError("Invalid customer ID.");
      setLoading(false);
      return;
    }

    const fetchCustomer = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/customers/${customerId}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to fetch customer"
          );
        }

        setCustomer(data.customer);
      } catch (error) {
        console.error(
          "Fetch customer error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load customer"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  const fullName = customer
    ? [
        customer.firstName,
        customer.middleName,
        customer.lastName,
      ]
        .filter(Boolean)
        .join(" ")
    : "";

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <EmployeeSidebar />

        <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">
          <Card className="p-10">
            <div className="space-y-4">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </Card>
        </main>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen bg-slate-50">
        <EmployeeSidebar />

        <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">
          <Card className="p-8 text-center">
            <h1 className="text-xl font-semibold text-slate-900">
              Customer not found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error ||
                "The customer you are looking for does not exist."}
            </p>

            <Button render={<Link href="/Employee/customers" />}
              nativeButton={false} className="mt-6">
              Back to Customers
            </Button>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <EmployeeSidebar />

      <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Employee
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Customer Details
            </h1>

            <p className="mt-2 text-slate-500">
              View customer information.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              render={<Link href="/Employee/customers" />}
              nativeButton={false}
              variant="outline"
            >
              Back
            </Button>

            <Button
              render={<Link href={`/Employee/customers/${customer.id}/edit`} />}
            >
              Edit Customer
            </Button>
          </div>
        </header>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Personal Information
              </CardTitle>
            </CardHeader>

            <CardContent>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Customer ID
                </p>

                <p className="mt-1 break-all text-sm font-medium text-slate-900">
                  #{customer.id}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Full Name
                </p>

                <p className="mt-1 text-sm font-medium text-slate-900">
                  {fullName}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Age
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {customer.age}
                </p>
              </div>
            </div>
          </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Contact Information
              </CardTitle>
            </CardHeader>

            <CardContent>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Contact Number 1
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {customer.contactNumber1}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Contact Number 2
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {customer.contactNumber2 || "—"}
                </p>
              </div>

              <div className="md:col-span-2">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {customer.email}
                </p>
              </div>
            </div>
          </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Address
              </CardTitle>
            </CardHeader>

            <CardContent>

            <div className="mt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Address
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                {customer.address}
              </p>
            </div>
          </CardContent>
          </Card>

          {/* Record Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Record Information
              </CardTitle>
            </CardHeader>

            <CardContent>

            <div className="mt-6 grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Added By
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {customer.createdBy?.name ||
                    customer.createdById}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Added Date
                </p>

                <p className="mt-1 text-sm text-slate-700">
                  {new Date(
                    customer.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Email Status
                </p>

                <Badge variant="secondary" className="mt-1">
                  Not available
                </Badge>
              </div>
            </div>
          </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}