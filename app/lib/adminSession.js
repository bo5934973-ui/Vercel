import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE = "portfolio_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 12;

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
}

function signature(value) {
  return crypto.createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export function hasAdminSession(request) {
  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const secret = sessionSecret();
  if (!token || !secret) return false;

  const [expiresAt, receivedSignature] = token.split(".");
  if (!expiresAt || !receivedSignature || !/^\d+$/.test(expiresAt) || Number(expiresAt) <= Date.now()) {
    return false;
  }

  const expectedSignature = signature(expiresAt);
  const receivedBuffer = Buffer.from(receivedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  return (
    receivedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

export function adminSessionCookie(value = "") {
  return {
    value,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: value ? ADMIN_SESSION_MAX_AGE : 0
  };
}

export function createAdminSession() {
  const expiresAt = String(Date.now() + ADMIN_SESSION_MAX_AGE * 1000);
  return `${expiresAt}.${signature(expiresAt)}`;
}
