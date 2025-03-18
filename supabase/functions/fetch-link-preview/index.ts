import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      throw new Error("URL is required");
    }

    // Fetch the HTML content of the URL
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; LynkrBot/1.0; +https://lynkr.me)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }

    const html = await response.text();

    // Extract Open Graph and meta tags
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // Try to get Open Graph image
    let thumbnailUrl =
      doc.querySelector('meta[property="og:image"]')?.getAttribute("content") ||
      doc.querySelector('meta[name="twitter:image"]')?.getAttribute("content");

    // If no OG image, try to find the first large image on the page
    if (!thumbnailUrl) {
      const images = Array.from(doc.querySelectorAll("img"))
        .filter((img) => {
          const src = img.getAttribute("src");
          return src && !src.includes("logo") && !src.includes("icon");
        })
        .map((img) => img.getAttribute("src"))
        .filter(Boolean);

      if (images.length > 0) {
        thumbnailUrl = images[0];

        // Convert relative URLs to absolute
        if (thumbnailUrl && !thumbnailUrl.startsWith("http")) {
          const baseUrl = new URL(url);
          thumbnailUrl = thumbnailUrl.startsWith("/")
            ? `${baseUrl.origin}${thumbnailUrl}`
            : `${baseUrl.origin}/${thumbnailUrl}`;
        }
      }
    }

    // Get title and description
    const title =
      doc.querySelector('meta[property="og:title"]')?.getAttribute("content") ||
      doc
        .querySelector('meta[name="twitter:title"]')
        ?.getAttribute("content") ||
      doc.querySelector("title")?.textContent ||
      "";

    const description =
      doc
        .querySelector('meta[property="og:description"]')
        ?.getAttribute("content") ||
      doc
        .querySelector('meta[name="twitter:description"]')
        ?.getAttribute("content") ||
      doc.querySelector('meta[name="description"]')?.getAttribute("content") ||
      "";

    return new Response(
      JSON.stringify({
        thumbnailUrl,
        title,
        description,
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
