import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { User, UserCircle, Link as LinkIcon, Menu, X } from "lucide-react";
import UserProfile from "./user-profile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-purple-900/30 bg-black/90 backdrop-blur-sm py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          prefetch
          className="text-2xl font-bold flex items-center gap-3"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-purple-800 rounded-lg flex items-center justify-center shadow-lg">
              <LinkIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <span className="text-white">Lynkr</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/#features"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Features
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Explore our powerful features</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/#pricing"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Pricing
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>View our pricing plans</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/#examples"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Examples
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>See Lynkr in action</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {user ? (
            <Button
              asChild
              variant="default"
              className="bg-purple-600 hover:bg-purple-700 text-white border-none"
            >
              <Link href="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <div className="flex gap-4 items-center">
              <Button
                asChild
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button
                asChild
                className="bg-purple-600 hover:bg-purple-700 text-white border-none"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-black/95 backdrop-blur-sm border-l border-purple-900/30">
              <SheetHeader>
                <SheetTitle className="text-white">Lynkr Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                <SheetClose asChild>
                  <Link
                    href="/#features"
                    className="text-gray-300 hover:text-white transition-colors text-lg"
                  >
                    Features
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/#pricing"
                    className="text-gray-300 hover:text-white transition-colors text-lg"
                  >
                    Pricing
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/#examples"
                    className="text-gray-300 hover:text-white transition-colors text-lg"
                  >
                    Examples
                  </Link>
                </SheetClose>

                <div className="h-px bg-gradient-to-r from-transparent via-purple-900/30 to-transparent my-2"></div>

                {user ? (
                  <SheetClose asChild>
                    <Button
                      asChild
                      className="bg-purple-600 hover:bg-purple-700 text-white border-none w-full"
                    >
                      <Link href="/dashboard">Dashboard</Link>
                    </Button>
                  </SheetClose>
                ) : (
                  <div className="flex flex-col gap-3">
                    <SheetClose asChild>
                      <Button
                        asChild
                        variant="outline"
                        className="text-gray-300 w-full border-purple-900/50"
                      >
                        <Link href="/sign-in">Sign In</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        asChild
                        className="bg-purple-600 hover:bg-purple-700 text-white border-none w-full"
                      >
                        <Link href="/sign-up">Sign Up</Link>
                      </Button>
                    </SheetClose>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
