"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { uploadToCloudinary } from "@/lib/cloudinary";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const postSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(300),
  excerpt: z.string().trim().min(1, "Excerpt is required").max(500),
  contentMarkdown: z.string().trim().min(1, "Content is required"),
  published: z.coerce.boolean(),
});

export type BlogFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function saveBlogPost(
  _prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: "error", message: "Your session expired. Please sign in again." };
  }

  const parsed = postSchema.safeParse({
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    contentMarkdown: formData.get("contentMarkdown"),
    published: formData.get("published") === "on",
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const postId = formData.get("postId") as string | null;
  const coverImage = formData.get("coverImage") as File | null;

  let coverImageUrl: string | undefined;
  if (coverImage && coverImage.size > 0) {
    const uploaded = await uploadToCloudinary(coverImage, "travulyn/blog");
    coverImageUrl = uploaded.url;
  }

  const wasPublished = postId
    ? (await prisma.blogPost.findUnique({ where: { id: postId }, select: { published: true } }))?.published
    : false;

  const data = {
    title: parsed.data.title,
    excerpt: parsed.data.excerpt,
    contentMarkdown: parsed.data.contentMarkdown,
    published: parsed.data.published,
    ...(coverImageUrl ? { coverImageUrl } : {}),
    ...(parsed.data.published && !wasPublished ? { publishedAt: new Date() } : {}),
  };

  try {
    if (postId) {
      await prisma.blogPost.update({ where: { id: postId }, data });
    } else {
      await prisma.blogPost.create({
        data: { ...data, slug: slugify(parsed.data.title), authorId: session.user.id },
      });
    }
  } catch {
    return { status: "error", message: "A post with a similar title already exists." };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deleteBlogPost(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.blogPost.delete({ where: { id } });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}
