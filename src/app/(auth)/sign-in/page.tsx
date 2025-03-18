import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

interface LoginProps {
  searchParams: Promise<Message>;
}

export default async function SignInPage({ searchParams }: LoginProps) {
  const message = await searchParams;

  if ("message" in message) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-gray-900 to-black">
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] pointer-events-none"></div>
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 to-white">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-gray-300">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-300"
              >
                Sign up
              </Link>
            </p>
          </div>

          <div className="backdrop-blur-lg bg-white/[0.04] border border-white/10 rounded-xl p-8 shadow-2xl shadow-indigo-900/20 hover:shadow-indigo-800/30 transition-all duration-300">
            <form className="space-y-6">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-200"
                  >
                    Email
                  </Label>
                  <div className="relative group">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 bg-gray-900/70 border-white/10 focus:border-indigo-500 focus:ring-indigo-500/30 transition-all duration-300 text-gray-200"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path d="M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z" />
                        <path d="M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 rounded-md border border-indigo-500/0 group-focus-within:border-indigo-500/50 pointer-events-none transition-all duration-300"></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-200"
                    >
                      Password
                    </Label>
                    <Link
                      className="text-xs text-gray-400 hover:text-indigo-400 transition-colors duration-300"
                      href="/forgot-password"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      placeholder="Your password"
                      required
                      className="w-full pl-10 bg-gray-900/70 border-white/10 focus:border-indigo-500 focus:ring-indigo-500/30 transition-all duration-300 text-gray-200"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors duration-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="absolute inset-0 rounded-md border border-indigo-500/0 group-focus-within:border-indigo-500/50 pointer-events-none transition-all duration-300"></div>
                  </div>
                </div>
              </div>

              <SubmitButton
                className="w-full relative overflow-hidden bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-md font-medium transition-all duration-300 shadow-lg shadow-indigo-600/30 group"
                pendingText="Signing in..."
                formAction={signInAction}
              >
                <span className="relative z-10">Sign in</span>
                <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <span className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-indigo-400 to-purple-400 w-0 group-hover:w-full transition-all duration-500 ease-in-out"></span>
              </SubmitButton>

              <FormMessage message={message} />
            </form>
          </div>

          <div className="text-center text-sm text-gray-400 mt-6">
            <p>
              By signing in, you agree to our{" "}
              <Link
                href="#"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="#"
                className="text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
