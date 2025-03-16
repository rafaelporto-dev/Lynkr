import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { User, UserCircle, Link as LinkIcon } from "lucide-react";
import UserProfile from "./user-profile";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-purple-900/30 bg-black/80 backdrop-blur-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          prefetch
          className="text-2xl font-bold text-white flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
            <LinkIcon className="w-4 h-4 text-white" />
          </div>
          <span>Lynkr</span>
        </Link>

        <div className="hidden md:flex gap-8 items-center">
          <Link
            href="/#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/#"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Examples
          </Link>
        </div>

        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/dashboard" className="px-4 py-2 text-sm font-medium">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  Dashboard
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-md hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
