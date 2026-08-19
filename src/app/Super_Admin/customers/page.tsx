"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import CustomerSearch from "@/components/customers/customersearch";
import CustomerFilters from "@/components/customers/customerfilters";
import CustomerTable from "@/components/customers/customertable";
import CustomerPagination from "@/components/customers/customerpagination";

import type {
  Customer,
  EmailStatus,
} from "@/types/customer";

type Employee = {
  id: string;
  name: string;
  role: "SUPER_ADMIN" | "EMPLOYEE";
  status: "ACTIVE" | "INACTIVE";
};

export default function CustomersPage() {
  const router = useRouter();

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [employees, setEmployees] =
    useState<Employee[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [employeeLoading, setEmployeeLoading] =
    useState(true);

  // Search
  const [search, setSearch] =
    useState("");

  // Filters
  const [date, setDate] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [endDate, setEndDate] =
    useState("");

  const [employee, setEmployee] =
    useState("");

  /*
   * Email Status
   *
   * Empty string = All statuses
   */
  const [emailStatus, setEmailStatus] =
    useState<EmailStatus | "">("");

  // Pagination
  const [currentPage, setCurrentPage] =
    useState(1);

  const customersPerPage = 10;

  /*
  |--------------------------------------------------------------------------
  | Get customers
  |--------------------------------------------------------------------------
  */
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/customers",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch customers"
        );
      }

      setCustomers(
        data.customers || []
      );
    } catch (error) {
      console.error(
        "Fetch customers error:",
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

  /*
  |--------------------------------------------------------------------------
  | Get employees
  |--------------------------------------------------------------------------
  */
  const fetchEmployees = async () => {
    try {
      setEmployeeLoading(true);

      const response = await fetch(
        "/api/employees",
        {
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to fetch employees"
        );
      }

      /*
       * Only active EMPLOYEE accounts
       * are shown in the customer filter.
       */
      const employeeList: Employee[] =
        (data.employees || []).filter(
          (item: Employee) =>
            item.role === "EMPLOYEE" &&
            item.status === "ACTIVE"
        );

      setEmployees(employeeList);
    } catch (error) {
      console.error(
        "Fetch employees error:",
        error
      );

      /*
       * Employee loading failure should
       * not prevent customers from loading.
       */
      setEmployees([]);
    } finally {
      setEmployeeLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load customers + employees
  |--------------------------------------------------------------------------
  */
  useEffect(() => {
    fetchCustomers();
    fetchEmployees();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Full customer name
  |--------------------------------------------------------------------------
  */
  const getCustomerName = (
    customer: Customer
  ) => {
    return [
      customer.firstName,
      customer.middleName,
      customer.lastName,
    ]
      .filter(Boolean)
      .join(" ");
  };

  /*
  |--------------------------------------------------------------------------
  | Customer created date
  |--------------------------------------------------------------------------
  */
  const getCustomerDate = (
    customer: Customer
  ) => {
    return new Date(customer.createdAt)
      .toISOString()
      .split("T")[0];
  };

  /*
  |--------------------------------------------------------------------------
  | Search + Filters
  |--------------------------------------------------------------------------
  */
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const searchValue =
        search.toLowerCase().trim();

      const fullName =
        getCustomerName(
          customer
        ).toLowerCase();

      const contact1 =
        customer.contactNumber1
          .toLowerCase();

      const contact2 =
        customer.contactNumber2
          ?.toLowerCase() || "";

      const email =
        customer.email.toLowerCase();

      const customerDate =
        getCustomerDate(
          customer
        );

      /*
       * Search
       */
      const matchesSearch =
        !searchValue ||
        fullName.includes(
          searchValue
        ) ||
        email.includes(
          searchValue
        ) ||
        contact1.includes(
          searchValue
        ) ||
        contact2.includes(
          searchValue
        );

      /*
       * Exact Date
       */
      const matchesDate =
        !date ||
        customerDate === date;

      /*
       * From Date
       */
      const matchesStartDate =
        !startDate ||
        customerDate >= startDate;

      /*
       * To Date
       */
      const matchesEndDate =
        !endDate ||
        customerDate <= endDate;

      /*
       * Employee
       *
       * The dropdown stores the
       * actual employee ID.
       *
       * Customer.createdById also
       * stores the employee ID.
       */
      const matchesEmployee =
        !employee ||
        customer.createdById ===
          employee;

      /*
       * Email Status
       */
      const matchesEmailStatus =
        !emailStatus ||
        customer.emailStatus ===
          emailStatus;

      return (
        matchesSearch &&
        matchesDate &&
        matchesStartDate &&
        matchesEndDate &&
        matchesEmployee &&
        matchesEmailStatus
      );
    });
  }, [
    customers,
    search,
    date,
    startDate,
    endDate,
    employee,
    emailStatus,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCustomers.length /
        customersPerPage
    )
  );

  const safeCurrentPage =
    Math.min(
      currentPage,
      totalPages
    );

  const startIndex =
    (safeCurrentPage - 1) *
    customersPerPage;

  const paginatedCustomers =
    filteredCustomers.slice(
      startIndex,
      startIndex +
        customersPerPage
    );

  /*
  |--------------------------------------------------------------------------
  | Delete customer
  |--------------------------------------------------------------------------
  */
  const handleDeleteCustomer =
    async (
      customerId: string
    ) => {
      try {
        const response =
          await fetch(
            `/api/customers/${customerId}`,
            {
              method: "DELETE",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to delete customer"
          );
        }

        setCustomers(
          (currentCustomers) =>
            currentCustomers.filter(
              (customer) =>
                customer.id !==
                customerId
            )
        );

        setCurrentPage(1);
      } catch (error) {
        console.error(
          "Delete customer error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to delete customer"
        );
      }
    };

  /*
  |--------------------------------------------------------------------------
  | Clear filters
  |--------------------------------------------------------------------------
  */
  const clearFilters = () => {
    setSearch("");
    setDate("");
    setStartDate("");
    setEndDate("");
    setEmployee("");
    setEmailStatus("");
    setCurrentPage(1);
  };

  /*
  |--------------------------------------------------------------------------
  | Export
  |--------------------------------------------------------------------------
  */
  const handleExport = () => {
    const emailStatusLabel =
      emailStatus === "PENDING"
        ? "Pending"
        : emailStatus === "SENT"
        ? "Sent"
        : emailStatus === "FAILED"
        ? "Failed"
        : "";

    const exportData = {
      totalCustomers:
        customers.length,

      allCustomers:
        customers,

      filteredCustomers:
        filteredCustomers,

      activeFilters: [
        ...(search.trim()
          ? [
              `Search: ${search.trim()}`,
            ]
          : []),

        ...(date
          ? [`Date: ${date}`]
          : []),

        ...(startDate
          ? [`From: ${startDate}`]
          : []),

        ...(endDate
          ? [`To: ${endDate}`]
          : []),

        ...(employee
          ? [
              `Created By: ${
                employees.find(
                  (item) =>
                    item.id ===
                    employee
                )?.name ||
                employee
              }`,
            ]
          : []),

        ...(emailStatus
          ? [
              `Email Status: ${emailStatusLabel}`,
            ]
          : []),
      ],
    };

    sessionStorage.setItem(
      "customerExportData",
      JSON.stringify(
        exportData
      )
    );

    router.push(
      "/Super_Admin/export"
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">

        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Super Admin
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Customers
            </h1>

            <p className="mt-2 text-slate-500">
              Manage all customer records.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            {/* Export */}
            <Button
              type="button"
              variant="outline"
              onClick={handleExport}
              disabled={customers.length === 0}
            >
              Export
            </Button>

            {/* Add Customer */}
            <Button render={<Link href="/Super_Admin/customers/add" />}
              nativeButton={false}>
              + Add Customer
            </Button>

          </div>
        </header>

        {/* Search */}
        <CustomerSearch
          search={search}
          onSearchChange={(
            value
          ) => {
            setSearch(value);
            setCurrentPage(1);
          }}
        />

        {/* Filters */}
        <CustomerFilters
          date={date}
          startDate={startDate}
          endDate={endDate}
          employee={employee}
          emailStatus={emailStatus}
          employees={employees}

          onDateChange={(
            value: string
          ) => {
            setDate(value);
            setCurrentPage(1);
          }}

          onStartDateChange={(
            value: string
          ) => {
            setStartDate(value);
            setCurrentPage(1);
          }}

          onEndDateChange={(
            value: string
          ) => {
            setEndDate(value);
            setCurrentPage(1);
          }}

          onEmployeeChange={(
            value: string
          ) => {
            setEmployee(value);
            setCurrentPage(1);
          }}

          onEmailStatusChange={(
            value:
              | EmailStatus
              | ""
          ) => {
            setEmailStatus(value);
            setCurrentPage(1);
          }}

          onClear={
            clearFilters
          }
        />

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

        {/* Content */}
        {!loading && !error && (
          <>

            {/* Result count */}
            <div className="mb-4">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-900">
                  {
                    filteredCustomers.length
                  }
                </span>{" "}
                customer
                {filteredCustomers.length !==
                1
                  ? "s"
                  : ""}
              </p>
            </div>

            {/* Employee loading information */}
            {employeeLoading && (
              <p className="mb-3 text-xs text-slate-400">
                Loading employees...
              </p>
            )}

            {/* Table */}
            <CustomerTable
              customers={
                paginatedCustomers
              }
              onDelete={
                handleDeleteCustomer
              }
            />

            {/* Pagination */}
            {filteredCustomers.length >
              0 &&
              totalPages > 1 && (
                <CustomerPagination
                  currentPage={
                    safeCurrentPage
                  }
                  totalPages={
                    totalPages
                  }
                  onPageChange={
                    setCurrentPage
                  }
                />
              )}

          </>
        )}

      </main>
    </div>
  );
}