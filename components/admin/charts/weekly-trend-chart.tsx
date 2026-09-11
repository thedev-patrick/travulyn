"use client";

import { useRef, useState } from "react";

type WeekDatum = {
  weekLabel: string;
  count: number;
};

const WIDTH = 600;
const HEIGHT = 180;
const PAD_LEFT = 28;
const PAD_RIGHT = 12;
const PAD_TOP = 16;
const PAD_BOTTOM = 24;

export function WeeklyTrendChart({ data }: { data: WeekDatum[] }) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const innerWidth = WIDTH - PAD_LEFT - PAD_RIGHT;
  const innerHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  // Round the axis ceiling to a clean step above the max.
  const axisMax = Math.max(4, Math.ceil(maxCount / 4) * 4);

  const points = data.map((d, i) => ({
    x: PAD_LEFT + (data.length === 1 ? innerWidth / 2 : (i / (data.length - 1)) * innerWidth),
    y: PAD_TOP + innerHeight - (d.count / axisMax) * innerHeight,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${PAD_TOP + innerHeight} L ${points[0].x} ${PAD_TOP + innerHeight} Z`;

  const last = points[points.length - 1];
  const hovered = hoverIndex !== null ? points[hoverIndex] : null;

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * WIDTH;
    const ratio = (x - PAD_LEFT) / innerWidth;
    const i = Math.round(ratio * (data.length - 1));
    setHoverIndex(Math.min(Math.max(i, 0), data.length - 1));
  }

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full touch-none"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverIndex(null)}
        role="img"
        aria-label={`New applications per week, last ${data.length} weeks. Most recent week: ${last.count}.`}
      >
        {/* gridlines */}
        <line
          x1={PAD_LEFT}
          y1={PAD_TOP + innerHeight}
          x2={WIDTH - PAD_RIGHT}
          y2={PAD_TOP + innerHeight}
          stroke="var(--border)"
          strokeWidth={1}
        />
        <line x1={PAD_LEFT} y1={PAD_TOP} x2={WIDTH - PAD_RIGHT} y2={PAD_TOP} stroke="var(--border)" strokeWidth={1} />
        <text x={PAD_LEFT - 6} y={PAD_TOP + innerHeight} textAnchor="end" dy="0.32em" className="fill-muted-foreground text-[9px]">
          0
        </text>
        <text x={PAD_LEFT - 6} y={PAD_TOP} textAnchor="end" dy="0.32em" className="fill-muted-foreground text-[9px]">
          {axisMax}
        </text>

        {/* area wash */}
        <path d={areaPath} fill="var(--primary)" opacity={0.1} stroke="none" />
        {/* line */}
        <path d={linePath} fill="none" stroke="var(--primary)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* end marker + label */}
        <circle cx={last.x} cy={last.y} r={4} fill="var(--primary)" stroke="var(--card)" strokeWidth={2} />
        <text x={last.x} y={last.y - 10} textAnchor="end" className="fill-foreground text-[10px] font-medium">
          {last.count}
        </text>

        {/* hover crosshair */}
        {hovered && (
          <>
            <line
              x1={hovered.x}
              y1={PAD_TOP}
              x2={hovered.x}
              y2={PAD_TOP + innerHeight}
              stroke="var(--border)"
              strokeWidth={1}
            />
            <circle cx={hovered.x} cy={hovered.y} r={4} fill="var(--primary)" stroke="var(--card)" strokeWidth={2} />
          </>
        )}

        {/* hit targets */}
        {points.map((p, i) => (
          <rect
            key={p.weekLabel}
            x={p.x - innerWidth / (data.length * 2)}
            y={PAD_TOP}
            width={innerWidth / data.length}
            height={innerHeight}
            fill="transparent"
            tabIndex={0}
            role="img"
            aria-label={`${p.weekLabel}: ${p.count} application${p.count === 1 ? "" : "s"}`}
            onFocus={() => setHoverIndex(i)}
            onBlur={() => setHoverIndex(null)}
          />
        ))}
      </svg>

      {hovered && (
        <div
          role="tooltip"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-md bg-foreground px-2 py-1 text-xs font-medium whitespace-nowrap text-background shadow-md"
          style={{ left: `${(hovered.x / WIDTH) * 100}%`, top: `${(hovered.y / HEIGHT) * 100 - 4}%` }}
        >
          {hovered.weekLabel} — {hovered.count}
        </div>
      )}
    </div>
  );
}
