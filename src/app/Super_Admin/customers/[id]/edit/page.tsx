"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import Sidebar from "@/components/layout/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type CustomerData = {
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

export default function EditCustomerPage() {
  const params = useParams();
  const router = useRouter();

  const customerId = String(params.id);

  const [customer, setCustomer] =
    useState<CustomerData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [firstName, setFirstName] =
    useState("");

  const [middleName, setMiddleName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [age, setAge] =
    useState("");

  const [contactNumber1, setContactNumber1] =
    useState("");

  const [contactNumber2, setContactNumber2] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [address, setAddress] =
    useState("");

  /*
    Load customer from backend
  */
  useEffect(() => {
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
            data.message ||
              "Failed to load customer"
          );
        }

        const customerData =
          data.customer;

        setCustomer(customerData);

        setFirstName(
          customerData.firstName ?? ""
        );

        setMiddleName(
          customerData.middleName ?? ""
        );

        setLastName(
          customerData.lastName ?? ""
        );

        setAge(
          String(customerData.age ?? "")
        );

        setContactNumber1(
          customerData.contactNumber1 ?? ""
        );

        setContactNumber2(
          customerData.contactNumber2 ?? ""
        );

        setEmail(
          customerData.email ?? ""
        );

        setAddress(
          customerData.address ?? ""
        );
      } catch (error) {
        console.error(
          "Fetch customer error:",
          error
        );

        setError(
          "Unable to load customer."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  /*
    Save changes
  */
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/customers/${customerId}`,
        {
          method: "PUT",

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
        throw new Error(
          data.message ||
            "Failed to update customer"
        );
      }

      /*
        Update successful
      */
      router.push(
        `/Super_Admin/customers/${customerId}`
      );

      router.refresh();
    } catch (error) {
      console.error(
        "Update customer error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update customer."
      );
    } finally {
      setSaving(false);
    }
  };

  /*
    Loading
  */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

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

  /*
    Customer not found / error
  */
  if (!customer) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <main className="ml-64 p-8">

          <h1 className="text-2xl font-bold text-slate-900">
            Customer Not Found
          </h1>

          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <Button render={<Link href="/Super_Admin/customers" />}
              nativeButton={false} className="mt-6">
            Back to Customers
          </Button>

        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">

      <Sidebar />

      <main className="ml-64 p-8">

        {/* Header */}
        <header className="mb-8">

          <Button
            render={<Link href={`/Super_Admin/customers/${customer.id}`} />}
            variant="link"
            className="h-auto p-0 text-sm font-medium"
          >
            ← Back to Customer
          </Button>

          <p className="mt-5 text-sm font-medium text-blue-600">
            Super Admin
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Edit Customer
          </h1>

          <p className="mt-2 text-slate-500">
            Update customer information.
          </p>

        </header>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

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
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-3">

              {/* First Name */}
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>

                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              {/* Middle Name */}
              <div className="space-y-2">
                <Label htmlFor="middleName">Middle Name</Label>

                <Input
                  id="middleName"
                  type="text"
                  value={middleName}
                  onChange={(event) =>
                    setMiddleName(
                      event.target.value
                    )
                  }
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>

                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>

                <Input
                  id="age"
                  type="number"
                  min="1"
                  value={age}
                  onChange={(event) =>
                    setAge(
                      event.target.value
                    )
                  }
                  required
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
            </CardHeader>

            <CardContent className="grid gap-5 md:grid-cols-2">

              {/* Contact 1 */}
              <div className="space-y-2">
                <Label htmlFor="contactNumber1">Contact Number</Label>

                <Input
                  id="contactNumber1"
                  type="tel"
                  value={contactNumber1}
                  onChange={(event) =>
                    setContactNumber1(
                      event.target.value
                    )
                  }
                  required
                />
              </div>

              {/* Contact 2 */}
              <div className="space-y-2">
                <Label htmlFor="contactNumber2">Alternate Contact</Label>

                <Input
                  id="contactNumber2"
                  type="tel"
                  value={contactNumber2}
                  onChange={(event) =>
                    setContactNumber2(
                      event.target.value
                    )
                  }
                />
              </div>

              {/* Email */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="email">Email Address</Label>

                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                  required
                />
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

            <CardContent className="space-y-2">

              <Label htmlFor="address">Address</Label>

              <Textarea
                id="address"
                value={address}
                onChange={(event) =>
                  setAddress(
                    event.target.value
                  )
                }
                required
                rows={4}
              />

            </CardContent>
          </Card>

          {/* Buttons */}
          <div className="flex justify-end gap-3">

            <Button
              render={<Link href={`/Super_Admin/customers/${customer.id}`} />}
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