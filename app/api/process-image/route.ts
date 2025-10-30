import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Use OpenAI Vision to analyze the image
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are analyzing a photo of ingredients for the Mise cooking app. 

Look at this image and identify all the ingredients you can see. Focus on:
- Fresh ingredients (vegetables, fruits, herbs)
- Pantry items (cans, boxes, bottles)
- Proteins (meat, fish, tofu, etc.)
- Any other cooking ingredients

Return a JSON array of ingredient names, being specific but practical for cooking. For example:
- "Red bell pepper" not just "pepper"
- "Yellow onion" not just "onion" 
- "Canned diced tomatoes" not just "tomatoes"

Format: {"ingredients": ["ingredient1", "ingredient2", ...]}

Only return the JSON, no other text.`,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const resultText = response.choices[0]?.message?.content;
    if (!resultText) {
      throw new Error("No ingredients detected");
    }

    let result;
    try {
      result = JSON.parse(resultText);
    } catch (parseError) {
      console.error("Failed to parse ingredients JSON:", parseError);
      throw new Error("Invalid response format");
    }

    return NextResponse.json({
      ingredients: result.ingredients || [],
    });
  } catch (error) {
    console.error("Image processing error:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
