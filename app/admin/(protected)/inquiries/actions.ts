"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function toggleInquiryHandled(formData: FormData) {
  const id = formData.get("id") as string;
  const handled = formData.get("handled") === "true";

  await prisma.inquiry.update({ where: { id }, data: { handled: !handled } });
  revalidatePath("/admin/inquiries");
}
