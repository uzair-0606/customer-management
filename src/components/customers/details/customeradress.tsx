import type { Customer } from "@/types/customer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type CustomerAddressProps = {
  customer: Customer;
};

export default function CustomerAddress({
  customer,
}: CustomerAddressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Address
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Address
        </p>

        <p className="mt-1 text-sm text-slate-700">
          {customer.address}
        </p>
      </CardContent>
    </Card>
  );
}
