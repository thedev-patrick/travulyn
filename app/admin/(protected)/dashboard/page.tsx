import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Dashboard",
};

export default async function AdminDashboardPage() {
  const [
    totalCustomers,
    totalApplications,
    docsPending,
    inReview,
    completed,
    openInquiries,
    corridorCount,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.application.count(),
    prisma.application.count({ where: { status: "DOCS_PENDING" } }),
    prisma.application.count({ where: { status: "IN_REVIEW" } }),
    prisma.application.count({ where: { status: "COMPLETED" } }),
    prisma.inquiry.count({ where: { handled: false } }),
    prisma.corridor.count(),
  ]);

  const stats = [
    { label: "Total customers", value: totalCustomers, href: "/admin/customers" },
    { label: "Total applications", value: totalApplications, href: "/admin/customers" },
    { label: "Docs pending", value: docsPending, href: "/admin/customers" },
    { label: "In review", value: inReview, href: "/admin/customers" },
    { label: "Completed", value: completed, href: "/admin/customers" },
    { label: "Open inquiries", value: openInquiries, href: "/admin/inquiries" },
    { label: "Active corridors", value: corridorCount, href: "/admin/corridors" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">An overview of your customers and content.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{s.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-semibold">{s.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
