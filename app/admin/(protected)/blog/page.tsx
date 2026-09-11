import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
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
import { deleteBlogPost } from "./actions";
import { ListSearch } from "@/components/admin/list-search";
import { ListPagination, paginationInfo } from "@/components/admin/list-pagination";

export const metadata = {
  title: "Blog",
};

export default async function AdminBlogPage({ searchParams }: PageProps<"/admin/blog">) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : undefined;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) || 1 : 1;

  const where = q ? { title: { contains: q, mode: "insensitive" as const } } : undefined;

  const totalCount = await prisma.blogPost.count({ where });
  const { currentPage, totalPages, skip, take } = paginationInfo(totalCount, page);

  const posts = await prisma.blogPost.findMany({
    where,
    skip,
    take,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-1 text-muted-foreground">Write and publish posts for the landing page.</p>
        </div>
        <Button render={<Link href="/admin/blog/new" />}>
          <Plus className="h-4 w-4" /> New post
        </Button>
      </div>

      <div className="mt-6">
        <ListSearch placeholder="Search posts…" />
      </div>

      <div className="mt-4 rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell>{p.author.name}</TableCell>
                <TableCell>
                  <Badge variant={p.published ? "default" : "outline"}>
                    {p.published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" render={<Link href={`/admin/blog/${p.id}`} />}>
                    Edit
                  </Button>
                  <form action={deleteBlogPost}>
                    <input type="hidden" name="id" value={p.id} />
                    <Button variant="ghost" size="icon-sm" type="submit">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  {q ? `No posts match "${q}".` : "No posts yet."}
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
