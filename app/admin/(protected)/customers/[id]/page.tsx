import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { prisma } from "@/lib/prisma";
import { ApplicationStatusBadge } from "@/components/status-badge";

export const metadata = {
  title: "Customer Profile",
};

export default async function CustomerProfilePage({ params }: PageProps<"/admin/customers/[id]">) {
  const { id } = await params;

  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      applications: {
        orderBy: { createdAt: "desc" },
        include: { originCountry: true, destinationCountry: true },
      },
    },
  });

  if (!customer) notFound();

  return (
    <div className="grid max-w-4xl gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{customer.fullName}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> {customer.email}
          </p>
          {customer.phone && (
            <p className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> {customer.phone}
            </p>
          )}
          <p>Customer since {customer.createdAt.toLocaleDateString()}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Applications</CardTitle>
          <Button size="sm" render={<Link href={`/admin/customers/${customer.id}/applications/new`} />}>
            <Plus className="h-4 w-4" /> New application
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Route</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.applications.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      {a.originCountry.flagEmoji} {a.originCountry.name} → {a.destinationCountry.flagEmoji}{" "}
                      {a.destinationCountry.name}
                    </TableCell>
                    <TableCell>
                      <ApplicationStatusBadge status={a.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{a.createdAt.toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        render={<Link href={`/admin/customers/${customer.id}/applications/${a.id}`} />}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {customer.applications.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No applications yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
