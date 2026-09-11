"use client";

import { useActionState } from "react";
import { CheckCircle2, Clock, FileText, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadCustomerDocument, type UploadState } from "@/app/portal/[token]/actions";

const statusMeta: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: typeof Clock }> = {
  PENDING: { label: "Needed", variant: "outline", icon: Clock },
  UPLOADED: { label: "Under review", variant: "default", icon: FileText },
  APPROVED: { label: "Approved", variant: "secondary", icon: CheckCircle2 },
  REJECTED: { label: "Needs re-upload", variant: "destructive", icon: XCircle },
};

const initialState: UploadState = { status: "idle" };

export function DocumentUploadRow({
  token,
  document,
}: {
  token: string;
  document: {
    id: string;
    status: string;
    rejectionReason: string | null;
    requiredDocument: { name: string; description: string | null };
  };
}) {
  const [state, formAction, pending] = useActionState(uploadCustomerDocument, initialState);
  const meta = statusMeta[document.status];
  const Icon = meta.icon;
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
        <Badge variant={meta.variant}>
          <Icon className="h-3 w-3" /> {meta.label}
        </Badge>
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
