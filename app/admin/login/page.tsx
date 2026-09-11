import Link from "next/link";
import { Plane } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/admin/login-form";
import { Reveal } from "@/components/motion/reveal";
import { ParallaxBlobs } from "@/components/site/parallax-blobs";

export const metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <div className="relative isolate flex min-h-svh items-center justify-center overflow-hidden bg-muted/20 px-4">
      <ParallaxBlobs className="pointer-events-none absolute inset-0 -z-10" />
      <Reveal y={12}>
        <Card className="w-full max-w-sm shadow-lg">
          <CardHeader className="items-center text-center">
            <Link href="/" className="group mb-2 flex items-center gap-2 font-heading text-lg font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover:-rotate-12">
                <Plane className="h-4 w-4" />
              </span>
              Travulyn
            </Link>
            <CardTitle className="font-heading font-medium">Admin sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
