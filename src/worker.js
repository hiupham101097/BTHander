import { onRequest } from "../functions/api/[[path]].js";

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api" || pathname.startsWith("/api/")) {
      return onRequest({ request, env, ctx });
    }
    if (pathname.startsWith("/media/")) {
      const object = await env.MEDIA.get(pathname.slice("/media/".length));
      return object ? new Response(object.body, { headers: { "content-type": object.httpMetadata?.contentType || "application/octet-stream", "cache-control": "public, max-age=31536000, immutable" } }) : new Response("Not found", { status: 404 });
    }
    const asset = await env.ASSETS.fetch(request);
    if (asset.status === 404) {
      return env.ASSETS.fetch(new Request(new URL("/", request.url), request));
    }
    return asset;
  },
};
