import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const { data: recipe, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !recipe) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Fetch recipe error:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipe" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // First, remove recipe from any cookbooks (cookbook_recipes junction table)
    const { error: junctionError } = await supabase
      .from("cookbook_recipes")
      .delete()
      .eq("recipe_id", id);

    if (junctionError) {
      console.error("Junction table delete error:", junctionError);
      // Continue with recipe deletion even if junction cleanup fails
    }

    // Delete the recipe
    const { error } = await supabase.from("recipes").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete recipe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete recipe error:", error);
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData = await request.json();

    // Validate required fields
    if (!updateData.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    // Clean and validate data
    const cleanData = {
      title: updateData.title.trim(),
      description: updateData.description?.trim() || null,
      prep_time: updateData.prep_time || 15,
      cook_time: updateData.cook_time || 30,
      servings: updateData.servings || 4,
      difficulty: updateData.difficulty || "Medium",
      ingredients: Array.isArray(updateData.ingredients)
        ? updateData.ingredients
        : [],
      instructions: Array.isArray(updateData.instructions)
        ? updateData.instructions
        : [],
      cuisine_tags: Array.isArray(updateData.cuisine_tags)
        ? updateData.cuisine_tags
        : [],
      tips: updateData.tips || null,
      image_url: updateData.image_url || null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("recipes")
      .update(cleanData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update recipe" },
        { status: 500 }
      );
    }

    return NextResponse.json({ recipe: data });
  } catch (error) {
    console.error("Update recipe error:", error);
    return NextResponse.json(
      { error: "Failed to update recipe" },
      { status: 500 }
    );
  }
}
