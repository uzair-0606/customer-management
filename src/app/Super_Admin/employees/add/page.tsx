"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormErrors = {
  name?: string;
  email?: string;
  contact?: string;
  password?: string;
};

export default function AddEmployeePage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState("");

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required.";
    } else if (name.trim().length < 2) {
      newErrors.name =
        "Name must contain at least 2 characters.";
    }

    if (!email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email.trim()
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    const cleanContact =
      contact.replace(/\D/g, "");

    if (!contact.trim()) {
      newErrors.contact =
        "Contact number is required.";
    } else if (
      cleanContact.length !== 10 ||
      !/^[6-9]/.test(cleanContact)
    ) {
      newErrors.contact =
        "Enter a valid 10-digit Indian mobile number.";
    }

    if (!password) {
      newErrors.password =
        "Password is required.";
    } else if (password.length < 6) {
      newErrors.password =
        "Password must contain at least 6 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setApiError("");

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const cleanContact =
        contact.replace(/\D/g, "");

      const response = await fetch(
        "/api/employees",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
            phone: cleanContact,
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to create employee."
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to create employee."
        );
      }

      alert(
        "Employee created successfully."
      );

      router.push(
        "/Super_Admin/employees"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Create employee error:",
        error
      );

      setApiError(
        error instanceof Error
          ? error.message
          : "Failed to create employee."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 p-8">

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

          <p className="mt-5 text-sm font-medium text-blue-600">
            Super Admin
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Add Employee
          </h1>

          <p className="mt-2 text-slate-500">
            Create a new employee account.
          </p>

        </header>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-6"
        >

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Personal Information
              </CardTitle>
              <CardDescription>
                Enter the employee&apos;s basic information.
              </CardDescription>
            </CardHeader>

            <CardContent className="max-w-2xl space-y-2">

              <Label htmlFor="name">Full Name</Label>

              <Input
                id="name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);

                  if (errors.name) {
                    setErrors((current) => ({
                      ...current,
                      name: undefined,
                    }));
                  }
                }}
                placeholder="Enter employee name"
                aria-invalid={!!errors.name}
              />

              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}

            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Contact Information
              </CardTitle>
              <CardDescription>
                Enter the employee&apos;s contact details.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid max-w-4xl gap-5 md:grid-cols-2">

              {/* Email */}
              <div className="space-y-2">

                <Label htmlFor="email">Email Address</Label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);

                    if (errors.email) {
                      setErrors((current) => ({
                        ...current,
                        email: undefined,
                      }));
                    }
                  }}
                  placeholder="employee@example.com"
                  aria-invalid={!!errors.email}
                />

                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}

              </div>

              {/* Contact */}
              <div className="space-y-2">

                <Label htmlFor="contact">Contact Number</Label>

                <Input
                  id="contact"
                  type="tel"
                  value={contact}
                  onChange={(event) => {
                    setContact(event.target.value);

                    if (errors.contact) {
                      setErrors((current) => ({
                        ...current,
                        contact: undefined,
                      }));
                    }
                  }}
                  placeholder="9876543210"
                  maxLength={10}
                  aria-invalid={!!errors.contact}
                />

                {errors.contact && (
                  <p className="text-sm text-red-600">{errors.contact}</p>
                )}

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
                Configure the employee&apos;s account.
              </CardDescription>
            </CardHeader>

            <CardContent className="grid max-w-4xl gap-5 md:grid-cols-2">

              {/* Role */}
              <div className="space-y-2">

                <Label htmlFor="role">Role</Label>

                <Input
                  id="role"
                  type="text"
                  value="EMPLOYEE"
                  disabled
                />

                <p className="text-xs text-slate-500">
                  New accounts are created as employees.
                </p>

              </div>

              {/* Status */}
              <div className="space-y-2">

                <Label htmlFor="status">Status</Label>

                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value ?? "ACTIVE")}
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

              {/* Password */}
              <div className="space-y-2 md:col-span-2">

                <Label htmlFor="password">Password</Label>

                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);

                    if (errors.password) {
                      setErrors((current) => ({
                        ...current,
                        password: undefined,
                      }));
                    }
                  }}
                  placeholder="Enter employee password"
                  className="max-w-2xl"
                  aria-invalid={!!errors.password}
                />

                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}

                <p className="text-xs text-slate-500">
                  Minimum 6 characters.
                </p>

              </div>

            </CardContent>
          </Card>

          {/* API Error */}
          {apiError && (
            <Alert variant="destructive">
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">

            <Button
              render={<Link href="/Super_Admin/employees" />}
              nativeButton={false}
              variant="outline"
              size="lg"
            >
              Cancel
            </Button>

            <Button type="submit" disabled={saving} size="lg">
              {saving ? "Creating Employee..." : "Create Employee"}
            </Button>

          </div>

        </form>

      </main>
    </div>
  );
}