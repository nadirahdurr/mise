import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const recipe = await request.json();

    // Transform the recipe data to match our database schema
    const recipeData = {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      prep_time: recipe.prepTime,
      cook_time: recipe.cookTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      image_url: recipe.image,
      cuisine_tags: recipe.cuisine || [],
      tips: recipe.tips,
    };

    const { data, error } = await supabase
      .from("recipes")
      .insert([recipeData])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to save recipe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, recipe: data[0] });
  } catch (error) {
    console.error("Save recipe error:", error);
    return NextResponse.json(
      { error: "Failed to save recipe" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    const { data, error } = await supabase
      .from("recipes")
      .select("id, title, description, prep_time, cook_time, servings, difficulty, image_url, cuisine_tags, created_at")
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch recipes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipes: data });
  } catch (error) {
    console.error("Fetch recipes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
