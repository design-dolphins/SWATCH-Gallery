import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");
  if (!url) return NextResponse.json({ error: "No URL" }, { status: 400 });

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SWATCHBot/1.0)" },
      signal: AbortSignal.timeout(8000),
    });
    const html = await res.text();

    const ogSiteName = html.match(
      /<meta[^>]*property=["']og:site_name["'][^>]*content=["']([^"']+)["']/i
    )?.[1];
    const ogTitle = html.match(
      /<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']+)["']/i
    )?.[1];
    const title = html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim();

    const siteName = ogSiteName || ogTitle || title || "";

    return NextResponse.json({ siteName });
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
