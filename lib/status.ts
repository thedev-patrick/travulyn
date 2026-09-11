import {
  CheckCircle2,
  Clock,
  Clock3,
  FileCheck,
  FileText,
  ShieldCheck,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { ApplicationStatus, DocumentStatus } from "@/lib/generated/prisma/enums";

type StatusMeta = {
  label: string;
  icon: LucideIcon;
  /** Badge className — pairs with `variant="outline"`. */
  badgeClassName: string;
};

/** Pipeline order, earliest to latest — drives the dashboard stage chart too. */
export const APPLICATION_STATUS_ORDER: ApplicationStatus[] = [
  "ONBOARDED",
  "DOCS_PENDING",
  "IN_REVIEW",
  "APPROVED",
  "COMPLETED",
];

export const applicationStatusMeta: Record<ApplicationStatus, StatusMeta> = {
  ONBOARDED: {
    label: "Getting started",
    icon: Clock3,
    badgeClassName: "gap-1.5 border-border bg-muted text-muted-foreground",
  },
  DOCS_PENDING: {
    label: "Documents pending",
    icon: FileCheck,
    badgeClassName: "gap-1.5 border-brand-warm/30 bg-brand-warm/15 text-brand-warm",
  },
  IN_REVIEW: {
    label: "In review",
    icon: ShieldCheck,
    badgeClassName: "gap-1.5 border-primary/30 bg-primary/15 text-primary",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    badgeClassName: "gap-1.5 border-success/30 bg-success/10 text-success",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    badgeClassName: "gap-1.5 border-success/50 bg-success/20 font-semibold text-success",
  },
};

export const documentStatusMeta: Record<DocumentStatus, StatusMeta> = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    badgeClassName: "gap-1.5 border-border bg-muted text-muted-foreground",
  },
  UPLOADED: {
    label: "Uploaded",
    icon: FileText,
    badgeClassName: "gap-1.5 border-primary/30 bg-primary/15 text-primary",
  },
  APPROVED: {
    label: "Approved",
    icon: CheckCircle2,
    badgeClassName: "gap-1.5 border-success/30 bg-success/10 text-success",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    badgeClassName: "gap-1.5 border-destructive/30 bg-destructive/10 text-destructive",
  },
};
