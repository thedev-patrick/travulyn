"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { onboardCustomer, type OnboardFormState } from "@/app/admin/(protected)/customers/actions";

const initialState: OnboardFormState = { status: "idle" };

export function OnboardCustomerForm({
  countries,
}: {
  countries: { id: string; name: string; flagEmoji: string | null }[];
}) {
  const [state, formAction, pending] = useActionState(onboardCustomer, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" name="fullName" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="originCountryId">Travelling from</Label>
          <select
            id="originCountryId"
            name="originCountryId"
            required
            defaultValue=""
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
          >
            <option value="" disabled>Select a country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{c.flagEmoji} {c.name}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="destinationCountryId">Travelling to</Label>
          <select
            id="destinationCountryId"
            name="destinationCountryId"
            required
            defaultValue=""
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
          >
            <option value="" disabled>Select a country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{c.flagEmoji} {c.name}</option>
            ))}
          </select>
        </div>
      </div>
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Onboarding…" : "Onboard customer"}
      </Button>
    </form>
  );
}
