import { notFound } from "next/navigation";
import { CheckCircle2, Clock3, FileCheck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getApplicationByToken } from "@/lib/queries";
import { DocumentUploadRow } from "@/components/portal/document-upload-row";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { ProgressBar } from "@/components/portal/progress-bar";

export const metadata = {
  title: "Your Application",
};

const statusMeta: Record<string, { label: string; icon: typeof Clock3 }> = {
  ONBOARDED: { label: "Getting started", icon: Clock3 },
  DOCS_PENDING: { label: "Documents pending", icon: FileCheck },
  IN_REVIEW: { label: "In review", icon: ShieldCheck },
  APPROVED: { label: "Approved", icon: CheckCircle2 },
  COMPLETED: { label: "Completed", icon: CheckCircle2 },
};

export default async function CustomerPortalPage({ params }: PageProps<"/portal/[token]">) {
  const { token } = await params;
  const application = await getApplicationByToken(token);

  if (!application || application.tokenExpiresAt < new Date()) notFound();

  const total = application.documents.length;
  const approved = application.documents.filter((d) => d.status === "APPROVED").length;
  const progress = total > 0 ? Math.round((approved / total) * 100) : 0;
  const meta = statusMeta[application.status];
  const StatusIcon = meta.icon;

  return (
    <div className="grid gap-6">
      <Reveal>
        <h1 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
          Hi {application.customer.fullName.split(" ")[0]},
        </h1>
        <p className="mt-1 text-muted-foreground">
          {application.originCountry.flagEmoji} {application.originCountry.name} →{" "}
          {application.destinationCountry.flagEmoji} {application.destinationCountry.name}
        </p>
        <Badge className="mt-3 gap-1.5">
          <StatusIcon className="h-3 w-3" /> {meta.label}
        </Badge>
      </Reveal>

      <Reveal delay={0.05}>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Document progress</span>
              <span className="text-muted-foreground">{approved} of {total} approved</span>
            </div>
            <ProgressBar percent={progress} className="mt-3" />
          </CardContent>
        </Card>
      </Reveal>

      <Reveal delay={0.1}>
        <Card>
          <CardHeader>
            <CardTitle className="font-heading font-medium">Your documents</CardTitle>
          </CardHeader>
          <CardContent>
            <RevealGroup className="grid gap-3" stagger={0.05}>
              {application.documents.map((doc) => (
                <RevealItem key={doc.id}>
                  <DocumentUploadRow token={token} document={doc} />
                </RevealItem>
              ))}
            </RevealGroup>
            {application.documents.length === 0 && (
              <p className="text-sm text-muted-foreground">No documents required yet.</p>
            )}
          </CardContent>
        </Card>
      </Reveal>

      <Reveal delay={0.15}>
        <Card>
          <CardHeader>
            <CardTitle className="font-heading font-medium">Progress updates</CardTitle>
          </CardHeader>
          <CardContent>
            {application.progressEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No updates yet — check back soon.</p>
            ) : (
              <div className="grid gap-4">
                {application.progressEvents.map((e, i) => (
                  <div key={e.id}>
                    <p className="text-sm font-medium">{e.title}</p>
                    {e.description && <p className="text-sm text-muted-foreground">{e.description}</p>}
                    <p className="mt-0.5 text-xs text-muted-foreground">{e.createdAt.toLocaleString()}</p>
                    {i < application.progressEvents.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
