import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { marked } from "marked";
import { getBlogPostBySlug } from "@/lib/queries";
import { Reveal } from "@/components/motion/reveal";

// Posts are published live via the admin CMS, so this page must render
// per-request rather than being cached from build time.
export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const html = await marked.parse(post.contentMarkdown);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Reveal>
        <Link
          href="/blog"
          className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
          Back to blog
        </Link>
        <p className="mt-6 text-xs text-muted-foreground">
          {post.publishedAt?.toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          &middot; {post.author.name}
        </p>
        <h1 className="mt-2 font-heading text-3xl font-medium tracking-tight sm:text-4xl">{post.title}</h1>
      </Reveal>
      {post.coverImageUrl && (
        <Reveal delay={0.05}>
          <Image
            src={post.coverImageUrl}
            alt=""
            width={1200}
            height={630}
            className="mt-6 w-full rounded-xl border object-cover"
          />
        </Reveal>
      )}
      <Reveal delay={0.1}>
        <div
          className="prose prose-neutral mt-8 max-w-none dark:prose-invert prose-headings:font-heading prose-headings:font-medium prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </Reveal>
    </article>
  );
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}
