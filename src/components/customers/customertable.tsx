"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  Customer,
  EmailStatus,
} from "@/types/customer";

type CustomerTableProps = {
  customers: Customer[];
  onDelete: (customerId: string) => void;
};

export default function CustomerTable({
  customers,
  onDelete,
}: CustomerTableProps) {
  const [customerToDelete, setCustomerToDelete] =
    useState<Customer | null>(null);

  /*
   * Get full customer name
   */
  const getCustomerName = (customer: Customer) => {
    return [
      customer.firstName,
      customer.middleName,
      customer.lastName,
    ]
      .filter(Boolean)
      .join(" ");
  };

  /*
   * Format customer creation date
   */
  const getCustomerDate = (customer: Customer) => {
    return new Date(
      customer.createdAt
    ).toLocaleDateString();
  };

  /*
   * Email status badge
   */
  const getEmailStatus = (
    status: EmailStatus
  ) => {
    switch (status) {
      case "SENT":
        return {
          label: "Sent",
          className:
            "border-green-200 bg-green-100 text-green-700 hover:bg-green-100",
        };

      case "FAILED":
        return {
          label: "Failed",
          className:
            "border-red-200 bg-red-100 text-red-700 hover:bg-red-100",
        };

      case "PENDING":
      default:
        return {
          label: "Pending",
          className:
            "border-yellow-200 bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
        };
    }
  };

  return (
    <>
      {/* Customer Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            {/* Table Header */}
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="px-6 font-medium text-slate-500">
                  #
                </TableHead>

                <TableHead className="px-6 font-medium text-slate-500">
                  Full Name
                </TableHead>

                <TableHead className="px-6 font-medium text-slate-500">
                  Contact
                </TableHead>

                <TableHead className="px-6 font-medium text-slate-500">
                  Email
                </TableHead>

                <TableHead className="px-6 font-medium text-slate-500">
                  Email Status
                </TableHead>

                <TableHead className="px-6 font-medium text-slate-500">
                  Date Added
                </TableHead>

                <TableHead className="px-6 font-medium text-slate-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody>
              {customers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="h-24 text-center text-slate-500"
                  >
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                customers.map((customer) => {
                  const emailStatus =
                    getEmailStatus(
                      customer.emailStatus
                    );

                  return (
                    <TableRow
                      key={customer.id}
                      className="hover:bg-slate-50"
                    >
                      {/* ID */}
                      <TableCell className="px-6 text-xs text-slate-500">
                        {customer.id}
                      </TableCell>

                      {/* Full Name */}
                      <TableCell className="px-6 font-medium text-slate-900">
                        {getCustomerName(customer)}
                      </TableCell>

                      {/* Contact */}
                      <TableCell className="px-6 text-slate-600">
                        {customer.contactNumber1}
                      </TableCell>

                      {/* Email */}
                      <TableCell className="px-6 text-slate-600">
                        {customer.email}
                      </TableCell>

                      {/* Email Status */}
                      <TableCell className="px-6">
                        <Badge
                          variant="outline"
                          className={
                            emailStatus.className
                          }
                        >
                          {emailStatus.label}
                        </Badge>
                      </TableCell>

                      {/* Date Added */}
                      <TableCell className="px-6 text-slate-600">
                        {getCustomerDate(customer)}
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="px-6">
                        <div className="flex items-center gap-2">
                          {/* View */}
                          <Link
                            href={`/Super_Admin/customers/${customer.id}`}
                            className="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                          >
                            View
                          </Link>

                          {/* Edit */}
                          <Link
                            href={`/Super_Admin/customers/${customer.id}/edit`}
                            className="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                          >
                            Edit
                          </Link>

                          {/* Delete */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setCustomerToDelete(
                                customer
                              )
                            }
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delete Customer Dialog */}
      <Dialog
        open={!!customerToDelete}
        onOpenChange={(open) => {
          if (!open) {
            setCustomerToDelete(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Delete Customer?
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-slate-900">
                {customerToDelete
                  ? getCustomerName(
                      customerToDelete
                    )
                  : ""}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            {/* Cancel */}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setCustomerToDelete(null)
              }
            >
              Cancel
            </Button>

            {/* Confirm Delete */}
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (!customerToDelete) {
                  return;
                }

                onDelete(customerToDelete.id);

                setCustomerToDelete(null);
              }}
            >
              Delete Customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}