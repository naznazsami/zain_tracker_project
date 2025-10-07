import RecentTransactions from "@/components/RecentTransactions";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Other dashboard widgets */}
      <RecentTransactions />
    </div>
  );
}
