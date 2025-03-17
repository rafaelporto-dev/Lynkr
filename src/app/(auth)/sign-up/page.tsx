import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { signUpAction } from "@/app/actions";
import Navbar from "@/components/navbar";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={searchParams} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-black">
      <Navbar />
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight text-white">Create your account</h1>
            <p className="mt-2 text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/sign-in" className="font-medium text-indigo-400 hover:text-indigo-300">
                Sign in
              </Link>
            </p>
          </div>
          
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
            <form className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-white">Sign up</h1>
                <p className="text-sm text-gray-300">
                  Already have an account?{" "}
                  <Link
                    className="text-purple-400 font-medium hover:underline transition-all"
                    href="/sign-in"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="full_name" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="John Doe"
                    required
                    className="w-full"
                  />
                </div>

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
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Your password"
                    minLength={6}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <SubmitButton
                formAction={signUpAction}
                pendingText="Signing up..."
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md"
              >
                Sign up
              </SubmitButton>

              <FormMessage message={searchParams} />
            </form>
          </div>
          
          <SmtpMessage />
        </div>
      </div>
    </div>
  );
}
