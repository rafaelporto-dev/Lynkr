import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Link as LinkIcon,
  BarChart,
  Palette,
} from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-white">
      {/* Background gradient - futuristic purple and blue neon theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 opacity-90" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-8 tracking-tight">
              One Link for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                All Your Content
              </span>
            </h1>

            <p className="text-xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
              Centralize all your important links in one customizable profile.
              Share your social media, portfolio, store, and more with a single
              personalized URL.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-lg font-medium shadow-lg shadow-purple-500/20"
              >
                Create Your Lynkr
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </Link>

              <Link
                href="#pricing"
                className="inline-flex items-center px-8 py-4 text-white bg-gray-800/50 backdrop-blur-sm rounded-lg hover:bg-gray-700/50 transition-colors text-lg font-medium border border-gray-700"
              >
                View Pricing
              </Link>
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
              <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-800/30">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <LinkIcon className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Centralized Links
                </h3>
                <p className="text-gray-300">
                  Manage all your important links in one place with our
                  intuitive drag & drop interface.
                </p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-800/30">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <BarChart className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Detailed Analytics
                </h3>
                <p className="text-gray-300">
                  Track clicks and interactions with comprehensive statistics
                  for each of your links.
                </p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-800/30">
                <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Palette className="w-6 h-6 text-indigo-400" />
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
    </div>
  );
}
