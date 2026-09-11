import { Badge } from "@/components/ui/badge";
import { applicationStatusMeta, documentStatusMeta } from "@/lib/status";
import type { ApplicationStatus, DocumentStatus } from "@/lib/generated/prisma/enums";

export function ApplicationStatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  const meta = applicationStatusMeta[status];
  const Icon = meta.icon;
  return (
    <Badge variant="outline" className={className ? `${meta.badgeClassName} ${className}` : meta.badgeClassName}>
      <Icon className="h-3 w-3" /> {meta.label}
    </Badge>
  );
}

export function DocumentStatusBadge({
  status,
  label,
  className,
}: {
  status: DocumentStatus;
  /** Override the default label — e.g. customer-facing copy differs from the admin's. */
  label?: string;
  className?: string;
}) {
  const meta = documentStatusMeta[status];
  const Icon = meta.icon;
  return (
    <Badge variant="outline" className={className ? `${meta.badgeClassName} ${className}` : meta.badgeClassName}>
      <Icon className="h-3 w-3" /> {label ?? meta.label}
    </Badge>
  );
}
