"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveDocument, type DocumentFormState } from "@/app/admin/(protected)/documents/actions";

const initialState: DocumentFormState = { status: "idle" };

export function DocumentForm({
  document,
}: {
  document?: { id: string; name: string; description: string | null };
}) {
  const [state, formAction, pending] = useActionState(saveDocument, initialState);

  return (
    <form action={formAction} className="grid gap-4">
      {document && <input type="hidden" name="documentId" value={document.id} />}
      <div className="grid gap-1.5">
        <Label htmlFor="name">Document name</Label>
        <Input id="name" name="name" defaultValue={document?.name} required />
      </div>
      <div className="grid gap-1.5">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" name="description" rows={3} defaultValue={document?.description ?? ""} />
      </div>
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      <Button type="submit" disabled={pending} className="justify-self-start">
        {pending ? "Saving…" : "Save document type"}
      </Button>
    </form>
  );
}
