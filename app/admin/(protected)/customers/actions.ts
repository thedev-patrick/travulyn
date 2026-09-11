"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createApplication } from "@/lib/applications";

const onboardSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required").max(200),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().optional(),
  originCountryId: z.string().min(1, "Select an origin country"),
  destinationCountryId: z.string().min(1, "Select a destination country"),
});

export type OnboardFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function onboardCustomer(
  _prevState: OnboardFormState,
  formData: FormData
): Promise<OnboardFormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { status: "error", message: "Your session expired. Please sign in again." };
  }

  const parsed = onboardSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    originCountryId: formData.get("originCountryId"),
    destinationCountryId: formData.get("destinationCountryId"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const existing = await prisma.customer.findUnique({ where: { email: parsed.data.email } });
  if (existing) {
    return {
      status: "error",
      message: `A customer with this email already exists (${existing.fullName}). Open their profile to add a new application instead.`,
    };
  }

  const customer = await prisma.customer.create({
    data: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      createdByAdminId: session.user.id,
    },
  });

  const result = await createApplication({
    customerId: customer.id,
    customerFullName: customer.fullName,
    customerEmail: customer.email,
    originCountryId: parsed.data.originCountryId,
    destinationCountryId: parsed.data.destinationCountryId,
    createdByAdminId: session.user.id,
  });

  if ("error" in result) {
    await prisma.customer.delete({ where: { id: customer.id } });
    return { status: "error", message: result.error };
  }

  revalidatePath("/admin/customers");
  redirect(`/admin/customers/${customer.id}`);
}
