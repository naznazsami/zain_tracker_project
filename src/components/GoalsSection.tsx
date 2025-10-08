"use client";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

type Goal = { id: string | number; name: string; target: number; current: number };

export default function GoalsSection() {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    const accessToken = Cookies.get("accessToken");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    fetch(`${base}/goals`, { headers })
      .then((r) => r.ok ? r.json() : Promise.reject("goals"))
      .then((data) => { if (data?.success) setGoals(data.data || []); })
      .catch(() => {});
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {goals.map((g) => {
        const pct = g.target ? Math.min(100, Math.round((g.current / g.target) * 100)) : 0;
        return (
          <Card key={g.id} className="p-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <div className="font-medium truncate">{g.name}</div>
              <div className="text-sm text-muted-foreground">{pct}%</div>
            </div>
            <div className="mt-3 h-2 w-full rounded bg-muted">
              <div className="h-2 rounded bg-blue-600" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-2 text-xs text-muted-foreground tabular-nums">${g.current.toFixed(2)} / ${g.target.toFixed(2)}</div>
          </Card>
        );
      })}
      {goals.length === 0 && (
        <Card className="p-4 text-sm text-muted-foreground">No goals yet.</Card>
      )}
    </div>
  );
}


