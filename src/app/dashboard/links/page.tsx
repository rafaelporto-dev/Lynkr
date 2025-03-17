import { SubscriptionCheckClient } from "@/components/subscription-check-client";
import DashboardNavbar from "@/components/dashboard-navbar";
import LinkForm from "@/components/link-form";
import LinksList from "@/components/links-list";
import { InfoIcon, LinkIcon } from "lucide-react";

export default function LinksPage() {
  return (
    <SubscriptionCheckClient>
      <DashboardNavbar />
      <main className="w-full">
        <div className="container mx-auto px-4 py-8 flex flex-col gap-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <LinkIcon className="h-7 w-7" />
                Links
              </h1>
            </div>
            <div className="bg-secondary/50 text-sm p-3 px-4 rounded-lg text-muted-foreground flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>Manage your links here</span>
            </div>
          </header>

          {/* Links Management Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <LinkForm />
            </div>
            <div className="md:col-span-2">
              <LinksList />
            </div>
          </section>
        </div>
      </main>
    </SubscriptionCheckClient>
  );
}
