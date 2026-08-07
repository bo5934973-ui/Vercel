import { list, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { siteContent } from "@/data/contentFallback";
import { hasAdminSession } from "@/app/lib/adminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_PATH = "content/site.json";
const CONTENT_CACHE_TTL = 60 * 1000;

let cachedContent = null;
let cachedAt = 0;

function validateContent(content) {
  return (
    content &&
    typeof content === "object" &&
    content.site &&
    content.hero &&
    content.worksSection &&
    content.about &&
    content.contact &&
    Array.isArray(content.works)
  );
}

function json(body, init = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      "Cache-Control": init.cacheControl || "no-store",
      ...(init.headers || {})
    }
  });
}

async function getStoredContent() {
  if (cachedContent && Date.now() - cachedAt < CONTENT_CACHE_TTL) {
    return cachedContent;
  }

  const { blobs } = await list({
    prefix: CONTENT_PATH,
    limit: 1
  });
  const blob = blobs.find((item) => item.pathname === CONTENT_PATH) || blobs[0];

  if (!blob?.url) {
    cachedContent = siteContent;
    cachedAt = Date.now();
    return siteContent;
  }

  const response = await fetch(blob.url, { cache: "no-store" });
  if (!response.ok) {
    cachedContent = siteContent;
    cachedAt = Date.now();
    return siteContent;
  }

  cachedContent = await response.json();
  cachedAt = Date.now();
  return cachedContent;
}

export async function GET() {
  try {
    const content = await getStoredContent();
    return json(
      { content },
      { cacheControl: "public, max-age=0, s-maxage=60, stale-while-revalidate=300" }
    );
  } catch {
    return json({ content: siteContent });
  }
}

export async function POST(request) {
  if (!hasAdminSession(request)) {
    return json({ error: "登录已过期，请重新登录。" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!validateContent(body.content)) {
    return json({ error: "内容格式不完整，保存失败。" }, { status: 400 });
  }

  await put(CONTENT_PATH, JSON.stringify(body.content, null, 2), {
    access: "public",
    allowOverwrite: true,
    contentType: "application/json; charset=utf-8",
    cacheControlMaxAge: 60
  });

  cachedContent = body.content;
  cachedAt = Date.now();

  return json({ content: body.content, savedAt: new Date().toISOString() });
}
