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
    <div className="mt-6">

      {/* Mobile: Previous / page indicator / Next */}
      <div className="flex items-center justify-between gap-3 sm:hidden">
        <Button
          type="button"
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>

        <p className="text-sm text-slate-500">
          Page {currentPage} of {totalPages}
        </p>

        <Button
          type="button"
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>

      {/* Desktop: Previous / page numbers / Next */}
      <div className="hidden items-center justify-between sm:flex">
        <Button
          type="button"
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </Button>

        <div className="flex items-center gap-2 overflow-x-auto">
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
                  ? "shrink-0 bg-blue-600 text-white hover:bg-blue-700"
                  : "shrink-0"
              }
            >
              {page}
            </Button>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>

    </div>
  );
}
