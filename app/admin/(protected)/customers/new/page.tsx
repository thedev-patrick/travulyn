import { prisma } from "@/lib/prisma";
import { OnboardCustomerForm } from "@/components/admin/onboard-customer-form";

export const metadata = {
  title: "Onboard Customer",
};

export default async function NewCustomerPage() {
  const countries = await prisma.country.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold tracking-tight">Onboard a customer</h1>
      <p className="mt-1 text-muted-foreground">
        We&apos;ll create their document checklist from the matching corridor and email them a
        private link to track progress.
      </p>
      <div className="mt-6">
        <OnboardCustomerForm countries={countries} />
      </div>
    </div>
  );
}
