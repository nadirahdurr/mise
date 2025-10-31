import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database Types
export interface Recipe {
  id: string;
  title: string;
  description: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  image_url?: string;
  cuisine_tags: string[];
  tips?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
}

export interface Cookbook {
  id: string;
  title: string;
  description?: string;
  created_at: string;
  updated_at: string;
  user_id?: string;
  is_public: boolean;
}

export interface CookbookRecipe {
  id: string;
  cookbook_id: string;
  recipe_id: string;
  added_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
  updated_at: string;
}
