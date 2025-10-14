-- Remove status column and update project_type to be free text
ALTER TABLE projects DROP COLUMN IF EXISTS status;

-- Update project_type constraint to allow any text
ALTER TABLE projects DROP CONSTRAINT IF EXISTS projects_project_type_check;

-- Update existing data to use Arabic text
UPDATE projects SET project_type = 
  CASE 
    WHEN project_type = 'electrical' THEN 'كهربائية'
    WHEN project_type = 'lighting' THEN 'إضاءة'
    WHEN project_type = 'energy' THEN 'طاقة'
    WHEN project_type = 'industrial' THEN 'صناعية'
    WHEN project_type = 'commercial' THEN 'تجارية'
    WHEN project_type = 'residential' THEN 'سكنية'
    ELSE project_type
  END;








