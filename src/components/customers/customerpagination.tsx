"use client";

import { Button } from "@/components/ui/button";

type CustomerPaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function CustomerPagination({
  currentPage,
  totalPages,
  onPageChange,
}: CustomerPaginationProps) {
  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <div className="mt-6 flex items-center justify-between">
      {/* Previous */}
      <Button
        type="button"
        variant="outline"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((page) => (
          <Button
            key={page}
            type="button"
            variant={
              currentPage === page
                ? "default"
                : "outline"
            }
            size="icon"
            onClick={() => onPageChange(page)}
            className={
              currentPage === page
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : ""
            }
          >
            {page}
          </Button>
        ))}
      </div>

      {/* Next */}
      <Button
        type="button"
        variant="outline"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </Button>
    </div>
  );
}