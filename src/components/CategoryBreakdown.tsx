import { Card } from "@/components/ui/card";

export default function CategoryBreakdown({ items }: { items: { name: string; total: number; color?: string }[] }) {
  const palette = [
    "oklch(0.488 0.243 264.376)",
    "oklch(0.696 0.17 162.48)",
    "oklch(0.769 0.188 70.08)",
    "oklch(0.627 0.265 303.9)",
    "oklch(0.645 0.246 16.439)",
  ];
  const sum = items.reduce((acc, it) => acc + (it.total || 0), 0) || 1;
  return (
    <Card className="p-4 md:p-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">By Category</h3>
        <div className="text-xs text-muted-foreground">Spending distribution</div>
      </div>
      <div className="mt-4 space-y-3">
        {items.map((it, idx) => {
          const percentage = Math.round(((it.total || 0) / sum) * 100);
          return (
            <div key={it.name} className="grid grid-cols-3 items-center gap-3 text-sm">
              <div className="truncate">{it.name}</div>
              <div className="text-right tabular-nums">{it.total.toFixed(2)}</div>
              <div className="flex items-center gap-2">
                <div className="relative h-2 w-full overflow-hidden rounded bg-muted">
                  <div className="absolute inset-y-0 left-0" style={{ width: `${percentage}%`, backgroundColor: it.color || palette[idx % palette.length] }} />
                </div>
                <span className="w-10 text-right text-xs text-muted-foreground">{percentage}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}


