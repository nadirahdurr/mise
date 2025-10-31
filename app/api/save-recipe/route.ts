import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const recipe = await request.json();

    const { data, error } = await supabase
      .from("recipes")
      .insert([
        {
          title: recipe.title,
          description: recipe.description,
          prep_time: recipe.prepTime,
          cook_time: recipe.cookTime,
          servings: recipe.servings,
          difficulty: recipe.difficulty,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          image_url: recipe.image,
          cuisine_tags: recipe.cuisine,
          tips: recipe.tips,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to save recipe to database" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Save recipe error:", error);
    return NextResponse.json(
      { error: "Failed to save recipe" },
      { status: 500 }
    );
  }
}
