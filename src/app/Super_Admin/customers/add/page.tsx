"use client";

import { useState } from "react";
import Link from "next/link";

import Sidebar from "@/components/layout/sidebar";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function AddCustomerPage() {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");

  const [contactNumber1, setContactNumber1] =
    useState("");
  const [contactNumber2, setContactNumber2] =
    useState("");

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [errors, setErrors] =
    useState<Record<string, string>>({});

  const [saving, setSaving] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const newErrors: Record<string, string> = {};

    // First name
    if (!firstName.trim()) {
      newErrors.firstName =
        "First name is required.";
    }

    // Last name
    if (!lastName.trim()) {
      newErrors.lastName =
        "Last name is required.";
    }

    // Age
    if (!age.trim()) {
      newErrors.age = "Age is required.";
    } else if (
      !/^\d+$/.test(age.trim())
    ) {
      newErrors.age =
        "Age must contain only numbers.";
    } else if (
      Number(age) < 1 ||
      Number(age) > 120
    ) {
      newErrors.age =
        "Please enter a valid age.";
    }

    // Contact number 1
    if (!contactNumber1.trim()) {
      newErrors.contactNumber1 =
        "Primary contact number is required.";
    } else if (
      !/^(?:\+91|91|0)?[6-9]\d{9}$/.test(
        contactNumber1.replace(/[\s-]/g, "")
      )
    ) {
      newErrors.contactNumber1 =
        "Enter a valid Indian mobile number.";
    }

    // Contact number 2
    if (contactNumber2.trim()) {
      if (
        !/^(?:\+91|91|0)?[6-9]\d{9}$/.test(
          contactNumber2.replace(/[\s-]/g, "")
        )
      ) {
        newErrors.contactNumber2 =
          "Enter a valid Indian mobile number.";
      }
    }

    // Email
    if (!email.trim()) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    // Address
    if (!address.trim()) {
      newErrors.address =
        "Address is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/customers",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            firstName:
              firstName.trim(),

            middleName:
              middleName.trim() || null,

            lastName:
              lastName.trim(),

            age: Number(age),

            contactNumber1:
              contactNumber1.trim(),

            contactNumber2:
              contactNumber2.trim() ||
              null,

            email:
              email.trim().toLowerCase(),

            address:
              address.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrors({
          form:
            data.message ||
            "Failed to create customer.",
        });

        return;
      }

      console.log(
        "Customer created:",
        data.customer
      );

      window.location.href =
        "/Super_Admin/customers";
    } catch (error) {
      console.error(
        "Create customer error:",
        error
      );

      setErrors({
        form:
          "Something went wrong. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      <main className="min-h-screen pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">
        <div className="mx-auto max-w-6xl">

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

            <div className="mt-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Super Admin
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                Add Customer
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Create a new customer record by
                entering their personal, contact,
                and address information.
              </p>
            </div>
          </header>

          {/* Form-level error */}
          {errors.form && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Unable to create customer</AlertTitle>
              <AlertDescription>{errors.form}</AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* ================================= */}
            {/* PERSONAL INFORMATION */}
            {/* ================================= */}

            <Card className="gap-0 overflow-hidden py-0">

              <CardHeader className="flex-row items-center gap-3 border-b border-slate-100 px-6 py-5">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
                  01
                </div>

                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Personal Information
                  </CardTitle>

                  <CardDescription className="mt-0.5">
                    Basic information about the customer.
                  </CardDescription>
                </div>

              </CardHeader>

              <CardContent className="p-6">
                <div className="grid gap-5 md:grid-cols-3">

                  {/* First Name */}
                  <div>
                    <Label
                      htmlFor="firstName"
                      >
                      First Name
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </Label>

                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) =>
                        setFirstName(
                          event.target.value
                        )
                      }
                      placeholder="Enter first name"
                      aria-invalid={!!errors.firstName}
                    />

                    {errors.firstName && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  {/* Middle Name */}
                  <div>
                    <Label
                      htmlFor="middleName"
                      >
                      Middle Name
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        Optional
                      </span>
                    </Label>

                    <Input
                      id="middleName"
                      type="text"
                      value={middleName}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) =>
                        setMiddleName(
                          event.target.value
                        )
                      }
                      placeholder="Enter middle name"
                      
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <Label
                      htmlFor="lastName"
                      >
                      Last Name
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </Label>

                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) =>
                        setLastName(
                          event.target.value
                        )
                      }
                      placeholder="Enter last name"
                      aria-invalid={!!errors.lastName}
                    />

                    {errors.lastName && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.lastName}
                      </p>
                    )}
                  </div>

                  {/* Age */}
                  <div>
                    <Label
                      htmlFor="age"
                      >
                      Age
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </Label>

                    <Input
                      id="age"
                      type="number"
                      min="1"
                      max="120"
                      value={age}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) =>
                        setAge(
                          event.target.value
                        )
                      }
                      placeholder="Enter age"
                      aria-invalid={!!errors.age}
                    />

                    {errors.age && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.age}
                      </p>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* ================================= */}
            {/* CONTACT INFORMATION */}
            {/* ================================= */}

            <Card className="gap-0 overflow-hidden py-0">

              <CardHeader className="flex-row items-center gap-3 border-b border-slate-100 px-6 py-5">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
                  02
                </div>

                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Contact Information
                  </CardTitle>

                  <CardDescription className="mt-0.5">
                    Phone and email details for communication.
                  </CardDescription>
                </div>

              </CardHeader>

              <CardContent className="p-6">
                <div className="grid gap-5 md:grid-cols-2">

                  {/* Primary Contact */}
                  <div>
                    <Label
                      htmlFor="contactNumber1"
                      >
                      Primary Contact Number
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </Label>

                    <Input
                      id="contactNumber1"
                      type="tel"
                      value={contactNumber1}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) =>
                        setContactNumber1(
                          event.target.value
                        )
                      }
                      placeholder="+91 98765 43210"
                      aria-invalid={!!errors.contactNumber1}
                    />

                    {errors.contactNumber1 && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.contactNumber1}
                      </p>
                    )}
                  </div>

                  {/* Alternate Contact */}
                  <div>
                    <Label
                      htmlFor="contactNumber2"
                      >
                      Alternate Contact
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        Optional
                      </span>
                    </Label>

                    <Input
                      id="contactNumber2"
                      type="tel"
                      value={contactNumber2}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) =>
                        setContactNumber2(
                          event.target.value
                        )
                      }
                      placeholder="+91 98765 43210"
                      aria-invalid={!!errors.contactNumber2}
                    />

                    {errors.contactNumber2 && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.contactNumber2}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <Label
                      htmlFor="email"
                      >
                      Email Address
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </Label>

                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      placeholder="customer@example.com"
                      aria-invalid={!!errors.email}
                    />

                    {errors.email && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* ================================= */}
            {/* ADDRESS */}
            {/* ================================= */}

            <Card className="gap-0 overflow-hidden py-0">

              <CardHeader className="flex-row items-center gap-3 border-b border-slate-100 px-6 py-5">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-600">
                  03
                </div>

                <div>
                  <CardTitle className="text-base font-semibold text-slate-900">
                    Address
                  </CardTitle>

                  <CardDescription className="mt-0.5">
                    Customer&apos;s residential or mailing address.
                  </CardDescription>
                </div>

              </CardHeader>

              <CardContent className="space-y-1.5 p-6">
                <Label htmlFor="address">
                  Full Address
                  <span className="ml-1 text-red-500">*</span>
                </Label>

                <Textarea
                  id="address"
                  value={address}
                  onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setAddress(event.target.value)
                  }
                  placeholder="Enter full address"
                  rows={5}
                  aria-invalid={!!errors.address}
                />

                {errors.address && (
                  <p className="text-xs font-medium text-red-600">
                    {errors.address}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* ================================= */}
            {/* FOOTER ACTIONS */}
            {/* ================================= */}

            <Card className="flex-row items-center justify-between py-5">

              <p className="hidden text-xs text-slate-400 sm:block">
                <span className="text-red-500">
                  *
                </span>{" "}
                Required fields
              </p>

              <div className="ml-auto flex gap-3">

                {/* Cancel */}
                <Button
                  render={<Link href="/Super_Admin/customers" />}
              nativeButton={false}
                  variant="outline"
                  size="lg"
                >
                  Cancel
                </Button>

                {/* Save */}
                <Button type="submit" disabled={saving} size="lg">
                  {saving
                    ? "Saving..."
                    : "Save Customer"}
                </Button>

              </div>
            </Card>

          </form>
        </div>
      </main>
    </div>
  );
}