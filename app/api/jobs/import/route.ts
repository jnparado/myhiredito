import { NextResponse } from "next/server";
import {
  detectJobSource,
  isSupportedJobBoardUrl,
  titleFromJobUrl,
} from "@/app/lib/externalHiringBoard";

function metaContent(html: string, key: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${key}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${key}["'][^>]+content=["']([^"']+)["']`, "i"),
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtml(match[1]);
  }
  return null;
}

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function titleFromHtml(html: string): string | null {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return match?.[1] ? decodeHtml(match[1]).replace(/\s+\|.+$/, "").trim() : null;
}

export async function POST(request: Request) {
  const body = (await request.json()) as { url?: string };
  const url = body.url?.trim() ?? "";

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return NextResponse.json({ error: "Enter a valid job URL." }, { status: 400 });
  }

  if (!isSupportedJobBoardUrl(url)) {
    return NextResponse.json(
      {
        error:
          "Use a LinkedIn, Indeed, ZipRecruiter, Glassdoor, Greenhouse, or Lever job URL.",
      },
      { status: 400 },
    );
  }

  const source = detectJobSource(url);
  const fallbackTitle = titleFromJobUrl(url);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; MyHireditoJobImport/1.0; +https://myhiredito.com)",
        Accept: "text/html",
      },
      signal: AbortSignal.timeout(6000),
    });

    const html = await response.text();
    const title =
      metaContent(html, "og:title") ||
      titleFromHtml(html) ||
      fallbackTitle;
    const description =
      metaContent(html, "og:description") ||
      metaContent(html, "description") ||
      `Imported hiring post from ${source}. Review and complete pay, location, and requirements before publishing.`;
    const siteName = metaContent(html, "og:site_name");

    return NextResponse.json({
      draft: {
        title,
        company: siteName ?? "",
        description,
        source,
        sourceUrl: url,
        location: "",
        pay: "",
      },
    });
  } catch {
    return NextResponse.json({
      draft: {
        title: fallbackTitle,
        company: "",
        description: `Imported from ${source}. Add pay, location, and requirements, then post to MyHiredito.`,
        source,
        sourceUrl: url,
        location: "",
        pay: "",
      },
      source: "url-fallback",
    });
  }
}
