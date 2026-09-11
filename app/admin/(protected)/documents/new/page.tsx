import { DocumentForm } from "@/components/admin/document-form";

export const metadata = {
  title: "New Document Type",
};

export default function NewDocumentPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight">New document type</h1>
      <div className="mt-6">
        <DocumentForm />
      </div>
    </div>
  );
}
