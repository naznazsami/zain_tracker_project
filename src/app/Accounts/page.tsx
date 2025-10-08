"use client";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Card } from "@/components/ui/card";
import KPIStatCard from "@/components/KPIStatCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AddAccountButton from "@/components/accounts/AddAccountButton";

type Account = {
  id: string | number;
  name: string;
  type: string;
  balance: number;
  created_at: string;
};

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [kpis, setKpis] = useState<{ totalBalance: number; numAccounts: number } | null>(null);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
    const headers: HeadersInit = { "Content-Type": "application/json" } as HeadersInit;
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    const fetchAccounts = fetch(`${base}/accounts`, { headers }).then((r) => r.ok ? r.json() : Promise.reject("accounts"));
    const fetchKpis = fetch(`${base}/accounts/kpis`, { headers }).then((r) => r.ok ? r.json() : Promise.reject("kpis"));
    Promise.allSettled([fetchAccounts, fetchKpis]).then(([ra, rk]) => {
      if (ra.status === "fulfilled" && ra.value?.success) setAccounts(ra.value.data || []);
      if (rk.status === "fulfilled" && rk.value?.success) setKpis(rk.value.data);
    }).finally(() => setLoading(false));
  }, []);

  const onAccountAdded = (acc: Account) => {
    setAccounts((cur) => [acc, ...cur]);
    setKpis((cur) => cur ? { ...cur, numAccounts: cur.numAccounts + 1, totalBalance: cur.totalBalance + (acc.balance || 0) } : cur);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Accounts</h1>
        <AddAccountButton onCreated={onAccountAdded} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPIStatCard title="Total Balance" value={kpis?.totalBalance ?? 0} prefix="$" variant="primary" />
        <KPIStatCard title="Accounts" value={kpis?.numAccounts ?? 0} variant="success" />
        <KPIStatCard title="Avg/Account" value={kpis && kpis.numAccounts ? Math.round((kpis.totalBalance || 0) / kpis.numAccounts) : 0} prefix="$" variant="neutral" />
      </div>

      <Card className="p-0">
        <div className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((a) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className="capitalize">{a.type}</TableCell>
                  <TableCell className="text-right tabular-nums">${a.balance?.toFixed(2)}</TableCell>
                </TableRow>
              ))}
              {!loading && accounts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">No accounts found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}


