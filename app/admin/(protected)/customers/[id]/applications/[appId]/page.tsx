import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { prisma } from "@/lib/prisma";
import { portalUrlFor } from "@/lib/tokens";
import { resendPortalLink, updateApplicationStatus } from "../actions";
import { DocumentReviewRow } from "@/components/admin/document-review-row";
import { ProgressEventForm } from "@/components/admin/progress-event-form";
import { ApplicationStatusBadge } from "@/components/status-badge";
import { APPLICATION_STATUS_ORDER, applicationStatusMeta } from "@/lib/status";

export const metadata = {
  title: "Application Detail",
};

export default async function ApplicationDetailPage({
  params,
}: PageProps<"/admin/customers/[id]/applications/[appId]">) {
  const { id, appId } = await params;

  const application = await prisma.application.findUnique({
    where: { id: appId },
    include: {
      customer: true,
      originCountry: true,
      destinationCountry: true,
      corridor: true,
      documents: { include: { requiredDocument: true }, orderBy: { createdAt: "asc" } },
      progressEvents: { orderBy: { createdAt: "desc" }, include: { createdByAdmin: { select: { name: true } } } },
    },
  });

  if (!application || application.customerId !== id) notFound();

  const portalUrl = portalUrlFor(application.accessToken);

  return (
    <div className="grid max-w-5xl gap-6">
      <Link
        href={`/admin/customers/${id}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to {application.customer.fullName}
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{application.customer.fullName}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1 text-sm text-muted-foreground">
              <p>{application.customer.email}{application.customer.phone ? ` · ${application.customer.phone}` : ""}</p>
              <p>
                {application.originCountry.flagEmoji} {application.originCountry.name} →{" "}
                {application.destinationCountry.flagEmoji} {application.destinationCountry.name}
              </p>
              <p>Application created {application.createdAt.toLocaleDateString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              {application.documents.map((doc) => (
                <DocumentReviewRow key={doc.id} applicationId={application.id} document={doc} />
              ))}
              {application.documents.length === 0 && (
                <p className="text-sm text-muted-foreground">No documents on file.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progress timeline</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <ProgressEventForm applicationId={application.id} />
              <Separator />
              <div className="grid gap-4">
                {application.progressEvents.map((e) => (
                  <div key={e.id}>
                    <p className="text-sm font-medium">{e.title}</p>
                    {e.description && <p className="text-sm text-muted-foreground">{e.description}</p>}
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {e.createdAt.toLocaleString()} · {e.createdByAdmin.name}
                    </p>
                  </div>
                ))}
                {application.progressEvents.length === 0 && (
                  <p className="text-sm text-muted-foreground">No updates yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <ApplicationStatusBadge status={application.status} className="w-fit" />
              <form action={updateApplicationStatus} className="grid gap-2">
                <input type="hidden" name="id" value={application.id} />
                <select
                  name="status"
                  defaultValue={application.status}
                  className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
                >
                  {APPLICATION_STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>{applicationStatusMeta[s].label}</option>
                  ))}
                </select>
                <Button type="submit" size="sm" variant="outline">Update status</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Portal access</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <p className="break-all rounded-md bg-muted p-2 text-xs">{portalUrl}</p>
              <form action={resendPortalLink}>
                <input type="hidden" name="id" value={application.id} />
                <Button type="submit" size="sm" variant="outline" className="w-full">
                  <Send className="h-4 w-4" /> Resend link by email
                </Button>
              </form>
              <a href={`mailto:${application.customer.email}`} className="inline-flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <Mail className="h-4 w-4" /> {application.customer.email}
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
