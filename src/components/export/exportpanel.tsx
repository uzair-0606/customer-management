"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import type { Customer } from "@/types/customer";

type ExportPanelProps = {
  totalCustomers: number;
  allCustomers: Customer[];
  filteredCustomers: Customer[];
  activeFilters: string[];
};

type ExportFormat = "CSV" | "EXCEL";
type ExportScope = "ALL" | "FILTERED";

export default function ExportPanel({
  totalCustomers,
  allCustomers,
  filteredCustomers,
  activeFilters,
}: ExportPanelProps) {
  const [format, setFormat] =
    useState<ExportFormat>("CSV");

  const [scope, setScope] =
    useState<ExportScope>("ALL");

  const [exporting, setExporting] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const customersToExport =
    scope === "ALL"
      ? allCustomers
      : filteredCustomers;

  const recordCount =
    customersToExport.length;

  /*
   * Convert customers into
   * export-friendly rows.
   */
  const getExportRows = () => {
    return customersToExport.map(
      (customer) => ({
        ID: customer.id,

        Name: [
          customer.firstName,
          customer.middleName,
          customer.lastName,
        ]
          .filter(Boolean)
          .join(" "),

        Age: customer.age,

        "Contact Number 1":
          customer.contactNumber1,

        "Contact Number 2":
          customer.contactNumber2 || "",

        Email: customer.email,

        Address: customer.address,

        "Created By":
          customer.createdById,

        "Created Date":
          new Date(
            customer.createdAt
          ).toLocaleDateString(),
      })
    );
  };

  /*
   * Export handler
   */
  const handleExport = () => {
    if (recordCount === 0) {
      return;
    }

    setExporting(true);
    setMessage("");

    try {
      const exportRows =
        getExportRows();

      /*
       * CSV
       */
      if (format === "CSV") {
        const headers =
          Object.keys(exportRows[0]);

        const rows =
          exportRows.map((row) =>
            headers.map(
              (header) =>
                row[
                  header as keyof typeof row
                ]
            )
          );

        const csvContent = [
          headers,
          ...rows,
        ]
          .map((row) =>
            row
              .map((value) => {
                const text =
                  String(value ?? "");

                return `"${text.replace(
                  /"/g,
                  '""'
                )}"`;
              })
              .join(",")
          )
          .join("\n");

        const blob = new Blob(
          [csvContent],
          {
            type:
              "text/csv;charset=utf-8;",
          }
        );

        const url =
          URL.createObjectURL(blob);

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          scope === "FILTERED"
            ? "filtered-customers.csv"
            : "customers.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        setMessage(
          `${recordCount} customer${
            recordCount !== 1
              ? "s"
              : ""
          } exported successfully as CSV.`
        );

        return;
      }

      /*
       * Excel
       */
      const worksheet =
        XLSX.utils.json_to_sheet(
          exportRows
        );

      /*
       * Automatically size columns.
       */
      const columnWidths =
        Object.keys(
          exportRows[0]
        ).map((key) => {
          const maxLength =
            Math.max(
              key.length,
              ...exportRows.map(
                (row) =>
                  String(
                    row[
                      key as keyof typeof row
                    ] ?? ""
                  ).length
              )
            );

          return {
            wch: Math.min(
              Math.max(
                maxLength + 2,
                12
              ),
              40
            ),
          };
        });

      worksheet["!cols"] =
        columnWidths;

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Customers"
      );

      XLSX.writeFile(
        workbook,
        scope === "FILTERED"
          ? "filtered-customers.xlsx"
          : "customers.xlsx"
      );

      setMessage(
        `${recordCount} customer${
          recordCount !== 1
            ? "s"
            : ""
        } exported successfully as Excel.`
      );
    } catch (error) {
      console.error(
        "Export failed:",
        error
      );

      setMessage(
        "Export failed. Please try again."
      );
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card>

      {/* Header */}
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-slate-900">
          Export Customer Data
        </CardTitle>

        <CardDescription>
          Choose the customer records and
          format you want to export.
        </CardDescription>
      </CardHeader>

      <CardContent>

      {/* Export Options */}
      <div className="grid gap-5 md:grid-cols-2">

        {/* Records */}
        <div className="space-y-2">
          <label
            htmlFor="export-scope"
            className="block text-sm font-medium text-slate-700"
          >
            Records to Export
          </label>

          <Select
            value={scope}
            onValueChange={(value) => setScope((value ?? "ALL") as ExportScope)}
          >
            <SelectTrigger id="export-scope" className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ALL">
                All Customers ({totalCustomers})
              </SelectItem>

              <SelectItem value="FILTERED">
                Filtered Customers ({filteredCustomers.length})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Format */}
        <div className="space-y-2">
          <label
            htmlFor="export-format"
            className="block text-sm font-medium text-slate-700"
          >
            Export Format
          </label>

          <Select
            value={format}
            onValueChange={(value) => setFormat((value ?? "CSV") as ExportFormat)}
          >
            <SelectTrigger id="export-format" className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="CSV">CSV</SelectItem>
              <SelectItem value="EXCEL">Excel</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-lg bg-slate-50 p-4">
        <p className="text-sm text-slate-500">
          Records to export
        </p>

        <p className="mt-1 text-2xl font-bold text-slate-900">
          {recordCount}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {scope === "ALL"
            ? "All available customers"
            : "Customers matching the current filters"}
        </p>
      </div>

      {/* Active Filters */}
      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-slate-700">
          Active Filters
        </p>

        {activeFilters.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(
              (filter) => (
                <Badge
                  key={filter}
                  className="bg-blue-50 text-blue-600 hover:bg-blue-50"
                >
                  {filter}
                </Badge>
              )
            )}
          </div>
        ) : (
          <p className="text-sm text-slate-500">
            No filters are currently applied.
          </p>
        )}
      </div>

      {/* Preview */}
      <div className="mt-8">

        <div className="mb-3">
          <h3 className="text-sm font-semibold text-slate-900">
            Customer Preview
          </h3>

          <p className="mt-1 text-xs text-slate-500">
            {scope === "ALL"
              ? "Preview of all available customers."
              : "Preview of customers matching your current filters."}
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <Table>

            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created Date</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>

              {customersToExport.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center"
                  >
                    <p className="text-sm font-medium text-slate-700">
                      No customers found.
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Try changing your filters.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                customersToExport.map(
                  (customer) => {
                    const fullName = [
                      customer.firstName,
                      customer.middleName,
                      customer.lastName,
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <TableRow key={customer.id}>
                        <TableCell className="text-xs text-slate-500">
                          {customer.id}
                        </TableCell>

                        <TableCell className="font-medium text-slate-900">
                          {fullName}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {customer.age}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {customer.contactNumber1}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {customer.email}
                        </TableCell>

                        <TableCell className="text-slate-600">
                          {new Date(
                            customer.createdAt
                          ).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )
              )}

            </TableBody>
          </Table>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="mt-6 flex items-center justify-between">

        <p className="text-sm text-slate-500">
          Format:{" "}
          <span className="font-medium text-slate-900">
            {format === "CSV"
              ? "CSV"
              : "Excel"}
          </span>
        </p>

        <Button
          type="button"
          onClick={handleExport}
          disabled={
            exporting ||
            recordCount === 0
          }
        >
          {exporting
            ? "Preparing Export..."
            : `Export ${recordCount} ${
                recordCount === 1
                  ? "Customer"
                  : "Customers"
              }`}
        </Button>
      </div>

      {/* Message */}
      {message && (
        <Alert
          className={
            message.includes("failed")
              ? "mt-5 border-red-200 bg-red-50 text-red-700 [&>svg]:text-red-600"
              : "mt-5 border-green-200 bg-green-50 text-green-700 [&>svg]:text-green-600"
          }
        >
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      </CardContent>
    </Card>
  );
}