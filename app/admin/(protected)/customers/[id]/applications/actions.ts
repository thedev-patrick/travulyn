"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createApplication } from "@/lib/applications";
import { portalUrlFor } from "@/lib/tokens";
import { sendCustomerPortalLink, sendProgressUpdate } from "@/lib/email";

const newApplicationSchema = z.object({
  originCountryId: z.string().min(1, "Select an origin country"),
  destinationCountryId: z.string().min(1, "Select a destination country"),
});

export type NewApplicationFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function createApplicationAction(
  _prevState: NewApplicationFormState,
  formData: FormData
): Promise<NewApplicationFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: "error", message: "Your session expired. Please sign in again." };
  }

  const customerId = formData.get("customerId") as string;
  const parsed = newApplicationSchema.safeParse({
    originCountryId: formData.get("originCountryId"),
    destinationCountryId: formData.get("destinationCountryId"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const customer = await prisma.customer.findUniqueOrThrow({ where: { id: customerId } });

  const result = await createApplication({
    customerId,
    customerFullName: customer.fullName,
    customerEmail: customer.email,
    originCountryId: parsed.data.originCountryId,
    destinationCountryId: parsed.data.destinationCountryId,
    createdByAdminId: session.user.id,
  });

  if ("error" in result) {
    return { status: "error", message: result.error };
  }

  revalidatePath(`/admin/customers/${customerId}`);
  redirect(`/admin/customers/${customerId}/applications/${result.application.id}`);
}

export async function resendPortalLink(formData: FormData) {
  const id = formData.get("id") as string;
  const application = await prisma.application.findUniqueOrThrow({
    where: { id },
    include: { customer: true },
  });

  await sendCustomerPortalLink({
    to: application.customer.email,
    fullName: application.customer.fullName,
    portalUrl: portalUrlFor(application.accessToken),
  });

  revalidatePath(`/admin/customers/${application.customerId}/applications/${id}`);
}

export async function reviewDocument(formData: FormData) {
  const documentId = formData.get("documentId") as string;
  const applicationId = formData.get("applicationId") as string;
  const decision = formData.get("decision") as "APPROVED" | "REJECTED";
  const rejectionReason = (formData.get("rejectionReason") as string) || null;

  await prisma.applicationDocument.update({
    where: { id: documentId },
    data: {
      status: decision,
      rejectionReason: decision === "REJECTED" ? rejectionReason : null,
    },
  });

  const documents = await prisma.applicationDocument.findMany({ where: { applicationId } });
  const allApproved = documents.every((d) => d.status === "APPROVED");
  const anyReviewable = documents.some((d) => d.status === "UPLOADED");

  const application = await prisma.application.update({
    where: { id: applicationId },
    data: {
      status: allApproved ? "APPROVED" : anyReviewable ? "IN_REVIEW" : undefined,
    },
  });

  revalidatePath(`/admin/customers/${application.customerId}/applications/${applicationId}`);
  revalidatePath(`/portal`);
}

const statusSchema = z.enum(["ONBOARDED", "DOCS_PENDING", "IN_REVIEW", "APPROVED", "COMPLETED"]);

export async function updateApplicationStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const status = statusSchema.parse(formData.get("status"));

  const application = await prisma.application.update({ where: { id }, data: { status } });
  revalidatePath(`/admin/customers/${application.customerId}/applications/${id}`);
  revalidatePath("/admin/customers");
}

const progressEventSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().optional(),
});

export type ProgressEventFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function addProgressEvent(
  _prevState: ProgressEventFormState,
  formData: FormData
): Promise<ProgressEventFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: "error", message: "Your session expired. Please sign in again." };
  }

  const applicationId = formData.get("applicationId") as string;
  const parsed = progressEventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const application = await prisma.application.findUniqueOrThrow({
    where: { id: applicationId },
    include: { customer: true },
  });

  await prisma.progressEvent.create({
    data: {
      applicationId,
      title: parsed.data.title,
      description: parsed.data.description,
      createdByAdminId: session.user.id,
    },
  });

  await sendProgressUpdate({
    to: application.customer.email,
    fullName: application.customer.fullName,
    title: parsed.data.title,
    description: parsed.data.description,
    portalUrl: portalUrlFor(application.accessToken),
  });

  revalidatePath(`/admin/customers/${application.customerId}/applications/${applicationId}`);
  return { status: "idle" };
}
