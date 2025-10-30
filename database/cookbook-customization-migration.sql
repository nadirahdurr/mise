-- Add customization fields to cookbooks table
ALTER TABLE cookbooks 
ADD COLUMN IF NOT EXISTS author text default 'Mise Chef',
ADD COLUMN IF NOT EXISTS cover_photo_url text,
ADD COLUMN IF NOT EXISTS cover_color text default '#5F6B3C',
ADD COLUMN IF NOT EXISTS cover_style text default 'classic' check (cover_style in ('classic', 'modern', 'rustic', 'elegant'));

-- Update existing cookbooks to have default values
UPDATE cookbooks 
SET 
  author = 'Mise Chef',
  cover_color = '#5F6B3C',
  cover_style = 'classic'
WHERE author IS NULL OR cover_color IS NULL OR cover_style IS NULL;