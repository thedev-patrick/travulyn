import Link from "next/link";
import { ArrowLeft, FileCheck, Plane, Route, Users } from "lucide-react";
import { LoginForm } from "@/components/admin/login-form";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "Admin Login",
};

const highlights = [
  {
    icon: Route,
    title: "Corridors & pricing",
    body: "Keep routes, cost estimates, and processing times up to date.",
  },
  {
    icon: FileCheck,
    title: "Applications",
    body: "Review uploaded documents and post updates customers see instantly.",
  },
  {
    icon: Users,
    title: "Customers",
    body: "Onboard travellers and generate their private portal link.",
  },
];

export default function AdminLoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:22px_22px]"
        />
        <Plane
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-16 h-80 w-80 rotate-45 text-primary-foreground/[0.06]"
        />

        <Link href="/" className="group flex w-fit items-center gap-2 font-heading text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-foreground/15 transition-transform duration-300 group-hover:-rotate-12">
            <Plane className="h-4 w-4" />
          </span>
          Travulyn
        </Link>

        <Reveal>
          <h1 className="max-w-sm font-heading text-3xl leading-tight font-medium tracking-tight">
            Run the whole operation from one dashboard.
          </h1>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/70">
            Corridors, documents, customers, and content — everything your team needs to keep
            travellers moving.
          </p>

          <div className="mt-8 grid gap-3">
            {highlights.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xl bg-primary-foreground/10 p-3.5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15">
                  <item.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-primary-foreground/70">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <p className="text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} Travulyn. Staff access only.
        </p>
      </div>

      <div className="flex flex-col justify-center px-4 py-16 sm:px-6">
        <Reveal y={12} className="mx-auto w-full max-w-sm">
          <Link
            href="/"
            className="group mb-8 flex items-center gap-2 font-heading text-lg font-semibold lg:hidden"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-12">
              <Plane className="h-4 w-4" />
            </span>
            Travulyn
          </Link>

          <h2 className="font-heading text-2xl font-medium tracking-tight">Welcome back</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage corridors, applications, and content.
          </p>

          <div className="mt-6">
            <LoginForm />
          </div>

          <Link
            href="/"
            className="group mt-8 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Back to Travulyn
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
