"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, User, LogOut, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/Employee/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Customers",
    href: "/Employee/customers",
    icon: Users,
  },
  {
    name: "Profile",
    href: "/Employee/profile",
    icon: User,
  },
];

export default function EmployeeSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const employeeName = session?.user?.name || "Employee";

  const initials = employeeName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b bg-white px-4 lg:hidden">
        <span className="text-sm font-bold text-slate-900">
          Customer Management
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
      </div>

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar / drawer */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r bg-white transition-transform duration-200 ease-in-out",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo / Brand */}
        <div className="flex h-20 items-center justify-between border-b px-6">
          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Customer Management
            </h1>
            <p className="mt-1 text-xs text-blue-600">Employee Portal</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Menu
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              const Icon = item.icon;

              return (
                <Button
                  key={item.href}
                  render={<Link href={item.href} />}
                  nativeButton={false}
                  variant="ghost"
                  onClick={() => setOpen(false)}
                  className={cn(
                    "h-auto w-full justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    isActive && "bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600"
                  )}
                >
                  <Icon className="size-4" />
                  {item.name}
                </Button>
              );
            })}
          </div>
        </nav>

        <Separator />

        {/* Employee information + Logout */}
        <div className="p-4">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-blue-100 text-blue-700">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {employeeName}
              </p>
              <p className="text-xs text-slate-500">Employee</p>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-3 h-auto w-full justify-start gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
