import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/admin/", "/private/"],
    },
    sitemap: "https://lynkr.me/sitemap.xml",
  };
}
