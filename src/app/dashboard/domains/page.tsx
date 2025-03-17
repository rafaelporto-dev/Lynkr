import { SubscriptionCheckClient } from "@/components/subscription-check-client";
import DashboardNavbar from "@/components/dashboard-navbar";
import CustomDomainManager from "@/components/custom-domain-manager";
import { Globe, InfoIcon } from "lucide-react";

export default function DomainsPage() {
  return (
    <SubscriptionCheckClient>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Globe className="h-7 w-7" />
                Domains
              </h1>
            </div>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>Configure your custom domains</span>
            </div>
          </header>

          {/* Custom Domain Section */}
          <CustomDomainManager />
        </div>
      </main>
    </SubscriptionCheckClient>
  );
}
