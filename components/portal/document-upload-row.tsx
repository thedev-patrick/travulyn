"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadCustomerDocument, type UploadState } from "@/app/portal/[token]/actions";
import { DocumentStatusBadge } from "@/components/status-badge";
import type { DocumentStatus } from "@/lib/generated/prisma/enums";

const initialState: UploadState = { status: "idle" };

const customerFacingLabel: Record<DocumentStatus, string> = {
  PENDING: "Needed",
  UPLOADED: "Under review",
  APPROVED: "Approved",
  REJECTED: "Needs re-upload",
};

export function DocumentUploadRow({
  token,
  document,
}: {
  token: string;
  document: {
    id: string;
    status: DocumentStatus;
    rejectionReason: string | null;
    requiredDocument: { name: string; description: string | null };
  };
}) {
  const [state, formAction, pending] = useActionState(uploadCustomerDocument, initialState);
  const canUpload = document.status === "PENDING" || document.status === "REJECTED";

  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium">{document.requiredDocument.name}</p>
          {document.requiredDocument.description && (
            <p className="text-xs text-muted-foreground">{document.requiredDocument.description}</p>
          )}
          {document.status === "REJECTED" && document.rejectionReason && (
            <p className="mt-1 text-xs text-destructive">{document.rejectionReason}</p>
          )}
        </div>
        <DocumentStatusBadge status={document.status} label={customerFacingLabel[document.status]} />
      </div>

      {canUpload && (
        <form action={formAction} className="mt-3 flex flex-wrap items-center gap-2">
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="documentId" value={document.id} />
          <Input name="file" type="file" required className="max-w-xs" />
          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Uploading…" : "Upload"}
          </Button>
        </form>
      )}
      {state.status === "error" && <p className="mt-2 text-sm text-destructive">{state.message}</p>}
    </div>
  );
}
