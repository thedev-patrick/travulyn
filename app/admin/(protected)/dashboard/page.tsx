import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { APPLICATION_STATUS_ORDER, applicationStatusMeta } from "@/lib/status";
import { StageFunnelChart } from "@/components/admin/charts/stage-funnel-chart";
import { WeeklyTrendChart } from "@/components/admin/charts/weekly-trend-chart";

export const metadata = {
  title: "Dashboard",
};

const WEEKS_OF_HISTORY = 12;
const DAY_MS = 24 * 60 * 60 * 1000;

function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diffToMonday = (day + 6) % 7;
  d.setDate(d.getDate() - diffToMonday);
  return d;
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const historyStart = new Date(startOfWeek(now).getTime() - (WEEKS_OF_HISTORY - 1) * 7 * DAY_MS);

  const [
    totalCustomers,
    totalApplications,
    docsPending,
    inReview,
    completed,
    openInquiries,
    corridorCount,
    statusCounts,
    recentApplications,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.application.count(),
    prisma.application.count({ where: { status: "DOCS_PENDING" } }),
    prisma.application.count({ where: { status: "IN_REVIEW" } }),
    prisma.application.count({ where: { status: "COMPLETED" } }),
    prisma.inquiry.count({ where: { handled: false } }),
    prisma.corridor.count(),
    prisma.application.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.application.findMany({
      where: { createdAt: { gte: historyStart } },
      select: { createdAt: true },
    }),
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

  const countByStatus = new Map(statusCounts.map((s) => [s.status, s._count._all]));
  const stageData = APPLICATION_STATUS_ORDER.map((status) => ({
    status,
    label: applicationStatusMeta[status].label,
    count: countByStatus.get(status) ?? 0,
  }));

  const weeklyData = Array.from({ length: WEEKS_OF_HISTORY }, (_, i) => {
    const weekStart = new Date(historyStart.getTime() + i * 7 * DAY_MS);
    const weekEnd = new Date(weekStart.getTime() + 7 * DAY_MS);
    const count = recentApplications.filter(
      (a) => a.createdAt >= weekStart && a.createdAt < weekEnd
    ).length;
    return {
      weekLabel: weekStart.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      count,
    };
  });

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

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Applications by stage</CardTitle>
          </CardHeader>
          <CardContent>
            <StageFunnelChart data={stageData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">New applications, last {WEEKS_OF_HISTORY} weeks</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyTrendChart data={weeklyData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
