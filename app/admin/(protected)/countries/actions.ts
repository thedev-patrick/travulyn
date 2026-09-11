"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const countrySchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  isoCode: z
    .string()
    .trim()
    .min(2, "ISO code must be 2-3 letters")
    .max(3, "ISO code must be 2-3 letters")
    .transform((v) => v.toUpperCase()),
  flagEmoji: z.string().trim().optional(),
});

export type CountryFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function saveCountry(
  _prevState: CountryFormState,
  formData: FormData
): Promise<CountryFormState> {
  const parsed = countrySchema.safeParse({
    name: formData.get("name"),
    isoCode: formData.get("isoCode"),
    flagEmoji: formData.get("flagEmoji") || undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  const countryId = formData.get("countryId") as string | null;

  try {
    if (countryId) {
      await prisma.country.update({ where: { id: countryId }, data: parsed.data });
    } else {
      await prisma.country.create({ data: parsed.data });
    }
  } catch {
    return { status: "error", message: "A country with this name or ISO code already exists." };
  }

  revalidatePath("/admin/countries");
  revalidatePath("/destinations");
  redirect("/admin/countries");
}

export async function deleteCountry(formData: FormData) {
  const id = formData.get("id") as string;

  const [corridorCount, applicationCount] = await Promise.all([
    prisma.corridor.count({ where: { OR: [{ originCountryId: id }, { destinationCountryId: id }] } }),
    prisma.application.count({ where: { OR: [{ originCountryId: id }, { destinationCountryId: id }] } }),
  ]);

  if (corridorCount > 0 || applicationCount > 0) {
    throw new Error(
      `Cannot delete this country: it's used by ${corridorCount} corridor(s) and ${applicationCount} application(s).`
    );
  }

  await prisma.country.delete({ where: { id } });
  revalidatePath("/admin/countries");
  revalidatePath("/destinations");
}
