"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../../supabase/client";
import LinksList from "@/components/links-list";
import LinkForm from "@/components/link-form";
import { Button } from "@/components/ui/button";
import { Copy, Check, PlusCircle, FileEdit, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function DashboardPage() {
  const [username, setUsername] = useState("");
  const [profileUrl, setProfileUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();

        if (profile && profile.username) {
          setUsername(profile.username);
          setProfileUrl(`${window.location.origin}/${profile.username}`);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);

      toast({
        title: "Link copied!",
        description: "Your link has been copied to the clipboard.",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error copying link",
        description: "Unable to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVisitProfile = () => {
    window.open(profileUrl, "_blank");
  };

  return (
    <main className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
      {/* Coluna Esquerda - Preview e Informações */}
      <div className="md:w-1/3 space-y-6">
        {/* Painel de Perfil */}
        <div className="rounded-xl bg-card shadow-lg border p-6 space-y-4">
          <div className="h-[150px] w-full overflow-hidden rounded-lg bg-gradient-to-b from-indigo-900 via-gray-900 to-black flex items-center justify-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
              {username ? username.charAt(0).toUpperCase() : "L"}
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold">@{username || "user"}</h2>
            <div className="flex items-center justify-center">
              <div className="text-sm rounded-full bg-muted/30 px-3 py-1 flex items-center gap-2 max-w-[260px]">
                <span className="truncate">
                  {profileUrl || "lynkr.me/your-username"}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 rounded-full hover:bg-primary/10 hover:text-primary"
                  onClick={handleCopyUrl}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleVisitProfile}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Visit my profile
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push("/dashboard/personalization")}
            >
              <FileEdit className="mr-2 h-4 w-4" />
              Personalize theme
            </Button>
          </div>
        </div>

        {/* Formulário para adicionar link */}
        {isAddingLink ? (
          <div className="rounded-xl bg-card shadow-lg border">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-medium">Add new link</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingLink(false)}
              >
                Cancel
              </Button>
            </div>
            <div className="p-4">
              <LinkForm />
            </div>
          </div>
        ) : (
          <Button className="w-full py-6" onClick={() => setIsAddingLink(true)}>
            <PlusCircle className="mr-2 h-5 w-5" />
            Add new link
          </Button>
        )}
      </div>

      {/* Coluna Direita - Lista de Links */}
      <div className="md:w-2/3 rounded-xl bg-card shadow-lg border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Your links</h2>
          <p className="text-sm text-muted-foreground">
            Drag to reorder. Click the switch to activate/deactivate.
          </p>
        </div>
        <div className="p-4">
          <LinksList />
        </div>
      </div>
    </main>
  );
}
