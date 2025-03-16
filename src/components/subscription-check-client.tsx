"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../supabase/client";

interface SubscriptionCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export function SubscriptionCheckClient({
  children,
  redirectTo = "/pricing",
}: SubscriptionCheckProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function checkSubscription() {
      try {
        // Check if user is logged in
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          router.push("/sign-in");
          return;
        }

        // Check URL parameters for successful checkout
        let sessionId = null;
        try {
          const url = new URL(window.location.href);
          sessionId = url.searchParams.get("session_id");
        } catch (error) {
          // If URL parsing fails, continue without the session ID
        }

        // If there's a session_id in the URL, we'll assume the checkout was successful
        // and allow access to the dashboard temporarily
        if (sessionId) {
          setIsAllowed(true);
          setIsLoading(false);
          return;
        }

        // Check subscription status
        const { data: profileData } = await supabase
          .from("profiles")
          .select("is_subscribed")
          .eq("id", userData.user.id)
          .single();

        if (profileData?.is_subscribed) {
          setIsAllowed(true);
        } else {
          router.push(redirectTo);
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
        router.push(redirectTo);
      } finally {
        setIsLoading(false);
      }
    }

    checkSubscription();
  }, [redirectTo, router, supabase]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!isAllowed) {
    return null; // Will redirect in the useEffect
  }

  return <>{children}</>;
}
