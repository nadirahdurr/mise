import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Database setup only available in development" },
      { status: 403 }
    );
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase credentials" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "🚨 Manual Database Setup Required",
      instructions: [
        "1. Go to your Supabase SQL Editor",
        "2. Copy the contents of database/schema.sql",
        "3. Paste and run the SQL",
        "4. Optionally run database/seed-data.sql for sample data",
      ],
      links: {
        dashboard: `${supabaseUrl.replace(
          ".supabase.co",
          ""
        )}.supabase.co/dashboard`,
        sqlEditor: `${supabaseUrl.replace(
          "https://",
          "https://supabase.com/dashboard/project/"
        )}/sql`,
      },
      files: {
        schema: "database/schema.sql",
        sampleData: "database/seed-data.sql",
      },
      error: "Tables not found - run schema.sql first!",
    });
  } catch (error) {
    console.error("Setup check error:", error);
    return NextResponse.json(
      { error: "Failed to check database setup" },
      { status: 500 }
    );
  }
}
