import DashboardNavbar from "@/components/dashboard-navbar";
import { SubscriptionCheckClient } from "@/components/subscription-check-client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionCheckClient>
      <div className="min-h-screen bg-background flex flex-col">
        <DashboardNavbar />
        <div className="flex-1">{children}</div>
      </div>
    </SubscriptionCheckClient>
  );
}
