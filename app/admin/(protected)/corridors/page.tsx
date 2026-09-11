import Link from "next/link";
import { cookies } from "next/headers";
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
import { deleteCorridor } from "./actions";
import { ListSearch } from "@/components/admin/list-search";
import { ListPagination, paginationInfo } from "@/components/admin/list-pagination";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  isSupportedCurrency,
  getExchangeRates,
  convertAmount,
  formatCurrency,
} from "@/lib/currency";

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

  const cookieStore = await cookies();
  const preferredCurrency = cookieStore.get(CURRENCY_COOKIE)?.value;
  const displayCurrency = isSupportedCurrency(preferredCurrency) ? preferredCurrency : DEFAULT_CURRENCY;

  const needsConversion = corridors.some((c) => c.currency !== displayCurrency);
  const rates = needsConversion ? await getExchangeRates() : null;

  const rows = corridors.map((c) => {
    let convertedLabel: string | null = null;
    if (c.currency !== displayCurrency && rates) {
      const min = convertAmount(Number(c.priceEstimateMin), c.currency, displayCurrency, rates);
      const max = convertAmount(Number(c.priceEstimateMax), c.currency, displayCurrency, rates);
      if (min !== null && max !== null) {
        convertedLabel = `≈ ${formatCurrency(min, displayCurrency)}–${formatCurrency(max, displayCurrency)}`;
      }
    }
    return { ...c, convertedLabel };
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
            {rows.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">
                  {c.originCountry.flagEmoji} {c.originCountry.name} → {c.destinationCountry.flagEmoji} {c.destinationCountry.name}
                </TableCell>
                <TableCell>
                  <p>
                    {c.currency} {Number(c.priceEstimateMin).toLocaleString()}–{Number(c.priceEstimateMax).toLocaleString()}
                  </p>
                  {c.convertedLabel && (
                    <p className="text-xs text-muted-foreground">{c.convertedLabel}</p>
                  )}
                </TableCell>
                <TableCell>{c.processingDays} days</TableCell>
                <TableCell>{c._count.documents}</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" render={<Link href={`/admin/corridors/${c.id}`} />}>
                    Edit
                  </Button>
                  <DeleteConfirmDialog
                    title="Delete this corridor?"
                    description={`${c.originCountry.name} → ${c.destinationCountry.name} and its document requirements will be permanently removed. This fails if any applications use it.`}
                    action={deleteCorridor}
                    hiddenFields={{ id: c.id }}
                  />
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
