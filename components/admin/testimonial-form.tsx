"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  saveTestimonial,
  type TestimonialFormState,
} from "@/app/admin/(protected)/testimonials/actions";

const initialState: TestimonialFormState = { status: "idle" };

export function TestimonialForm({
  testimonial,
}: {
  testimonial?: {
    id: string;
    customerName: string;
    countryContext: string | null;
    quote: string;
    rating: number;
    featured: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState(saveTestimonial, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      {testimonial && <input type="hidden" name="testimonialId" value={testimonial.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="customerName">Customer name</Label>
          <Input id="customerName" name="customerName" defaultValue={testimonial?.customerName} required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="countryContext">Route (optional)</Label>
          <Input
            id="countryContext"
            name="countryContext"
            placeholder="e.g. Nigeria → United Kingdom"
            defaultValue={testimonial?.countryContext ?? ""}
          />
        </div>
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="quote">Quote</Label>
        <Textarea id="quote" name="quote" rows={4} defaultValue={testimonial?.quote} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="rating">Rating (1-5)</Label>
          <Input id="rating" name="rating" type="number" min={1} max={5} defaultValue={testimonial?.rating ?? 5} required />
        </div>
        <div className="flex items-center gap-2 self-end pb-2">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={testimonial?.featured}
            className="h-4 w-4 rounded border-input"
          />
          <Label htmlFor="featured">Featured on homepage</Label>
        </div>
      </div>
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Saving…" : "Save testimonial"}
      </Button>
    </form>
  );
}
