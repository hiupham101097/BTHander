import { onRequest } from "../functions/api/[[path]].js";

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname === "/api" || pathname.startsWith("/api/")) {
      return onRequest({ request, env, ctx });
    }
    const asset = await env.ASSETS.fetch(request);
    if (asset.status === 404 && request.headers.get("accept")?.includes("text/html")) {
      return env.ASSETS.fetch(new Request(new URL("/", request.url), request));
    }
    return asset;
  },
};
