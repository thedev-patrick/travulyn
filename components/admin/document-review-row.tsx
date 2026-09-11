"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { reviewDocument } from "@/app/admin/(protected)/customers/[id]/applications/actions";
import { DocumentStatusBadge } from "@/components/status-badge";
import type { DocumentStatus } from "@/lib/generated/prisma/enums";

export function DocumentReviewRow({
  applicationId,
  document,
}: {
  applicationId: string;
  document: {
    id: string;
    status: DocumentStatus;
    fileUrl: string | null;
    rejectionReason: string | null;
    requiredDocument: { name: string; description: string | null };
  };
}) {
  const [showReject, setShowReject] = useState(false);

  return (
    <div className="rounded-lg border p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium">{document.requiredDocument.name}</p>
          {document.requiredDocument.description && (
            <p className="text-xs text-muted-foreground">{document.requiredDocument.description}</p>
          )}
          {document.fileUrl && (
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-primary underline underline-offset-4"
            >
              View uploaded file
            </a>
          )}
          {document.status === "REJECTED" && document.rejectionReason && (
            <p className="mt-1 text-xs text-destructive">Reason: {document.rejectionReason}</p>
          )}
        </div>
        <DocumentStatusBadge status={document.status} />
      </div>

      {document.status === "UPLOADED" && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <form action={reviewDocument}>
            <input type="hidden" name="documentId" value={document.id} />
            <input type="hidden" name="applicationId" value={applicationId} />
            <input type="hidden" name="decision" value="APPROVED" />
            <Button type="submit" size="sm" variant="secondary">
              <CheckCircle2 className="h-4 w-4" /> Approve
            </Button>
          </form>
          <Button type="button" size="sm" variant="outline" onClick={() => setShowReject((v) => !v)}>
            <XCircle className="h-4 w-4" /> Reject
          </Button>
        </div>
      )}

      {showReject && (
        <form action={reviewDocument} className="mt-3 grid gap-2">
          <input type="hidden" name="documentId" value={document.id} />
          <input type="hidden" name="applicationId" value={applicationId} />
          <input type="hidden" name="decision" value="REJECTED" />
          <Textarea name="rejectionReason" placeholder="Reason for rejection" rows={2} required />
          <Button type="submit" size="sm" variant="destructive" className="justify-self-start">
            Confirm rejection
          </Button>
        </form>
      )}
    </div>
  );
}
