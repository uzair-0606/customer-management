"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import EmployeeSidebar from "@/components/layout/employeesidebar";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Card, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function EmployeeAddCustomerPage() {
  const router = useRouter();

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

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !age.trim() ||
      !contactNumber1.trim() ||
      !email.trim() ||
      !address.trim()
    ) {
      setError(
        "Please fill in all required fields."
      );
      return;
    }

    const numericAge = Number(age);

    if (
      !Number.isInteger(numericAge) ||
      numericAge <= 0 ||
      numericAge > 150
    ) {
      setError("Please enter a valid age.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(
        "/api/customers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstName.trim(),
            middleName:
              middleName.trim() || null,
            lastName: lastName.trim(),
            age: numericAge,
            contactNumber1:
              contactNumber1.trim(),
            contactNumber2:
              contactNumber2.trim() || null,
            email: email
              .trim()
              .toLowerCase(),
            address: address.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(
          data.message ||
            "Failed to create customer."
        );
        return;
      }

      router.push("/Employee/customers");
      router.refresh();
    } catch (error) {
      console.error(
        "Create customer failed:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAddressChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAddress(event.target.value);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <EmployeeSidebar />

      <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">
        {/* Page Header */}
        <header className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Employee
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Add Customer
          </h1>

          <p className="mt-2 text-slate-500">
            Create a new customer record.
          </p>
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
                Enter the customer&apos;s basic information.
              </CardDescription>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {/* First Name */}
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>

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
                  />
                </div>

                {/* Middle Name */}
                <div className="space-y-2">
                  <Label htmlFor="middleName">Middle Name</Label>

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
                    placeholder="Optional"
                  />
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>

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
                  />
                </div>

                {/* Age */}
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>

                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="150"
                    value={age}
                    onChange={(
                      event: React.ChangeEvent<HTMLInputElement>
                    ) =>
                      setAge(
                        event.target.value
                      )
                    }
                    placeholder="Enter age"
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
                Enter the customer&apos;s contact details.
              </CardDescription>

              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {/* Contact Number */}
                <div className="space-y-2">
                  <Label htmlFor="contactNumber1">Contact Number</Label>

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
                  />
                </div>

                {/* Alternate Contact */}
                <div className="space-y-2">
                  <Label htmlFor="contactNumber2">
                    Alternate Contact Number
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
                    placeholder="Optional"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="email">Email</Label>

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
                Enter the customer&apos;s address.
              </CardDescription>

              <div className="mt-6 space-y-2">
                <Label htmlFor="address">Address</Label>

                <Textarea
                  id="address"
                  value={address}
                  onChange={handleAddressChange}
                  placeholder="House / street address"
                  rows={4}
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

            <Separator />

            {/* Actions */}
            <CardContent className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              {/* Cancel */}
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(
                    "/Employee/customers"
                  )
                }
              >
                Cancel
              </Button>

              {/* Save */}
              <Button type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : "Save Customer"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}