"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Globe,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

type CustomDomain = {
  id: string;
  domain: string;
  verified: boolean;
  verification_code: string;
  created_at: string;
  updated_at: string;
};

export default function CustomDomainManager() {
  const [domain, setDomain] = useState("");
  const [customDomain, setCustomDomain] = useState<CustomDomain | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [hasSubscription, setHasSubscription] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function checkSubscriptionAndLoadDomain() {
      try {
        setIsLoading(true);
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("You must be logged in to manage custom domains");
          return;
        }

        // Check if user has a subscription
        const { data: profile } = await supabase
          .from("profiles")
          .select("has_free_plan")
          .eq("id", user.id)
          .single();

        // If user has free plan, they can't use custom domains
        if (profile?.has_free_plan) {
          setHasSubscription(false);
          return;
        }

        // Check for active subscription
        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .in("status", ["active", "trialing", "paid"])
          .single();

        if (subError || !subscription) {
          setHasSubscription(false);
          return;
        }

        setHasSubscription(true);

        // Load existing custom domain if any
        const { data: domainData, error: domainError } = await supabase
          .from("custom_domains")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (domainError && domainError.code !== "PGRST116") {
          // PGRST116 is the error code for no rows returned
          throw domainError;
        }

        if (domainData) {
          setCustomDomain(domainData);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load domain information");
      } finally {
        setIsLoading(false);
      }
    }

    checkSubscriptionAndLoadDomain();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Basic validation
      if (!domain.trim()) {
        setError("Domain is required");
        return;
      }

      // Domain format validation
      const domainRegex =
        /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/i;
      if (!domainRegex.test(domain)) {
        setError("Please enter a valid domain name (e.g., example.com)");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("You must be logged in to add a custom domain");
        return;
      }

      // Generate a verification code
      const verificationCode = Math.random().toString(36).substring(2, 15);

      // Insert the new domain
      const { data, error: insertError } = await supabase
        .from("custom_domains")
        .insert({
          user_id: user.id,
          domain: domain.trim().toLowerCase(),
          verification_code: verificationCode,
          verified: false,
        })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === "23505") {
          // Unique violation
          setError("This domain is already in use. Please try another one.");
        } else {
          throw insertError;
        }
        return;
      }

      setCustomDomain(data);
      setDomain("");
      toast({
        title: "Domain added",
        description: "Please verify your domain to activate it.",
      });
    } catch (err: any) {
      setError(err.message || "Failed to add domain");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyDomain = async () => {
    if (!customDomain) return;

    setIsVerifying(true);
    setError("");

    try {
      // In a real implementation, we would check if the DNS TXT record is set correctly
      // For this demo, we'll simulate a verification check

      // Simulate API call to verify domain
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update the domain status to verified
      const { error: updateError } = await supabase
        .from("custom_domains")
        .update({
          verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", customDomain.id);

      if (updateError) throw updateError;

      // Update the profile to indicate they have a custom domain
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          has_custom_domain: true,
          updated_at: new Date().toISOString(),
        })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      if (profileError) throw profileError;

      // Update local state
      setCustomDomain({
        ...customDomain,
        verified: true,
      });

      toast({
        title: "Domain verified",
        description: "Your custom domain is now active.",
      });
    } catch (err: any) {
      setError(err.message || "Failed to verify domain");
    } finally {
      setIsVerifying(false);
    }
  };

  const deleteDomain = async () => {
    if (!customDomain) return;

    if (!confirm("Are you sure you want to delete this domain?")) {
      return;
    }

    setIsDeleting(true);
    setError("");

    try {
      const { error: deleteError } = await supabase
        .from("custom_domains")
        .delete()
        .eq("id", customDomain.id);

      if (deleteError) throw deleteError;

      // Update the profile to indicate they no longer have a custom domain
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          has_custom_domain: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", (await supabase.auth.getUser()).data.user?.id);

      if (profileError) throw profileError;

      setCustomDomain(null);
      toast({
        title: "Domain deleted",
        description: "Your custom domain has been removed.",
      });
    } catch (err: any) {
      setError(err.message || "Failed to delete domain");
    } finally {
      setIsDeleting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Verification code copied to clipboard.",
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Custom Domain</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!hasSubscription) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Custom Domain</CardTitle>
          <CardDescription>
            Use your own domain instead of lynkr.me/username
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-muted">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Premium Feature</AlertTitle>
            <AlertDescription>
              Custom domains are available for premium users only. Upgrade your
              plan to use this feature.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button onClick={() => router.push("/pricing")} className="w-full">
            Upgrade Plan
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          <span>Custom Domain</span>
        </CardTitle>
        <CardDescription>
          Use your own domain instead of lynkr.me/username
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {customDomain ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
              <div>
                <h3 className="font-medium">{customDomain.domain}</h3>
                <p className="text-sm text-muted-foreground">
                  {customDomain.verified ? "Verified" : "Pending verification"}
                </p>
              </div>
              <div>
                {customDomain.verified ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-amber-500" />
                )}
              </div>
            </div>

            {!customDomain.verified && (
              <div className="space-y-4">
                <Alert>
                  <AlertTitle>Verification Required</AlertTitle>
                  <AlertDescription className="space-y-4">
                    <p>
                      To verify your domain, add the following TXT record to
                      your DNS settings:
                    </p>
                    <div className="bg-muted p-3 rounded-md flex justify-between items-center">
                      <code className="text-sm break-all">
                        lynkr-verification={customDomain.verification_code}
                      </code>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          copyToClipboard(
                            `lynkr-verification=${customDomain.verification_code}`,
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm">
                      DNS changes may take up to 24 hours to propagate. Once
                      you've added the TXT record, click the Verify button
                      below.
                    </p>
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={deleteDomain}
                    disabled={isVerifying || isDeleting}
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>Delete Domain</>
                    )}
                  </Button>
                  <Button
                    onClick={verifyDomain}
                    disabled={isVerifying || isDeleting}
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>Verify Domain</>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {customDomain.verified && (
              <div className="space-y-4">
                <Alert className="bg-green-500/10 border-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle>Domain Verified</AlertTitle>
                  <AlertDescription>
                    <p className="mb-2">
                      Your domain is verified and active. To complete setup:
                    </p>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>
                        Set up a CNAME record pointing to{" "}
                        <code className="bg-muted px-1 py-0.5 rounded">
                          lynkr.me
                        </code>
                      </li>
                      <li>
                        Your profile is now accessible at{" "}
                        <a
                          href={`https://${customDomain.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center"
                        >
                          {customDomain.domain}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </li>
                    </ol>
                  </AlertDescription>
                </Alert>

                <Button
                  variant="outline"
                  onClick={deleteDomain}
                  disabled={isDeleting}
                  className="w-full"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>Remove Custom Domain</>
                  )}
                </Button>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="domain">Domain Name</Label>
              <Input
                id="domain"
                placeholder="example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={isSubmitting}
              />
              <p className="text-sm text-muted-foreground">
                Enter a domain you own without www or http://
              </p>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Domain"
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
