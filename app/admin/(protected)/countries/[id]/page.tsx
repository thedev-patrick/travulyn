import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CountryForm } from "@/components/admin/country-form";

export const metadata = {
  title: "Edit Country",
};

export default async function EditCountryPage({ params }: PageProps<"/admin/countries/[id]">) {
  const { id } = await params;
  const country = await prisma.country.findUnique({ where: { id } });

  if (!country) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight">Edit country</h1>
      <div className="mt-6">
        <CountryForm country={country} />
      </div>
    </div>
  );
}
