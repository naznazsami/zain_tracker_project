"use client";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";

export default function CategoryDonut({ items }: { items: { name: string; total: number; color?: string }[] }) {
  const total = useMemo(() => items.reduce((a, b) => a + (b.total || 0), 0) || 1, [items]);
  const palette = [
    "oklch(0.488 0.243 264.376)",
    "oklch(0.696 0.17 162.48)",
    "oklch(0.769 0.188 70.08)",
    "oklch(0.627 0.265 303.9)",
    "oklch(0.645 0.246 16.439)",
  ];

  let cumulative = 0;
  const slices = items.map((it, idx) => {
    const pct = (it.total || 0) / total;
    const start = cumulative;
    cumulative += pct;
    const end = cumulative;
    const color = it.color || palette[idx % palette.length];
    return { it, start, end, color };
  });

  return (
    <Card className="p-4 md:p-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Spending by Category</h3>
        <div className="text-xs text-muted-foreground">Donut</div>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        <svg viewBox="0 0 42 42" width="220" height="220" className="mx-auto">
          <circle cx="21" cy="21" r="15.915" fill="none" stroke="var(--muted)" strokeWidth="6" />
          {slices.map((s, i) => {
            const dash = (s.end - s.start) * 100;
            const gap = 100 - dash;
            const rot = s.start * 360 - 90;
            return (
              <circle
                key={i}
                cx="21"
                cy="21"
                r="15.915"
                fill="none"
                stroke={s.color}
                strokeWidth="6"
                strokeDasharray={`${dash} ${gap}`}
                transform={`rotate(${rot} 21 21)`}
              />
            );
          })}
          <circle cx="21" cy="21" r="10" fill="var(--background)" />
          <text x="21" y="22" textAnchor="middle" className="text-sm" fill="currentColor">
            ${total.toFixed(0)}
          </text>
        </svg>
        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: it.color || palette[idx % palette.length] }} />
                <span className="truncate">{it.name}</span>
              </div>
              <span className="tabular-nums">${it.total.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}


