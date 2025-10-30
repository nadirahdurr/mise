INSERT INTO recipes (id, title, description, prep_time, cook_time, servings, difficulty, ingredients, instructions, cuisine_tags, tips)
VALUES
(
  'recipe_001_carbonara',
  'Classic Spaghetti Carbonara',
  'A creamy Roman pasta dish made with eggs, cheese, and pancetta. Simple ingredients, extraordinary flavor.',
  '10 min',
  '15 min',
  4,
  'Medium',
  ARRAY[
    '1 lb spaghetti',
    '6 oz pancetta or guanciale, diced',
    '4 large eggs',
    '1 cup freshly grated Pecorino Romano',
    '1/2 cup freshly grated Parmesan',
    '3 cloves garlic, minced',
    'Fresh black pepper',
    'Salt for pasta water'
  ],
  ARRAY[
    'Bring a large pot of salted water to boil. Cook spaghetti until al dente.',
    'While pasta cooks, render pancetta in a large skillet over medium heat until crispy.',
    'In a bowl, whisk together eggs, both cheeses, and plenty of black pepper.',
    'Reserve 1 cup pasta water before draining.',
    'Add hot pasta to the skillet with pancetta.',
    'Remove from heat and quickly toss with egg mixture, adding pasta water as needed.',
    'Serve immediately with extra cheese and pepper.'
  ],
  ARRAY['Italian', 'Comfort', 'Quick'],
  'The key is to work quickly once the pasta is drained. The residual heat cooks the eggs gently.'
),
(
  'recipe_002_coconut_curry',
  'Thai-Style Coconut Curry',
  'A fragrant and warming curry with tender vegetables in rich coconut milk. Customize with your favorite proteins.',
  '15 min',
  '25 min',
  6,
  'Easy',
  ARRAY[
    '2 tbsp coconut oil',
    '3 tbsp red curry paste',
    '1 can (14oz) coconut milk',
    '1 bell pepper, sliced',
    '1 zucchini, sliced',
    '1 cup snap peas',
    '1 onion, sliced',
    '3 cloves garlic, minced',
    '1 tbsp fresh ginger, grated',
    '2 tbsp fish sauce',
    '1 tbsp brown sugar',
    'Fresh basil leaves',
    'Lime wedges for serving',
    'Jasmine rice'
  ],
  ARRAY[
    'Heat coconut oil in a large pot over medium heat.',
    'Add curry paste and cook for 1 minute until fragrant.',
    'Pour in coconut milk and bring to a gentle simmer.',
    'Add onion, garlic, and ginger. Cook for 5 minutes.',
    'Add harder vegetables like bell pepper first, cook 5 minutes.',
    'Add remaining vegetables and simmer until tender.',
    'Stir in fish sauce and brown sugar.',
    'Taste and adjust seasoning.',
    'Serve over jasmine rice with fresh basil and lime.'
  ],
  ARRAY['Asian', 'Vegan', 'Comfort'],
  'Start cooking rice first. Coconut milk can separate - just stir it back together.'
),
(
  'recipe_003_tomato_soup',
  'Roasted Tomato Soup',
  'A velvety smooth soup that captures the essence of summer tomatoes. Perfect with grilled cheese.',
  '20 min',
  '45 min',
  4,
  'Easy',
  ARRAY[
    '3 lbs ripe tomatoes, halved',
    '1 large onion, quartered',
    '4 cloves garlic',
    '3 tbsp olive oil',
    '2 cups vegetable broth',
    '1/2 cup heavy cream',
    '2 tbsp fresh basil, chopped',
    '1 tsp sugar',
    'Salt and pepper to taste'
  ],
  ARRAY[
    'Preheat oven to 425°F.',
    'Toss tomatoes, onion, and garlic with olive oil, salt, and pepper.',
    'Roast for 25-30 minutes until caramelized.',
    'Let cool slightly, then blend until smooth.',
    'Pour into a pot and add broth.',
    'Simmer for 15 minutes.',
    'Stir in cream, basil, and sugar.',
    'Season to taste and serve hot.'
  ],
  ARRAY['Comfort', 'Soup/Stew', 'Vegetarian'],
  'Roasting the vegetables first adds incredible depth of flavor.'
),
(
  'recipe_004_jerk_chicken',
  'Caribbean Jerk Chicken',
  'Spicy, smoky, and packed with island flavors. This marinade transforms simple chicken into something special.',
  '20 min',
  '30 min',
  4,
  'Medium',
  ARRAY[
    '4 chicken breasts or 8 thighs',
    '3 scotch bonnet peppers, seeded',
    '6 green onions, chopped',
    '4 cloves garlic',
    '2 tbsp fresh thyme',
    '2 tbsp brown sugar',
    '2 tbsp soy sauce',
    '2 tbsp lime juice',
    '2 tbsp vegetable oil',
    '1 tbsp allspice',
    '1 tsp cinnamon',
    '1 tsp nutmeg',
    'Salt and pepper'
  ],
  ARRAY[
    'Blend all ingredients except chicken into a smooth marinade.',
    'Score chicken and coat thoroughly with marinade.',
    'Marinate for at least 2 hours or overnight.',
    'Preheat grill to medium-high heat.',
    'Grill chicken, turning once, until cooked through.',
    'Let rest 5 minutes before serving.',
    'Serve with rice and beans or plantains.'
  ],
  ARRAY['Caribbean', 'Spicy', 'Grilled'],
  'Wear gloves when handling scotch bonnets. Adjust heat by using fewer peppers.'
),
(
  'recipe_005_mushroom_risotto',
  'Creamy Mushroom Risotto',
  'Rich, creamy rice dish with earthy mushrooms. A labor of love that rewards patience with incredible flavor.',
  '15 min',
  '35 min',
  4,
  'Hard',
  ARRAY[
    '1 1/2 cups Arborio rice',
    '6 cups warm chicken or vegetable broth',
    '1 lb mixed mushrooms, sliced',
    '1 onion, finely diced',
    '3 cloves garlic, minced',
    '1/2 cup white wine',
    '4 tbsp butter',
    '2 tbsp olive oil',
    '1/2 cup Parmesan, grated',
    '2 tbsp fresh parsley',
    'Salt and pepper'
  ],
  ARRAY[
    'Heat broth in a saucepan and keep warm.',
    'Sauté mushrooms in olive oil until golden. Set aside.',
    'In the same pan, melt 2 tbsp butter and cook onion until soft.',
    'Add garlic and rice, stirring until rice is coated.',
    'Add wine and stir until absorbed.',
    'Add warm broth one ladle at a time, stirring constantly.',
    'Continue until rice is creamy and al dente, about 18-20 minutes.',
    'Stir in mushrooms, remaining butter, and Parmesan.',
    'Season and garnish with parsley.'
  ],
  ARRAY['Italian', 'Comfort', 'Vegetarian'],
  'Patience is key. Never rush risotto. The constant stirring creates the creamy texture.'
),
(
  'recipe_006_quick_stir_fry',
  'Quick Vegetable Stir Fry',
  'A colorful, healthy meal ready in minutes. Use whatever vegetables you have on hand.',
  '10 min',
  '8 min',
  4,
  'Easy',
  ARRAY[
    '2 tbsp vegetable oil',
    '1 bell pepper, sliced',
    '1 zucchini, sliced',
    '1 cup broccoli florets',
    '1 carrot, julienned',
    '3 cloves garlic, minced',
    '1 tbsp fresh ginger, grated',
    '3 tbsp soy sauce',
    '1 tbsp sesame oil',
    '1 tsp honey',
    '1 tsp cornstarch',
    '2 tbsp water',
    'Green onions for garnish',
    'Sesame seeds'
  ],
  ARRAY[
    'Mix soy sauce, sesame oil, honey, cornstarch, and water for sauce.',
    'Heat oil in a large wok or skillet over high heat.',
    'Add harder vegetables first (broccoli, carrots).',
    'Stir-fry for 2-3 minutes.',
    'Add remaining vegetables and cook 2 more minutes.',
    'Add garlic and ginger, stir for 30 seconds.',
    'Pour in sauce and toss until vegetables are coated.',
    'Garnish with green onions and sesame seeds.'
  ],
  ARRAY['Asian', 'Quick 15-min', 'Vegan'],
  'Keep the heat high and ingredients moving. Have everything prepped before you start.'
),
(
  'recipe_007_beef_stew',
  'Hearty Beef Stew',
  'A warming, soul-satisfying stew perfect for cold days. Tender beef and vegetables in rich broth.',
  '25 min',
  '2 hours',
  6,
  'Medium',
  ARRAY[
    '2 lbs beef chuck, cubed',
    '3 tbsp flour',
    '3 tbsp vegetable oil',
    '1 onion, diced',
    '3 carrots, chunked',
    '3 potatoes, cubed',
    '3 celery stalks, chopped',
    '4 cups beef broth',
    '2 tbsp tomato paste',
    '2 bay leaves',
    '1 tsp thyme',
    '1 tsp rosemary',
    'Salt and pepper',
    '1 cup peas (frozen)'
  ],
  ARRAY[
    'Season beef with salt and pepper, then coat with flour.',
    'Brown beef in oil in a Dutch oven. Remove and set aside.',
    'Sauté onion until softened.',
    'Add tomato paste and cook 1 minute.',
    'Return beef to pot with broth, herbs, and bay leaves.',
    'Bring to a boil, then reduce heat and simmer covered for 1.5 hours.',
    'Add carrots, potatoes, and celery.',
    'Continue cooking 30 minutes until vegetables are tender.',
    'Stir in peas and cook 5 minutes more.',
    'Remove bay leaves before serving.'
  ],
  ARRAY['Comfort', 'Soup/Stew', 'Soul Food'],
  'Low and slow is the secret. Don''t rush the browning step - it builds flavor.'
),
(
  'recipe_008_banana_pancakes',
  'Fluffy Banana Pancakes',
  'Weekend morning perfection. Light, fluffy pancakes with sweet banana flavor.',
  '10 min',
  '15 min',
  4,
  'Easy',
  ARRAY[
    '2 cups all-purpose flour',
    '2 tbsp sugar',
    '2 tsp baking powder',
    '1 tsp salt',
    '2 large eggs',
    '1 3/4 cups milk',
    '4 tbsp melted butter',
    '2 ripe bananas, mashed',
    '1 tsp vanilla extract',
    'Butter for cooking',
    'Maple syrup for serving'
  ],
  ARRAY[
    'Mix flour, sugar, baking powder, and salt in a large bowl.',
    'In another bowl, whisk eggs, milk, melted butter, mashed bananas, and vanilla.',
    'Pour wet ingredients into dry ingredients.',
    'Stir just until combined - lumps are okay.',
    'Heat griddle or skillet over medium heat.',
    'Brush with butter.',
    'Pour 1/4 cup batter for each pancake.',
    'Cook until bubbles form on surface, then flip.',
    'Cook until golden brown on both sides.',
    'Serve hot with maple syrup.'
  ],
  ARRAY['Comfort', 'Quick 15-min', 'Breakfast'],
  'Don''t overmix the batter - lumps mean tender pancakes.'
)
ON CONFLICT (id) DO NOTHING;

-- Insert sample cookbooks into the cookbooks table (safe - won't create duplicates)
INSERT INTO cookbooks (id, title, description, author, cover_color, cover_style, is_public)
VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'Weeknight Winners',
  'Quick and delicious meals for busy weeknights. All recipes ready in 30 minutes or less.',
  'Mise Chef',
  '#C5A75A',
  'modern',
  false
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Ultimate Comfort Food',
  'Soul-warming dishes that feel like a hug. Perfect for cozy nights and family gatherings.',
  'Grandma Rose',
  '#5F6B3C',
  'rustic',
  false
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'Fresh & Healthy',
  'Nutritious recipes that don''t compromise on flavor. Clean eating made delicious.',
  'Chef Marina',
  '#A8B5A0',
  'classic',
  false
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Around the World',
  'A culinary journey through different cuisines. Bring global flavors to your kitchen.',
  'Chef Antonio',
  '#C17B5C',
  'elegant',
  false
),
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Dinner Party Favorites',
  'Impressive dishes that wow your guests. Elegant recipes for special occasions.',
  'Isabella Fontaine',
  '#2C3E21',
  'elegant',
  false
)
ON CONFLICT (id) DO NOTHING;

-- Link recipes to cookbooks in the cookbook_recipes table (safe - won't create duplicates)
INSERT INTO cookbook_recipes (cookbook_id, recipe_id)
VALUES
-- Weeknight Winners
('550e8400-e29b-41d4-a716-446655440001', 'recipe_001_carbonara'),
('550e8400-e29b-41d4-a716-446655440001', 'recipe_006_quick_stir_fry'),
('550e8400-e29b-41d4-a716-446655440001', 'recipe_008_banana_pancakes'),

-- Ultimate Comfort Food
('550e8400-e29b-41d4-a716-446655440002', 'recipe_001_carbonara'),
('550e8400-e29b-41d4-a716-446655440002', 'recipe_003_tomato_soup'),
('550e8400-e29b-41d4-a716-446655440002', 'recipe_007_beef_stew'),
('550e8400-e29b-41d4-a716-446655440002', 'recipe_008_banana_pancakes'),

-- Fresh & Healthy
('550e8400-e29b-41d4-a716-446655440003', 'recipe_002_coconut_curry'),
('550e8400-e29b-41d4-a716-446655440003', 'recipe_006_quick_stir_fry'),

-- Around the World
('550e8400-e29b-41d4-a716-446655440004', 'recipe_001_carbonara'),
('550e8400-e29b-41d4-a716-446655440004', 'recipe_002_coconut_curry'),
('550e8400-e29b-41d4-a716-446655440004', 'recipe_004_jerk_chicken'),

-- Dinner Party Favorites
('550e8400-e29b-41d4-a716-446655440005', 'recipe_004_jerk_chicken'),
('550e8400-e29b-41d4-a716-446655440005', 'recipe_005_mushroom_risotto'),
('550e8400-e29b-41d4-a716-446655440005', 'recipe_007_beef_stew')
ON CONFLICT (cookbook_id, recipe_id) DO NOTHING;