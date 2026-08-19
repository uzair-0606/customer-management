"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import EmployeeSidebar from "@/components/layout/employeesidebar";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Customer } from "@/types/customer";

export default function EmployeeCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const customersPerPage = 5;

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/customers", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to fetch customers"
        );
      }

      setCustomers(data.customers || []);
    } catch (error) {
      console.error(
        "Fetch employee customers error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const getCustomerName = (customer: Customer) => {
    return [
      customer.firstName,
      customer.middleName,
      customer.lastName,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const getCustomerDate = (customer: Customer) => {
    if (!customer.createdAt) {
      return "";
    }

    return new Date(
      customer.createdAt
    ).toLocaleDateString();
  };

  const filteredCustomers = useMemo(() => {
    const searchValue = search
      .toLowerCase()
      .trim();

    if (!searchValue) {
      return customers;
    }

    return customers.filter((customer) => {
      const fullName =
        getCustomerName(customer).toLowerCase();

      const email =
        customer.email.toLowerCase();

      const contact1 =
        customer.contactNumber1.toLowerCase();

      const contact2 =
        customer.contactNumber2?.toLowerCase() || "";

      return (
        fullName.includes(searchValue) ||
        email.includes(searchValue) ||
        contact1.includes(searchValue) ||
        contact2.includes(searchValue)
      );
    });
  }, [customers, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCustomers.length /
        customersPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    customersPerPage;

  const paginatedCustomers =
    filteredCustomers.slice(
      startIndex,
      startIndex + customersPerPage
    );

  return (
    <div className="min-h-screen bg-slate-50">
      <EmployeeSidebar />

      <main className="min-h-screen pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Employee
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Customers
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Manage your customer records.
              </p>
            </div>

            <Button render={<Link href="/Employee/customers/add" />}
              nativeButton={false} size="lg">
              + Add Customer
            </Button>
          </header>

          {/* Search */}
          <Card className="mb-6 gap-2 p-5">
            <Label htmlFor="customer-search">Search Customers</Label>

            <Input
              id="customer-search"
              type="text"
              value={search}
              onChange={(
                event: React.ChangeEvent<HTMLInputElement>
              ) => {
                setSearch(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by name, email or contact..."
              className="h-11 border-slate-300 bg-white text-sm shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
            />
          </Card>

          {/* Loading */}
          {loading && (
            <Card className="space-y-3 p-10">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/4" />
            </Card>
          )}

          {/* Error */}
          {!loading && error && (
            <Alert variant="destructive">
              <AlertTitle>Could not load customers</AlertTitle>
              <AlertDescription>
                {error}

                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={fetchCustomers}
                  className="mt-3 w-fit"
                >
                  Try Again
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Customer Content */}
          {!loading && !error && (
            <>
              {/* Result Count */}
              <div className="mb-4">
                <p className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-slate-900">
                    {filteredCustomers.length}
                  </span>{" "}
                  customer
                  {filteredCustomers.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="px-6 font-medium text-slate-500">
                          #
                        </TableHead>

                        <TableHead className="px-6 font-medium text-slate-500">
                          Customer Name
                        </TableHead>

                        <TableHead className="px-6 font-medium text-slate-500">
                          Email
                        </TableHead>

                        <TableHead className="px-6 font-medium text-slate-500">
                          Contact
                        </TableHead>

                        <TableHead className="px-6 font-medium text-slate-500">
                          Date
                        </TableHead>

                        <TableHead className="px-6 font-medium text-slate-500">
                          Actions
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {paginatedCustomers.length ===
                      0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="h-28 text-center"
                          >
                            <p className="text-sm font-medium text-slate-700">
                              No customers found.
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              Try changing your
                              search or add a new
                              customer.
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedCustomers.map(
                          (customer) => {
                            const fullName =
                              getCustomerName(
                                customer
                              );

                            return (
                              <TableRow
                                key={customer.id}
                                className="hover:bg-slate-50"
                              >
                                {/* ID */}
                                <TableCell className="px-6 text-xs text-slate-500">
                                  {customer.id}
                                </TableCell>

                                {/* Name */}
                                <TableCell className="px-6 font-medium text-slate-900">
                                  {fullName}
                                </TableCell>

                                {/* Email */}
                                <TableCell className="px-6 text-slate-600">
                                  {customer.email}
                                </TableCell>

                                {/* Contact */}
                                <TableCell className="px-6 text-slate-600">
                                  {
                                    customer.contactNumber1
                                  }
                                </TableCell>

                                {/* Date */}
                                <TableCell className="px-6 text-slate-600">
                                  {getCustomerDate(
                                    customer
                                  )}
                                </TableCell>

                                {/* Actions */}
                                <TableCell className="px-6">
                                  <div className="flex items-center gap-2">

                                    {/* View */}
                                    <Button
                                      render={<Link href={`/Employee/customers/${customer.id}`} />}
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-3 text-xs text-blue-600 hover:text-blue-700"
                                    >
                                      View
                                    </Button>

                                    {/* Edit */}
                                    <Button
                                      render={<Link href={`/Employee/customers/${customer.id}/edit`} />}
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 px-3 text-xs text-slate-600"
                                    >
                                      Edit
                                    </Button>

                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          }
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Pagination */}
              {filteredCustomers.length > 0 &&
                totalPages > 1 && (
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">

                    <p className="text-sm text-slate-500">
                      Page{" "}
                      <span className="font-medium text-slate-900">
                        {safeCurrentPage}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium text-slate-900">
                        {totalPages}
                      </span>
                    </p>

                    <div className="flex gap-2">

                      {/* Previous */}
                      <Button
                        type="button"
                        variant="outline"
                        disabled={
                          safeCurrentPage === 1
                        }
                        onClick={() =>
                          setCurrentPage(
                            safeCurrentPage - 1
                          )
                        }
                        className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      >
                        Previous
                      </Button>

                      {/* Next */}
                      <Button
                        type="button"
                        variant="outline"
                        disabled={
                          safeCurrentPage ===
                          totalPages
                        }
                        onClick={() =>
                          setCurrentPage(
                            safeCurrentPage + 1
                          )
                        }
                        className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      >
                        Next
                      </Button>

                    </div>
                  </div>
                )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}