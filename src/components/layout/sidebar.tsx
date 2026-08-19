"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserCog, Settings, LogOut, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navigation = [
  {
    name: "Dashboard",
    href: "/Super_Admin/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: "Customers",
    href: "/Super_Admin/customers",
    icon: Users,
    exact: false,
  },
  {
    name: "Employees",
    href: "/Super_Admin/employees",
    icon: UserCog,
    exact: false,
  },
  {
    name: "Settings",
    href: "/Super_Admin/settings",
    icon: Settings,
    exact: false,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const adminName = session?.user?.name || "Super Admin";

  const initials = adminName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-slate-800 bg-slate-900 px-4 text-white lg:hidden">
        <span className="text-sm font-semibold">Customer Management</span>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen(true)}
          className="text-white hover:bg-slate-800 hover:text-white"
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
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col bg-slate-900 text-white transition-transform duration-200 ease-in-out",
          "lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800 px-6">
          <h1 className="text-lg font-semibold">Customer Management</h1>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="text-white hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {navigation.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Button
                key={item.href}
                render={<Link href={item.href} />}
                nativeButton={false}
                variant="ghost"
                onClick={() => setOpen(false)}
                className={cn(
                  "h-auto w-full justify-start gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white",
                  isActive && "bg-slate-800 text-white"
                )}
              >
                <Icon className="size-4" />
                {item.name}
              </Button>
            );
          })}
        </nav>

        <Separator className="bg-slate-800" />

        {/* Admin information + Logout */}
        <div className="p-4">
          <div className="flex items-center gap-3 rounded-lg bg-slate-800 p-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-slate-700 text-white">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">
                {adminName}
              </p>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          </div>

          <Button
            variant="ghost"
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="mt-3 h-auto w-full justify-start gap-2 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-950 hover:text-red-300"
          >
            <LogOut className="size-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  );
}
