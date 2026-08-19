"use client";

import { useState } from "react";
import Link from "next/link";

import type { Employee } from "@/types/employee";

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

type EmployeeTableProps = {
  employees: Employee[];
  onDeactivate: (employeeId: string) => void;
};

export default function EmployeeTable({
  employees,
  onDeactivate,
}: EmployeeTableProps) {
  const [employeeToDeactivate, setEmployeeToDeactivate] =
    useState<Employee | null>(null);

  return (
    <>
      {/* Employee Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            {/* Header */}
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="px-6 font-medium text-slate-500">
                  #
                </TableHead>

                <TableHead className="px-6 font-medium text-slate-500">
                  Employee Name
                </TableHead>

                <TableHead className="px-6 font-medium text-slate-500">
                  Email
                </TableHead>

                <TableHead className="px-6 font-medium text-slate-500">
                  Contact
                </TableHead>

                <TableHead className="px-6 font-medium text-slate-500">
                  Role
                </TableHead>

                <TableHead className="px-6 font-medium text-slate-500">
                  Status
                </TableHead>

                <TableHead className="px-6 font-medium text-slate-500">
                  Joined Date
                </TableHead>

                <TableHead className="px-6 font-medium text-slate-500">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* Body */}
            <TableBody>
              {employees.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-slate-500"
                  >
                    No employees found.
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    className="hover:bg-slate-50"
                  >
                    {/* ID */}
                    <TableCell className="px-6 text-xs text-slate-500">
                      {employee.id}
                    </TableCell>

                    {/* Name */}
                    <TableCell className="px-6 font-medium text-slate-900">
                      {employee.name}
                    </TableCell>

                    {/* Email */}
                    <TableCell className="px-6 text-slate-600">
                      {employee.email}
                    </TableCell>

                    {/* Contact */}
                    <TableCell className="px-6 text-slate-600">
                      {employee.contact}
                    </TableCell>

                    {/* Role */}
                    <TableCell className="px-6">
                      <Badge
                        variant="outline"
                        className="border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-50"
                      >
                        {employee.role}
                      </Badge>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="px-6">
                      <Badge
                        variant="outline"
                        className={
                          employee.status === "ACTIVE"
                            ? "border-green-200 bg-green-50 text-green-600 hover:bg-green-50"
                            : "border-slate-200 bg-slate-100 text-slate-500 hover:bg-slate-100"
                        }
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>

                    {/* Joined Date */}
                    <TableCell className="px-6 text-slate-600">
                      {employee.joinedDate}
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="px-6">
                      <div className="flex items-center gap-2">
                        {/* View */}
                        <Link
                          href={`/Super_Admin/employees/${employee.id}`}
                          className="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                        >
                          View
                        </Link>

                        {/* Edit */}
                        <Link
                          href={`/Super_Admin/employees/${employee.id}/edit`}
                          className="inline-flex h-8 items-center justify-center rounded-md px-3 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                          Edit
                        </Link>

                        {/* Deactivate */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={
                            employee.status ===
                            "INACTIVE"
                          }
                          onClick={() =>
                            setEmployeeToDeactivate(
                              employee
                            )
                          }
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          {employee.status ===
                          "INACTIVE"
                            ? "Inactive"
                            : "Deactivate"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Deactivate Confirmation Dialog */}
      <Dialog
        open={!!employeeToDeactivate}
        onOpenChange={(open) => {
          if (!open) {
            setEmployeeToDeactivate(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Deactivate Employee?
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to deactivate{" "}
              <span className="font-semibold text-slate-900">
                {employeeToDeactivate
                  ? employeeToDeactivate.name
                  : ""}
              </span>
              ?
            </DialogDescription>
          </DialogHeader>

          <div className="text-sm text-slate-500">
            The employee will remain in the system, but
            their status will become inactive.
          </div>

          <DialogFooter>
            {/* Cancel */}
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setEmployeeToDeactivate(null)
              }
            >
              Cancel
            </Button>

            {/* Confirm */}
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (!employeeToDeactivate) {
                  return;
                }

                const employeeId =
                  employeeToDeactivate.id;

                onDeactivate(employeeId);

                setEmployeeToDeactivate(null);
              }}
            >
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}