"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/components/layout/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Employee = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "SUPER_ADMIN" | "EMPLOYEE";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
};

export default function EditEmployeePage() {
  const params = useParams();
  const router = useRouter();

  const id = String(params.id);

  const [employee, setEmployee] =
    useState<Employee | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] =
    useState<"ACTIVE" | "INACTIVE">("ACTIVE");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  /*
   * Load employee
   */
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/employees/${id}`,
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load employee"
          );
        }

        const loadedEmployee =
          data.employee as Employee;

        setEmployee(loadedEmployee);

        setName(loadedEmployee.name);
        setEmail(loadedEmployee.email);
        setPhone(
          loadedEmployee.phone || ""
        );
        setStatus(loadedEmployee.status);
      } catch (error) {
        console.error(
          "Load employee error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load employee"
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchEmployee();
    }
  }, [id]);

  /*
   * Save employee
   */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/employees/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || null,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update employee"
        );
      }

      router.push(
        `/Super_Admin/employees/${id}`
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Update employee error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update employee"
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

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

  if (!employee) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">
          <h1 className="text-2xl font-bold text-slate-900">
            Employee Not Found
          </h1>

          <p className="mt-2 text-slate-500">
            {error ||
              "The employee could not be loaded."}
          </p>

          <Button render={<Link href="/Super_Admin/employees" />}
              nativeButton={false} className="mt-6">
            Back to Employees
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">
        {/* Header */}
        <header className="mb-8">
          <Button
            render={<Link href={`/Super_Admin/employees/${id}`} />}
            variant="link"
            className="h-auto p-0 text-sm font-medium"
          >
            ← Back to Employee
          </Button>

          <div className="mt-5">
            <p className="text-sm font-medium text-blue-600">
              Super Admin
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Edit Employee
            </h1>

            <p className="mt-2 text-slate-500">
              Update employee account information.
            </p>
          </div>
        </header>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Personal Information
              </CardTitle>
              <CardDescription>
                Update the employee&apos;s basic information.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>

                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                />
              </div>

              {/* Employee ID */}
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>

                <Input
                  id="employeeId"
                  type="text"
                  value={employee.id}
                  disabled
                />
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
                Update employee contact details.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Contact Number</Label>

                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                />
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
                Manage employee account status.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid gap-6 md:grid-cols-2">
              {/* Role */}
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>

                <Input
                  id="role"
                  type="text"
                  value={employee.role}
                  disabled
                />
              </div>

              {/* Status */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>

                <Select
                  value={status}
                  onValueChange={(value) =>
                    setStatus((value ?? "ACTIVE") as "ACTIVE" | "INACTIVE")
                  }
                >
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              render={<Link href={`/Super_Admin/employees/${id}`} />}
              variant="outline"
            >
              Cancel
            </Button>

            <Button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : "Save Changes"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}