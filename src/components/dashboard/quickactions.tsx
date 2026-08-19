import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";

const actions = [
  {
    href: "/Super_Admin/customers/add",
    title: "Add Customer",
    description: "Add a new customer record.",
    variant: "primary" as const,
  },
  {
    href: "/Super_Admin/employees",
    title: "Manage Employees",
    description: "Manage employee accounts.",
    variant: "default" as const,
  },
  {
    href: "/Super_Admin/export",
    title: "Export Data",
    description: "Export customer information.",
    variant: "default" as const,
  },
];

export default function QuickActions() {
  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">
        Quick Actions
      </h2>

      <div className="grid gap-4 md:grid-cols-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href} className="block">
            <Card
              className={
                action.variant === "primary"
                  ? "border-none bg-blue-600 py-5 text-white transition hover:bg-blue-700"
                  : "py-5 transition hover:shadow-md"
              }
            >
              <CardContent>
                <p
                  className={
                    action.variant === "primary"
                      ? "font-semibold"
                      : "font-semibold text-slate-900"
                  }
                >
                  {action.title}
                </p>

                <p
                  className={
                    action.variant === "primary"
                      ? "mt-1 text-sm text-blue-100"
                      : "mt-1 text-sm text-slate-500"
                  }
                >
                  {action.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
