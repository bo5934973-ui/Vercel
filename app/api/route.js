import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  adminSessionCookie,
  createAdminSession,
  hasAdminSession
} from "@/app/lib/adminSession";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(body, init = {}) {
  return NextResponse.json(body, {
    ...init,
    headers: { "Cache-Control": "no-store", ...(init.headers || {}) }
  });
}

export async function GET(request) {
  return json({ authenticated: hasAdminSession(request) });
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

  if (typeof body.password !== "string" || body.password !== expectedPassword) {
    return json({ error: "后台密码不正确。" }, { status: 401 });
  }

  const response = json({ authenticated: true });
  response.cookies.set(ADMIN_SESSION_COOKIE, adminSessionCookie(createAdminSession()));
  return response;
}

export async function DELETE() {
  const response = json({ authenticated: false });
  response.cookies.set(ADMIN_SESSION_COOKIE, adminSessionCookie());
  return response;
}
