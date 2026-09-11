import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { deleteTestimonial } from "./actions";
import { ListSearch } from "@/components/admin/list-search";
import { ListPagination, paginationInfo } from "@/components/admin/list-pagination";
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog";

export const metadata = {
  title: "Testimonials",
};

export default async function AdminTestimonialsPage({ searchParams }: PageProps<"/admin/testimonials">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1;

  const where = q
    ? {
        OR: [
          { customerName: { contains: q, mode: "insensitive" as const } },
          { quote: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const totalCount = await prisma.testimonial.count({ where });
  const { currentPage, totalPages, skip, take } = paginationInfo(totalCount, page);

  const testimonials = await prisma.testimonial.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Testimonials</h1>
          <p className="mt-1 text-muted-foreground">Customer stories shown on the landing page.</p>
        </div>
        <Button render={<Link href="/admin/testimonials/new" />}>
          <Plus className="h-4 w-4" /> New testimonial
        </Button>
      </div>

      <div className="mt-6">
        <ListSearch placeholder="Search testimonials…" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between gap-2">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < t.rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                  ))}
                </div>
                {t.featured && <Badge variant="secondary">Featured</Badge>}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-3 text-sm font-medium">{t.customerName}</p>
              {t.countryContext && <p className="text-xs text-muted-foreground">{t.countryContext}</p>}
              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" render={<Link href={`/admin/testimonials/${t.id}`} />}>
                  Edit
                </Button>
                <DeleteConfirmDialog
                  title="Delete this testimonial?"
                  description={`The quote from ${t.customerName} will be permanently removed from the landing page.`}
                  action={deleteTestimonial}
                  hiddenFields={{ id: t.id }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
        {testimonials.length === 0 && (
          <p className="text-muted-foreground">
            {q ? `No testimonials match "${q}".` : "No testimonials yet."}
          </p>
        )}
      </div>

      <ListPagination currentPage={currentPage} totalPages={totalPages} searchParams={params} />
    </div>
  );
}
