import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DocumentForm } from "@/components/admin/document-form";

export const metadata = {
  title: "Edit Document Type",
};

export default async function EditDocumentPage({ params }: PageProps<"/admin/documents/[id]">) {
  const { id } = await params;
  const document = await prisma.requiredDocument.findUnique({ where: { id } });

  if (!document) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight">Edit document type</h1>
      <div className="mt-6">
        <DocumentForm document={document} />
      </div>
    </div>
  );
}
