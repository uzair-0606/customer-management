"use client";

import { Input } from "@/components/ui/input";

type CustomerSearchProps = {
  search: string;
  onSearchChange: (value: string) => void;
};

export default function CustomerSearch({
  search,
  onSearchChange,
}: CustomerSearchProps) {
  return (
    <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm">
      <label
        htmlFor="customer-search"
        className="mb-2 block text-sm font-medium text-slate-700"
      >
        Search Customers
      </label>

      <Input
        id="customer-search"
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search by name, email or contact number..."
        className="h-11"
      />
    </div>
  );
}