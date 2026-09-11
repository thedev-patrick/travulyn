"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Route,
  FileText,
  Users,
  Newspaper,
  Quote,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/corridors", label: "Corridors & Pricing", icon: Route },
  { href: "/admin/documents", label: "Document Types", icon: FileText },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
  { href: "/admin/inquiries", label: "Inquiries", icon: Mail },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="grid gap-1 p-3">
      {items.map((item) => {
        const active = pathname.startsWith(item.href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
