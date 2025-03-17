import { ArrowUpRight, InfoIcon } from "lucide-react";
import Link from "next/link";

export function SmtpMessage() {
  return (
    <div className="rounded-lg bg-gray-900 border border-gray-800 p-4 text-sm">
      <div className="flex items-start gap-3">
        <InfoIcon size={18} className="text-indigo-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-gray-300">
            <strong>Note:</strong> Emails are rate limited. Enable Custom SMTP to
            increase the rate limit.
          </p>
          <Link
            href="https://supabase.com/docs/guides/auth/auth-smtp"
            target="_blank"
            className="mt-1 inline-flex items-center text-indigo-400 hover:text-indigo-300 text-sm"
          >
            Learn more <ArrowUpRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
