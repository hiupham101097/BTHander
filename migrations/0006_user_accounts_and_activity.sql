PRAGMA foreign_keys = OFF;

CREATE TABLE accounts_new (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'user')) DEFAULT 'user',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO accounts_new (id, name, email, password_hash, password_salt, role, created_at, updated_at)
SELECT id, name, email, password_hash, password_salt, CASE WHEN role = 'admin' THEN 'admin' ELSE 'user' END, created_at, updated_at
FROM accounts;

DROP TABLE accounts;
ALTER TABLE accounts_new RENAME TO accounts;

ALTER TABLE support_requests ADD COLUMN account_id INTEGER REFERENCES accounts(id);
CREATE INDEX IF NOT EXISTS idx_support_requests_account_created ON support_requests(account_id, created_at DESC);

CREATE TABLE IF NOT EXISTS project_interests (
  account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (account_id, project_id)
);

CREATE TABLE IF NOT EXISTS project_purchases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id INTEGER NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'cancelled')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(account_id, project_id)
);

PRAGMA foreign_keys = ON;
