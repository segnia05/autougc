import { NextResponse } from "next/server";
import { TEMPLATES_CATALOG } from "@/lib/seo/templatesData";

export async function GET() {
  const baseUrl = "https://autougc.ai";
  const currentDate = new Date().toISOString().split("T")[0];

  const tools = [
    "tiktok-hook-generator",
    "instagram-reels-script-generator",
    "ugc-video-cost-calculator",
  ];

  const staticUrls = [
    { loc: `${baseUrl}/`, priority: "1.0", changefreq: "daily" },
    { loc: `${baseUrl}/studio`, priority: "0.9", changefreq: "weekly" },
  ];

  const templateUrls = Object.keys(TEMPLATES_CATALOG).map((slug) => ({
    loc: `${baseUrl}/templates/${slug}`,
    priority: "0.8",
    changefreq: "weekly",
  }));

  const toolUrls = tools.map((slug) => ({
    loc: `${baseUrl}/tools/${slug}`,
    priority: "0.8",
    changefreq: "weekly",
  }));

  const allUrls = [...staticUrls, ...templateUrls, ...toolUrls];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (item) => `  <url>
    <loc>${item.loc}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(sitemapXml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
