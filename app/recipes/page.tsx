"use client";

import React, { useState, useEffect } from "react";
import { Clock, Users, Search, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import Sidebar from "@/components/Sidebar";
import { Recipe } from "@/lib/supabase";
import Link from "next/link";

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("/api/recipes");
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched recipes:", data.recipes?.length || 0, "recipes");
        setRecipes(data.recipes || []);
      } else {
        console.error("Failed to fetch recipes:", response.status);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.cuisine_tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const handleDeleteRecipe = (deletedRecipeId: string) => {
    setRecipes(recipes.filter((recipe) => recipe.id !== deletedRecipeId));
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-spectral text-2xl text-text-charcoal mb-4">
              Your Recipes
            </h1>

            {/* Search */}
            <div className="relative max-w-md">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-helper-text"
                size={16}
              />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mise-input pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-olive-oil-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-helper-text text-body mb-4">
                {searchTerm
                  ? "No recipes found matching your search."
                  : "No recipes saved yet."}
              </p>
              <Link href="/" className="mise-button-primary">
                Create Your First Recipe
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onDelete={handleDeleteRecipe}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function RecipeCard({
  recipe,
  onDelete,
}: {
  recipe: Recipe;
  onDelete: (id: string) => void;
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/recipes/${recipe.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete recipe");
      }

      toast.success(`"${recipe.title}" deleted successfully`);
      onDelete(recipe.id);
    } catch (error) {
      console.error("Delete recipe error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to delete recipe: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <div className="mise-card hover:shadow-lg transition-shadow duration-200 group relative">
        {/* Delete button */}
        <button
          onClick={handleDeleteClick}
          className="absolute top-3 right-3 z-10 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
          title="Delete recipe"
        >
          <Trash2 size={12} />
        </button>

        <Link href={`/recipes/${recipe.id}`} className="block">
          {recipe.image_url && (
            <div className="aspect-video bg-butcher-paper rounded-mise overflow-hidden mb-4">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-spectral text-lg text-text-charcoal line-clamp-2">
              {recipe.title}
            </h3>

            {recipe.description && (
              <p className="text-helper-text text-sm line-clamp-2">
                {recipe.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-helper-text">
              <div className="flex items-center gap-1">
                <Clock size={12} />
                <span>
                  {recipe.prep_time} + {recipe.cook_time}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>{recipe.servings} servings</span>
              </div>
            </div>

            {recipe.cuisine_tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {recipe.cuisine_tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-olive-oil-gold/10 text-olive-oil-gold text-xs font-medium rounded"
                  >
                    {tag}
                  </span>
                ))}
                {recipe.cuisine_tags.length > 3 && (
                  <span className="text-xs text-helper-text">
                    +{recipe.cuisine_tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="mise-card w-full max-w-md">
            <h3 className="font-spectral text-lg text-text-charcoal mb-4">
              Delete Recipe
            </h3>
            <p className="text-helper-text text-sm mb-6">
              Are you sure you want to delete <strong>"{recipe.title}"</strong>?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="mise-button-secondary flex-1 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-mise font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 flex-1"
              >
                {isDeleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
