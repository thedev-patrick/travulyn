import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { toggleInquiryHandled } from "./actions";
import { ListSearch } from "@/components/admin/list-search";
import { ListPagination, paginationInfo } from "@/components/admin/list-pagination";

export const metadata = {
  title: "Inquiries",
};

export default async function InquiriesPage({ searchParams }: PageProps<"/admin/inquiries">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { email: { contains: q, mode: "insensitive" as const } },
          { message: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const totalCount = await prisma.inquiry.count({ where });
  const { currentPage, totalPages, skip, take } = paginationInfo(totalCount, page);

  const inquiries = await prisma.inquiry.findMany({ where, skip, take, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Inquiries</h1>
      <p className="mt-1 text-muted-foreground">Messages submitted through the contact form.</p>

      <div className="mt-6">
        <ListSearch placeholder="Search inquiries…" />
      </div>

      <div className="mt-4 grid gap-4">
        {inquiries.map((i) => (
          <Card key={i.id}>
            <CardContent className="flex flex-wrap items-start justify-between gap-4 pt-6">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium">{i.name}</p>
                  <Badge variant={i.handled ? "secondary" : "default"}>
                    {i.handled ? "Handled" : "New"}
                  </Badge>
                </div>
                <a href={`mailto:${i.email}`} className="text-sm text-muted-foreground hover:text-foreground">
                  {i.email}
                </a>
                <p className="mt-2 max-w-xl text-sm">{i.message}</p>
                <p className="mt-2 text-xs text-muted-foreground">{i.createdAt.toLocaleString()}</p>
              </div>
              <form action={toggleInquiryHandled}>
                <input type="hidden" name="id" value={i.id} />
                <input type="hidden" name="handled" value={String(i.handled)} />
                <Button type="submit" size="sm" variant="outline">
                  Mark as {i.handled ? "new" : "handled"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ))}
        {inquiries.length === 0 && (
          <p className="text-muted-foreground">
            {q ? `No inquiries match "${q}".` : "No inquiries yet."}
          </p>
        )}
      </div>

      <ListPagination currentPage={currentPage} totalPages={totalPages} searchParams={params} />
    </div>
  );
}
