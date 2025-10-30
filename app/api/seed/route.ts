import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    // This is a development-only endpoint
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Seeding is only available in development" },
        { status: 403 }
      );
    }

    // Check if data already exists
    const { data: existingRecipes } = await supabase
      .from("recipes")
      .select("id")
      .limit(1);

    const { data: existingCookbooks } = await supabase
      .from("cookbooks")
      .select("id")
      .limit(1);

    if (existingRecipes && existingRecipes.length > 0) {
      return NextResponse.json({
        success: false,
        message:
          "Database already contains recipes. Use /api/seed/reset to clear first.",
      });
    }

    return NextResponse.json({
      success: false,
      message:
        "Please run the SQL file database/seed-data.sql directly in your Supabase SQL Editor to seed the database with sample data.",
      instructions: [
        "1. Open your Supabase dashboard",
        "2. Go to SQL Editor",
        "3. Copy and paste the contents of database/seed-data.sql",
        "4. Click 'Run' to execute",
        "5. This will add 8 sample recipes and 5 sample cookbooks",
      ],
    });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: "Failed to check database status" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // This is a development-only endpoint
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Database reset is only available in development" },
        { status: 403 }
      );
    }

    // Clear cookbook_recipes first (foreign key constraints)
    await supabase
      .from("cookbook_recipes")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    // Clear cookbooks
    await supabase
      .from("cookbooks")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    // Clear recipes
    await supabase.from("recipes").delete().neq("id", "");

    return NextResponse.json({
      success: true,
      message:
        "Database cleared successfully. You can now run database/seed-data.sql to add fresh sample data.",
    });
  } catch (error) {
    console.error("Database reset error:", error);
    return NextResponse.json(
      { error: "Failed to reset database" },
      { status: 500 }
    );
  }
}
