"use client";

import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

type AdminProfile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "SUPER_ADMIN" | "EMPLOYEE";
  status: "ACTIVE" | "INACTIVE";
};

export default function SettingsPanel() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] =
    useState(false);

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [emailNotifications, setEmailNotifications] =
    useState(true);

  const [systemNotifications, setSystemNotifications] =
    useState(true);

  const [twoFactor, setTwoFactor] =
    useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*
   * Load current Super Admin profile.
   */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/settings/profile",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load profile."
          );
        }

        const profile: AdminProfile =
          data.employee;

        setName(profile.name);
        setEmail(profile.email);
      } catch (error) {
        console.error(
          "Load settings error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load settings."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  /*
   * Save profile.
   */
  const handleSaveProfile = async () => {
    try {
      setSavingProfile(true);
      setMessage("");
      setError("");

      const response = await fetch(
        "/api/settings/profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to update profile."
        );
      }

      setName(data.employee.name);
      setEmail(data.employee.email);

      setMessage(
        "Profile updated successfully."
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Save profile error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update profile."
      );
    } finally {
      setSavingProfile(false);
    }
  };

  /*
   * Change password.
   */
  const handleChangePassword = async () => {
    try {
      setChangingPassword(true);
      setMessage("");
      setError("");

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

      if (newPassword !== confirmPassword) {
        setError(
          "New password and confirmation do not match."
        );
        return;
      }

      const response = await fetch(
        "/api/settings/password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to change password."
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage(
        "Password changed successfully."
      );

      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Change password error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Failed to change password."
      );
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <Card className="space-y-4 p-10">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/4" />
      </Card>
    );
  }

  return (
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

      {/* Admin Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Admin Profile
          </CardTitle>
          <CardDescription>
            Manage your administrator account information.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-5 md:grid-cols-2">

          <div className="space-y-2">
            <Label htmlFor="admin-name">Name</Label>

            <Input
              id="admin-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="admin-email">Email</Label>

            <Input
              id="admin-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
            />
          </div>

        </CardContent>

        <CardFooter className="justify-end">
          <Button
            type="button"
            onClick={handleSaveProfile}
            disabled={savingProfile}
          >
            {savingProfile
              ? "Saving..."
              : "Save Profile"}
          </Button>
        </CardFooter>

      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Security
          </CardTitle>
          <CardDescription>
            Manage account security and authentication.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">

          {/* Password */}
          <div>

            <div className="mb-4">
              <p className="text-sm font-medium text-slate-900">
                Change Password
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Use a strong password with at least 8 characters.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">

              <Input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value
                  )
                }
              />

              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value
                  )
                }
              />

              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="mt-4 flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleChangePassword}
                disabled={changingPassword}
              >
                {changingPassword
                  ? "Changing..."
                  : "Change Password"}
              </Button>
            </div>

          </div>

          {/* Two Factor */}
          <div className="flex items-center justify-between gap-4 border-t pt-5">

            <div>
              <p className="text-sm font-medium text-slate-900">
                Two-Factor Authentication
              </p>

              <p className="mt-1 text-xs text-slate-500">
                2FA is not configured yet.
              </p>
            </div>

            <Switch
              checked={twoFactor}
              onCheckedChange={setTwoFactor}
              aria-label="Toggle two-factor authentication"
            />

          </div>

        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-slate-900">
            Notifications
          </CardTitle>
          <CardDescription>
            Choose which notifications you want to receive.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">

          {/* Email */}
          <div className="flex items-center justify-between gap-4">

            <div>
              <p className="text-sm font-medium text-slate-900">
                Email Notifications
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Receive important account updates by email.
              </p>
            </div>

            <Switch
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
              aria-label="Toggle email notifications"
            />

          </div>

          {/* System */}
          <div className="flex items-center justify-between gap-4 border-t pt-5">

            <div>
              <p className="text-sm font-medium text-slate-900">
                System Notifications
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Receive notifications about system activity.
              </p>
            </div>

            <Switch
              checked={systemNotifications}
              onCheckedChange={setSystemNotifications}
              aria-label="Toggle system notifications"
            />

          </div>

        </CardContent>
      </Card>

    </div>
  );
}