"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { APPLICATION_STATUS_ORDER, applicationStatusMeta } from "@/lib/status";
import type { ApplicationStatus } from "@/lib/generated/prisma/enums";

export function StatusUpdateForm({
  applicationId,
  currentStatus,
  action,
}: {
  applicationId: string;
  currentStatus: ApplicationStatus;
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="grid gap-2">
      <input type="hidden" name="id" value={applicationId} />
      <Select name="status" defaultValue={currentStatus}>
        <SelectTrigger className="w-full">
          <SelectValue>
            {(value: ApplicationStatus) => applicationStatusMeta[value].label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {APPLICATION_STATUS_ORDER.map((s) => (
            <SelectItem key={s} value={s}>
              {applicationStatusMeta[s].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type="submit" size="sm" variant="outline">
        Update status
      </Button>
    </form>
  );
}
