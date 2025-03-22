"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  UserCircle,
  BarChart2,
  Globe,
  LogOut,
  Trash2,
  Home,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { deleteAccountAction } from "@/app/actions";
import { cn } from "@/lib/utils";

export default function DashboardNavbar() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [userData, setUserData] = useState<{
    name?: string;
    email?: string;
    username?: string;
  }>({});

  useEffect(() => {
    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserData({
          email: user.email,
          name:
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User",
          username: user.user_metadata?.username || "",
        });
      }
    };

    getUserData();
  }, [supabase.auth]);

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    const result = await deleteAccountAction();
    if (result) {
      router.push(result);
    }
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Lynkr
              </span>
            </Link>

            {/* Navigation - apenas páginas existentes */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/dashboard"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive("/dashboard")
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/analytics"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive("/dashboard/analytics")
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <BarChart2 className="h-4 w-4" />
                Analytics
              </Link>
              <Link
                href="/dashboard/domains"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive("/dashboard/domains")
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Globe className="h-4 w-4" />
                Domains
              </Link>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-8 w-8 rounded-full"
                >
                  <UserCircle className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {userData.name}
                    </p>
                    {userData.username && (
                      <p className="text-xs leading-none text-muted-foreground">
                        @{userData.username}
                      </p>
                    )}
                    <p className="text-xs leading-none text-muted-foreground">
                      {userData.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-2"
                  >
                    <UserCircle className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/");
                  }}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDeleteAccount}
                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
