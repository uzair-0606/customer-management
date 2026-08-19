import type { Customer } from "@/types/customer";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

type CustomerContactInfoProps = {
  customer: Customer;
};

export default function CustomerContactInfo({
  customer,
}: CustomerContactInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Contact Information
        </CardTitle>
        <CardDescription>
          Contact details of the customer.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-sm text-slate-500">
            Primary Contact
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {customer.contactNumber1}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Secondary Contact
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {customer.contactNumber2 || "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-sm text-slate-500">
            Email
          </p>

          <p className="mt-1 font-medium text-slate-900">
            {customer.email}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}