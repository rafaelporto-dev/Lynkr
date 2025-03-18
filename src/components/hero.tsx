import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Link as LinkIcon,
  BarChart,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Hero() {
  return (
    <div className="relative overflow-hidden pt-12 md:pt-16 pb-24 md:pb-32">
      {/* Background elements - usando o mesmo estilo das páginas de autenticação */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black -z-10"></div>
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none"></div>
      <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-900/40 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-indigo-900/40 rounded-full filter blur-3xl opacity-20"></div>

      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-4xl mx-auto">
          <Badge
            variant="outline"
            className="mb-6 bg-white/[0.04] backdrop-blur-lg border-white/10 text-indigo-300 px-4 py-1.5"
          >
            The future of link management
          </Badge>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-8">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">
              Your All-in-One
            </span>{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
              Link Hub Solution
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Create a stunning link page that showcases all your important links
            in one beautiful, customizable profile.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white py-6 px-8 rounded-md font-medium transition-all duration-300 shadow-lg shadow-indigo-600/30 group"
            >
              <Link href="/sign-up">
                <span className="relative z-10 flex items-center justify-center">
                  Create Your Lynkr
                  <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 w-0 group-hover:w-full transition-all duration-500 ease-in-out"></span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto bg-white/[0.04] backdrop-blur-lg border-white/10 hover:bg-white/[0.08] hover:text-indigo-400 text-white py-6 px-8 rounded-md font-medium transition-all duration-300"
            >
              <Link href="#pricing">View Pricing</Link>
            </Button>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-900/50">
                <Check className="w-3 h-3 text-indigo-400" />
              </div>
              <span>Custom URL: lynkr.me/username</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-900/50">
                <Check className="w-3 h-3 text-indigo-400" />
              </div>
              <span>Advanced analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-900/50">
                <Check className="w-3 h-3 text-indigo-400" />
              </div>
              <span>Futuristic themes</span>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group backdrop-blur-lg bg-white/[0.04] border border-white/10 p-8 rounded-xl hover:shadow-xl hover:shadow-indigo-900/10 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:bg-indigo-800/40 transition-colors">
                <LinkIcon className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Centralized Links
              </h3>
              <p className="text-gray-300">
                Manage all your important links in one place with our intuitive
                drag & drop interface.
              </p>
            </div>

            <div className="group backdrop-blur-lg bg-white/[0.04] border border-white/10 p-8 rounded-xl hover:shadow-xl hover:shadow-indigo-900/10 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:bg-indigo-800/40 transition-colors">
                <BarChart className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Detailed Analytics
              </h3>
              <p className="text-gray-300">
                Track clicks and interactions with comprehensive statistics for
                each of your links.
              </p>
            </div>

            <div className="group backdrop-blur-lg bg-white/[0.04] border border-white/10 p-8 rounded-xl hover:shadow-xl hover:shadow-indigo-900/10 transition-all duration-300">
              <div className="w-14 h-14 bg-indigo-900/30 rounded-lg flex items-center justify-center mb-6 mx-auto group-hover:bg-indigo-800/40 transition-colors">
                <Palette className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Custom Themes
              </h3>
              <p className="text-gray-300">
                Stand out with futuristic themes in stunning designs with modern
                effects and animations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
