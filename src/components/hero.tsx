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
    <div className="relative overflow-hidden">
      {/* Background elements - mais sutis e escuros */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-900/20 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-900/20 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-950/10 rounded-full filter blur-3xl opacity-30"></div>
      </div>

      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <Badge
            variant="outline"
            className="mb-4 bg-background/10 backdrop-blur-sm border-purple-800/30 text-purple-300"
          >
            The future of link management
          </Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-white">
            Your All-in-One <br />
            <span className="text-purple-300">Link Hub Solution</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Create a stunning link page that showcases all your important links
            in one beautiful, customizable profile.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white border-none transition-all px-8"
            >
              <Link href="/sign-up">
                Create Your Lynkr
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-background/10 backdrop-blur-sm border-gray-700 hover:bg-background/20 text-white transition-colors px-8"
            >
              <Link href="#pricing">View Pricing</Link>
            </Button>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-purple-400" />
              <span>Custom URL: lynkr.me/username</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-purple-400" />
              <span>Advanced analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-purple-400" />
              <span>Futuristic themes</span>
            </div>
          </div>

          {/* Feature highlights */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-purple-900/30 hover:border-purple-800/40 transition-all">
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-900/40 transition-colors">
                <LinkIcon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Centralized Links
              </h3>
              <p className="text-gray-300">
                Manage all your important links in one place with our intuitive
                drag & drop interface.
              </p>
            </div>

            <div className="group bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-purple-900/30 hover:border-purple-800/40 transition-all">
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-900/40 transition-colors">
                <BarChart className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Detailed Analytics
              </h3>
              <p className="text-gray-300">
                Track clicks and interactions with comprehensive statistics for
                each of your links.
              </p>
            </div>

            <div className="group bg-black/40 backdrop-blur-sm p-6 rounded-xl border border-purple-900/30 hover:border-purple-800/40 transition-all">
              <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-purple-900/40 transition-colors">
                <Palette className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Custom Themes
              </h3>
              <p className="text-gray-300">
                Stand out with futuristic themes in stunning purple and blue
                neon designs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
