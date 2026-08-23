-- Add category to projects table
ALTER TABLE projects ADD COLUMN category TEXT NOT NULL DEFAULT 'web' CHECK(category IN ('web', 'mobile', 'software'));
