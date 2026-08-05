const json = (body, status = 200) => new Response(body === null ? null : JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json; charset=utf-8" },
});

const projectFromRow = (row) => row && ({ ...row, languages: JSON.parse(row.languages), configuration: JSON.parse(row.configuration) });

function isAdmin(request, env) {
  return Boolean(env.ADMIN_API_KEY) && request.headers.get("x-admin-key") === env.ADMIN_API_KEY;
}

function supportErrors(input) {
  const errors = [];
  if (typeof input.name !== "string" || !input.name.trim()) errors.push("name is required");
  if (typeof input.email !== "string" || !/^\S+@\S+\.\S+$/.test(input.email)) errors.push("email must be valid");
  if (typeof input.message !== "string" || !input.message.trim()) errors.push("message is required");
  return errors;
}

function projectErrors(input, partial = false) {
  const errors = [];
  if ((!partial || "name" in input) && (typeof input.name !== "string" || !input.name.trim())) errors.push("name is required");
  if ((!partial || "languages" in input) && (!Array.isArray(input.languages) || !input.languages.length || input.languages.some((item) => typeof item !== "string" || !item.trim()))) errors.push("languages must be a non-empty array of strings");
  if ((!partial || "configuration" in input) && (!input.configuration || Array.isArray(input.configuration) || typeof input.configuration !== "object")) errors.push("configuration must be an object");
  if ((!partial || "price" in input) && (typeof input.price !== "number" || !Number.isFinite(input.price) || input.price < 0)) errors.push("price must be a non-negative number");
  if ("currency" in input && (typeof input.currency !== "string" || !/^[A-Z]{3}$/.test(input.currency))) errors.push("currency must be a 3-letter uppercase code");
  return errors;
}

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const method = request.method;
  const adminRoute = (method === "GET" && parts[1] === "support")
    || (method === "PATCH" && parts[1] === "support")
    || (["POST", "PATCH", "DELETE"].includes(method) && parts[1] === "projects");
  if (adminRoute && !isAdmin(request, env)) return json({ error: "Unauthorized" }, 401);

  try {
    if (method === "POST" && url.pathname === "/api/support") {
      const input = await request.json();
      const errors = supportErrors(input);
      if (errors.length) return json({ errors }, 422);
      const result = await env.DB.prepare("INSERT INTO support_requests (name, email, phone, company, message) VALUES (?, ?, ?, ?, ?)")
        .bind(input.name.trim(), input.email.trim().toLowerCase(), input.phone?.trim() || null, input.company?.trim() || null, input.message.trim()).run();
      return json({ id: result.meta.last_row_id, message: "Support request received" }, 201);
    }

    if (method === "GET" && url.pathname === "/api/support") {
      const status = url.searchParams.get("status");
      const query = status ? env.DB.prepare("SELECT * FROM support_requests WHERE status = ? ORDER BY id DESC").bind(status) : env.DB.prepare("SELECT * FROM support_requests ORDER BY id DESC");
      return json({ data: (await query.all()).results });
    }

    if (method === "PATCH" && parts[1] === "support" && parts[2]) {
      const input = await request.json();
      if (!["new", "in_progress", "resolved"].includes(input.status)) return json({ error: "status must be new, in_progress, or resolved" }, 422);
      const result = await env.DB.prepare("UPDATE support_requests SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(input.status, Number(parts[2])).run();
      return result.meta.changes ? json({ id: Number(parts[2]), status: input.status }) : json({ error: "Support request not found" }, 404);
    }

    if (method === "GET" && url.pathname === "/api/projects") {
      const result = await env.DB.prepare("SELECT * FROM projects ORDER BY id DESC").all();
      return json({ data: result.results.map(projectFromRow) });
    }

    if (method === "POST" && url.pathname === "/api/projects") {
      const input = await request.json();
      const errors = projectErrors(input);
      if (errors.length) return json({ errors }, 422);
      const result = await env.DB.prepare("INSERT INTO projects (name, languages, configuration, price, currency) VALUES (?, ?, ?, ?, ?)")
        .bind(input.name.trim(), JSON.stringify(input.languages), JSON.stringify(input.configuration), input.price, input.currency || "VND").run();
      const row = await env.DB.prepare("SELECT * FROM projects WHERE id = ?").bind(result.meta.last_row_id).first();
      return json({ data: projectFromRow(row) }, 201);
    }

    if ((method === "PATCH" || method === "DELETE") && parts[1] === "projects" && parts[2]) {
      const id = Number(parts[2]);
      if (method === "DELETE") {
        const result = await env.DB.prepare("DELETE FROM projects WHERE id = ?").bind(id).run();
        return result.meta.changes ? new Response(null, { status: 204 }) : json({ error: "Project not found" }, 404);
      }
      const input = await request.json();
      const errors = projectErrors(input, true);
      if (errors.length || !Object.keys(input).length) return json({ errors: errors.length ? errors : ["At least one field is required"] }, 422);
      const current = await env.DB.prepare("SELECT * FROM projects WHERE id = ?").bind(id).first();
      if (!current) return json({ error: "Project not found" }, 404);
      const merged = { ...projectFromRow(current), ...input };
      await env.DB.prepare("UPDATE projects SET name=?, languages=?, configuration=?, price=?, currency=?, updated_at=CURRENT_TIMESTAMP WHERE id=?")
        .bind(merged.name.trim(), JSON.stringify(merged.languages), JSON.stringify(merged.configuration), merged.price, merged.currency || "VND", id).run();
      return json({ data: projectFromRow(await env.DB.prepare("SELECT * FROM projects WHERE id = ?").bind(id).first()) });
    }
    return json({ error: "Route not found" }, 404);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : "Bad request" }, 400);
  }
}
