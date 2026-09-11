import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Customers",
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ONBOARDED: "secondary",
  DOCS_PENDING: "outline",
  IN_REVIEW: "default",
  APPROVED: "default",
  COMPLETED: "secondary",
};

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      applications: {
        orderBy: { createdAt: "desc" },
        include: { destinationCountry: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="mt-1 text-muted-foreground">Onboard customers and track their document progress.</p>
        </div>
        <Button render={<Link href="/admin/customers/new" />}>
          <Plus className="h-4 w-4" /> Onboard customer
        </Button>
      </div>

      <div className="mt-6 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Applications</TableHead>
              <TableHead>Latest status</TableHead>
              <TableHead>Added</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((c) => {
              const latest = c.applications[0];
              return (
                <TableRow key={c.id}>
                  <TableCell>
                    <p className="font-medium">{c.fullName}</p>
                    <p className="text-xs text-muted-foreground">{c.email}</p>
                  </TableCell>
                  <TableCell>
                    {c.applications.length === 0
                      ? "—"
                      : `${c.applications.length} trip${c.applications.length > 1 ? "s" : ""}`}
                    {latest && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (latest: {latest.destinationCountry.flagEmoji} {latest.destinationCountry.name})
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {latest ? (
                      <Badge variant={statusVariant[latest.status]}>{latest.status.replace("_", " ")}</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">No applications yet</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {c.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" render={<Link href={`/admin/customers/${c.id}`} />}>
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {customers.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No customers yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
