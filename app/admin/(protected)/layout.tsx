import Link from "next/link";
import { Plane } from "lucide-react";
import { auth } from "@/lib/auth";
import { SidebarNav } from "@/components/admin/sidebar-nav";
import { SignOutButton } from "@/components/admin/sign-out-button";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await auth();

  return (
    <div className="flex min-h-svh">
      <aside className="hidden w-64 shrink-0 border-r bg-muted/20 md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b px-4 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Plane className="h-4 w-4" />
          </span>
          Travulyn Admin
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        <div className="border-t p-3">
          <p className="truncate px-3 text-xs text-muted-foreground">{session?.user?.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b px-4 md:hidden">
          <Link href="/admin/dashboard" className="font-semibold">Travulyn Admin</Link>
          <SignOutButton />
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
