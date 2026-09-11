import { CountryForm } from "@/components/admin/country-form";

export const metadata = {
  title: "New Country",
};

export default function NewCountryPage() {
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold tracking-tight">New country</h1>
      <div className="mt-6">
        <CountryForm />
      </div>
    </div>
  );
}
