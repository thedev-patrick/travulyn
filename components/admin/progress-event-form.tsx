"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  addProgressEvent,
  type ProgressEventFormState,
} from "@/app/admin/(protected)/customers/[id]/applications/actions";

const initialState: ProgressEventFormState = { status: "idle" };

export function ProgressEventForm({ applicationId }: { applicationId: string }) {
  const [state, formAction, pending] = useActionState(addProgressEvent, initialState);

  return (
    <form action={formAction} className="grid gap-2">
      <input type="hidden" name="applicationId" value={applicationId} />
      <Input name="title" placeholder="Update title, e.g. Interview scheduled" required />
      <Textarea name="description" placeholder="Details (optional) — shared with the customer" rows={2} />
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      <Button type="submit" size="sm" disabled={pending} className="justify-self-start">
        {pending ? "Posting…" : "Post update"}
      </Button>
    </form>
  );
}
