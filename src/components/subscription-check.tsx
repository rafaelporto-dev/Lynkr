import { redirect } from "next/navigation";
import { checkUserSubscription } from "@/app/actions";
import { createClient } from "../../supabase/server";
import { headers } from "next/headers";

interface SubscriptionCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export async function SubscriptionCheck({
  children,
  redirectTo = "/pricing",
}: SubscriptionCheckProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Check URL parameters for successful checkout
  let sessionId = null;
  try {
    // Get the current request URL from headers
    const headersList = headers();
    const referer = headersList.get("referer") || headersList.get("referrer");

    if (referer) {
      const url = new URL(referer);
      sessionId = url.searchParams.get("session_id");
    }
  } catch (error) {
    // If URL parsing fails, continue without the session ID
  }

  // If there's a session_id in the URL, we'll assume the checkout was successful
  // and allow access to the dashboard temporarily
  if (sessionId) {
    return <>{children}</>;
  }

  const isSubscribed = await checkUserSubscription(user?.id!);

  if (!isSubscribed) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
