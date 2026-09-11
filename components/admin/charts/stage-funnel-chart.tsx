"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type StageDatum = {
  status: string;
  label: string;
  count: number;
};

export function StageFunnelChart({ data }: { data: StageDatum[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="grid gap-2.5">
      {data.map((d, i) => {
        const percent = (d.count / maxCount) * 100;
        const active = activeIndex === i;
        return (
          <div
            key={d.status}
            role="group"
            tabIndex={0}
            aria-label={`${d.label}: ${d.count} application${d.count === 1 ? "" : "s"}`}
            className="relative grid grid-cols-[110px_1fr_auto] items-center gap-3 rounded-md px-1 py-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            onMouseEnter={() => setActiveIndex(i)}
            onMouseLeave={() => setActiveIndex(null)}
            onFocus={() => setActiveIndex(i)}
            onBlur={() => setActiveIndex(null)}
          >
            <span className="truncate text-sm text-muted-foreground">{d.label}</span>
            <div className="h-5 min-w-0 rounded-r bg-muted/50">
              <div
                className={cn(
                  "h-full rounded-r transition-[filter,width] duration-200",
                  active && "brightness-110"
                )}
                style={{
                  width: `${Math.max(percent, d.count > 0 ? 3 : 0)}%`,
                  backgroundColor: `var(--chart-${i + 1})`,
                }}
              />
            </div>
            <span className="w-8 text-right text-sm font-medium tabular-nums">{d.count}</span>

            {active && (
              <div
                role="tooltip"
                className="pointer-events-none absolute -top-8 left-[110px] z-10 rounded-md bg-foreground px-2 py-1 text-xs font-medium whitespace-nowrap text-background shadow-md"
              >
                {d.label} — {d.count} application{d.count === 1 ? "" : "s"}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
