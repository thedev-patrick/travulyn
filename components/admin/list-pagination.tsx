import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PAGE_SIZE = 10;

export function paginationInfo(totalCount: number, page: number) {
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  return {
    totalPages,
    currentPage,
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  };
}

export function ListPagination({
  currentPage,
  totalPages,
  searchParams,
}: {
  currentPage: number;
  totalPages: number;
  /** The resolved searchParams object for the current page, so filters survive navigation. */
  searchParams: Record<string, string | string[] | undefined>;
}) {
  if (totalPages <= 1) return null;

  function hrefFor(page: number) {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(searchParams)) {
      if (key === "page" || val === undefined) continue;
      params.set(key, Array.isArray(val) ? val[0] : val);
    }
    params.set("page", String(page));
    return `?${params.toString()}`;
  }

  return (
    <div className="mt-4 flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          render={currentPage > 1 ? <Link href={hrefFor(currentPage - 1)} /> : undefined}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          render={currentPage < totalPages ? <Link href={hrefFor(currentPage + 1)} /> : undefined}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
