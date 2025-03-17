import { SubscriptionCheckClient } from "@/components/subscription-check-client";
import DashboardNavbar from "@/components/dashboard-navbar";
import UserStatistics from "@/components/user-statistics";
import { BarChart2, InfoIcon } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <SubscriptionCheckClient>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <BarChart2 className="h-7 w-7" />
                Analytics
              </h1>
            </div>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>View your links statistics</span>
            </div>
          </header>

          {/* Analytics Section */}
          <UserStatistics />
        </div>
      </main>
    </SubscriptionCheckClient>
  );
}
