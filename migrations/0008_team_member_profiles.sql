ALTER TABLE team_members ADD COLUMN profile_intro TEXT;
ALTER TABLE team_members ADD COLUMN skills TEXT NOT NULL DEFAULT '[]';
ALTER TABLE team_members ADD COLUMN experience TEXT NOT NULL DEFAULT '[]';
ALTER TABLE team_members ADD COLUMN featured_projects TEXT NOT NULL DEFAULT '[]';
ALTER TABLE team_members ADD COLUMN articles TEXT NOT NULL DEFAULT '[]';
