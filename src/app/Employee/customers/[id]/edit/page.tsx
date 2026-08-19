"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import EmployeeSidebar from "@/components/layout/employeesidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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
};

type CustomerForm = {
  firstName: string;
  middleName: string;
  lastName: string;
  age: string;
  contactNumber1: string;
  contactNumber2: string;
  email: string;
  address: string;
};

export default function EmployeeEditCustomerPage() {
  const params = useParams();
  const router = useRouter();

  const customerId =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
      ? params.id[0]
      : "";

  const [form, setForm] = useState<CustomerForm>({
    firstName: "",
    middleName: "",
    lastName: "",
    age: "",
    contactNumber1: "",
    contactNumber2: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* Fetch customer*/
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
          `/api/customers/${customerId}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to fetch customer"
          );
        }

        const customer: Customer =
          data.customer;

        setForm({
          firstName:
            customer.firstName || "",

          middleName:
            customer.middleName || "",

          lastName:
            customer.lastName || "",

          age:
            customer.age !== undefined &&
            customer.age !== null
              ? String(customer.age)
              : "",

          contactNumber1:
            customer.contactNumber1 || "",

          contactNumber2:
            customer.contactNumber2 || "",

          email:
            customer.email || "",

          address:
            customer.address || "",
        });
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

  /* Update form field */
  const updateField = (
    field: keyof CustomerForm,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
    setSuccess("");
  };

  /* Save customer */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    /*
      Basic validation
     */
    if (
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.age.trim() ||
      !form.contactNumber1.trim() ||
      !form.email.trim() ||
      !form.address.trim()
    ) {
      setError(
        "Please fill in all required fields."
      );

      return;
    }

    /*
      Validate age
     */
    const numericAge = Number(form.age);

    if (
      !Number.isInteger(numericAge) ||
      numericAge <= 0 ||
      numericAge > 150
    ) {
      setError(
        "Please enter a valid age between 1 and 150."
      );

      return;
    }

    /*
      Validate email
     */
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email.trim())) {
      setError(
        "Please enter a valid email address."
      );

      return;
    }

    if (!customerId) {
      setError("Invalid customer ID.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/customers/${customerId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            firstName:
              form.firstName.trim(),

            middleName:
              form.middleName.trim()
                ? form.middleName.trim()
                : null,

            lastName:
              form.lastName.trim(),

            age: numericAge,

            contactNumber1:
              form.contactNumber1.trim(),

            contactNumber2:
              form.contactNumber2.trim()
                ? form.contactNumber2.trim()
                : null,

            email:
              form.email
                .trim()
                .toLowerCase(),

            address:
              form.address.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update customer"
        );
      }

      setSuccess(
        "Customer updated successfully."
      );

      /*
       Give the user a moment to see the
       success message, then return to details.
       */
      setTimeout(() => {
        router.push(
          `/Employee/customers/${customerId}`
        );

        router.refresh();
      }, 700);
    } catch (error) {
      console.error(
        "Update customer error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update customer"
      );
    } finally {
      setSaving(false);
    }
  };

  /* Loading */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <EmployeeSidebar />

        <main className="ml-64 p-8">
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

  /* Error while loading customer */
  if (error && !form.firstName) {
    return (
      <div className="min-h-screen bg-slate-50">
        <EmployeeSidebar />

        <main className="ml-64 p-8">
          <Card className="p-8 text-center">
            <h1 className="text-xl font-semibold text-slate-900">
              Unable to load customer
            </h1>

            <p className="mt-2 text-sm text-red-600">
              {error}
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

      <main className="ml-64 p-8">

        {/* Header */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Employee
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Edit Customer
            </h1>

            <p className="mt-2 text-slate-500">
              Update customer information.
            </p>
          </div>

          <Button
            render={<Link href={`/Employee/customers/${customerId}`} />}
            variant="outline"
          >
            Back
          </Button>
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="gap-8">

            {/* Personal Information */}
            <CardContent>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Personal Information
              </CardTitle>

              <CardDescription className="mt-1">
                Update the customer&apos;s basic information.
              </CardDescription>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">
                    First Name
                    <span className="text-red-500">{" "}*</span>
                  </Label>

                  <Input
                    id="firstName"
                    type="text"
                    value={form.firstName}
                    onChange={(event) =>
                      updateField(
                        "firstName",
                        event.target.value
                      )
                    }
                    disabled={saving}
                  />
                </div>

                {/* Middle Name */}
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>

                  <Input
                    id="middleName"
                    type="text"
                    value={form.middleName}
                    onChange={(event) =>
                      updateField(
                        "middleName",
                        event.target.value
                      )
                    }
                    disabled={saving}
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">
                    Last Name
                    <span className="text-red-500">{" "}*</span>
                  </Label>

                  <Input
                    id="lastName"
                    type="text"
                    value={form.lastName}
                    onChange={(event) =>
                      updateField(
                        "lastName",
                        event.target.value
                      )
                    }
                    disabled={saving}
                  />
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age">
                    Age
                    <span className="text-red-500">{" "}*</span>
                  </Label>

                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="150"
                    value={form.age}
                    onChange={(event) =>
                      updateField(
                        "age",
                        event.target.value
                      )
                    }
                    disabled={saving}
                  />
                </div>

              </div>
            </CardContent>

            <Separator />

            {/* Contact Information */}
            <CardContent>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Contact Information
              </CardTitle>

              <CardDescription className="mt-1">
                Update the customer&apos;s contact details.
              </CardDescription>

              <div className="mt-6 grid gap-5 md:grid-cols-2">

                {/* Contact 1 */}
                <div className="space-y-2">
                  <Label htmlFor="contactNumber1">
                    Contact Number 1
                    <span className="text-red-500">{" "}*</span>
                  </Label>

                  <Input
                    id="contactNumber1"
                    type="tel"
                    value={form.contactNumber1}
                    onChange={(event) =>
                      updateField(
                        "contactNumber1",
                        event.target.value
                      )
                    }
                    disabled={saving}
                  />
                </div>

                {/* Contact 2 */}
                <div className="space-y-2">
                  <Label htmlFor="contactNumber2">Contact Number 2</Label>

                  <Input
                    id="contactNumber2"
                    type="tel"
                    value={form.contactNumber2}
                    onChange={(event) =>
                      updateField(
                        "contactNumber2",
                        event.target.value
                      )
                    }
                    disabled={saving}
                  />
                </div>

                {/* Email */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">
                    Email
                    <span className="text-red-500">{" "}*</span>
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value
                      )
                    }
                    disabled={saving}
                  />
                </div>

              </div>
            </CardContent>

            <Separator />

            {/* Address */}
            <CardContent>
              <CardTitle className="text-lg font-semibold text-slate-900">
                Address
              </CardTitle>

              <CardDescription className="mt-1">
                Update the customer&apos;s address.
              </CardDescription>

              <div className="mt-6 space-y-2">

                <Label htmlFor="address">
                  Address
                  <span className="text-red-500">{" "}*</span>
                </Label>

                <Textarea
                  id="address"
                  rows={5}
                  value={form.address}
                  onChange={(event) =>
                    updateField(
                      "address",
                      event.target.value
                    )
                  }
                  disabled={saving}
                />

              </div>
            </CardContent>

            {/* Error */}
            {error && (
              <CardContent>
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </CardContent>
            )}

            {/* Success */}
            {success && (
              <CardContent>
                <Alert className="border-green-200 bg-green-50 text-green-700 [&>svg]:text-green-600">
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              </CardContent>
            )}

            <Separator />

            {/* Actions */}
            <CardContent className="flex justify-end gap-3">

              <Button
                render={<Link href={`/Employee/customers/${customerId}`} />}
                variant="outline"
                disabled={saving}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </Button>

            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}