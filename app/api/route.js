import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { hasAdminSession } from "@/app/lib/adminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 12 * 1024 * 1024;

function json(body, init = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init.headers || {})
    }
  });
}

function sanitizeName(name = "media") {
  const clean = name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return clean || "media";
}

function extensionFor(type) {
  return {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg",
    "application/pdf": "pdf"
  }[type];
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

  const contentType = String(body.contentType || "");
  const ext = extensionFor(contentType);
  if (!ext) {
    return json({ error: "Only JPG, PNG, WebP, GIF, SVG images and PDF files are supported." }, { status: 400 });
  }

  const base64 = String(body.data || "").replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  if (!buffer.length) return json({ error: "File content is empty." }, { status: 400 });
  if (buffer.length > MAX_FILE_SIZE) {
    return json({ error: "File must be smaller than 12MB." }, { status: 400 });
  }

  const key = `media/${Date.now()}-${sanitizeName(body.filename)}.${ext}`;
  const blob = await put(key, buffer, {
    access: "public",
    addRandomSuffix: false,
    contentType,
    cacheControlMaxAge: 31536000
  });

  return json({ key: blob.pathname, url: blob.url });
}
