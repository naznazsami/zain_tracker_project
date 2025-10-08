"use client";
import KPIStatCard from "@/components/KPIStatCard";
import OverviewChart from "@/components/OverviewChart";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import RecentTransactions from "@/components/RecentTransactions";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import GoalsSection from "@/components/GoalsSection";
import CategoryDonut from "@/components/CategoryDonut";

export default function HomeDashboard() {
  const [kpis, setKpis] = useState<{ balance: number; income: number; expense: number } | null>(null);
  const [overview, setOverview] = useState<{ label: string; income: number; expense: number }[]>([]);
  const [byCategory, setByCategory] = useState<{ name: string; total: number; color?: string }[]>([]);
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    setLoading(true);
    const fetchKpis = fetch(`${base}/dashboard/kpis?range=${timeframe}`, { headers }).then((r) => r.ok ? r.json() : Promise.reject("kpis"));
    const fetchOverview = fetch(`${base}/dashboard/overview?range=${timeframe}`, { headers }).then((r) => r.ok ? r.json() : Promise.reject("overview"));
    const fetchCategories = fetch(`${base}/dashboard/by-category?range=${timeframe}`, { headers }).then((r) => r.ok ? r.json() : Promise.reject("categories"));

    Promise.allSettled([fetchKpis, fetchOverview, fetchCategories]).then((results) => {
      const [rkpis, rover, rcat] = results;
      if (rkpis.status === "fulfilled" && rkpis.value?.success) setKpis(rkpis.value.data);
      if (rover.status === "fulfilled" && rover.value?.success) setOverview(rover.value.data);
      if (rcat.status === "fulfilled" && rcat.value?.success) setByCategory(rcat.value.data);
    }).finally(() => setLoading(false));
  }, [timeframe]);

  return (
    <div className="space-y-6">
      <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as any)}>
        <TabsList>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
          <TabsTrigger value="year">Year</TabsTrigger>
        </TabsList>
        <TabsContent value={timeframe}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {loading ? (
              <>
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
                <Skeleton className="h-28 w-full" />
              </>
            ) : (
              <>
                <KPIStatCard title="Balance" value={kpis?.balance ?? 0} prefix="$" variant="primary" />
                <KPIStatCard title="Income" value={kpis?.income ?? 0} prefix="$" trendLabel={`vs last ${timeframe}`} trendValue={8} variant="success" />
                <KPIStatCard title="Expenses" value={kpis?.expense ?? 0} prefix="$" trendLabel={`vs last ${timeframe}`} trendValue={-5} variant="danger" />
              </>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <div className="lg:col-span-2">
              {loading ? <Skeleton className="h-[260px] w-full" /> : <OverviewChart data={overview} />}
            </div>
            <div>
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : (
                <CategoryDonut items={byCategory} />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <Card className="p-0 animate-in fade-in slide-in-from-bottom-2">
        <RecentTransactions />
      </Card>

      <GoalsSection />
    </div>
  );
}


