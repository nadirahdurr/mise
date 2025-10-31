import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Get cookbooks with recipe count
    const { data, error } = await supabase
      .from("cookbooks")
      .select(
        `
        *,
        cookbook_recipes(count)
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to fetch cookbooks" },
        { status: 500 }
      );
    }

    // Transform the data to include recipe count
    const cookbooks = data.map((cookbook) => ({
      ...cookbook,
      recipe_count: cookbook.cookbook_recipes?.[0]?.count || 0,
      cookbook_recipes: undefined, // Remove the raw count data
    }));

    return NextResponse.json({ cookbooks });
  } catch (error) {
    console.error("Fetch cookbooks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cookbooks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const cookbookData = {
      title: title.trim(),
      description: description?.trim() || null,
      author: author?.trim() || "Mise Chef",
      cover_photo_url: cover_photo_url || null,
      cover_color: cover_color || "#5F6B3C",
      cover_style: cover_style || "classic",
      is_public: false,
    };

    const { data, error } = await supabase
      .from("cookbooks")
      .insert([cookbookData])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to create cookbook" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, cookbook: data[0] });
  } catch (error) {
    console.error("Create cookbook error:", error);
    return NextResponse.json(
      { error: "Failed to create cookbook" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const {
      id,
      title,
      description,
      author,
      cover_photo_url,
      cover_color,
      cover_style,
    } = await request.json();

    if (!id || !title?.trim()) {
      return NextResponse.json(
        { error: "ID and title are required" },
        { status: 400 }
      );
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
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to update cookbook" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, cookbook: data[0] });
  } catch (error) {
    console.error("Update cookbook error:", error);
    return NextResponse.json(
      { error: "Failed to update cookbook" },
      { status: 500 }
    );
  }
}
