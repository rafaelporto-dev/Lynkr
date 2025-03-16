import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  CheckCircle2,
  Zap,
  Shield,
  Users,
  Smartphone,
  Palette,
  BarChart3,
  Link as LinkIcon,
  MousePointerClick,
} from "lucide-react";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-black">
      <Navbar />
      <Hero />

      {/* How It Works Section */}
      <section className="py-24 bg-black/80">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">
              How Lynkr Works
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Create your personalized link hub in minutes with our intuitive
              platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mb-6 border border-purple-500/30">
                <span className="text-2xl font-bold text-purple-400">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Sign Up</h3>
              <p className="text-gray-300">
                Create your account in seconds with email or social login
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 border border-blue-500/30">
                <span className="text-2xl font-bold text-blue-400">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Add Your Links
              </h3>
              <p className="text-gray-300">
                Easily add and organize all your important links with drag &
                drop
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-600/20 rounded-full flex items-center justify-center mb-6 border border-indigo-500/30">
                <span className="text-2xl font-bold text-indigo-400">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Share Your Profile
              </h3>
              <p className="text-gray-300">
                Get your custom URL and share it anywhere online
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-black/90 to-indigo-950/90">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Powerful Features
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Everything you need to create the perfect link hub experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <LinkIcon className="w-6 h-6" />,
                title: "Unlimited Links",
                description: "Add as many links as you need to your profile",
              },
              {
                icon: <Palette className="w-6 h-6" />,
                title: "Custom Themes",
                description: "Choose from stunning futuristic designs",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Detailed Analytics",
                description: "Track clicks and visitor engagement",
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: "Mobile Optimized",
                description: "Perfect experience on any device",
              },
              {
                icon: <MousePointerClick className="w-6 h-6" />,
                title: "Drag & Drop Editor",
                description: "Intuitive interface for easy customization",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Secure Platform",
                description: "Your data is always protected",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Lightning Fast",
                description: "Optimized for speed and performance",
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Social Integration",
                description: "Connect all your social profiles",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-purple-900/30 hover:border-purple-700/50 transition-all"
              >
                <div className="text-purple-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo/Preview Section */}
      <section className="py-24 bg-black/80">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-white">
                Your Personal Link Hub
              </h2>
              <p className="text-gray-300 mb-8">
                Create a stunning profile that showcases all your content in one
                place. Customize colors, add your bio, and organize your links
                exactly how you want.
              </p>
              <ul className="space-y-4">
                {[
                  "Custom URL: lynkr.me/username",
                  "Personalized bio and profile picture",
                  "Futuristic themes and animations",
                  "Real-time analytics dashboard",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <a
                  href="/sign-up"
                  className="inline-flex items-center px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg shadow-purple-500/20"
                >
                  Create Your Lynkr
                  <ArrowUpRight className="ml-2 w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative mx-auto w-[280px] h-[580px] bg-gray-900 rounded-[40px] p-4 border-4 border-gray-800 shadow-xl shadow-purple-500/10">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-800 rounded-b-xl"></div>
                <div className="w-full h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 rounded-[28px] p-6 overflow-hidden">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mb-4"></div>
                    <h3 className="text-white font-bold text-xl mb-1">
                      @username
                    </h3>
                    <p className="text-gray-300 text-sm mb-6 text-center">
                      Digital creator & content specialist
                    </p>

                    {/* Sample links */}
                    {[
                      "Portfolio",
                      "Instagram",
                      "YouTube Channel",
                      "Latest Project",
                    ].map((link, index) => (
                      <div
                        key={index}
                        className="w-full p-3 mb-3 bg-white/10 backdrop-blur-sm rounded-lg text-center text-white hover:bg-white/20 transition-all cursor-pointer"
                      >
                        {link}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-purple-200">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-purple-200">Profile Views</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5M+</div>
              <div className="text-purple-200">Link Clicks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-black/80" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Choose the perfect plan for your needs. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Add free plan */}
            <PricingCard
              key="free-plan"
              item={{
                id: "free-plan",
                name: "Free",
                isFree: true,
                amount: 0,
                interval: "forever",
              }}
              user={user}
            />
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-indigo-950/90 to-black/90">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-white">
            Ready to Create Your Link Hub?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who've already centralized their online
            presence with Lynkr.
          </p>
          <a
            href="/sign-up"
            className="inline-flex items-center px-8 py-4 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all text-lg font-medium shadow-lg shadow-purple-500/20"
          >
            Get Started Now
            <ArrowUpRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
