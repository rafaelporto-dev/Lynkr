import { resetPasswordAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function ResetPassword(props: {
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
            <h1 className="text-2xl font-bold tracking-tight text-white">Reset your password</h1>
            <p className="mt-2 text-sm text-gray-400">
              Please enter your new password below
            </p>
          </div>
          
          <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
            <form className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-3xl font-semibold tracking-tight text-white">Reset password</h1>
                <p className="text-sm text-gray-300">
                  Please enter your new password below.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    New password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="New password"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm password"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <SubmitButton
                formAction={resetPasswordAction}
                pendingText="Updating password..."
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-md"
              >
                Update password
              </SubmitButton>

              <FormMessage message={searchParams} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
