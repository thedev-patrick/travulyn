import { prisma } from "@/lib/prisma";
import { CorridorForm } from "@/components/admin/corridor-form";

export const metadata = {
  title: "New Corridor",
};

export default async function NewCorridorPage() {
  const [countries, documents] = await Promise.all([
    prisma.country.findMany({ orderBy: { name: "asc" } }),
    prisma.requiredDocument.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">New corridor</h1>
      <p className="mt-1 text-muted-foreground">Define a route, its price estimate, and required documents.</p>
      <div className="mt-6">
        <CorridorForm countries={countries} documents={documents} />
      </div>
    </div>
  );
}
