import { ContactForm } from "@/components/site/contact-form";
import { getCountries } from "@/lib/queries";
import { Reveal } from "@/components/motion/reveal";

// Queries the database (country list) at request time rather than caching a
// build-time snapshot — consistent with the other public pages, and avoids
// requiring a fully-migrated database just to produce a build.
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Contact Us",
};

export default async function ContactPage() {
  const countries = await getCountries();

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <Reveal>
        <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">Contact Travulyn</h1>
        <p className="mt-2 text-muted-foreground">
          Tell us about your trip and we&apos;ll get back to you with next steps.
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mt-10">
          <ContactForm countries={countries} />
        </div>
      </Reveal>
    </div>
  );
}
