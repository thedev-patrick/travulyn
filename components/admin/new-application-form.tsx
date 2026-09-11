"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
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
          <label className="text-sm font-medium" htmlFor="originCountryId">Travelling from</label>
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
          <label className="text-sm font-medium" htmlFor="destinationCountryId">Travelling to</label>
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
        {pending ? "Creating…" : "Create application"}
      </Button>
    </form>
  );
}
