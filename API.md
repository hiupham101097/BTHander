# Aurix API (Cloudflare Worker + D1)

The backend runs in a Cloudflare Worker and stores data in the D1 database `app-db`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/support` | Submit support: `name`, `email`, `message`, plus optional `phone`, `company` |
| `GET` | `/api/projects` | List public projects |
| `POST` | `/api/projects` | Create a project |
| `PATCH` / `DELETE` | `/api/projects/:id` | Update or delete a project |
| `GET` | `/api/support` | List support submissions |
| `PATCH` | `/api/support/:id` | Change request status: `new`, `in_progress`, or `resolved` |

Project payload example:

```json
{
  "name": "Aurix Vision",
  "languages": ["JavaScript", "Python"],
  "configuration": { "hosting": "Cloudflare", "region": "APAC" },
  "price": 18900000,
  "currency": "VND"
}
```

All management routes require `x-admin-key`. Add an `ADMIN_API_KEY` secret under **Cloudflare Workers → bthander → Settings → Variables and Secrets**. Do not put this key in the frontend or Git.
