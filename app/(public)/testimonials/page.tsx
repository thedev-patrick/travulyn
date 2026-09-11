import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getTestimonials } from "@/lib/queries";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { TiltCard } from "@/components/motion/tilt-card";

export const metadata = {
  title: "Testimonials",
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Reveal>
        <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">Traveller stories</h1>
        <p className="mt-2 text-muted-foreground">Real feedback from people we&apos;ve helped get where they&apos;re going.</p>
      </Reveal>

      {testimonials.length === 0 ? (
        <p className="mt-10 text-muted-foreground">No testimonials yet.</p>
      ) : (
        <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2" stagger={0.06}>
          {testimonials.map((t) => (
            <RevealItem key={t.id}>
              <TiltCard className="h-full rounded-xl">
                <Card className="h-full transition-shadow duration-300 hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < t.rating ? "fill-primary text-primary" : "text-muted-foreground"}`}
                        />
                      ))}
                    </div>
                    <p className="mt-3 font-heading text-3xl leading-none text-primary/30">&ldquo;</p>
                    <p className="-mt-4 text-muted-foreground">{t.quote}</p>
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
      )}
    </div>
  );
}
