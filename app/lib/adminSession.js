import crypto from "node:crypto";

export const ADMIN_SESSION_COOKIE = "portfolio_admin_session";

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
}

function signature(value) {
  return crypto.createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

export function hasAdminSession(request) {
  const token =
    request.headers.get("x-admin-session") ||
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const secret = sessionSecret();
  if (!token || !secret) return false;

  const [nonce, receivedSignature] = token.split(".");
  if (!nonce || !receivedSignature) {
    return false;
  }

  const expectedSignature = signature(nonce);
  const receivedBuffer = Buffer.from(receivedSignature);
  const expectedBuffer = Buffer.from(expectedSignature);
  return (
    receivedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

export function adminSessionCookie(value = "") {
  const cookie = {
    value,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  };

  // Omitting Max-Age/Expires makes a successful login last for the browser
  // session instead of expiring while an admin page is still open.
  if (!value) cookie.maxAge = 0;
  return cookie;
}

export function createAdminSession() {
  const nonce = crypto.randomBytes(32).toString("base64url");
  return `${nonce}.${signature(nonce)}`;
}
