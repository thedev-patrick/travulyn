import Link from "next/link";
import { Plane } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="flex flex-col gap-3">
          <Link href="/" className="flex items-center gap-2 font-heading font-semibold">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Plane className="h-3.5 w-3.5" />
            </span>
            Travulyn
          </Link>
          <p className="max-w-xs text-sm text-muted-foreground">
            Travel documents and visa support, wherever you&apos;re going.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted-foreground">
          <Link href="/destinations" className="transition-colors hover:text-foreground">Check Requirements</Link>
          <Link href="/how-it-works" className="transition-colors hover:text-foreground">How It Works</Link>
          <Link href="/blog" className="transition-colors hover:text-foreground">Blog</Link>
          <Link href="/testimonials" className="transition-colors hover:text-foreground">Testimonials</Link>
          <Link href="/contact" className="transition-colors hover:text-foreground">Contact</Link>
        </nav>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Travulyn. All rights reserved.
      </div>
    </footer>
  );
}
