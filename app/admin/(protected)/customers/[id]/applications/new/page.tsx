import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewApplicationForm } from "@/components/admin/new-application-form";

export const metadata = {
  title: "New Application",
};

export default async function NewApplicationPage({ params }: PageProps<"/admin/customers/[id]/applications/new">) {
  const { id } = await params;

  const [customer, countries] = await Promise.all([
    prisma.customer.findUnique({ where: { id } }),
    prisma.country.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!customer) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight">New application for {customer.fullName}</h1>
      <p className="mt-1 text-muted-foreground">
        We&apos;ll create a fresh document checklist for this route and email them a new tracking link.
      </p>
      <div className="mt-6">
        <NewApplicationForm customerId={customer.id} countries={countries} />
      </div>
    </div>
  );
}
