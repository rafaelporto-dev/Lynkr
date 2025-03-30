import DashboardNavbar from "@/components/dashboard-navbar";
import { SubscriptionCheckClient } from "@/components/subscription-check-client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionCheckClient>
      <div className="h-screen bg-background flex flex-col overflow-hidden">
        <DashboardNavbar />
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </SubscriptionCheckClient>
  );
}
