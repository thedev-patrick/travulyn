"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const documentSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  description: z.string().trim().optional(),
});

export type DocumentFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function saveDocument(
  _prevState: DocumentFormState,
  formData: FormData
): Promise<DocumentFormState> {
  const parsed = documentSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const documentId = formData.get("documentId") as string | null;

  try {
    if (documentId) {
      await prisma.requiredDocument.update({ where: { id: documentId }, data: parsed.data });
    } else {
      await prisma.requiredDocument.create({ data: parsed.data });
    }
  } catch {
    return { status: "error", message: "A document type with this name already exists." };
  }

  revalidatePath("/admin/documents");
  redirect("/admin/documents");
}

export async function deleteDocument(formData: FormData) {
  const id = formData.get("id") as string;

  const usageCount = await prisma.applicationDocument.count({ where: { requiredDocumentId: id } });
  if (usageCount > 0) {
    throw new Error(
      `Cannot delete this document type: it is tracked on ${usageCount} application(s).`
    );
  }

  await prisma.requiredDocument.delete({ where: { id } });
  revalidatePath("/admin/documents");
}
