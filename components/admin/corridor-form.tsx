"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CountrySelect } from "@/components/site/country-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { saveCorridor, type CorridorFormState } from "@/app/admin/(protected)/corridors/actions";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

type Country = { id: string; name: string; flagEmoji: string | null };
type RequiredDocument = { id: string; name: string };

type ExistingDoc = { requiredDocumentId: string; isMandatory: boolean };

const initialState: CorridorFormState = { status: "idle" };

const docRequirementLabel: Record<string, string> = {
  none: "Not required",
  required: "Required",
  optional: "Optional",
};

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
          <CountrySelect
            id="originCountryId"
            name="originCountryId"
            countries={countries}
            defaultValue={corridor?.originCountryId}
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="destinationCountryId">Destination country</Label>
          <CountrySelect
            id="destinationCountryId"
            name="destinationCountryId"
            countries={countries}
            defaultValue={corridor?.destinationCountryId}
            required
          />
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
          <Select name="currency" defaultValue={corridor?.currency ?? "USD"}>
            <SelectTrigger id="currency" className="w-full">
              <SelectValue>{(value: string) => value}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_CURRENCIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.code} — {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              <Select name={`doc_${doc.id}`} defaultValue={docStatus(doc.id)}>
                <SelectTrigger size="sm" className="w-36">
                  <SelectValue>
                    {(value: string) => docRequirementLabel[value] ?? "Not required"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not required</SelectItem>
                  <SelectItem value="required">Required</SelectItem>
                  <SelectItem value="optional">Optional</SelectItem>
                </SelectContent>
              </Select>
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
