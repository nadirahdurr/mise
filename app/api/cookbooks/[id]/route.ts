import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Fetch cookbook with its recipes
    const { data: cookbook, error: cookbookError } = await supabase
      .from("cookbooks")
      .select(
        `
        *,
        cookbook_recipes(
          recipe_id,
          recipes(*)
        )
      `
      )
      .eq("id", id)
      .single();

    if (cookbookError) {
      console.error("Database error:", cookbookError);
      return NextResponse.json(
        { error: "Cookbook not found" },
        { status: 404 }
      );
    }

    // Transform the data to include recipes directly
    const cookbookWithRecipes = {
      ...cookbook,
      recipes: cookbook.cookbook_recipes?.map((cr: any) => cr.recipes) || [],
      cookbook_recipes: undefined, // Remove the join data
    };

    return NextResponse.json({ cookbook: cookbookWithRecipes });
  } catch (error) {
    console.error("Fetch cookbook error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cookbook" },
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

    const { error } = await supabase.from("cookbooks").delete().eq("id", id);

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to delete cookbook" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete cookbook error:", error);
    return NextResponse.json(
      { error: "Failed to delete cookbook" },
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
    const {
      title,
      description,
      author,
      cover_photo_url,
      cover_color,
      cover_style,
    } = await request.json();

    if (!title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const updateData = {
      title: title.trim(),
      description: description?.trim() || null,
      author: author?.trim() || "Mise Chef",
      cover_photo_url: cover_photo_url || null,
      cover_color: cover_color || "#5F6B3C",
      cover_style: cover_style || "classic",
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("cookbooks")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update cookbook" },
        { status: 500 }
      );
    }

    return NextResponse.json({ cookbook: data });
  } catch (error) {
    console.error("Update cookbook error:", error);
    return NextResponse.json(
      { error: "Failed to update cookbook" },
      { status: 500 }
    );
  }
}
