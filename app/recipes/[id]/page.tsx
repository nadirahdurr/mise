import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Users, BookOpen, Save } from "lucide-react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import SaveRecipeButton from "@/components/SaveRecipeButton";
import DeleteRecipeButton from "@/components/DeleteRecipeButton";

interface Recipe {
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
}

async function getRecipe(id: string): Promise<Recipe | null> {
  const supabase = await createClient();

  const { data: recipe, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !recipe) {
    return null;
  }

  return recipe;
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const recipe = await getRecipe(id);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/recipes"
              className="mise-button-secondary flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Recipes
            </Link>

            <div className="flex gap-3">
              <DeleteRecipeButton
                recipeId={recipe.id}
                recipeName={recipe.title}
              />
              <SaveRecipeButton recipe={recipe} />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Recipe Info */}
            <div className="space-y-6">
              {/* Recipe Image */}
              {recipe.image_url && (
                <div className="aspect-video bg-butcher-paper rounded-mise overflow-hidden">
                  <img
                    src={recipe.image_url}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Recipe Header */}
              <div>
                <h1 className="font-spectral text-3xl text-text-charcoal mb-3">
                  {recipe.title}
                </h1>
                <p className="text-helper-text text-body leading-relaxed">
                  {recipe.description}
                </p>
              </div>

              {/* Recipe Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-helper-text">
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  <span>
                    {recipe.prep_time} prep • {recipe.cook_time} cook
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users size={16} />
                  <span>{recipe.servings} servings</span>
                </div>
                <div className="px-3 py-1 bg-herb-green/10 rounded text-herb-green text-xs font-medium">
                  {recipe.difficulty}
                </div>
              </div>

              {/* Cuisine Tags */}
              <div className="flex flex-wrap gap-2">
                {recipe.cuisine_tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-olive-oil-gold/10 text-olive-oil-gold text-sm font-medium rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Tips */}
              {recipe.tips && (
                <div className="mise-card bg-egg-yolk/5 border-egg-yolk/20">
                  <h3 className="font-spectral text-lg text-text-charcoal mb-2">
                    Chef's Tip
                  </h3>
                  <p className="text-text-charcoal text-sm leading-relaxed">
                    {recipe.tips}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Instructions */}
            <div className="space-y-6">
              {/* Ingredients */}
              <div>
                <h2 className="font-spectral text-xl text-text-charcoal mb-4">
                  Ingredients
                </h2>
                <ul className="space-y-3">
                  {recipe.ingredients?.map((ingredient, index) => (
                    <li
                      key={index}
                      className="text-body text-text-charcoal flex items-start gap-3"
                    >
                      <span className="w-2 h-2 bg-olive-oil-gold rounded-full mt-2 flex-shrink-0" />
                      {ingredient}
                    </li>
                  )) || (
                    <li className="text-helper-text">
                      No ingredients available
                    </li>
                  )}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h2 className="font-spectral text-xl text-text-charcoal mb-4">
                  Instructions
                </h2>
                <ol className="space-y-4">
                  {recipe.instructions?.map((instruction, index) => (
                    <li
                      key={index}
                      className="text-body text-text-charcoal flex gap-3"
                    >
                      <span className="w-7 h-7 bg-olive-oil-gold text-cast-iron text-sm font-medium rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{instruction}</span>
                    </li>
                  )) || (
                    <li className="text-helper-text">
                      No instructions available
                    </li>
                  )}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
