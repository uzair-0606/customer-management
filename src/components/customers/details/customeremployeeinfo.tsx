import type { Customer } from "@/types/customer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

type CustomerEmployeeInfoProps = {
  customer: Customer;
};

export default function CustomerEmployeeInfo({
  customer,
}: CustomerEmployeeInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Employee Information
        </CardTitle>
        <CardDescription>
          Information about who added this customer.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        <div>
          <p className="text-sm text-slate-500">
            Created By
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {customer.createdById}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Created Date
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {new Date(customer.createdAt).toLocaleDateString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
