import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CorridorForm } from "@/components/admin/corridor-form";

export const metadata = {
  title: "Edit Corridor",
};

export default async function EditCorridorPage({ params }: PageProps<"/admin/corridors/[id]">) {
  const { id } = await params;

  const [countries, documents, corridor] = await Promise.all([
    prisma.country.findMany({ orderBy: { name: "asc" } }),
    prisma.requiredDocument.findMany({ orderBy: { name: "asc" } }),
    prisma.corridor.findUnique({
      where: { id },
      include: { documents: true },
    }),
  ]);

  if (!corridor) notFound();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Edit corridor</h1>
      <div className="mt-6">
        <CorridorForm
          countries={countries}
          documents={documents}
          corridor={{
            id: corridor.id,
            originCountryId: corridor.originCountryId,
            destinationCountryId: corridor.destinationCountryId,
            priceEstimateMin: Number(corridor.priceEstimateMin),
            priceEstimateMax: Number(corridor.priceEstimateMax),
            currency: corridor.currency,
            processingDays: corridor.processingDays,
            summary: corridor.summary,
            documents: corridor.documents.map((d) => ({
              requiredDocumentId: d.requiredDocumentId,
              isMandatory: d.isMandatory,
            })),
          }}
        />
      </div>
    </div>
  );
}
