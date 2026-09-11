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
import { deleteDocument } from "./actions";

export const metadata = {
  title: "Document Types",
};

export default async function DocumentsPage() {
  const documents = await prisma.requiredDocument.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { corridors: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Document Types</h1>
          <p className="mt-1 text-muted-foreground">
            The master list of document types available to attach to corridors.
          </p>
        </div>
        <Button render={<Link href="/admin/documents/new" />}>
          <Plus className="h-4 w-4" /> New document type
        </Button>
      </div>

      <div className="mt-6 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Used in</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-medium">{d.name}</TableCell>
                <TableCell className="max-w-md text-muted-foreground">{d.description}</TableCell>
                <TableCell>{d._count.corridors} corridor(s)</TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" render={<Link href={`/admin/documents/${d.id}`} />}>
                    Edit
                  </Button>
                  <form action={deleteDocument}>
                    <input type="hidden" name="id" value={d.id} />
                    <Button variant="ghost" size="icon-sm" type="submit">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
            {documents.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  No document types yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
