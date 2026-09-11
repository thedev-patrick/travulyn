"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const testimonialSchema = z.object({
  customerName: z.string().trim().min(1, "Name is required").max(200),
  countryContext: z.string().trim().optional(),
  quote: z.string().trim().min(1, "Quote is required").max(1000),
  rating: z.coerce.number().int().min(1).max(5),
  featured: z.coerce.boolean(),
});

export type TestimonialFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function saveTestimonial(
  _prevState: TestimonialFormState,
  formData: FormData
): Promise<TestimonialFormState> {
  const parsed = testimonialSchema.safeParse({
    customerName: formData.get("customerName"),
    countryContext: formData.get("countryContext") || undefined,
    quote: formData.get("quote"),
    rating: formData.get("rating"),
    featured: formData.get("featured") === "on",
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const testimonialId = formData.get("testimonialId") as string | null;

  if (testimonialId) {
    await prisma.testimonial.update({ where: { id: testimonialId }, data: parsed.data });
  } else {
    await prisma.testimonial.create({ data: parsed.data });
  }

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.testimonial.delete({ where: { id } });
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  revalidatePath("/");
}
