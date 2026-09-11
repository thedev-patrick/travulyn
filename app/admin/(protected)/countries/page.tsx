import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { deleteCountry } from "./actions";
import { ListSearch } from "@/components/admin/list-search";
import { ListPagination, paginationInfo } from "@/components/admin/list-pagination";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

export const metadata = {
  title: "Countries",
};

export default async function CountriesPage({ searchParams }: PageProps<"/admin/countries">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { isoCode: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const totalCount = await prisma.country.count({ where });
  const { currentPage, totalPages, skip, take } = paginationInfo(totalCount, page);

  const countries = await prisma.country.findMany({
    where,
    skip,
    take,
    orderBy: { name: "asc" },
    include: {
      _count: { select: { corridorsAsOrigin: true, corridorsAsDestination: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Countries</h1>
          <p className="mt-1 text-muted-foreground">
            The master list of countries available as origins and destinations.
          </p>
        </div>
        <Button render={<Link href="/admin/countries/new" />}>
          <Plus className="h-4 w-4" /> New country
        </Button>
      </div>

      <div className="mt-6">
        <ListSearch placeholder="Search by name or ISO code…" />
      </div>

      <div className="mt-4 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>ISO code</TableHead>
              <TableHead>Used in</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {countries.map((c) => {
              const corridorCount = c._count.corridorsAsOrigin + c._count.corridorsAsDestination;
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    {c.flagEmoji} {c.name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{c.isoCode}</TableCell>
                  <TableCell>{corridorCount} corridor(s)</TableCell>
                  <TableCell className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" render={<Link href={`/admin/countries/${c.id}`} />}>
                      Edit
                    </Button>
                    <DeleteConfirmDialog
                      title="Delete this country?"
                      description={`${c.name} will be permanently removed. This fails if any corridor or application uses it.`}
                      action={deleteCountry}
                      hiddenFields={{ id: c.id }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
            {countries.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  {q ? `No countries match "${q}".` : "No countries yet."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ListPagination currentPage={currentPage} totalPages={totalPages} searchParams={params} />
    </div>
  );
}
