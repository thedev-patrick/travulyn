import Link from "next/link";
import { ArrowRight, FileCheck2, MessagesSquare, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getPublishedBlogPosts, getTestimonials } from "@/lib/queries";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { ParallaxBlobs } from "@/components/site/parallax-blobs";
import { FlightPath } from "@/components/site/flight-path";

const features = [
  {
    icon: FileCheck2,
    title: "Know what you need",
    body: "Pick your origin and destination to see the exact document checklist and price estimate.",
  },
  {
    icon: ShieldCheck,
    title: "Track your progress",
    body: "Once onboarded, we send you a private link to check the status of every document, any time.",
  },
  {
    icon: MessagesSquare,
    title: "Real human support",
    body: "Our team reviews every document you submit and keeps you updated at each step.",
  },
];

export default async function HomePage() {
  const [posts, testimonials] = await Promise.all([
    getPublishedBlogPosts(),
    getTestimonials(true),
  ]);

  return (
    <div className="overflow-x-clip">
      <section className="relative isolate overflow-hidden border-b">
        <ParallaxBlobs className="pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-20 sm:px-6 md:grid-cols-[1.1fr_0.9fr] md:py-28">
          <div className="flex flex-col gap-6">
            <div
              className="inline-flex w-fit items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Visa &amp; travel document specialists
            </div>
            <h1 className="max-w-xl font-heading text-4xl leading-[1.05] font-medium tracking-tight sm:text-5xl md:text-6xl">
              Travel documents,{" "}
              <span className="italic text-primary">sorted</span> — start to finish.
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground">
              Travulyn helps travellers understand exactly what documents they need,
              what it costs, and tracks every step of their application — from
              onboarding to approval.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button size="lg" className="group" render={<Link href="/destinations" />}>
                Check requirements
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
              <Button size="lg" variant="outline" render={<Link href="/contact" />}>
                Talk to us
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md md:max-w-none">
            <FlightPath className="w-full" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <RevealGroup className="grid gap-6 sm:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <RevealItem key={f.title}>
                <TiltCard className="h-full rounded-xl">
                  <Card className="h-full transition-shadow duration-300 hover:shadow-lg">
                    <CardContent className="flex flex-col gap-3 pt-6">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="font-heading text-lg font-medium">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.body}</p>
                    </CardContent>
                  </Card>
                </TiltCard>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </section>

      {testimonials.length > 0 && (
        <section className="border-t bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
            <Reveal>
              <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
                What travellers say
              </h2>
            </Reveal>
            <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2">
              {testimonials.slice(0, 4).map((t) => (
                <RevealItem key={t.id}>
                  <TiltCard className="h-full rounded-xl" glare={false}>
                    <Card className="h-full transition-shadow duration-300 hover:shadow-lg">
                      <CardContent className="pt-6">
                        <p className="font-heading text-2xl leading-none text-primary/40">&ldquo;</p>
                        <p className="-mt-3 text-muted-foreground">{t.quote}</p>
                        <p className="mt-4 text-sm font-medium">{t.customerName}</p>
                        {t.countryContext && (
                          <p className="text-xs text-muted-foreground">{t.countryContext}</p>
                        )}
                      </CardContent>
                    </Card>
                  </TiltCard>
                </RevealItem>
              ))}
            </RevealGroup>
            <Reveal delay={0.1}>
              <Button variant="link" className="group mt-4 px-0" render={<Link href="/testimonials" />}>
                Read more stories
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Button>
            </Reveal>
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
              From the blog
            </h2>
          </Reveal>
          <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <RevealItem key={post.id}>
                <Link href={`/blog/${post.slug}`}>
                  <TiltCard className="h-full rounded-xl" glare={false}>
                    <Card className="h-full transition-shadow duration-300 hover:shadow-lg">
                      <CardContent className="pt-6">
                        <h3 className="font-heading text-lg font-medium">{post.title}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.excerpt}</p>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </Link>
              </RevealItem>
            ))}
          </RevealGroup>
        </section>
      )}

      <section className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-20 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Reveal>
            <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
              Ready to get started?
            </h2>
            <p className="mt-1 text-muted-foreground">Reach out and our team will onboard you and track your progress.</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Button size="lg" className="group" render={<Link href="/contact" />}>
              Contact Travulyn
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
