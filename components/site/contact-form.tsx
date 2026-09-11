"use client";

import { useActionState } from "react";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CountrySelect } from "@/components/site/country-select";
import { submitInquiry, type ContactFormState } from "@/app/(public)/contact/actions";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm({
  countries,
}: {
  countries: { id: string; name: string; flagEmoji: string | null }[];
}) {
  const [state, formAction, pending] = useActionState(submitInquiry, initialState);

  if (state.status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-3 rounded-xl border bg-primary/5 p-10 text-center"
      >
        <motion.span
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.4, delay: 0.1, type: "spring" }}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground"
        >
          <CheckCircle2 className="h-6 w-6" />
        </motion.span>
        <p className="font-medium">{state.message}</p>
      </motion.div>
    );
  }

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="originCountryId">Travelling from (optional)</Label>
          <CountrySelect name="originCountryId" id="originCountryId" countries={countries} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="destinationCountryId">Travelling to (optional)</Label>
          <CountrySelect name="destinationCountryId" id="destinationCountryId" countries={countries} />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" rows={5} required />
      </div>
      {state.status === "error" && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
