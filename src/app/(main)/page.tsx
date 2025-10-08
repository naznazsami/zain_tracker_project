"use client";
import React from "react";
import HomeDashboard from "@/components/HomeDashboard";
import AddExpenseButton from "@/components/AddExpenseButton";

export default function HomePage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Overview</h2>
        <AddExpenseButton />
      </div>
      <HomeDashboard />
    </div>
  );
}
