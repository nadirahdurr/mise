import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { cookbookId, recipeId } = await request.json();

    if (!cookbookId || !recipeId) {
      return NextResponse.json(
        { error: "Cookbook ID and Recipe ID are required" },
        { status: 400 }
      );
    }

    // Check if recipe is already in cookbook
    const { data: existing, error: checkError } = await supabase
      .from("cookbook_recipes")
      .select("*")
      .eq("cookbook_id", cookbookId)
      .eq("recipe_id", recipeId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Recipe is already in this cookbook" },
        { status: 409 }
      );
    }

    // Add recipe to cookbook
    const { data, error } = await supabase
      .from("cookbook_recipes")
      .insert([
        {
          cookbook_id: cookbookId,
          recipe_id: recipeId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to add recipe to cookbook" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Add recipe to cookbook error:", error);
    return NextResponse.json(
      { error: "Failed to add recipe to cookbook" },
      { status: 500 }
    );
  }
}
