import { put } from "@vercel/blob";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 6 * 1024 * 1024;

function json(body, init = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init.headers || {})
    }
  });
}

function sanitizeName(name = "image") {
  const clean = name
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return clean || "image";
}

function extensionFor(type) {
  return {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/svg+xml": "svg"
  }[type];
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

  const contentType = String(body.contentType || "");
  const ext = extensionFor(contentType);
  if (!ext) {
    return json({ error: "只支持 JPG、PNG、WebP、GIF、SVG 图片。" }, { status: 400 });
  }

  const base64 = String(body.data || "").replace(/^data:[^;]+;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  if (!buffer.length) return json({ error: "图片内容为空。" }, { status: 400 });
  if (buffer.length > MAX_FILE_SIZE) {
    return json({ error: "图片不能超过 6MB。" }, { status: 400 });
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
