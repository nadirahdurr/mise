"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Settings,
  Download,
  ChevronLeft,
  ChevronRight,
  Edit3,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import CookbookCustomizationModal from "@/components/CookbookCustomizationModal";

interface Recipe {
  id: string;
  title: string;
  description: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  image_url?: string;
  cuisine_tags: string[];
  tips?: string;
}

interface Cookbook {
  id: string;
  title: string;
  description: string;
  author: string;
  cover_color: string;
  cover_photo_url?: string;
  cover_style: string;
  created_at: string;
  recipes?: Recipe[];
}

export default function CookbookPage() {
  const params = useParams();
  const [cookbook, setCookbook] = useState<Cookbook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCookbook(params.id as string);
    }
  }, [params.id]);

  const fetchCookbook = async (id: string) => {
    try {
      const response = await fetch(`/api/cookbooks/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCookbook(data.cookbook);
      } else {
        toast.error("Failed to load cookbook");
      }
    } catch (error) {
      console.error("Failed to fetch cookbook:", error);
      toast.error("Failed to load cookbook");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (!cookbook) return;

    const loadingToast = toast.loading("Generating PDF...");
    try {
      const response = await fetch(`/api/cookbooks/${cookbook.id}/export`, {
        method: "POST",
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;

        // Determine file extension based on content type
        if (contentType?.includes("application/pdf")) {
          a.download = `${cookbook.title}.pdf`;
          toast.success("PDF exported successfully!");
        } else {
          a.download = `${cookbook.title}-printable.html`;
          toast.success(
            "Printable HTML exported! You can print this to PDF from your browser."
          );
        }

        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error("Export failed");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export cookbook");
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const handleUpdateCookbook = async (cookbookData: Partial<Cookbook>) => {
    if (!cookbook) return;

    try {
      const response = await fetch(`/api/cookbooks/${cookbook.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cookbookData),
      });

      if (response.ok) {
        const data = await response.json();
        setCookbook(data.cookbook);
        setShowCustomizationModal(false);
        toast.success("Cookbook updated!");
      } else {
        toast.error("Failed to update cookbook");
      }
    } catch (error) {
      toast.error("Failed to update cookbook");
      console.error("Update cookbook error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-butcher-paper to-sage/10">
        <div className="w-8 h-8 border-2 border-olive-oil-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!cookbook) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-butcher-paper to-sage/10">
        <div className="text-center">
          <h2 className="font-spectral text-xl text-text-charcoal mb-2">
            Cookbook not found
          </h2>
          <Link href="/cookbooks" className="mise-button-primary">
            Back to Cookbooks
          </Link>
        </div>
      </div>
    );
  }

  const recipes = cookbook.recipes || [];
  const totalPages = Math.max(1, recipes.length + 1); // +1 for cover page

  const getCurrentContent = () => {
    if (currentPage === 0) {
      // Cover page
      return "cover";
    } else {
      // Recipe pages
      const recipeIndex = currentPage - 1;
      return recipes[recipeIndex] || null;
    }
  };

  const content = getCurrentContent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-butcher-paper to-sage/10 p-4">
      {/* Navigation Bar */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between">
        <Link
          href="/cookbooks"
          className="inline-flex items-center gap-2 text-text-charcoal hover:text-olive-oil-gold transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Cookbooks
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCustomizationModal(true)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Customize Cookbook"
          >
            <Settings size={20} className="text-text-charcoal" />
          </button>
          <button
            onClick={handleExportPDF}
            className="mise-button-secondary flex items-center gap-2"
          >
            <Download size={16} />
            Export PDF
          </button>
        </div>
      </div>

      {/* Book Container */}
      <div className="max-w-4xl mx-auto">
        <div className="book-wrapper relative">
          {/* Book Shadow */}
          <div className="absolute -inset-4 bg-black/10 rounded-lg blur-lg transform rotate-1" />

          {/* Main Book */}
          <div
            className="relative bg-bone rounded-lg shadow-2xl overflow-hidden book-page"
            style={{
              aspectRatio: "8.5/11",
              minHeight: "600px",
              backgroundImage:
                cookbook.cover_photo_url && currentPage === 0
                  ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${cookbook.cover_photo_url})`
                  : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {content === "cover" ? (
              /* Cover Page */
              <div
                className="h-full flex flex-col justify-between p-12 text-bone relative"
                style={{
                  backgroundColor: cookbook.cover_photo_url
                    ? "transparent"
                    : cookbook.cover_color,
                }}
              >
                {/* Decorative border */}
                <div className="absolute inset-6 border-2 border-bone/30 rounded pointer-events-none" />

                {/* Title Section */}
                <div className="relative z-10 text-center">
                  <div className="border-b border-bone/30 pb-4 mb-8">
                    <h1 className="font-spectral text-4xl md:text-5xl font-bold leading-tight">
                      {cookbook.title}
                    </h1>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="relative z-10 border-t border-bone/30 pt-6">
                  <div className="text-center text-sm space-y-2">
                    <div>Curated by {cookbook.author}</div>
                    <div>Designed by Mise</div>
                    <div className="text-xs opacity-75">
                      Illustrations by kitchen wisdom
                    </div>
                  </div>
                </div>

                {/* Recipe count indicator */}
                <div className="absolute bottom-12 right-12 text-right">
                  <div className="text-3xl font-spectral font-bold">
                    {recipes.length}
                  </div>
                  <div className="text-sm opacity-80">recipes</div>
                </div>
              </div>
            ) : content ? (
              /* Recipe Page */
              <div className="h-full p-8 flex flex-col">
                {/* Page Header */}
                <div className="border-b border-outline-gray/20 pb-4 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-spectral text-2xl text-text-charcoal mb-2">
                        {content.title}
                      </h2>
                      <p className="text-helper-text text-sm leading-relaxed">
                        {content.description}
                      </p>
                    </div>
                    <div className="text-right text-xs text-helper-text">
                      Page {currentPage} of {totalPages - 1}
                    </div>
                  </div>
                </div>

                {/* Recipe Content */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column - Ingredients */}
                  <div>
                    <h3 className="font-spectral text-lg text-text-charcoal mb-4 border-b border-olive-oil-gold/30 pb-2">
                      Ingredients
                    </h3>
                    <ul className="space-y-2">
                      {content.ingredients.map((ingredient, index) => (
                        <li
                          key={index}
                          className="text-sm text-text-charcoal flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 bg-olive-oil-gold rounded-full mt-2 flex-shrink-0" />
                          {ingredient}
                        </li>
                      ))}
                    </ul>

                    {/* Recipe Details */}
                    <div className="mt-6 p-4 bg-sage/10 rounded-lg">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-helper-text">Prep:</span>
                          <div className="font-medium">{content.prep_time}</div>
                        </div>
                        <div>
                          <span className="text-helper-text">Cook:</span>
                          <div className="font-medium">{content.cook_time}</div>
                        </div>
                        <div>
                          <span className="text-helper-text">Serves:</span>
                          <div className="font-medium">{content.servings}</div>
                        </div>
                        <div>
                          <span className="text-helper-text">Level:</span>
                          <div className="font-medium text-olive-oil-gold">
                            {content.difficulty}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Instructions */}
                  <div>
                    <h3 className="font-spectral text-lg text-text-charcoal mb-4 border-b border-olive-oil-gold/30 pb-2">
                      Instructions
                    </h3>
                    <ol className="space-y-3">
                      {content.instructions.map((instruction, index) => (
                        <li
                          key={index}
                          className="text-sm text-text-charcoal flex gap-3"
                        >
                          <span className="flex-shrink-0 w-6 h-6 bg-olive-oil-gold text-bone rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                          <span className="leading-relaxed">{instruction}</span>
                        </li>
                      ))}
                    </ol>

                    {/* Tips */}
                    {content.tips && (
                      <div className="mt-6 p-4 bg-olive-oil-gold/10 rounded-lg">
                        <h4 className="font-medium text-text-charcoal mb-2 text-sm">
                          Chef's Tip
                        </h4>
                        <p className="text-xs text-helper-text leading-relaxed">
                          {content.tips}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Empty page */
              <div className="h-full flex items-center justify-center">
                <p className="text-helper-text">End of cookbook</p>
              </div>
            )}
          </div>
        </div>

        {/* Page Navigation */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
            disabled={currentPage === 0}
            className="p-2 rounded-lg border border-outline-gray disabled:opacity-50 hover:border-olive-oil-gold transition-colors"
          >
            <ChevronLeft size={20} />
          </button>

          <span className="text-sm text-helper-text px-4">
            {currentPage + 1} / {totalPages}
          </span>

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
            }
            disabled={currentPage >= totalPages - 1}
            className="p-2 rounded-lg border border-outline-gray disabled:opacity-50 hover:border-olive-oil-gold transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Cookbook Customization Modal */}
      <CookbookCustomizationModal
        isOpen={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        cookbook={cookbook || {}}
        onSave={handleUpdateCookbook}
        isEditing={true}
      />

      <style jsx>{`
        .book-wrapper {
          filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.1));
        }

        .book-page {
          background-texture: paper;
        }

        .book-page::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 20% 20%,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 50%
          );
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
