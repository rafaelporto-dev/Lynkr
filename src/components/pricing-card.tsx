"use client";

import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { supabase } from "../../supabase/supabase";

export default function PricingCard({
  item,
  user,
}: {
  item: any;
  user: User | null;
}) {
  // Handle checkout process
  const handleCheckout = async (priceId: string) => {
    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/sign-in?redirect=pricing";
      return;
    }

    // For free plan, enable it in the database first, then redirect to dashboard
    if (item.isFree) {
      try {
        // Call the Supabase function to enable the free plan
        const { data, error } = await supabase.functions.invoke(
          "supabase-functions-enable-free-plan",
          {
            body: { user_id: user.id },
          }
        );

        if (error) {
          console.error("Error enabling free plan:", error);
          // Fallback to direct database update if function fails
          await supabase.from("profiles").upsert({
            id: user.id,
            has_free_plan: true,
            updated_at: new Date().toISOString(),
          });
        }

        window.location.href = "/dashboard";
      } catch (error) {
        console.error("Error enabling free plan:", error);
        // Still try to redirect to dashboard
        window.location.href = "/dashboard";
      }
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke(
        "supabase-functions-create-checkout",
        {
          body: {
            price_id: priceId,
            user_id: user.id,
            return_url: `${window.location.origin}/dashboard`,
          },
          headers: {
            "X-Customer-Email": user.email || "",
          },
        }
      );

      if (error) {
        throw error;
      }

      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  // Define features based on plan type
  const getFeatures = (planName: string | undefined) => {
    // Free plan features
    if (item.isFree) {
      return ["Basic profile URL", "Up to 5 links", "Lynkr branding"];
    }

    const baseFeatures = [
      "Custom profile URL",
      "Unlimited links",
      "Basic analytics",
    ];

    if (!planName) {
      return baseFeatures;
    }

    if (planName.toLowerCase().includes("pro")) {
      return [
        ...baseFeatures,
        "Advanced analytics",
        "Custom themes",
        "Remove Lynkr branding",
        "Custom domain",
        "Priority support",
      ];
    } else if (planName.toLowerCase().includes("business")) {
      return [
        ...baseFeatures,
        "Advanced analytics",
        "Custom themes",
        "Remove Lynkr branding",
        "Custom domain",
        "Priority support",
        "Team collaboration",
        "API access",
        "Multiple custom domains",
      ];
    }

    return baseFeatures;
  };

  const features = getFeatures(item.name);

  return (
    <Card
      className={`w-full max-w-[350px] relative overflow-hidden backdrop-blur-lg border transform transition-all duration-300 hover:translate-y-[-5px] ${
        item.popular
          ? "border-indigo-500/50 bg-white/[0.08] shadow-xl shadow-indigo-900/20 scale-105"
          : item.isFree
            ? "border-white/10 bg-white/[0.04] hover:border-indigo-500/20 hover:shadow-lg hover:shadow-indigo-900/10"
            : "border-indigo-500/30 bg-white/[0.06] hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-900/10"
      }`}
    >
      {item.popular && (
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20 opacity-50" />
      )}
      <CardHeader className="relative">
        {item.popular && (
          <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full w-fit mb-4">
            Most Popular
          </div>
        )}
        {item.isFree && (
          <div className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-900/60 backdrop-blur-sm rounded-full w-fit mb-4">
            Free Forever
          </div>
        )}
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          {item.name}
        </CardTitle>
        <CardDescription className="flex items-baseline gap-2 mt-2">
          {item.isFree ? (
            <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">
              $0
            </span>
          ) : (
            <>
              <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">
                ${item?.amount / 100}
              </span>
              <span className="text-gray-400">/{item?.interval}</span>
            </>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="relative">
        <ul className="space-y-3 mt-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-900/50 mt-0.5 flex-shrink-0">
                <Check
                  className={`w-3 h-3 ${item.popular ? "text-indigo-300" : "text-indigo-400"}`}
                />
              </div>
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="relative">
        <Button
          onClick={async () => {
            await handleCheckout(item.id);
          }}
          className={`w-full py-6 text-lg font-medium relative overflow-hidden group ${
            item.popular
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30"
              : item.isFree
                ? "bg-white/10 hover:bg-white/20 text-white"
                : "bg-indigo-600/80 hover:bg-indigo-500/80 text-white"
          }`}
        >
          <span className="relative z-10">
            {item.isFree ? "Start Free" : "Get Started"}
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 w-0 group-hover:w-full transition-all duration-500 ease-in-out"></span>
        </Button>
      </CardFooter>
    </Card>
  );
}
