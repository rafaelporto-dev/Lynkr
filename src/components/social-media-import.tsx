"use client";

import { useState } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Import,
  Twitter,
  Instagram,
  Youtube,
  Twitch,
  Github,
  Linkedin,
  Facebook,
  Check,
  AlertCircle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type SocialPlatform = {
  id: string;
  name: string;
  icon: React.ReactNode;
  placeholder: string;
  baseUrl: string;
  validateUsername: (username: string) => boolean;
};

const socialPlatforms: SocialPlatform[] = [
  {
    id: "twitter",
    name: "Twitter",
    icon: <Twitter className="h-5 w-5" />,
    placeholder: "username",
    baseUrl: "https://twitter.com/",
    validateUsername: (username) => /^[A-Za-z0-9_]{1,15}$/.test(username),
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: <Instagram className="h-5 w-5" />,
    placeholder: "username",
    baseUrl: "https://instagram.com/",
    validateUsername: (username) => /^[A-Za-z0-9._]{1,30}$/.test(username),
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: <Youtube className="h-5 w-5" />,
    placeholder: "channel or @handle",
    baseUrl: "https://youtube.com/",
    validateUsername: (username) =>
      /^(@[A-Za-z0-9_-]{3,30}|[A-Za-z0-9_-]{3,30})$/.test(username),
  },
  {
    id: "twitch",
    name: "Twitch",
    icon: <Twitch className="h-5 w-5" />,
    placeholder: "username",
    baseUrl: "https://twitch.tv/",
    validateUsername: (username) => /^[A-Za-z0-9_]{4,25}$/.test(username),
  },
  {
    id: "github",
    name: "GitHub",
    icon: <Github className="h-5 w-5" />,
    placeholder: "username",
    baseUrl: "https://github.com/",
    validateUsername: (username) => /^[A-Za-z0-9-]{1,39}$/.test(username),
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: <Linkedin className="h-5 w-5" />,
    placeholder: "username or custom URL",
    baseUrl: "https://linkedin.com/in/",
    validateUsername: (username) => /^[A-Za-z0-9-]{3,100}$/.test(username),
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: <Facebook className="h-5 w-5" />,
    placeholder: "username or page name",
    baseUrl: "https://facebook.com/",
    validateUsername: (username) => /^[A-Za-z0-9.]{5,50}$/.test(username),
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: <div className="h-5 w-5 flex items-center justify-center">TT</div>,
    placeholder: "@username",
    baseUrl: "https://tiktok.com/@",
    validateUsername: (username) => {
      // Remove @ if present
      const clean = username.startsWith("@") ? username.substring(1) : username;
      return /^[A-Za-z0-9_.]{2,24}$/.test(clean);
    },
  },
];

export default function SocialMediaImport() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<
    Record<string, string>
  >({});
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();

  const handlePlatformChange = (platformId: string, username: string) => {
    if (!username) {
      // Remove platform if username is empty
      const newSelected = { ...selectedPlatforms };
      delete newSelected[platformId];
      setSelectedPlatforms(newSelected);
    } else {
      setSelectedPlatforms({
        ...selectedPlatforms,
        [platformId]: username,
      });
    }
  };

  const handleImport = async () => {
    if (Object.keys(selectedPlatforms).length === 0) {
      setError("Please select at least one social media platform");
      return;
    }

    setIsImporting(true);
    setError("");
    setSuccess(false);

    try {
      // Get user data
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be logged in to import social media links");
      }

      // Get the highest display order for this user
      const { data: links } = await supabase
        .from("links")
        .select("display_order")
        .eq("user_id", user.id)
        .order("display_order", { ascending: false })
        .limit(1);

      let nextOrder =
        links && links.length > 0 ? links[0].display_order + 1 : 0;

      // Create links for each selected platform
      const linksToCreate = Object.entries(selectedPlatforms)
        .map(([platformId, username]) => {
          const platform = socialPlatforms.find((p) => p.id === platformId);
          if (!platform) return null;

          // Format username correctly
          let formattedUsername = username;
          if (platformId === "tiktok" && !username.startsWith("@")) {
            formattedUsername = username; // The baseUrl already includes @
          } else if (platformId === "youtube" && username.startsWith("@")) {
            formattedUsername = username; // Keep the @ for YouTube handles
          }

          return {
            user_id: user.id,
            title: platform.name,
            url: platform.baseUrl + formattedUsername,
            display_order: nextOrder++,
            active: true,
            click_count: 0,
          };
        })
        .filter(Boolean);

      if (linksToCreate.length === 0) {
        throw new Error("No valid social media links to import");
      }

      // Insert the new links
      const { error: insertError } = await supabase
        .from("links")
        .insert(linksToCreate);

      if (insertError) throw insertError;

      setSuccess(true);
      toast({
        title: "Social media links imported",
        description: `Successfully imported ${linksToCreate.length} links.`,
      });

      // Close dialog after a short delay
      setTimeout(() => {
        setIsOpen(false);
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Failed to import social media links");
      toast({
        title: "Error",
        description: "Failed to import social media links. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Import className="h-4 w-4" />
          Import from Social Media
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Import Social Media Links</DialogTitle>
          <DialogDescription>
            Enter your usernames to quickly import links from your social media
            accounts.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-500/10 border-green-500/20">
            <Check className="h-4 w-4 text-green-500" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              Your social media links have been imported successfully.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          {socialPlatforms.map((platform) => (
            <div
              key={platform.id}
              className="grid grid-cols-4 items-center gap-4"
            >
              <Label
                htmlFor={platform.id}
                className="text-right flex items-center justify-end gap-2"
              >
                {platform.icon}
                {platform.name}
              </Label>
              <Input
                id={platform.id}
                placeholder={platform.placeholder}
                className="col-span-3"
                onChange={(e) =>
                  handlePlatformChange(platform.id, e.target.value)
                }
                disabled={isImporting}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isImporting}
          >
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={isImporting}>
            {isImporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing...
              </>
            ) : (
              <>Import Links</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
