import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const customers = [
  {
    name: "Ahmed Khan",
    contact: "+91 98765 43210",
    email: "ahmed@example.com",
    addedBy: "Employee 01",
  },
  {
    name: "Sara Thomas",
    contact: "+91 98765 12345",
    email: "sara@example.com",
    addedBy: "Employee 02",
  },
];

export default function RecentCustomers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Recent Customer Entries
        </CardTitle>
        <CardDescription>Recently added customer records.</CardDescription>
      </CardHeader>

      <CardContent className="overflow-x-auto px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Added By</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.email}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell className="text-slate-600">
                  {customer.contact}
                </TableCell>
                <TableCell className="text-slate-600">
                  {customer.email}
                </TableCell>
                <TableCell className="text-slate-600">
                  {customer.addedBy}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
