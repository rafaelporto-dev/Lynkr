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
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">Sign in to your account</h1>
            <p className="mt-2 text-sm text-gray-400">
              Don't have an account?{" "}
              <Link href="/sign-up" className="font-medium text-indigo-400 hover:text-indigo-300">
                Sign up
              </Link>
            </p>
          </div>
          
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
            <form className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-white">Sign in</h1>
                <p className="text-sm text-gray-300">
                  Don't have an account?{" "}
                  <Link
                    className="text-purple-400 font-medium hover:underline transition-all"
                    href="/sign-up"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Link
                      className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-all"
                      href="/forgot-password"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Your password"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <SubmitButton
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md"
                pendingText="Signing in..."
                formAction={signInAction}
              >
                Sign in
              </SubmitButton>

              <div className="text-center">
                <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-gray-300">
                  Forgot your password?
                </Link>
              </div>

              <FormMessage message={message} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
