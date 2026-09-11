import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowRight, CheckCircle2, CircleDashed, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getCorridor, getCountries } from "@/lib/queries";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CountrySelect } from "@/components/site/country-select";
import {
  CURRENCY_COOKIE,
  DEFAULT_CURRENCY,
  isSupportedCurrency,
  getExchangeRates,
  convertAmount,
  formatCurrency,
} from "@/lib/currency";

export const metadata = {
  title: "Check Requirements & Pricing",
};

export default async function DestinationsPage({
  searchParams,
}: PageProps<"/destinations">) {
  const params = await searchParams;
  const origin = typeof params.origin === "string" ? params.origin : undefined;
  const destination = typeof params.destination === "string" ? params.destination : undefined;

  const countries = await getCountries();
  const corridor = origin && destination ? await getCorridor(origin, destination) : null;

  const cookieStore = await cookies();
  const preferredCurrency = cookieStore.get(CURRENCY_COOKIE)?.value;
  const displayCurrency = isSupportedCurrency(preferredCurrency) ? preferredCurrency : DEFAULT_CURRENCY;

  let priceMinDisplay = "";
  let priceMaxDisplay = "";
  let conversionNote: string | null = null;

  if (corridor) {
    const min = Number(corridor.priceEstimateMin);
    const max = Number(corridor.priceEstimateMax);

    if (displayCurrency === corridor.currency) {
      priceMinDisplay = formatCurrency(min, corridor.currency);
      priceMaxDisplay = formatCurrency(max, corridor.currency);
    } else {
      const rates = await getExchangeRates();
      const convertedMin = rates ? convertAmount(min, corridor.currency, displayCurrency, rates) : null;
      const convertedMax = rates ? convertAmount(max, corridor.currency, displayCurrency, rates) : null;

      if (convertedMin !== null && convertedMax !== null) {
        priceMinDisplay = formatCurrency(convertedMin, displayCurrency);
        priceMaxDisplay = formatCurrency(convertedMax, displayCurrency);
        conversionNote = `Converted from ${corridor.currency}, for reference only`;
      } else {
        priceMinDisplay = formatCurrency(min, corridor.currency);
        priceMaxDisplay = formatCurrency(max, corridor.currency);
        conversionNote = "Live exchange rates are unavailable right now — showing the original currency";
      }
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Reveal>
        <h1 className="font-heading text-3xl font-medium tracking-tight sm:text-4xl">
          Check requirements &amp; pricing
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pick where you&apos;re travelling from and to, and we&apos;ll show you the price
          estimate and documents you&apos;ll need.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <form method="get" className="mt-8 grid gap-4 rounded-2xl border bg-card p-4 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-end sm:p-5">
          <div className="grid gap-1.5">
            <label className="text-sm font-medium" htmlFor="origin">Travelling from</label>
            <CountrySelect name="origin" id="origin" countries={countries} defaultValue={origin} />
          </div>
          <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:mb-2.5 sm:block" />
          <div className="grid gap-1.5">
            <label className="text-sm font-medium" htmlFor="destination">Travelling to</label>
            <CountrySelect name="destination" id="destination" countries={countries} defaultValue={destination} />
          </div>
          <Button type="submit" className="group">
            Check
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Button>
        </form>
      </Reveal>

      <div className="mt-10">
        {origin && destination && !corridor && (
          <Reveal>
            <Card>
              <CardContent className="pt-6 text-muted-foreground">
                We don&apos;t have a published route for this pair yet.{" "}
                <Link href="/contact" className="text-primary underline underline-offset-4">
                  Contact us
                </Link>{" "}
                and our team will help directly.
              </CardContent>
            </Card>
          </Reveal>
        )}

        {corridor && (
          <div className="grid gap-6">
            <Reveal>
              <Card className="overflow-hidden">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
                  <div>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="text-lg">{corridor.originCountry.flagEmoji}</span>
                      {corridor.originCountry.name}
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span className="text-lg">{corridor.destinationCountry.flagEmoji}</span>
                      {corridor.destinationCountry.name}
                    </p>
                    <p className="mt-2 font-heading text-3xl font-medium">
                      {priceMinDisplay}
                      <span className="text-muted-foreground"> – </span>
                      {priceMaxDisplay}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Estimated price, service fees included
                      {conversionNote && <> · {conversionNote}</>}
                    </p>
                  </div>
                  <Badge variant="secondary" className="gap-1.5">
                    <Clock3 className="h-3 w-3" /> {corridor.processingDays} day processing
                  </Badge>
                </CardContent>
              </Card>
            </Reveal>

            {corridor.summary && (
              <Reveal delay={0.05}>
                <p className="text-muted-foreground">{corridor.summary}</p>
              </Reveal>
            )}

            <div>
              <Reveal>
                <h2 className="font-heading text-lg font-medium">Documents you&apos;ll need</h2>
              </Reveal>
              <RevealGroup className="mt-4 grid gap-3 sm:grid-cols-2" stagger={0.05}>
                {corridor.documents.map((doc) => (
                  <RevealItem key={doc.id}>
                    <div className="flex h-full items-start gap-3 rounded-lg border p-3 transition-colors hover:border-primary/40 hover:bg-primary/5">
                      {doc.isMandatory ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      ) : (
                        <CircleDashed className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <div>
                        <p className="text-sm font-medium">
                          {doc.requiredDocument.name}
                          {!doc.isMandatory && (
                            <span className="ml-2 text-xs text-muted-foreground">(if applicable)</span>
                          )}
                        </p>
                        {doc.requiredDocument.description && (
                          <p className="text-xs text-muted-foreground">{doc.requiredDocument.description}</p>
                        )}
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>

            <Reveal delay={0.1}>
              <Card className="bg-primary/5">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
                  <p className="text-sm">Ready to start your application?</p>
                  <Button render={<Link href="/contact" />}>Get started</Button>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        )}
      </div>
    </div>
  );
}
