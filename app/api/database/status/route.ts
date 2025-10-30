import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // Get counts from database
    const { count: recipeCount } = await supabase
      .from("recipes")
      .select("*", { count: "exact", head: true });

    const { count: cookbookCount } = await supabase
      .from("cookbooks")
      .select("*", { count: "exact", head: true });

    const { count: linkCount } = await supabase
      .from("cookbook_recipes")
      .select("*", { count: "exact", head: true });

    // Get sample data to verify it's coming from database
    const { data: recentRecipes } = await supabase
      .from("recipes")
      .select("id, title, created_at")
      .order("created_at", { ascending: false })
      .limit(3);

    const { data: recentCookbooks } = await supabase
      .from("cookbooks")
      .select("id, title, author, cover_color, created_at")
      .order("created_at", { ascending: false })
      .limit(3);

    return NextResponse.json({
      success: true,
      database_status: {
        total_recipes: recipeCount || 0,
        total_cookbooks: cookbookCount || 0,
        total_cookbook_links: linkCount || 0,
        is_empty: (recipeCount || 0) === 0 && (cookbookCount || 0) === 0,
      },
      sample_data: {
        recent_recipes: recentRecipes || [],
        recent_cookbooks: recentCookbooks || [],
      },
      instructions: {
        no_hardcoded_data:
          "All data is now pulled directly from the Supabase database",
        to_seed_database:
          "Run the SQL from database/seed-data.sql in your Supabase SQL Editor",
        api_endpoints: {
          recipes: "/api/recipes",
          cookbooks: "/api/cookbooks",
          individual_cookbook: "/api/cookbooks/[id]",
          database_status: "/api/database/status",
        },
      },
    });
  } catch (error) {
    console.error("Database status check error:", error);
    return NextResponse.json(
      { error: "Failed to check database status" },
      { status: 500 }
    );
  }
}
