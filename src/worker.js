import { onRequest } from "../functions/api/[[path]].js";

function withSecurityHeaders(res) {
  if (!res) return res;
  const h = new Headers(res.headers);
  h.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  h.set("X-Content-Type-Options", "nosniff");
  h.set("X-Frame-Options", "DENY");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set("X-XSS-Protection", "1; mode=block");
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers: h,
  });
}

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api" || pathname.startsWith("/api/")) {
      const apiRes = await onRequest({ request, env, ctx });
      return withSecurityHeaders(apiRes);
    }
    if (pathname.startsWith("/media/")) {
      const object = await env.MEDIA.get(pathname.slice("/media/".length));
      if (!object) return new Response("Not found", { status: 404 });
      return withSecurityHeaders(
        new Response(object.body, {
          headers: {
            "content-type": object.httpMetadata?.contentType || "application/octet-stream",
            "cache-control": "public, max-age=31536000, immutable",
          },
        })
      );
    }
    let asset = await env.ASSETS.fetch(request);
    if (asset.status === 404) {
      asset = await env.ASSETS.fetch(new Request(new URL("/", request.url), request));
    }
    return withSecurityHeaders(asset);
  },
};
