-- Repair databases where the accounts table still has the older
-- CHECK(role IN ('admin', 'user')) constraint.
PRAGMA foreign_keys = OFF;

DROP TABLE IF EXISTS accounts_role_rebuild;

CREATE TABLE accounts_role_rebuild (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  password_salt TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('admin', 'staff', 'user')) DEFAULT 'user',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO accounts_role_rebuild (
  id,
  name,
  email,
  password_hash,
  password_salt,
  role,
  created_at,
  updated_at
)
SELECT
  id,
  name,
  email,
  password_hash,
  password_salt,
  CASE
    WHEN role IN ('admin', 'staff', 'user') THEN role
    ELSE 'user'
  END,
  created_at,
  updated_at
FROM accounts;

DROP TABLE accounts;
ALTER TABLE accounts_role_rebuild RENAME TO accounts;

PRAGMA foreign_keys = ON;
