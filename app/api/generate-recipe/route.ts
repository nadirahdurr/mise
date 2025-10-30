import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Function to compress image and ensure it's under 1MB base64 limit
async function compressImageToBase64(
  imageBuffer: Buffer,
  mimeType: string
): Promise<string> {
  const maxSizeBytes = 800 * 1024; // Target 800KB to leave room for base64 encoding overhead
  let quality = 85;
  let width = 1024;

  while (quality > 10 && width > 256) {
    try {
      const compressedBuffer = await sharp(imageBuffer)
        .resize(width, width, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality })
        .toBuffer();

      // Check if compressed size is acceptable
      if (compressedBuffer.length <= maxSizeBytes) {
        const base64 = compressedBuffer.toString("base64");
        return `data:image/jpeg;base64,${base64}`;
      }

      // Reduce quality or size for next iteration
      if (quality > 50) {
        quality -= 15;
      } else {
        width = Math.floor(width * 0.8);
        quality = 85; // Reset quality when reducing size
      }
    } catch (error) {
      console.error("Error compressing image:", error);
      throw new Error("Failed to compress image");
    }
  }

  throw new Error("Unable to compress image below size limit");
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type");
    let ingredients,
      vibes,
      letMiseDecide,
      image = null;

    // Handle both JSON and FormData requests
    if (contentType?.includes("multipart/form-data")) {
      // Form data with potential image
      const formData = await request.formData();
      ingredients = JSON.parse((formData.get("ingredients") as string) || "[]");
      vibes = JSON.parse((formData.get("vibes") as string) || "[]");
      letMiseDecide = formData.get("letMiseDecide") === "true";
      image = formData.get("image") as File | null;
    } else {
      // JSON request (backward compatibility)
      const body = await request.json();
      ingredients = body.ingredients;
      vibes = body.vibes;
      letMiseDecide = body.letMiseDecide;
    }

    if ((!ingredients || ingredients.length === 0) && !image) {
      return NextResponse.json(
        { error: "Please provide ingredients and/or upload an image" },
        { status: 400 }
      );
    }

    // Determine type_of_food based on vibes or let Mise decide
    let typeOfFood = "";
    if (!letMiseDecide && vibes && vibes.length > 0) {
      typeOfFood = vibes.join(" and ");
    } else {
      typeOfFood = image
        ? "chef's choice based on ingredients and image"
        : "chef's choice based on ingredients";
    }

    // Process image if provided
    let imageUrl = "";
    if (image) {
      try {
        console.log(
          `Processing image: ${image.name}, size: ${image.size} bytes, type: ${image.type}`
        );

        // Convert image to buffer for compression
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Compress image to ensure it's under the API limit
        imageUrl = await compressImageToBase64(buffer, image.type);

        console.log(
          `Image compressed successfully, base64 length: ${imageUrl.length} characters`
        );
      } catch (compressionError) {
        console.error("Image compression failed:", compressionError);
        throw new Error(
          `Failed to process image: ${
            compressionError instanceof Error
              ? compressionError.message
              : "Unknown error"
          }`
        );
      }
    }

    // Create prompt configuration
    const promptConfig = {
      id: process.env.OPENAI_PROMPT_ID!,
      version: process.env.OPENAI_PROMPT_VERSION!,
      variables: {
        ingredients:
          ingredients && ingredients.length > 0 ? ingredients.join(", ") : "",
        type_of_food: typeOfFood,
        ai_decide: letMiseDecide.toString(),
        image_url: imageUrl,
      },
    };

    // Use OpenAI custom prompt for recipe generation
    console.log("Calling OpenAI with prompt config:", promptConfig);

    const response = await openai.responses.create({
      prompt: promptConfig,
    });

    console.log("OpenAI response received:", JSON.stringify(response, null, 2));

    // Extract recipe content from custom prompt response
    let recipeText = "";

    // The recipe content is in the output_text field
    if ((response as any).output_text) {
      recipeText = (response as any).output_text;
      console.log("Found recipe in output_text field");
    }
    // Fallback: try to extract from output array structure
    else if (
      response.output &&
      Array.isArray(response.output) &&
      response.output.length > 0
    ) {
      // Look for message type with output_text content
      const messageOutput = response.output.find(
        (item: any) => item.type === "message"
      );
      if (
        messageOutput &&
        (messageOutput as any).content &&
        Array.isArray((messageOutput as any).content)
      ) {
        const textItem = (messageOutput as any).content.find(
          (item: any) => item.type === "output_text"
        );
        if (textItem && textItem.text) {
          recipeText = textItem.text;
          console.log("Found recipe in output array structure");
        }
      }
    }

    if (!recipeText) {
      console.error(
        "Full response structure:",
        JSON.stringify(response, null, 2)
      );
      console.error("Available keys:", Object.keys(response || {}));
      throw new Error("No recipe content found in response");
    }

    console.log("Extracted recipe text:", recipeText);

    let recipeData;
    try {
      const parsedResponse = JSON.parse(recipeText);
      console.log("Parsed response structure:", parsedResponse);

      // Extract the nested recipe data
      recipeData = parsedResponse.recipe || parsedResponse;

      if (!recipeData.title) {
        console.error("No title found in recipe data:", recipeData);
        throw new Error("Invalid recipe structure - missing title");
      }
    } catch (parseError) {
      console.error("Failed to parse recipe JSON:", parseError);
      console.error("Raw response:", recipeText);
      throw new Error("Invalid recipe format generated");
    }

    // Generate an image for the recipe using the AI-provided image_prompt
    let generatedImageUrl = null;
    if (recipeData.image_prompt) {
      try {
        console.log(
          "Generating recipe image with prompt:",
          recipeData.image_prompt
        );

        const imageResponse = await openai.images.generate({
          model: process.env.OPENAI_IMAGE_MODEL!,
          prompt: recipeData.image_prompt,
          n: 1,
          size: "1536x1024",
        });

        if (imageResponse.data && imageResponse.data[0]) {
          const imageData = imageResponse.data[0];

          // Handle both URL and base64 formats
          if (typeof imageData === "string") {
            // If it's a string, it's likely a URL
            generatedImageUrl = imageData;
            console.log("Received image URL from gpt-image-1");
          } else if (imageData.url) {
            // If it's an object with url property
            generatedImageUrl = imageData.url;
            console.log("Received image URL from gpt-image-1 object");
          } else if (imageData.b64_json) {
            // If it's an object with b64_json property, convert to data URL
            generatedImageUrl = `data:image/png;base64,${imageData.b64_json}`;
            console.log(
              "Received base64 image from gpt-image-1, converted to data URL"
            );
          }
        }
      } catch (imageError) {
        console.error("Failed to generate recipe image:", imageError);
        // Continue without image - not a critical failure
      }
    }

    // Validate and provide defaults for required fields
    const validatedRecipeData = {
      title: recipeData.title || "Untitled Recipe",
      description: recipeData.description || "A delicious recipe",
      prep_time: recipeData.prep_time || 15, // Default 15 minutes if not provided
      cook_time: recipeData.cook_time || 30, // Default 30 minutes if not provided
      servings: recipeData.servings || 4, // Default 4 servings if not provided
      difficulty: recipeData.difficulty || "Medium", // Default Medium difficulty
      ingredients: Array.isArray(recipeData.ingredients)
        ? recipeData.ingredients
        : [],
      instructions: Array.isArray(recipeData.instructions)
        ? recipeData.instructions
        : [],
      cuisine_tags: Array.isArray(recipeData.cuisine_tags)
        ? recipeData.cuisine_tags
        : [],
      tips: recipeData.tips || "Enjoy your meal!",
    };

    console.log(
      "Validated recipe data before database save:",
      validatedRecipeData
    );

    // Save recipe to database
    try {
      const { data: savedRecipe, error } = await supabase
        .from("recipes")
        .insert([
          {
            title: validatedRecipeData.title,
            description: validatedRecipeData.description,
            prep_time: validatedRecipeData.prep_time,
            cook_time: validatedRecipeData.cook_time,
            servings: validatedRecipeData.servings,
            difficulty: validatedRecipeData.difficulty,
            ingredients: validatedRecipeData.ingredients,
            instructions: validatedRecipeData.instructions,
            image_url: generatedImageUrl,
            cuisine_tags: validatedRecipeData.cuisine_tags,
            tips: validatedRecipeData.tips,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Database save error:", error);
        // Still return the recipe even if database save fails
        const tempRecipe = {
          ...validatedRecipeData,
          id: `temp_${Date.now()}`,
          image_url: generatedImageUrl,
          created_at: new Date().toISOString(),
        };
        return NextResponse.json({
          success: true,
          recipe: tempRecipe,
          saved_to_database: false,
        });
      }

      // Return the saved recipe with database ID
      return NextResponse.json({
        success: true,
        recipe: {
          ...validatedRecipeData,
          id: savedRecipe.id,
          image_url: generatedImageUrl,
          created_at: savedRecipe.created_at,
        },
        saved_to_database: true,
      });
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      // Still return the recipe even if database save fails
      const tempRecipe = {
        ...validatedRecipeData,
        id: `temp_${Date.now()}`,
        image_url: generatedImageUrl,
        created_at: new Date().toISOString(),
      };
      return NextResponse.json({
        success: true,
        recipe: tempRecipe,
        saved_to_database: false,
      });
    }
  } catch (error) {
    console.error("Recipe generation error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate recipe",
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
