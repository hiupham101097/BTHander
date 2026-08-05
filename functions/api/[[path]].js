const encoder = new TextEncoder();
const json = (body, status = 200, headers = {}) => new Response(body === null ? null : JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", ...headers },
});
const projectFromRow = (row) => row && ({ ...row, languages: JSON.parse(row.languages), configuration: JSON.parse(row.configuration) });
const productFromRow = (row) => row && ({ ...row, specifications: JSON.parse(row.specifications) });
const hex = (bytes) => [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
const randomHex = (length = 32) => hex(crypto.getRandomValues(new Uint8Array(length)));

async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt: encoder.encode(salt), iterations: 100000, hash: "SHA-256" }, key, 256);
  return hex(bits);
}
async function tokenHash(token) { return hex(await crypto.subtle.digest("SHA-256", encoder.encode(token))); }
function cookieValue(request, name) {
  return request.headers.get("cookie")?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`))?.slice(name.length + 1);
}
function cleanAccount(account) { return account && { id: account.id, name: account.name, email: account.email, role: account.role }; }
function supportErrors(input) {
  const errors = [];
  if (typeof input.name !== "string" || !input.name.trim()) errors.push("name is required");
  if (typeof input.email !== "string" || !/^\S+@\S+\.\S+$/.test(input.email)) errors.push("email must be valid");
  if (typeof input.message !== "string" || !input.message.trim()) errors.push("message is required");
  return errors;
}
function accountErrors(input) {
  const errors = [];
  if (typeof input.name !== "string" || !input.name.trim()) errors.push("name is required");
  if (typeof input.email !== "string" || !/^\S+@\S+\.\S+$/.test(input.email)) errors.push("email must be valid");
  if (typeof input.password !== "string" || input.password.length < 10) errors.push("password must contain at least 10 characters");
  return errors;
}
function projectErrors(input, partial = false) {
  const errors = [];
  if ((!partial || "name" in input) && (typeof input.name !== "string" || !input.name.trim())) errors.push("name is required");
  if ((!partial || "languages" in input) && (!Array.isArray(input.languages) || !input.languages.length || input.languages.some((item) => typeof item !== "string" || !item.trim()))) errors.push("languages must be a non-empty array of strings");
  if ((!partial || "configuration" in input) && (!input.configuration || Array.isArray(input.configuration) || typeof input.configuration !== "object")) errors.push("configuration must be an object");
  if ("description" in input && (typeof input.description !== "string" || input.description.length > 1000)) errors.push("description must be a string up to 1000 characters");
  if ((!partial || "price" in input) && (typeof input.price !== "number" || !Number.isFinite(input.price) || input.price < 0)) errors.push("price must be a non-negative number");
  if ("currency" in input && (typeof input.currency !== "string" || !/^[A-Z]{3}$/.test(input.currency))) errors.push("currency must be a 3-letter uppercase code");
  return errors;
}
function productErrors(input, partial = false) {
  const errors = [];
  if ((!partial || "name" in input) && (typeof input.name !== "string" || !input.name.trim())) errors.push("name is required");
  if ("description" in input && (typeof input.description !== "string" || input.description.length > 1000)) errors.push("description must be a string up to 1000 characters");
  if ((!partial || "product_type" in input) && !["trial", "sale"].includes(input.product_type)) errors.push("product_type must be trial or sale");
  if ((!partial || "price" in input) && (typeof input.price !== "number" || !Number.isFinite(input.price) || input.price < 0)) errors.push("price must be a non-negative number");
  if ("currency" in input && (typeof input.currency !== "string" || !/^[A-Z]{3}$/.test(input.currency))) errors.push("currency must be a 3-letter uppercase code");
  if ((!partial || "specifications" in input) && (!Array.isArray(input.specifications) || input.specifications.some((item) => typeof item !== "string" || !item.trim()))) errors.push("specifications must be an array of strings");
  if ("status" in input && !["draft", "published"].includes(input.status)) errors.push("status must be draft or published");
  return errors;
}
function teamErrors(input, partial = false) {
  const errors = [];
  if ((!partial || "name" in input) && (typeof input.name !== "string" || !input.name.trim())) errors.push("name is required");
  if ((!partial || "title" in input) && (typeof input.title !== "string" || !input.title.trim())) errors.push("title is required");
  if ("bio" in input && (typeof input.bio !== "string" || input.bio.length > 1000)) errors.push("bio must be a string up to 1000 characters");
  if ("avatar_url" in input && input.avatar_url !== null && typeof input.avatar_url !== "string") errors.push("avatar_url must be a string");
  if ("contact_info" in input && input.contact_info !== null && (typeof input.contact_info !== "string" || input.contact_info.length > 300)) errors.push("contact_info must be a string up to 300 characters");
  if ("sort_order" in input && (!Number.isInteger(input.sort_order) || input.sort_order < 0)) errors.push("sort_order must be a non-negative integer");
  if ("status" in input && !["active", "inactive"].includes(input.status)) errors.push("status must be active or inactive");
  return errors;
}
async function currentAccount(request, env) {
  const token = cookieValue(request, "bthander_session") || request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  return env.DB.prepare("SELECT a.id, a.name, a.email, a.role FROM sessions s JOIN accounts a ON a.id=s.account_id WHERE s.token_hash=? AND s.expires_at>CURRENT_TIMESTAMP").bind(await tokenHash(token)).first();
}
async function requireRole(request, env, roles) {
  const account = await currentAccount(request, env);
  return account && roles.includes(account.role) ? account : null;
}
async function authRoutes(request, env, url) {
  const method = request.method;
  if (method === "GET" && url.pathname === "/api/auth/setup-status") {
    const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM accounts").first();
    return json({ setupRequired: Number(row.count) === 0 });
  }
  if (method === "POST" && url.pathname === "/api/auth/bootstrap") {
    const row = await env.DB.prepare("SELECT COUNT(*) AS count FROM accounts").first();
    if (Number(row.count) > 0) return json({ error: "Initial administrator already exists" }, 403);
    const input = await request.json(), errors = accountErrors(input);
    if (errors.length) return json({ errors }, 422);
    const salt = randomHex(16), hash = await passwordHash(input.password, salt);
    const result = await env.DB.prepare("INSERT INTO accounts (name,email,password_hash,password_salt,role) VALUES (?,?,?,?, 'admin')").bind(input.name.trim(), input.email.trim().toLowerCase(), hash, salt).run();
    return createSession(env, result.meta.last_row_id, 201);
  }
  if (method === "POST" && url.pathname === "/api/auth/register") {
    const input = await request.json(), errors = accountErrors(input);
    if (errors.length) return json({ errors }, 422);
    const salt = randomHex(16), hash = await passwordHash(input.password, salt);
    try {
      const result = await env.DB.prepare("INSERT INTO accounts (name,email,password_hash,password_salt,role) VALUES (?,?,?,?, 'staff')").bind(input.name.trim(), input.email.trim().toLowerCase(), hash, salt).run();
      return createSession(env, result.meta.last_row_id, 201);
    } catch (error) {
      if (String(error).includes("UNIQUE")) return json({ error: "Email này đã được đăng ký" }, 409);
      throw error;
    }
  }
  if (method === "POST" && url.pathname === "/api/auth/login") {
    const input = await request.json();
    if (typeof input.email !== "string" || typeof input.password !== "string") return json({ error: "email and password are required" }, 422);
    const account = await env.DB.prepare("SELECT * FROM accounts WHERE email=?").bind(input.email.trim().toLowerCase()).first();
    if (!account || await passwordHash(input.password, account.password_salt) !== account.password_hash) return json({ error: "Invalid email or password" }, 401);
    return createSession(env, account.id);
  }
  if (method === "POST" && url.pathname === "/api/auth/logout") {
    const token = cookieValue(request, "bthander_session");
    if (token) await env.DB.prepare("DELETE FROM sessions WHERE token_hash=?").bind(await tokenHash(token)).run();
    return json({ ok: true }, 200, { "set-cookie": "bthander_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0" });
  }
  if (method === "GET" && url.pathname === "/api/auth/me") {
    const account = await currentAccount(request, env);
    return account ? json({ data: cleanAccount(account) }) : json({ error: "Unauthorized" }, 401);
  }
  return null;
}
async function createSession(env, accountId, status = 200) {
  const token = randomHex(32);
  await env.DB.prepare("INSERT INTO sessions (account_id,token_hash,expires_at) VALUES (?, ?, datetime('now', '+7 days'))").bind(accountId, await tokenHash(token)).run();
  const account = await env.DB.prepare("SELECT id,name,email,role FROM accounts WHERE id=?").bind(accountId).first();
  return json({ data: cleanAccount(account) }, status, { "set-cookie": `bthander_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800` });
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url), parts = url.pathname.split("/").filter(Boolean), method = request.method;
  try {
    if (url.pathname.startsWith("/api/auth/")) return await authRoutes(request, env, url) || json({ error: "Route not found" }, 404);
    const supportAdmin = (method === "GET" || method === "PATCH") && parts[1] === "support";
    const projectAdmin = ["POST", "PATCH", "DELETE"].includes(method) && parts[1] === "projects";
    const catalogAdmin = ["POST", "PATCH", "DELETE"].includes(method) && ["products", "team", "accounts"].includes(parts[1]);
    const accountsRead = method === "GET" && url.pathname === "/api/accounts";
    if (supportAdmin && !await requireRole(request, env, ["admin", "staff"])) return json({ error: "Unauthorized" }, 401);
    if (projectAdmin && !await requireRole(request, env, ["admin"])) return json({ error: "Unauthorized" }, 401);
    if (catalogAdmin && !await requireRole(request, env, ["admin"])) return json({ error: "Unauthorized" }, 401);
    if (accountsRead && !await requireRole(request, env, ["admin"])) return json({ error: "Unauthorized" }, 401);

    if (method === "POST" && url.pathname === "/api/support") {
      const input = await request.json(), errors = supportErrors(input);
      if (errors.length) return json({ errors }, 422);
      const result = await env.DB.prepare("INSERT INTO support_requests (name,email,phone,company,message) VALUES (?,?,?,?,?)").bind(input.name.trim(), input.email.trim().toLowerCase(), input.phone?.trim() || null, input.company?.trim() || null, input.message.trim()).run();
      return json({ id: result.meta.last_row_id, message: "Support request received" }, 201);
    }
    if (method === "GET" && url.pathname === "/api/support") {
      const status = url.searchParams.get("status"), query = status ? env.DB.prepare("SELECT * FROM support_requests WHERE status=? ORDER BY id DESC").bind(status) : env.DB.prepare("SELECT * FROM support_requests ORDER BY id DESC");
      return json({ data: (await query.all()).results });
    }
    if (method === "PATCH" && parts[1] === "support" && parts[2]) {
      const input = await request.json();
      if (!["new", "in_progress", "resolved"].includes(input.status)) return json({ error: "status must be new, in_progress, or resolved" }, 422);
      const result = await env.DB.prepare("UPDATE support_requests SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(input.status, Number(parts[2])).run();
      return result.meta.changes ? json({ id: Number(parts[2]), status: input.status }) : json({ error: "Support request not found" }, 404);
    }
    if (method === "GET" && url.pathname === "/api/projects") return json({ data: (await env.DB.prepare("SELECT * FROM projects ORDER BY id DESC").all()).results.map(projectFromRow) });
    if (method === "POST" && url.pathname === "/api/projects") {
      const input = await request.json(), errors = projectErrors(input);
      if (errors.length) return json({ errors }, 422);
      const result = await env.DB.prepare("INSERT INTO projects (name,description,languages,configuration,price,currency) VALUES (?,?,?,?,?,?)").bind(input.name.trim(), input.description?.trim() || null, JSON.stringify(input.languages), JSON.stringify(input.configuration), input.price, input.currency || "VND").run();
      return json({ data: projectFromRow(await env.DB.prepare("SELECT * FROM projects WHERE id=?").bind(result.meta.last_row_id).first()) }, 201);
    }
    if ((method === "PATCH" || method === "DELETE") && parts[1] === "projects" && parts[2]) {
      const id = Number(parts[2]);
      if (method === "DELETE") { const result = await env.DB.prepare("DELETE FROM projects WHERE id=?").bind(id).run(); return result.meta.changes ? new Response(null, { status: 204 }) : json({ error: "Project not found" }, 404); }
      const input = await request.json(), errors = projectErrors(input, true);
      if (errors.length || !Object.keys(input).length) return json({ errors: errors.length ? errors : ["At least one field is required"] }, 422);
      const current = await env.DB.prepare("SELECT * FROM projects WHERE id=?").bind(id).first();
      if (!current) return json({ error: "Project not found" }, 404);
      const merged = { ...projectFromRow(current), ...input };
      await env.DB.prepare("UPDATE projects SET name=?,description=?,languages=?,configuration=?,price=?,currency=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(merged.name.trim(), merged.description?.trim() || null, JSON.stringify(merged.languages), JSON.stringify(merged.configuration), merged.price, merged.currency || "VND", id).run();
      return json({ data: projectFromRow(await env.DB.prepare("SELECT * FROM projects WHERE id=?").bind(id).first()) });
    }
    if (method === "GET" && url.pathname === "/api/products") {
      const admin = await requireRole(request, env, ["admin"]);
      const query = admin ? env.DB.prepare("SELECT * FROM products ORDER BY id DESC") : env.DB.prepare("SELECT * FROM products WHERE status='published' ORDER BY id DESC");
      return json({ data: (await query.all()).results.map(productFromRow) });
    }
    if (method === "POST" && url.pathname === "/api/products") {
      const input = await request.json(), errors = productErrors(input);
      if (errors.length) return json({ errors }, 422);
      const result = await env.DB.prepare("INSERT INTO products (name,description,product_type,price,currency,specifications,status) VALUES (?,?,?,?,?,?,?)").bind(input.name.trim(), input.description?.trim() || null, input.product_type, input.price, input.currency || "VND", JSON.stringify(input.specifications), input.status || "published").run();
      return json({ data: productFromRow(await env.DB.prepare("SELECT * FROM products WHERE id=?").bind(result.meta.last_row_id).first()) }, 201);
    }
    if ((method === "PATCH" || method === "DELETE") && parts[1] === "products" && parts[2]) {
      const id = Number(parts[2]);
      if (method === "DELETE") { const result = await env.DB.prepare("DELETE FROM products WHERE id=?").bind(id).run(); return result.meta.changes ? new Response(null, { status: 204 }) : json({ error: "Product not found" }, 404); }
      const input = await request.json(), errors = productErrors(input, true);
      if (errors.length || !Object.keys(input).length) return json({ errors: errors.length ? errors : ["At least one field is required"] }, 422);
      const current = await env.DB.prepare("SELECT * FROM products WHERE id=?").bind(id).first(); if (!current) return json({ error: "Product not found" }, 404);
      const merged = { ...productFromRow(current), ...input };
      await env.DB.prepare("UPDATE products SET name=?,description=?,product_type=?,price=?,currency=?,specifications=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(merged.name.trim(), merged.description?.trim() || null, merged.product_type, merged.price, merged.currency || "VND", JSON.stringify(merged.specifications), merged.status || "published", id).run();
      return json({ data: productFromRow(await env.DB.prepare("SELECT * FROM products WHERE id=?").bind(id).first()) });
    }
    if (method === "GET" && url.pathname === "/api/team") {
      const admin = await requireRole(request, env, ["admin"]);
      const query = admin ? env.DB.prepare("SELECT * FROM team_members ORDER BY sort_order, id") : env.DB.prepare("SELECT * FROM team_members WHERE status='active' ORDER BY sort_order, id");
      return json({ data: (await query.all()).results });
    }
    if (method === "POST" && url.pathname === "/api/team") {
      const input = await request.json(), errors = teamErrors(input); if (errors.length) return json({ errors }, 422);
      const result = await env.DB.prepare("INSERT INTO team_members (name,title,bio,avatar_url,contact_info,sort_order,status) VALUES (?,?,?,?,?,?,?)").bind(input.name.trim(), input.title.trim(), input.bio?.trim() || null, input.avatar_url?.trim() || null, input.contact_info?.trim() || null, input.sort_order || 0, input.status || "active").run();
      return json({ data: await env.DB.prepare("SELECT * FROM team_members WHERE id=?").bind(result.meta.last_row_id).first() }, 201);
    }
    if ((method === "PATCH" || method === "DELETE") && parts[1] === "team" && parts[2]) {
      const id = Number(parts[2]);
      if (method === "DELETE") { const result = await env.DB.prepare("DELETE FROM team_members WHERE id=?").bind(id).run(); return result.meta.changes ? new Response(null, { status: 204 }) : json({ error: "Team member not found" }, 404); }
      const input = await request.json(), errors = teamErrors(input, true); if (errors.length || !Object.keys(input).length) return json({ errors: errors.length ? errors : ["At least one field is required"] }, 422);
      const current = await env.DB.prepare("SELECT * FROM team_members WHERE id=?").bind(id).first(); if (!current) return json({ error: "Team member not found" }, 404);
      const merged = { ...current, ...input };
      await env.DB.prepare("UPDATE team_members SET name=?,title=?,bio=?,avatar_url=?,contact_info=?,sort_order=?,status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(merged.name.trim(), merged.title.trim(), merged.bio?.trim() || null, merged.avatar_url?.trim() || null, merged.contact_info?.trim() || null, merged.sort_order, merged.status, id).run();
      return json({ data: await env.DB.prepare("SELECT * FROM team_members WHERE id=?").bind(id).first() });
    }
    if (method === "GET" && url.pathname === "/api/accounts") return json({ data: (await env.DB.prepare("SELECT id,name,email,role,created_at,updated_at FROM accounts ORDER BY id DESC").all()).results });
    if (method === "PATCH" && parts[1] === "accounts" && parts[2]) {
      const id = Number(parts[2]), input = await request.json();
      if (!['admin', 'staff'].includes(input.role)) return json({ error: "role must be admin or staff" }, 422);
      const actor = await requireRole(request, env, ["admin"]); if (actor.id === id && input.role !== 'admin') return json({ error: "You cannot remove your own administrator role" }, 422);
      const result = await env.DB.prepare("UPDATE accounts SET role=?,updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(input.role, id).run();
      return result.meta.changes ? json({ data: await env.DB.prepare("SELECT id,name,email,role,created_at,updated_at FROM accounts WHERE id=?").bind(id).first() }) : json({ error: "Account not found" }, 404);
    }
    return json({ error: "Route not found" }, 404);
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Bad request" }, 400); }
}
