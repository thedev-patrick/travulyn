"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CountrySelect } from "@/components/site/country-select";
import {
  createApplicationAction,
  type NewApplicationFormState,
} from "@/app/admin/(protected)/customers/[id]/applications/actions";

const initialState: NewApplicationFormState = { status: "idle" };

export function NewApplicationForm({
  customerId,
  countries,
}: {
  customerId: string;
  countries: { id: string; name: string; flagEmoji: string | null }[];
}) {
  const [state, formAction, pending] = useActionState(createApplicationAction, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      <input type="hidden" name="customerId" value={customerId} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="originCountryId">Travelling from</Label>
          <CountrySelect id="originCountryId" name="originCountryId" countries={countries} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="destinationCountryId">Travelling to</Label>
          <CountrySelect id="destinationCountryId" name="destinationCountryId" countries={countries} required />
        </div>
      </div>
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Creating…" : "Create application"}
      </Button>
    </form>
  );
}
