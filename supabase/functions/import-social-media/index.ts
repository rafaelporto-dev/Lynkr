import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { platforms, userId } = await req.json();

    if (!platforms || !userId) {
      throw new Error("Missing required parameters");
    }

    // In a real implementation, you would use OAuth to connect to these platforms
    // and fetch the user's actual data. This is a simplified version that just
    // creates links based on the provided usernames.

    // Mock response for demonstration
    const importedLinks = Object.entries(platforms).map(
      ([platform, username]) => ({
        platform,
        username,
        imported: true,
      }),
    );

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully imported ${importedLinks.length} social media links`,
        data: importedLinks,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
