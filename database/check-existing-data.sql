-- Check existing recipes
SELECT 'RECIPES' as table_name, id, title FROM recipes ORDER BY id;

-- Check existing cookbooks  
SELECT 'COOKBOOKS' as table_name, id, title FROM cookbooks ORDER BY id;

-- Check existing cookbook-recipe relationships
SELECT 'COOKBOOK_RECIPES' as table_name, cookbook_id, recipe_id FROM cookbook_recipes ORDER BY cookbook_id, recipe_id;

-- Count totals
SELECT 
  (SELECT COUNT(*) FROM recipes) as total_recipes,
  (SELECT COUNT(*) FROM cookbooks) as total_cookbooks,
  (SELECT COUNT(*) FROM cookbook_recipes) as total_relationships;