"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadToCloudinary } from "@/lib/cloudinary";

export type UploadState = {
  status: "idle" | "error";
  message?: string;
};

export async function uploadCustomerDocument(
  _prevState: UploadState,
  formData: FormData
): Promise<UploadState> {
  const token = formData.get("token") as string;
  const documentId = formData.get("documentId") as string;
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) {
    return { status: "error", message: "Please choose a file to upload." };
  }

  const application = await prisma.application.findUnique({
    where: { accessToken: token },
    include: { documents: true },
  });

  if (!application) {
    return { status: "error", message: "This link is invalid or has expired." };
  }

  const targetDoc = application.documents.find((d) => d.id === documentId);
  if (!targetDoc) {
    return { status: "error", message: "Document not found." };
  }

  const uploaded = await uploadToCloudinary(file, `travulyn/applications/${application.id}`);

  await prisma.applicationDocument.update({
    where: { id: targetDoc.id },
    data: {
      status: "UPLOADED",
      fileUrl: uploaded.url,
      rejectionReason: null,
      uploadedAt: new Date(),
    },
  });

  const documents = await prisma.applicationDocument.findMany({ where: { applicationId: application.id } });
  const allSubmitted = documents.every((d) => d.status === "UPLOADED" || d.status === "APPROVED");
  const anyUploaded = documents.some((d) => d.status === "UPLOADED" || d.status === "APPROVED");

  if (application.status === "ONBOARDED" || application.status === "DOCS_PENDING") {
    await prisma.application.update({
      where: { id: application.id },
      data: { status: allSubmitted ? "IN_REVIEW" : anyUploaded ? "DOCS_PENDING" : "ONBOARDED" },
    });
  }

  revalidatePath(`/portal/${token}`);
  return { status: "idle" };
}
