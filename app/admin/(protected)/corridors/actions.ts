"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";

const currencyCodes = SUPPORTED_CURRENCIES.map((c) => c.code) as [string, ...string[]];

const corridorSchema = z.object({
  originCountryId: z.string().min(1, "Select an origin country"),
  destinationCountryId: z.string().min(1, "Select a destination country"),
  priceEstimateMin: z.coerce.number().nonnegative(),
  priceEstimateMax: z.coerce.number().nonnegative(),
  currency: z.enum(currencyCodes, { message: "Select a supported currency" }),
  processingDays: z.coerce.number().int().nonnegative(),
  summary: z.string().trim().optional(),
});

export type CorridorFormState = {
  status: "idle" | "error";
  message?: string;
};

async function saveCorridorDocuments(corridorId: string, formData: FormData, documentIds: string[]) {
  await prisma.corridorDocument.deleteMany({ where: { corridorId } });

  const rows = documentIds
    .map((documentId) => {
      const value = formData.get(`doc_${documentId}`);
      if (value === "required" || value === "optional") {
        return {
          corridorId,
          requiredDocumentId: documentId,
          isMandatory: value === "required",
        };
      }
      return null;
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  if (rows.length > 0) {
    await prisma.corridorDocument.createMany({ data: rows });
  }
}

export async function saveCorridor(
  _prevState: CorridorFormState,
  formData: FormData
): Promise<CorridorFormState> {
  const parsed = corridorSchema.safeParse({
    originCountryId: formData.get("originCountryId"),
    destinationCountryId: formData.get("destinationCountryId"),
    priceEstimateMin: formData.get("priceEstimateMin"),
    priceEstimateMax: formData.get("priceEstimateMax"),
    currency: formData.get("currency"),
    processingDays: formData.get("processingDays"),
    summary: formData.get("summary") || undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid form data." };
  }

  if (parsed.data.originCountryId === parsed.data.destinationCountryId) {
    return { status: "error", message: "Origin and destination must be different." };
  }

  const corridorId = formData.get("corridorId") as string | null;
  const allDocumentIds = (formData.get("allDocumentIds") as string)?.split(",").filter(Boolean) ?? [];

  let corridor;
  if (corridorId) {
    corridor = await prisma.corridor.update({ where: { id: corridorId }, data: parsed.data });
  } else {
    const existing = await prisma.corridor.findUnique({
      where: {
        originCountryId_destinationCountryId: {
          originCountryId: parsed.data.originCountryId,
          destinationCountryId: parsed.data.destinationCountryId,
        },
      },
    });
    if (existing) {
      return { status: "error", message: "A corridor for this country pair already exists." };
    }
    corridor = await prisma.corridor.create({ data: parsed.data });
  }

  await saveCorridorDocuments(corridor.id, formData, allDocumentIds);

  revalidatePath("/admin/corridors");
  revalidatePath("/destinations");
  redirect("/admin/corridors");
}

export async function deleteCorridor(formData: FormData) {
  const id = formData.get("id") as string;

  const applicationCount = await prisma.application.count({ where: { corridorId: id } });
  if (applicationCount > 0) {
    throw new Error(
      `Cannot delete this corridor: ${applicationCount} application(s) are linked to it.`
    );
  }

  await prisma.corridor.delete({ where: { id } });
  revalidatePath("/admin/corridors");
  revalidatePath("/destinations");
}
