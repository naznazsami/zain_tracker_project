import RecentTransactions from "@/components/RecentTransactions";
import KPIStatCard from "@/components/KPIStatCard";
import OverviewChart from "@/components/OverviewChart";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  const [kpis, setKpis] = useState<{ balance: number; income: number; expense: number } | null>(null);
  const [overview, setOverview] = useState<{ label: string; income: number; expense: number }[]>([]);
  const [byCategory, setByCategory] = useState<{ name: string; total: number; color?: string }[]>([]);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

    const fetchKpis = fetch(`${base}/dashboard/kpis`, { headers }).then((r) => r.ok ? r.json() : Promise.reject("kpis"));
    const fetchOverview = fetch(`${base}/dashboard/overview`, { headers }).then((r) => r.ok ? r.json() : Promise.reject("overview"));
    const fetchCategories = fetch(`${base}/dashboard/by-category`, { headers }).then((r) => r.ok ? r.json() : Promise.reject("categories"));

    Promise.allSettled([fetchKpis, fetchOverview, fetchCategories]).then((results) => {
      const [rkpis, rover, rcat] = results;
      if (rkpis.status === "fulfilled" && rkpis.value?.success) setKpis(rkpis.value.data);
      if (rover.status === "fulfilled" && rover.value?.success) setOverview(rover.value.data);
      if (rcat.status === "fulfilled" && rcat.value?.success) setByCategory(rcat.value.data);
    });
  }, []);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPIStatCard title="Balance" value={kpis?.balance ?? 0} prefix="$" variant="primary" />
        <KPIStatCard title="Income (30d)" value={kpis?.income ?? 0} prefix="$" trendLabel="vs last 30d" trendValue={8} variant="success" />
        <KPIStatCard title="Expenses (30d)" value={kpis?.expense ?? 0} prefix="$" trendLabel="vs last 30d" trendValue={-5} variant="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <OverviewChart data={overview} />
        </div>
        <div>
          <CategoryBreakdown items={byCategory} />
        </div>
      </div>

      <Card className="p-0 animate-in fade-in slide-in-from-bottom-2">
        <RecentTransactions />
      </Card>
    </div>
  );
}
