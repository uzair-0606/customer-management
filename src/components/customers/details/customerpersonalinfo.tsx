import type { Customer } from "@/types/customer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type CustomerPersonalInfoProps = {
  customer: Customer;
};

export default function CustomerPersonalInfo({
  customer,
}: CustomerPersonalInfoProps) {
  const fullName = [
    customer.firstName,
    customer.middleName,
    customer.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Personal Information
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Customer ID
          </p>

          <p className="mt-1 text-sm font-medium text-slate-900">
            {customer.id}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Full Name
          </p>

          <p className="mt-1 text-sm font-medium text-slate-900">
            {fullName}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            First Name
          </p>

          <p className="mt-1 text-sm text-slate-700">
            {customer.firstName}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Middle Name
          </p>

          <p className="mt-1 text-sm text-slate-700">
            {customer.middleName || "—"}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Last Name
          </p>

          <p className="mt-1 text-sm text-slate-700">
            {customer.lastName}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Age
          </p>

          <p className="mt-1 text-sm text-slate-700">
            {customer.age}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}