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

export const metadata = {
  title: "Corridors & Pricing",
};

export default async function CorridorsPage() {
  const corridors = await prisma.corridor.findMany({
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

      <div className="mt-6 rounded-lg border">
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
                  No corridors yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
