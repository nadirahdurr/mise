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
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = parseInt(searchParams.get("offset") || "0");
    const search = searchParams.get("search") || "";

    // Base query
    let query = supabase
      .from("recipes")
      .select(
        "id, title, description, prep_time, cook_time, servings, difficulty, image_url, cuisine_tags, created_at",
        { count: "exact" }
      );

    // Add search filter if provided
    if (search.trim()) {
      const searchTerm = `%${search.toLowerCase()}%`;
      query = query.or(
        `title.ilike.${searchTerm},description.ilike.${searchTerm},cuisine_tags.cs.{${search}}`
      );
    }

    // Apply pagination and ordering
    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch recipes" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      recipes: data,
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    });
  } catch (error) {
    console.error("Fetch recipes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
