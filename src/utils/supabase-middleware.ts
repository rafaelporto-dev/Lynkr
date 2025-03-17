import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export function createClient(request: NextRequest) {
  // Create a cookies container
  const cookieStore = {
    get: (name: string) => {
      return request.cookies.get(name)?.value;
    },
    set: (name: string, value: string, options: any) => {
      // This is a read-only context, we don't need to set cookies here
    },
    remove: (name: string, options: any) => {
      // This is a read-only context, we don't need to remove cookies here
    },
  };

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: cookieStore.get,
        set: cookieStore.set,
        remove: cookieStore.remove,
      },
    },
  );
}
