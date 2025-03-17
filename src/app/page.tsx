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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans"
  );

  return (
    <div className="min-h-screen bg-[#1A0933] relative">
      {/* Background blobs - mais sutis */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-900/10 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-900/10 rounded-full filter blur-3xl opacity-20 -z-10"></div>

      <Navbar />
      <Hero />

      {/* How It Works Section */}
      <section className="py-24" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 bg-black/30 backdrop-blur-sm border-purple-800/30 text-purple-300"
            >
              Simple Process
            </Badge>
            <h2 className="text-3xl font-bold mb-4 text-white">
              How Lynkr Works
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Create your personalized link hub in minutes with our intuitive
              platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center group">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-purple-900/20 rounded-full group-hover:bg-purple-900/30 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform">
                    1
                  </span>
                </div>
                <div className="absolute inset-0 border border-purple-900/30 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Sign Up</h3>
              <p className="text-gray-300">
                Create your account in seconds with email or social login
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-purple-900/20 rounded-full group-hover:bg-purple-900/30 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform">
                    2
                  </span>
                </div>
                <div className="absolute inset-0 border border-purple-900/30 rounded-full animate-pulse"></div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">
                Add Your Links
              </h3>
              <p className="text-gray-300">
                Easily add and organize all your important links with drag &
                drop
              </p>
            </div>

            <div className="flex flex-col items-center text-center group">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 bg-purple-900/20 rounded-full group-hover:bg-purple-900/30 transition-colors"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-purple-400 group-hover:scale-110 transition-transform">
                    3
                  </span>
                </div>
                <div className="absolute inset-0 border border-purple-900/30 rounded-full animate-pulse"></div>
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
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 bg-black/30 backdrop-blur-sm border-purple-800/30 text-purple-300"
            >
              What We Offer
            </Badge>
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
              <Card
                key={index}
                className="group bg-black/40 backdrop-blur-sm border-purple-900/30 hover:border-purple-800/40 transition-all"
              >
                <CardHeader>
                  <div className="text-purple-400 mb-2 transition-transform group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo/Preview Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <Badge
                variant="outline"
                className="mb-4 bg-black/30 backdrop-blur-sm border-purple-800/30 text-purple-300"
              >
                Showcase
              </Badge>
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
                    <CheckCircle2 className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-purple-600 hover:bg-purple-700 text-white border-none"
                >
                  <a href="/sign-up">
                    Create Your Lynkr
                    <ArrowUpRight className="ml-2 w-4 h-4" />
                  </a>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative mx-auto w-[280px] h-[580px] bg-black/60 backdrop-blur-sm rounded-[40px] p-4 border border-purple-900/30 shadow-xl">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-black/40 backdrop-blur-sm rounded-b-xl"></div>
                <div className="w-full h-full bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 backdrop-blur-sm rounded-[28px] p-6 overflow-hidden border border-purple-800/30">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-purple-800 mb-4 ring-2 ring-purple-700/20"></div>
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
                        className="w-full p-3 mb-3 bg-black/40 backdrop-blur-sm rounded-lg text-center text-white hover:bg-black/60 transition-all cursor-pointer border border-purple-800/20"
                      >
                        {link}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-900/10 rounded-full blur-3xl"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-purple-900/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm -z-10"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-900/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 relative">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card className="bg-black/40 backdrop-blur-sm border-purple-900/30 hover:bg-black/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-4xl font-bold mb-2 text-white">
                  10K+
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-300">Active Users</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 backdrop-blur-sm border-purple-900/30 hover:bg-black/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-4xl font-bold mb-2 text-white">
                  1M+
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-300">Profile Views</p>
              </CardContent>
            </Card>
            <Card className="bg-black/40 backdrop-blur-sm border-purple-900/30 hover:bg-black/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-4xl font-bold mb-2 text-white">
                  5M+
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-300">Link Clicks</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge
              variant="outline"
              className="mb-4 bg-black/30 backdrop-blur-sm border-purple-800/30 text-purple-300"
            >
              Pricing
            </Badge>
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
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm -z-10"></div>
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-purple-900/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto backdrop-blur-sm p-8 rounded-2xl bg-black/40 border border-purple-900/30">
            <Badge
              variant="outline"
              className="mb-4 bg-black/30 backdrop-blur-sm border-purple-800/30 text-purple-300"
            >
              Get Started
            </Badge>
            <h2 className="text-3xl font-bold mb-4 text-white">
              Ready to Create Your Link Hub?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who've already centralized their online
              presence with Lynkr.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white border-none px-8"
            >
              <a href="/sign-up">
                Get Started Now
                <ArrowUpRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
