import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getPublishedBlogPosts } from "@/lib/queries";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";

export const metadata = {
  title: "Blog",
};

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Reveal>
        <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">Blog</h1>
        <p className="mt-2 text-muted-foreground">Tips and updates from the Travulyn team.</p>
      </Reveal>

      {posts.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No posts published yet — check back soon.</p>
      ) : (
        <RevealGroup className="mt-10 grid gap-5" stagger={0.06}>
          {posts.map((post) => (
            <RevealItem key={post.id}>
              <Link href={`/blog/${post.slug}`} className="block">
                <TiltCard className="rounded-xl" glare={false}>
                  <Card className="transition-shadow duration-300 hover:shadow-lg">
                    <CardContent className="flex items-start justify-between gap-4 pt-6">
                      <div>
                        <p className="text-xs text-muted-foreground">
                          {post.publishedAt?.toLocaleDateString(undefined, {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}{" "}
                          &middot; {post.author.name}
                        </p>
                        <h2 className="mt-1 font-heading text-xl font-medium">{post.title}</h2>
                        <p className="mt-2 text-muted-foreground">{post.excerpt}</p>
                      </div>
                      <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </CardContent>
                  </Card>
                </TiltCard>
              </Link>
            </RevealItem>
          ))}
        </RevealGroup>
      )}
    </div>
  );
}
