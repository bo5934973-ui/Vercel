import { list, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { siteContent } from "@/data/contentFallback";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CONTENT_PATH = "content/site.json";

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
      "Cache-Control": "no-store",
      ...(init.headers || {})
    }
  });
}

async function getStoredContent() {
  const { blobs } = await list({
    prefix: CONTENT_PATH,
    limit: 1
  });
  const blob = blobs.find((item) => item.pathname === CONTENT_PATH) || blobs[0];

  if (!blob?.url) return siteContent;

  const response = await fetch(blob.url, { cache: "no-store" });
  if (!response.ok) return siteContent;

  return response.json();
}

export async function GET() {
  try {
    const content = await getStoredContent();
    return json({ content });
  } catch {
    return json({ content: siteContent });
  }
}

export async function POST(request) {
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) {
    return json({ error: "Server is missing ADMIN_PASSWORD." }, { status: 500 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (body.password !== expectedPassword) {
    return json({ error: "后台密码不正确。" }, { status: 401 });
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

  return json({ content: body.content, savedAt: new Date().toISOString() });
}
