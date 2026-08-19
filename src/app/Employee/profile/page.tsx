"use client";

import { useEffect, useState } from "react";

import EmployeeSidebar from "@/components/layout/employeesidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

type Profile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
};

export default function EmployeeProfilePage() {
  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [savingProfile, setSavingProfile] =
    useState(false);

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  /*
   * ----------------------------------------------------
   * LOAD PROFILE
   * ----------------------------------------------------
   */

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/settings/profile",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to load profile"
        );
      }

      const employee = data.employee;

      setProfile(employee);

      setName(employee.name || "");
      setEmail(employee.email || "");
      setContact(employee.phone || "");
    } catch (error) {
      console.error(
        "Fetch profile error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /*
   * ----------------------------------------------------
   * SAVE PROFILE
   * ----------------------------------------------------
   */

  const handleSaveProfile = async () => {
    setError("");
    setMessage("");

    if (
      !name.trim() ||
      !email.trim()
    ) {
      setError(
        "Name and email are required."
      );

      return;
    }

    try {
      setSavingProfile(true);

      const response = await fetch(
        "/api/settings/profile",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: contact.trim() || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update profile"
        );
      }

      const employee = data.employee;

      setProfile(employee);

      setName(employee.name || "");
      setEmail(employee.email || "");
      setContact(employee.phone || "");

      setMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(
        "Update profile error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile"
      );
    } finally {
      setSavingProfile(false);
    }
  };

  /*
   * ----------------------------------------------------
   * CHANGE PASSWORD
   * ----------------------------------------------------
   */

  const handleChangePassword = async () => {
    setError("");
    setMessage("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setError(
        "Please fill in all password fields."
      );

      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );

      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "New password and confirmation do not match."
      );

      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch(
        "/api/settings/password",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to change password"
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage(
        "Password changed successfully."
      );
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to change password"
      );
    } finally {
      setChangingPassword(false);
    }
  };

  /*
   * ----------------------------------------------------
   * LOADING
   * ----------------------------------------------------
   */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <EmployeeSidebar />

        <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">
          <Card className="space-y-4 p-10">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </Card>
        </main>
      </div>
    );
  }

  /*
   * ----------------------------------------------------
   * PAGE
   * ----------------------------------------------------
   */

  return (
    <div className="min-h-screen bg-slate-50">

      <EmployeeSidebar />

      <main className="pt-20 p-4 sm:p-8 lg:ml-64 lg:pt-8">

        {/* Header */}

        <header className="mb-8">

          <p className="text-sm font-medium text-blue-600">
            Employee
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your personal information and account security.
          </p>

        </header>


        <div className="space-y-6">

          {/* Error */}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}


          {/* Success */}

          {message && (
            <Alert className="border-green-200 bg-green-50 text-green-700 [&>svg]:text-green-600">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}


          {/* Profile Information */}

          <Card>

            <CardHeader>

              <CardTitle className="text-lg font-semibold text-slate-900">
                Profile Information
              </CardTitle>

              <CardDescription>
                Update your personal information.
              </CardDescription>

            </CardHeader>


            <CardContent className="grid gap-5 md:grid-cols-2">

              {/* Name */}

              <div className="space-y-2">

                <Label htmlFor="employee-name">Full Name</Label>

                <Input
                  id="employee-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                />

              </div>


              {/* Email */}

              <div className="space-y-2">

                <Label htmlFor="employee-email">Email</Label>

                <Input
                  id="employee-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(
                      event.target.value
                    )
                  }
                />

              </div>


              {/* Contact */}

              <div className="space-y-2">

                <Label htmlFor="employee-contact">Contact Number</Label>

                <Input
                  id="employee-contact"
                  type="tel"
                  value={contact}
                  onChange={(event) =>
                    setContact(
                      event.target.value
                    )
                  }
                  placeholder="+91 98765 43210"
                />

              </div>


              {/* Role */}

              <div className="space-y-2">

                <Label htmlFor="employee-role">Role</Label>

                <Input
                  id="employee-role"
                  type="text"
                  value={
                    profile?.role || "EMPLOYEE"
                  }
                  disabled
                />

              </div>


              {/* Joined Date */}

              <div className="space-y-2">

                <Label htmlFor="joined-date">Joined Date</Label>

                <Input
                  id="joined-date"
                  type="text"
                  value={
                    profile?.createdAt
                      ? new Date(
                          profile.createdAt
                        ).toLocaleDateString()
                      : "—"
                  }
                  disabled
                />

              </div>

            </CardContent>


            {/* Save */}

            <CardFooter className="justify-end">

              <Button
                type="button"
                onClick={
                  handleSaveProfile
                }
                disabled={savingProfile}
              >
                {savingProfile
                  ? "Saving..."
                  : "Save Profile"}
              </Button>

            </CardFooter>

          </Card>


          {/* Change Password */}

          <Card>

            <CardHeader>

              <CardTitle className="text-lg font-semibold text-slate-900">
                Change Password
              </CardTitle>

              <CardDescription>
                Update your account password.
              </CardDescription>

            </CardHeader>


            <CardContent className="grid gap-5 md:grid-cols-2">

              {/* Current Password */}

              <div className="space-y-2 md:col-span-2">

                <Label htmlFor="current-password">Current Password</Label>

                <Input
                  id="current-password"
                  type="password"
                  value={
                    currentPassword
                  }
                  onChange={(event) =>
                    setCurrentPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter current password"
                />

              </div>


              {/* New Password */}

              <div className="space-y-2">

                <Label htmlFor="new-password">New Password</Label>

                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) =>
                    setNewPassword(
                      event.target.value
                    )
                  }
                  placeholder="Minimum 8 characters"
                />

              </div>


              {/* Confirm Password */}

              <div className="space-y-2">

                <Label htmlFor="confirm-password">Confirm New Password</Label>

                <Input
                  id="confirm-password"
                  type="password"
                  value={
                    confirmPassword
                  }
                  onChange={(event) =>
                    setConfirmPassword(
                      event.target.value
                    )
                  }
                  placeholder="Confirm new password"
                />

              </div>

            </CardContent>


            <CardFooter className="justify-end">

              <Button
                type="button"
                variant="outline"
                onClick={
                  handleChangePassword
                }
                disabled={
                  changingPassword
                }
              >
                {changingPassword
                  ? "Changing..."
                  : "Change Password"}
              </Button>

            </CardFooter>

          </Card>

        </div>

      </main>

    </div>
  );
}