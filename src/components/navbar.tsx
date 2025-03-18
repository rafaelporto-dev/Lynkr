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
    <nav className="w-full border-b border-indigo-500/20 bg-black/40 backdrop-blur-xl py-5 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link
          href="/"
          prefetch
          className="text-2xl font-bold flex items-center gap-3 group"
        >
          <div className="relative overflow-hidden">
            <div className="w-11 h-11 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/30">
              <div className="w-full h-full flex items-center justify-center backdrop-blur-sm bg-white/5 rounded-xl">
                <LinkIcon className="w-5 h-5 text-white group-hover:text-indigo-100 transition-all" />
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl blur opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
            </div>
          </div>
          <div>
            <span className="text-white font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-100 to-white group-hover:from-indigo-200 group-hover:to-purple-100 transition-colors duration-300">
              Lynkr
            </span>
            <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-indigo-400 to-purple-400 transition-all duration-300"></div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/#features"
                  className="text-gray-300 hover:text-indigo-300 transition-colors relative group px-3 py-2"
                >
                  <span>Features</span>
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="bg-indigo-900/90 backdrop-blur-lg border-indigo-600/50">
                <p>Explore our powerful features</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/#pricing"
                  className="text-gray-300 hover:text-indigo-300 transition-colors relative group px-3 py-2"
                >
                  <span>Pricing</span>
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="bg-indigo-900/90 backdrop-blur-lg border-indigo-600/50">
                <p>View our pricing plans</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/#examples"
                  className="text-gray-300 hover:text-indigo-300 transition-colors relative group px-3 py-2"
                >
                  <span>Examples</span>
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="bg-indigo-900/90 backdrop-blur-lg border-indigo-600/50">
                <p>See Lynkr in action</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {user ? (
            <Button
              asChild
              variant="default"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-none shadow-md transition-all duration-300 hover:shadow-indigo-500/25 relative overflow-hidden group"
            >
              <Link href="/dashboard">
                <span className="relative z-10">Dashboard</span>
                <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 w-0 group-hover:w-full transition-all duration-500 ease-in-out"></span>
              </Link>
            </Button>
          ) : (
            <div className="flex gap-4 items-center">
              <Button
                asChild
                variant="ghost"
                className="text-gray-300 hover:text-indigo-300 hover:bg-indigo-900/20 relative overflow-hidden group"
              >
                <Link href="/sign-in">
                  <span className="relative z-10">Sign In</span>
                  <span className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-400 w-0 group-hover:w-full transition-all duration-300 ease-in-out"></span>
                </Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-none shadow-md transition-all duration-300 hover:shadow-indigo-500/25 relative overflow-hidden group"
              >
                <Link href="/sign-up">
                  <span className="relative z-10">Sign Up</span>
                  <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 w-0 group-hover:w-full transition-all duration-500 ease-in-out"></span>
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-indigo-900/20 transition-colors duration-300 relative group"
              >
                <span className="absolute -inset-1 bg-indigo-500/20 blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-gradient-to-b from-indigo-950/95 to-gray-950/95 backdrop-blur-xl border-l border-indigo-600/30">
              <SheetHeader>
                <SheetTitle className="text-white bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-purple-200 font-extrabold text-2xl">
                  Lynkr Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-10">
                <SheetClose asChild>
                  <Link
                    href="/#features"
                    className="text-gray-300 hover:text-indigo-300 transition-colors text-lg flex items-center gap-3 group px-2 py-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>Features</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/#pricing"
                    className="text-gray-300 hover:text-indigo-300 transition-colors text-lg flex items-center gap-3 group px-2 py-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>Pricing</span>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link
                    href="/#examples"
                    className="text-gray-300 hover:text-indigo-300 transition-colors text-lg flex items-center gap-3 group px-2 py-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span>Examples</span>
                  </Link>
                </SheetClose>

                <div className="h-px bg-gradient-to-r from-transparent via-indigo-600/40 to-transparent my-4"></div>

                {user ? (
                  <SheetClose asChild>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-none w-full shadow-md transition-all duration-300 relative overflow-hidden group py-6"
                    >
                      <Link href="/dashboard">
                        <span className="relative z-10 font-medium">
                          Dashboard
                        </span>
                        <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 w-0 group-hover:w-full transition-all duration-500 ease-in-out"></span>
                      </Link>
                    </Button>
                  </SheetClose>
                ) : (
                  <div className="flex flex-col gap-3">
                    <SheetClose asChild>
                      <Button
                        asChild
                        variant="outline"
                        className="text-gray-300 w-full border-indigo-600/50 hover:bg-indigo-900/20 hover:text-indigo-300 transition-all duration-300 py-6"
                      >
                        <Link href="/sign-in">
                          <span className="font-medium">Sign In</span>
                        </Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button
                        asChild
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white border-none w-full shadow-md transition-all duration-300 relative overflow-hidden group py-6"
                      >
                        <Link href="/sign-up">
                          <span className="relative z-10 font-medium">
                            Sign Up
                          </span>
                          <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 w-0 group-hover:w-full transition-all duration-500 ease-in-out"></span>
                        </Link>
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
