ALTER TABLE projects ADD COLUMN detail_tag TEXT;
ALTER TABLE projects ADD COLUMN full_description TEXT;
ALTER TABLE projects ADD COLUMN gallery TEXT NOT NULL DEFAULT '[]';
ALTER TABLE projects ADD COLUMN roadmap TEXT NOT NULL DEFAULT '[]';
