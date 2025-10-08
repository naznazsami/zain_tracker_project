"use client";
import { Card } from "@/components/ui/card";
import { useEffect, useRef } from "react";

// Lightweight chart using <canvas> to avoid new deps
export default function OverviewChart({ data }: { data: { label: string; income: number; expense: number }[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const padding = 32;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxY = Math.max(1, ...data.flatMap((d) => [d.income, d.expense]));

    const barWidth = chartWidth / (data.length * 2.5);

    ctx.font = "12px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillStyle = "#6b7280"; // gray-500

    // X labels
    data.forEach((d, i) => {
      const x = padding + i * (barWidth * 2.5) + barWidth * 1.25;
      ctx.fillText(d.label, x, height - padding + 6);
    });

    // Bars
    data.forEach((d, i) => {
      const xBase = padding + i * (barWidth * 2.5);
      const incomeH = (d.income / maxY) * chartHeight;
      const expenseH = (d.expense / maxY) * chartHeight;

      // income bar
      ctx.fillStyle = "#16a34a"; // green-600
      ctx.fillRect(xBase + barWidth * 0.25, height - padding - incomeH, barWidth, incomeH);

      // expense bar
      ctx.fillStyle = "#dc2626"; // red-600
      ctx.fillRect(xBase + barWidth * 1.25, height - padding - expenseH, barWidth, expenseH);
    });

    // Y axis line
    ctx.strokeStyle = "#e5e7eb"; // gray-200
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.stroke();

    // X axis line
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();

    // Net line overlay (income - expense)
    const points = data.map((d, i) => {
      const net = Math.max(0, d.income - d.expense);
      const x = padding + i * (barWidth * 2.5) + barWidth * 1.25;
      const y = height - padding - (net / maxY) * chartHeight;
      return { x, y };
    });

    ctx.strokeStyle = "#2563eb"; // blue-600
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.stroke();

    // Points
    ctx.fillStyle = "#2563eb";
    points.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [data]);

  return (
    <Card className="p-4 md:p-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Overview</h3>
        <div className="text-xs text-muted-foreground">Income vs Expense</div>
      </div>
      <div className="mt-4">
        <canvas ref={canvasRef} width={720} height={260} className="w-full h-[260px]" />
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-green-600"/>Income</div>
        <div className="flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-red-600"/>Expense</div>
      </div>
    </Card>
  );
}


