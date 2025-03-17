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
          },
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
        },
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
      className={`w-full max-w-[350px] relative overflow-hidden ${
        item.popular
          ? "border-2 border-purple-500 bg-gradient-to-b from-gray-900 to-black shadow-xl scale-105"
          : item.isFree
            ? "border border-gray-700/50 bg-gray-900/60"
            : "border border-purple-900/30 bg-gray-900/80"
      }`}
    >
      {item.popular && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 opacity-50" />
      )}
      <CardHeader className="relative">
        {item.popular && (
          <div className="px-4 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-full w-fit mb-4">
            Most Popular
          </div>
        )}
        {item.isFree && (
          <div className="px-4 py-1.5 text-sm font-medium text-white bg-gray-700 rounded-full w-fit mb-4">
            Free Forever
          </div>
        )}
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          {item.name}
        </CardTitle>
        <CardDescription className="flex items-baseline gap-2 mt-2">
          {item.isFree ? (
            <span className="text-4xl font-bold text-white">$0</span>
          ) : (
            <>
              <span className="text-4xl font-bold text-white">
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
              <Check
                className={`w-5 h-5 ${item.isFree ? "text-gray-500" : "text-purple-500"} mt-0.5 flex-shrink-0`}
              />
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
          className={`w-full py-6 text-lg font-medium ${
            item.popular
              ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              : item.isFree
                ? "bg-gray-700 hover:bg-gray-600 text-white"
                : "bg-gray-800 hover:bg-gray-700 text-white"
          }`}
        >
          {item.isFree ? "Start Free" : "Get Started"}
        </Button>
      </CardFooter>
    </Card>
  );
}
