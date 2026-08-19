"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import EmployeeSearch from "@/components/employees/employeesearch";
import EmployeeFilters from "@/components/employees/employeefilters";
import EmployeeTable from "@/components/employees/employeetable";
import EmployeePagination from "@/components/employees/employeepagination";

import type { Employee } from "@/types/employee";

type ApiEmployee = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "SUPER_ADMIN" | "EMPLOYEE";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search
  const [search, setSearch] = useState("");

  // Filters
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const employeesPerPage = 5;

  /*
   * Load employees from backend
   */
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/employees", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message || "Failed to fetch employees"
          );
        }

        const backendEmployees: ApiEmployee[] =
          data.employees || [];

        /*
         * Only EMPLOYEE accounts are shown
         * on the employee management page.
         */
        const convertedEmployees: Employee[] =
          backendEmployees
            .filter(
              (employee) =>
                employee.role === "EMPLOYEE"
            )
            .map((employee) => ({
              id: employee.id,
              name: employee.name,
              email: employee.email,
              contact: employee.phone || "",
              role: "EMPLOYEE",
              status: employee.status,
              joinedDate: employee.createdAt
                ? new Date(employee.createdAt)
                    .toISOString()
                    .split("T")[0]
                : "",
            }));

        setEmployees(convertedEmployees);
      } catch (error) {
        console.error(
          "Fetch employees error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load employees"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  /*
   * Search + Filters
   */
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      const searchValue = search
        .toLowerCase()
        .trim();

      const matchesSearch =
        !searchValue ||
        employee.name
          .toLowerCase()
          .includes(searchValue) ||
        employee.email
          .toLowerCase()
          .includes(searchValue) ||
        employee.contact
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        !status ||
        employee.status === status;

      const matchesRole =
        !role ||
        employee.role === role;

      const matchesStartDate =
        !startDate ||
        employee.joinedDate >= startDate;

      const matchesEndDate =
        !endDate ||
        employee.joinedDate <= endDate;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [
    employees,
    search,
    status,
    role,
    startDate,
    endDate,
  ]);

  /*
   * Pagination
   */
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredEmployees.length /
        employeesPerPage
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const startIndex =
    (safeCurrentPage - 1) *
    employeesPerPage;

  const paginatedEmployees =
    filteredEmployees.slice(
      startIndex,
      startIndex + employeesPerPage
    );

  /*
   * Deactivate employee
   */
  const handleDeactivateEmployee = async (
    employeeId: string
  ) => {
    try {
      const employee = employees.find(
        (item) => item.id === employeeId
      );

      if (!employee) {
        throw new Error("Employee not found");
      }

      const response = await fetch(
        `/api/employees/${employeeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: employee.name,
            email: employee.email,
            phone: employee.contact || null,
            status: "INACTIVE",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to deactivate employee"
        );
      }

      setEmployees(
        (currentEmployees) =>
          currentEmployees.map(
            (currentEmployee) =>
              currentEmployee.id === employeeId
                ? {
                    ...currentEmployee,
                    status: "INACTIVE",
                  }
                : currentEmployee
          )
      );

      setCurrentPage(1);
    } catch (error) {
      console.error(
        "Deactivate employee error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to deactivate employee"
      );
    }
  };

  /*
   * Clear filters
   */
  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setRole("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 p-8">
        {/* Header */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Super Admin
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Employees
            </h1>

            <p className="mt-2 text-slate-500">
              Manage employee accounts and access.
            </p>
          </div>

          <Button render={<Link href="/Super_Admin/employees/add" />}
              nativeButton={false}>
            + Add Employee
          </Button>
        </header>

        {/* Search */}
        <EmployeeSearch
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
        />

        {/* Filters */}
        <EmployeeFilters
          status={status}
          role={role}
          startDate={startDate}
          endDate={endDate}
          onStatusChange={(value) => {
            setStatus(value);
            setCurrentPage(1);
          }}
          onRoleChange={(value) => {
            setRole(value);
            setCurrentPage(1);
          }}
          onStartDateChange={(value) => {
            setStartDate(value);
            setCurrentPage(1);
          }}
          onEndDateChange={(value) => {
            setEndDate(value);
            setCurrentPage(1);
          }}
          onClear={clearFilters}
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
            <AlertTitle>Could not load employees</AlertTitle>
            <AlertDescription>
              {error}

              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => window.location.reload()}
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
                  {filteredEmployees.length}
                </span>{" "}
                employee
                {filteredEmployees.length !== 1
                  ? "s"
                  : ""}
              </p>
            </div>

            {/* Employee table */}
            <EmployeeTable
              employees={paginatedEmployees}
              onDeactivate={
                handleDeactivateEmployee
              }
            />

            {/* Pagination */}
            {filteredEmployees.length > 0 &&
              totalPages > 1 && (
                <EmployeePagination
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
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