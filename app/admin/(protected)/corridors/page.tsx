import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
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
import { deleteCorridor } from "./actions";
import { ListSearch } from "@/components/admin/list-search";
import { ListPagination, paginationInfo } from "@/components/admin/list-pagination";

export const metadata = {
  title: "Corridors & Pricing",
};

export default async function CorridorsPage({ searchParams }: PageProps<"/admin/corridors">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1;

  const where = q
    ? {
        OR: [
          { originCountry: { name: { contains: q, mode: "insensitive" as const } } },
          { destinationCountry: { name: { contains: q, mode: "insensitive" as const } } },
        ],
      }
    : undefined;

  const totalCount = await prisma.corridor.count({ where });
  const { currentPage, totalPages, skip, take } = paginationInfo(totalCount, page);

  const corridors = await prisma.corridor.findMany({
    where,
    skip,
    take,
    include: { originCountry: true, destinationCountry: true, _count: { select: { documents: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Corridors &amp; Pricing</h1>
          <p className="mt-1 text-muted-foreground">
            Manage price estimates and document requirements per country pair.
          </p>
        </div>
        <Button render={<Link href="/admin/corridors/new" />}>
          <Plus className="h-4 w-4" /> New corridor
        </Button>
      </div>

      <div className="mt-6">
        <ListSearch placeholder="Search by country…" />
      </div>

      <div className="mt-4 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Processing</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {corridors.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">
                  {c.originCountry.flagEmoji} {c.originCountry.name} → {c.destinationCountry.flagEmoji} {c.destinationCountry.name}
                </TableCell>
                <TableCell>
                  {c.currency} {Number(c.priceEstimateMin).toLocaleString()}–{Number(c.priceEstimateMax).toLocaleString()}
                </TableCell>
                <TableCell>{c.processingDays} days</TableCell>
                <TableCell>{c._count.documents}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" render={<Link href={`/admin/corridors/${c.id}`} />}>
                    Edit
                  </Button>
                  <form action={deleteCorridor}>
                    <input type="hidden" name="id" value={c.id} />
                    <Button variant="ghost" size="icon-sm" type="submit">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
            {corridors.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  {q ? `No corridors match "${q}".` : "No corridors yet."}
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
