import { ArrowUpRight, InfoIcon } from "lucide-react";
import Link from "next/link";

export function SmtpMessage() {
  return (
    <div className="backdrop-blur-lg bg-white/[0.04] border border-white/10 rounded-lg p-4 text-sm shadow-lg hover:shadow-indigo-800/20 transition-all duration-300">
      <div className="flex items-start gap-3">
        <InfoIcon size={18} className="text-indigo-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-gray-300">
            <strong>Note:</strong> Emails are rate limited. Enable Custom SMTP
            to increase the rate limit.
          </p>
          <Link
            href="https://supabase.com/docs/guides/auth/auth-smtp"
            target="_blank"
            className="mt-1 inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-300 text-sm group"
          >
            Learn more{" "}
            <ArrowUpRight
              size={14}
              className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
