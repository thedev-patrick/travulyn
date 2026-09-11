import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BlogForm } from "@/components/admin/blog-form";

export const metadata = {
  title: "Edit Post",
};

export default async function EditBlogPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Edit blog post</h1>
      <div className="mt-6">
        <BlogForm post={post} />
      </div>
    </div>
  );
}
