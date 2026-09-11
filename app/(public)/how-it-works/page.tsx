import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { HowItWorksPlayer } from "@/components/site/how-it-works-player";

export const metadata = {
  title: "How It Works",
};

const forTeams = [
  "Manage corridors, pricing, and document requirements from one dashboard.",
  "Turn inquiries into customers and generate a private portal link per application.",
  "Review uploaded documents, approve or reject them, and post progress updates.",
];

const forCustomers = [
  "Check document requirements and pricing for your route before you commit.",
  "Get a private portal link — no account or password needed.",
  "Upload documents and watch your status update in real time.",
];

export default function HowItWorksPage() {
  return (
    <div>
      <section className="border-b">
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <Reveal>
            <div className="mx-auto inline-flex w-fit items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              A walkthrough
            </div>
            <h1 className="mt-4 font-heading text-3xl font-medium tracking-tight sm:text-4xl">
              See Travulyn in action
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              From a traveller&apos;s first inquiry to an approved application — here&apos;s how
              customers and our admin team use Travulyn together.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Reveal>
          <HowItWorksPlayer />
        </Reveal>
      </section>

      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <Reveal>
            <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
              Built for both sides
            </h2>
          </Reveal>
          <RevealGroup className="mt-8 grid gap-6 sm:grid-cols-2" stagger={0.06}>
            <RevealItem>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col pt-6">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-warm/15 px-2.5 py-1 text-xs font-medium text-brand-warm">
                    For your team
                  </span>
                  <ul className="mt-4 grid flex-1 gap-3 text-sm text-muted-foreground">
                    {forTeams.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-warm" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="group mt-5 w-fit" render={<Link href="/admin/login" />}>
                    Go to admin
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Button>
                </CardContent>
              </Card>
            </RevealItem>
            <RevealItem>
              <Card className="h-full">
                <CardContent className="flex h-full flex-col pt-6">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                    For your customers
                  </span>
                  <ul className="mt-4 grid flex-1 gap-3 text-sm text-muted-foreground">
                    {forCustomers.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                        {line}
                      </li>
                    ))}
                  </ul>
                  <Button className="group mt-5 w-fit" render={<Link href="/destinations" />}>
                    Check requirements
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Button>
                </CardContent>
              </Card>
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 px-4 py-20 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Reveal>
            <h2 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
              Ready to try it yourself?
            </h2>
            <p className="mt-1 text-muted-foreground">
              Talk to our team, or jump straight to checking your requirements.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap gap-3">
            <Button size="lg" variant="outline" render={<Link href="/destinations" />}>
              Check requirements
            </Button>
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
