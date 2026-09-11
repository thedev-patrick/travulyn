"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveCorridor, type CorridorFormState } from "@/app/admin/(protected)/corridors/actions";

type Country = { id: string; name: string; flagEmoji: string | null };
type RequiredDocument = { id: string; name: string };

type ExistingDoc = { requiredDocumentId: string; isMandatory: boolean };

const initialState: CorridorFormState = { status: "idle" };

export function CorridorForm({
  countries,
  documents,
  corridor,
}: {
  countries: Country[];
  documents: RequiredDocument[];
  corridor?: {
    id: string;
    originCountryId: string;
    destinationCountryId: string;
    priceEstimateMin: number | string;
    priceEstimateMax: number | string;
    currency: string;
    processingDays: number;
    summary: string | null;
    documents: ExistingDoc[];
  };
}) {
  const [state, formAction, pending] = useActionState(saveCorridor, initialState);
  const docStatus = (id: string) =>
    corridor?.documents.find((d) => d.requiredDocumentId === id)
      ? corridor.documents.find((d) => d.requiredDocumentId === id)!.isMandatory
        ? "required"
        : "optional"
      : "none";

  return (
    <form action={formAction} className="grid gap-6">
      {corridor && <input type="hidden" name="corridorId" value={corridor.id} />}
      <input type="hidden" name="allDocumentIds" value={documents.map((d) => d.id).join(",")} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="originCountryId">Origin country</Label>
          <select
            id="originCountryId"
            name="originCountryId"
            defaultValue={corridor?.originCountryId ?? ""}
            required
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
          >
            <option value="" disabled>Select a country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{c.flagEmoji} {c.name}</option>
            ))}
          </select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="destinationCountryId">Destination country</Label>
          <select
            id="destinationCountryId"
            name="destinationCountryId"
            defaultValue={corridor?.destinationCountryId ?? ""}
            required
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
          >
            <option value="" disabled>Select a country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{c.flagEmoji} {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <div className="grid gap-1.5">
          <Label htmlFor="priceEstimateMin">Min price</Label>
          <Input
            id="priceEstimateMin"
            name="priceEstimateMin"
            type="number"
            min={0}
            step="0.01"
            defaultValue={corridor?.priceEstimateMin as number | undefined}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="priceEstimateMax">Max price</Label>
          <Input
            id="priceEstimateMax"
            name="priceEstimateMax"
            type="number"
            min={0}
            step="0.01"
            defaultValue={corridor?.priceEstimateMax as number | undefined}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="currency">Currency</Label>
          <Input id="currency" name="currency" defaultValue={corridor?.currency ?? "USD"} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="processingDays">Processing days</Label>
          <Input
            id="processingDays"
            name="processingDays"
            type="number"
            min={0}
            defaultValue={corridor?.processingDays}
            required
          />
        </div>
      </div>

      <div className="grid gap-1.5">
        <Label htmlFor="summary">Summary (optional)</Label>
        <Textarea id="summary" name="summary" rows={3} defaultValue={corridor?.summary ?? ""} />
      </div>

      <div>
        <Label className="mb-2 block">Required documents</Label>
        <div className="grid gap-2 rounded-lg border divide-y">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between gap-4 p-3">
              <span className="text-sm">{doc.name}</span>
              <select
                name={`doc_${doc.id}`}
                defaultValue={docStatus(doc.id)}
                className="h-8 rounded-lg border border-input bg-transparent px-2 text-sm"
              >
                <option value="none">Not required</option>
                <option value="required">Required</option>
                <option value="optional">Optional</option>
              </select>
            </div>
          ))}
          {documents.length === 0 && (
            <p className="p-3 text-sm text-muted-foreground">
              No document types yet — add some under Document Types first.
            </p>
          )}
        </div>
      </div>

      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}

      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Saving…" : "Save corridor"}
      </Button>
    </form>
  );
}
