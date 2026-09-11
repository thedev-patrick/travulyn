"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const inquirySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Enter a valid email address"),
  message: z.string().trim().min(1, "Message is required").max(4000),
  originCountryId: z.string().trim().optional(),
  destinationCountryId: z.string().trim().optional(),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitInquiry(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const parsed = inquirySchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    originCountryId: formData.get("originCountryId") || undefined,
    destinationCountryId: formData.get("destinationCountryId") || undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
    };
  }

  await prisma.inquiry.create({ data: parsed.data });

  return { status: "success", message: "Thanks — our team will be in touch shortly." };
}
