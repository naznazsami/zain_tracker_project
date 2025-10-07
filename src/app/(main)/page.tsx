import React from "react";
import { cookies } from "next/headers";
import RecentTransactions from "@/components/RecentTransactions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AddExpenseButton from "@/components/AddExpenseButton";
const getTodayexpenses = async () => {
  const accessToken = (await cookies()).get("accessToken")?.value;
  if (!accessToken) {
    return 0;
  }
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}transactions/day`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    );
    const data = await response.json();
    if (data?.success) {
      return data?.data?.total || 0;
    } else {
      return 0;
    }
  } catch (error) {
    return [];
  }
};



export default async function Categories() {
  const total = await getTodayexpenses();

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Overview</h2>
        <AddExpenseButton />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Today's Expenses</CardTitle>
              <CardDescription>Total spent today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold tracking-tight">${total}</div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest activity</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentTransactions />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
