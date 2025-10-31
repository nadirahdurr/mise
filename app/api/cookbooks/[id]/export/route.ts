import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import puppeteer from "puppeteer";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(
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
    };

    // Generate PDF content
    const pdfHTML = generatePDFHTML(cookbookWithRecipes);

    try {
      // Generate actual PDF using Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
        ],
      });

      const page = await browser.newPage();

      // Set viewport to match A4 dimensions
      await page.setViewport({
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
        deviceScaleFactor: 1,
      });

      await page.setContent(pdfHTML, { waitUntil: "networkidle0" });

      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        preferCSSPageSize: false, // Let us control sizing
        displayHeaderFooter: false,
        margin: {
          top: "0",
          right: "0",
          bottom: "0",
          left: "0",
        },
      });

      await browser.close();

      return new NextResponse(pdfBuffer as unknown as BodyInit, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${cookbook.title}.pdf"`,
        },
      });
    } catch (puppeteerError) {
      console.error("Puppeteer PDF generation failed:", puppeteerError);

      // Fallback: Return HTML that can be printed to PDF by the browser
      return new NextResponse(pdfHTML, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `inline; filename="${cookbook.title}-printable.html"`,
        },
      });
    }
  } catch (error) {
    console.error("Export cookbook error:", error);
    return NextResponse.json(
      { error: "Failed to export cookbook" },
      { status: 500 }
    );
  }
}

function generatePDFHTML(cookbook: any) {
  const recipes = cookbook.recipes || [];

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${cookbook.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Spectral:wght@300;400;600;700&family=Inter:wght@300;400;500&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            line-height: 1.6;
            color: #2C3E21;
            background: #EFECE4;
            margin: 0;
            padding: 0;
        }
        
        .cover-page {
            page-break-after: always;
            width: 8.5in;
            height: 11in;
            margin: 0;
            padding: 0;
            position: relative;
            color: #EFECE4;
            text-align: center;
        }
        
        .cover-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            background: ${cookbook.cover_color || "#5F6B3C"};
            z-index: -1;
        }
        
        .cover-content {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 1in;
            box-sizing: border-box;
        }
        
        .cover-title {
            font-family: 'Spectral', serif;
            font-size: 2.5rem;
            font-weight: 700;
            margin: 1rem 0;
            border-bottom: 2px solid rgba(239, 236, 228, 0.3);
            padding-bottom: 0.5rem;
        }
        
        .cover-author {
            font-size: 1rem;
            opacity: 0.9;
        }
        
        .recipe-page {
            page-break-before: always;
            padding: 0.75in;
            box-sizing: border-box;
            display: flex;
            flex-direction: column;
            min-height: 11in;
        }
        
        .recipe-title {
            font-family: 'Spectral', serif;
            font-size: 1.75rem;
            color: #2C3E21;
            margin-bottom: 0.5rem;
            border-bottom: 2px solid #C5A75A;
            padding-bottom: 0.25rem;
            flex-shrink: 0;
        }
        
        .recipe-description {
            color: #666;
            font-style: italic;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            flex-shrink: 0;
        }
        
        .recipe-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
            flex: 1;
        }
        
        .ingredients,
        .instructions {
            display: flex;
            flex-direction: column;
        }
        
        .ingredients h3,
        .instructions h3 {
            font-family: 'Spectral', serif;
            font-size: 1.1rem;
            color: #2C3E21;
            margin-bottom: 0.75rem;
            border-bottom: 1px solid #C5A75A;
            padding-bottom: 0.25rem;
            flex-shrink: 0;
        }
        
        .ingredients ul {
            list-style: none;
            padding: 0;
            margin: 0;
            flex: 1;
        }
        
        .ingredients li {
            margin-bottom: 0.3rem;
            padding-left: 1rem;
            position: relative;
            font-size: 0.85rem;
            line-height: 1.3;
            page-break-inside: avoid;
        }
        
        .ingredients li::before {
            content: '•';
            color: #C5A75A;
            position: absolute;
            left: 0;
        }
        
        .instructions ol {
            padding-left: 0;
            margin: 0;
            counter-reset: step-counter;
            flex: 1;
        }
        
        .instructions li {
            counter-increment: step-counter;
            margin-bottom: 0.5rem;
            padding-left: 1.75rem;
            position: relative;
            font-size: 0.85rem;
            line-height: 1.3;
            page-break-inside: avoid;
        }
        
        .instructions li::before {
            content: counter(step-counter);
            position: absolute;
            left: 0;
            top: 0;
            background: #C5A75A;
            color: #EFECE4;
            width: 1.25rem;
            height: 1.25rem;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.7rem;
            font-weight: 500;
        }
        
        .recipe-details {
            background: rgba(197, 167, 90, 0.1);
            padding: 0.75rem;
            border-radius: 6px;
            margin-top: 0.75rem;
            flex-shrink: 0;
        }
        
        .recipe-details-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
        }
        
        .detail-item {
            text-align: center;
        }
        
        .detail-label {
            font-size: 0.7rem;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .detail-value {
            font-weight: 500;
            color: #2C3E21;
            font-size: 0.8rem;
        }
        
        .tips {
            background: rgba(95, 107, 60, 0.1);
            padding: 0.75rem;
            border-radius: 6px;
            margin-top: 0.75rem;
            border-left: 3px solid #5F6B3C;
            flex-shrink: 0;
        }
        
        .tips h4 {
            margin: 0 0 0.5rem 0;
            color: #5F6B3C;
            font-weight: 500;
            font-size: 0.9rem;
        }
        
        .tips p {
            margin: 0;
            font-size: 0.8rem;
            line-height: 1.3;
        }
        
        @media print {
            body { 
                background: white; 
                -webkit-print-color-adjust: exact;
                color-adjust: exact;
                margin: 0;
                padding: 0;
            }
            .cover-page { 
                page-break-inside: avoid; 
                page-break-after: always;
                width: 8.5in !important;
                height: 11in !important;
                margin: 0 !important;
                padding: 0 !important;
                position: relative;
            }
            .cover-background {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 100% !important;
                height: 100% !important;
            }
            .recipe-page {
                page-break-before: always;
                min-height: 11in;
            }
        }
        
        /* Ensure colors print properly */
        * {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
        }
        
        /* Full page coverage for cover */
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
        }
        
        /* Allow content to flow across pages */
        .ingredients ul,
        .instructions ol {
            page-break-inside: auto;
        }
        
        /* Ensure cover page extends to edges */
        @page:first {
            margin: 0;
            size: A4;
        }
    </style>
</head>
<body>
    <!-- Cover Page -->
    <div class="cover-page">
        <div class="cover-background"></div>
        <div class="cover-content">
            <div>
                <div style="border: 2px solid rgba(239, 236, 228, 0.3); padding: 2rem; border-radius: 8px;">
                    <h1 class="cover-title">${cookbook.title}</h1>
                    ${
                      cookbook.description
                        ? `<p style="font-size: 1.1rem; opacity: 0.9;">${cookbook.description}</p>`
                        : ""
                    }
                </div>
            </div>
            
            <div class="cover-author">
                <p>Curated by ${cookbook.author || "Mise Chef"}</p>
                <p>Designed by Mise</p>
                <p style="font-size: 0.9rem; opacity: 0.7;">Illustrations by kitchen wisdom</p>
            </div>
            
            <div style="position: absolute; bottom: 1in; right: 1in; text-align: right;">
                <div style="font-size: 2rem; font-family: 'Spectral', serif; font-weight: 700;">${
                  recipes.length
                }</div>
                <div style="font-size: 0.9rem; opacity: 0.8;">recipes</div>
            </div>
        </div>
    </div>

    ${recipes
      .map(
        (recipe: any) => `
    <!-- Recipe Page: ${recipe.title} -->
    <div class="recipe-page">
        <h2 class="recipe-title">${recipe.title}</h2>
        ${
          recipe.description
            ? `<p class="recipe-description">${recipe.description}</p>`
            : ""
        }
        
        <div class="recipe-grid">
            <div class="ingredients">
                <h3>Ingredients</h3>
                <ul>
                    ${recipe.ingredients
                      .map((ingredient: string) => `<li>${ingredient}</li>`)
                      .join("")}
                </ul>
                
                <div class="recipe-details">
                    <div class="recipe-details-grid">
                        <div class="detail-item">
                            <div class="detail-label">Prep Time</div>
                            <div class="detail-value">${recipe.prep_time}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Cook Time</div>
                            <div class="detail-value">${recipe.cook_time}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Servings</div>
                            <div class="detail-value">${recipe.servings}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Difficulty</div>
                            <div class="detail-value">${recipe.difficulty}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="instructions">
                <h3>Instructions</h3>
                <ol>
                    ${recipe.instructions
                      .map((instruction: string) => `<li>${instruction}</li>`)
                      .join("")}
                </ol>
                
                ${
                  recipe.tips
                    ? `
                <div class="tips">
                    <h4>Chef's Tip</h4>
                    <p>${recipe.tips}</p>
                </div>
                `
                    : ""
                }
            </div>
        </div>
    </div>
    `
      )
      .join("")}
</body>
</html>
  `.trim();
}
