"use client";

import { motion } from "motion/react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  FileCheck,
  LayoutDashboard,
  Link2,
  Mail,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/portal/progress-bar";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

function PillCountry({ flag, name }: { flag: string; name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium shadow-xs">
      <span>{flag}</span>
      {name}
    </span>
  );
}

export function SceneDiscover() {
  return (
    <div className="flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center gap-2"
      >
        <PillCountry flag="🇳🇬" name="Nigeria" />
        <motion.span
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.4, ease }}
          className="h-px w-8 origin-left bg-border sm:w-12"
        />
        <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.4, ease }}>
          <PillCountry flag="🇬🇧" name="United Kingdom" />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5, ease }}
        className="flex items-center justify-between rounded-lg border bg-background/60 px-3 py-2 text-xs"
      >
        <span className="text-muted-foreground">Estimated cost</span>
        <span className="font-medium">$220 – $340 · 10 business days</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5, ease }}
        className="grid gap-2"
      >
        <div className="h-8 rounded-md border bg-background/60" />
        <div className="h-8 rounded-md border bg-background/60" />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2, duration: 0.4, ease }} className="w-fit">
        <motion.div animate={{ scale: [1, 0.94, 1] }} transition={{ delay: 2.3, duration: 0.35 }}>
          <Button size="sm" className="pointer-events-none">
            Send inquiry
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 0.4, ease }}
        className="flex items-center gap-1.5 text-xs font-medium text-primary"
      >
        <CheckCircle2 className="h-3.5 w-3.5" /> Inquiry received — we&apos;ll be in touch
      </motion.div>
    </div>
  );
}

export function SceneAdminOnboard() {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard" },
    { icon: Mail, label: "Inquiries", active: true },
    { icon: Users, label: "Customers" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex w-fit items-center gap-1 rounded-lg border bg-background/60 p-1 text-[11px] text-muted-foreground"
      >
        {navItems.map((item) => (
          <span
            key={item.label}
            className={cn(
              "flex items-center gap-1 rounded-md px-2 py-1",
              item.active && "bg-brand-warm/15 text-brand-warm"
            )}
          >
            <item.icon className="h-3 w-3" /> {item.label}
          </span>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5, ease }}
        className="rounded-lg border bg-background/60 px-3 py-2.5"
      >
        <p className="text-xs font-medium">Amara O.</p>
        <p className="text-[11px] text-muted-foreground">Lagos → London · new inquiry</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.4, ease }} className="w-fit">
        <motion.div animate={{ scale: [1, 0.92, 1] }} transition={{ delay: 2.4, duration: 0.35 }}>
          <Button size="sm" variant="outline" className="pointer-events-none border-brand-warm/40 text-brand-warm hover:bg-brand-warm/10">
            Create customer
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.5, ease }}
        className="flex items-center justify-between gap-2 rounded-lg border border-dashed bg-background/60 px-3 py-2 text-[11px]"
      >
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <Link2 className="h-3 w-3" /> travulyn.com/portal/••••••••
        </span>
        <Badge variant="outline" className="gap-1 border-brand-warm/30 bg-brand-warm/15 text-brand-warm">
          <CheckCircle2 className="h-3 w-3" /> Application created
        </Badge>
      </motion.div>
    </div>
  );
}

export function ScenePortal() {
  const docs = [
    { label: "Passport", delay: 1.4, done: true },
    { label: "Bank statement", delay: 2.2, done: false },
  ];

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center justify-between gap-3"
      >
        <div>
          <p className="text-xs text-muted-foreground">Hi Amara,</p>
          <p className="text-sm font-medium">🇳🇬 Nigeria → 🇬🇧 United Kingdom</p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.4 }}>
          <Badge className="gap-1.5">
            <FileCheck className="h-3 w-3" /> Docs pending
          </Badge>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease }}
        className="rounded-lg border bg-background/60 p-3"
      >
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">Document progress</span>
          <span className="text-muted-foreground">1 of 2 approved</span>
        </div>
        <ProgressBar percent={50} className="mt-2" />
      </motion.div>

      <div className="grid gap-2">
        {docs.map((doc) => (
          <motion.div
            key={doc.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: doc.delay, duration: 0.4, ease }}
            className="flex items-center justify-between rounded-lg border bg-background/60 px-3 py-2 text-xs"
          >
            <span>{doc.label}</span>
            {doc.done ? (
              <span className="flex items-center gap-1 text-primary">
                <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded
              </span>
            ) : (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" /> Pending
              </span>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function SceneAdminReview() {
  return (
    <div className="flex flex-col gap-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="flex items-center justify-between gap-3 rounded-lg border bg-background/60 px-3 py-2.5"
      >
        <span className="flex items-center gap-2 text-xs font-medium">
          <FileCheck className="h-3.5 w-3.5 text-brand-warm" /> Passport.pdf
        </span>
        <motion.div animate={{ scale: [1, 0.92, 1] }} transition={{ delay: 1.6, duration: 0.35 }}>
          <Button size="xs" variant="outline" className="pointer-events-none border-brand-warm/40 text-brand-warm hover:bg-brand-warm/10">
            Approve
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2.1, duration: 0.4 }}
        className="flex w-fit items-center gap-1.5 rounded-full bg-brand-warm/15 px-2.5 py-1 text-xs font-medium text-brand-warm"
      >
        <CheckCircle2 className="h-3.5 w-3.5" /> Document approved
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.9, duration: 0.5, ease }}
        className="rounded-lg border border-dashed bg-background/60 p-3"
      >
        <p className="text-[11px] text-muted-foreground">Progress update</p>
        <p className="mt-1 text-xs font-medium">
          &ldquo;Documents verified — moving to visa application&rdquo;
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.7, duration: 0.4, ease }}
        className="flex items-center gap-1.5 text-xs font-medium text-brand-warm"
      >
        <ArrowRight className="h-3.5 w-3.5" /> Posted to the customer&apos;s portal
      </motion.div>
    </div>
  );
}

export function SceneSync() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
          className="rounded-lg border bg-background/60 p-3"
        >
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-brand-warm">
            <Users className="h-3 w-3" /> Admin
          </p>
          <p className="mt-1.5 text-xs leading-snug text-muted-foreground">
            Posted: &ldquo;Visa approved — documents ready&rdquo;
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease }}
          className="rounded-lg border bg-background/60 p-3"
        >
          <p className="flex items-center gap-1.5 text-[11px] font-medium text-primary">
            <ShieldCheck className="h-3 w-3" /> Client portal
          </p>
          <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.4 }}>
            <Badge className="mt-1.5 gap-1.5">
              <CheckCircle2 className="h-3 w-3" /> Approved
            </Badge>
          </motion.div>
        </motion.div>
      </div>

      <div className="relative h-4">
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
        <motion.span
          className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary"
          style={{ boxShadow: "0 0 0 4px color-mix(in oklch, var(--primary), transparent 80%)" }}
          initial={{ left: "6%", opacity: 0 }}
          animate={{ left: "94%", opacity: [0, 1, 1, 0] }}
          transition={{ delay: 0.8, duration: 1.1, ease, times: [0, 0.15, 0.85, 1] }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.4, duration: 0.5, ease }}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
      >
        <Sparkles className="h-3.5 w-3.5 text-primary" /> Updates sync instantly — no extra step for either side.
      </motion.div>
    </div>
  );
}
