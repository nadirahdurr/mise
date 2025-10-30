"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";

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
  recipe_count: number;
}

interface SaveRecipeButtonProps {
  recipe: Recipe;
}

export default function SaveRecipeButton({ recipe }: SaveRecipeButtonProps) {
  const [showCookbookModal, setShowCookbookModal] = useState(false);
  const [cookbooks, setCookbooks] = useState<Cookbook[]>([]);
  const [selectedCookbook, setSelectedCookbook] = useState<string>("");
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newCookbookName, setNewCookbookName] = useState("");
  const [newCookbookDescription, setNewCookbookDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showCookbookModal) {
      fetchCookbooks();
    }
  }, [showCookbookModal]);

  const fetchCookbooks = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/cookbooks");
      if (response.ok) {
        const data = await response.json();
        setCookbooks(data.cookbooks || []);
      }
    } catch (error) {
      console.error("Failed to fetch cookbooks:", error);
      toast.error("Failed to load cookbooks");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCookbook = () => {
    setShowCookbookModal(true);
  };

  const handleCreateNewCookbook = async () => {
    if (!newCookbookName.trim()) {
      toast.error("Please enter a cookbook name");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/cookbooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: newCookbookName,
          description: newCookbookDescription,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newCookbook = data.cookbook;

        // Add recipe to the new cookbook
        await addRecipeToCookbook(newCookbook.id);

        toast.success(`Recipe added to "${newCookbook.title}"!`);
        setShowCookbookModal(false);
        resetForm();
      } else {
        throw new Error("Failed to create cookbook");
      }
    } catch (error) {
      toast.error("Failed to create cookbook");
    } finally {
      setIsSaving(false);
    }
  };

  const addRecipeToCookbook = async (cookbookId: string) => {
    const response = await fetch("/api/cookbooks/add-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cookbookId,
        recipeId: recipe.id,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add recipe to cookbook");
    }
  };

  const handleSaveToExistingCookbook = async () => {
    if (!selectedCookbook) {
      toast.error("Please select a cookbook");
      return;
    }

    setIsSaving(true);
    try {
      await addRecipeToCookbook(selectedCookbook);
      const cookbook = cookbooks.find((c) => c.id === selectedCookbook);
      toast.success(`Recipe added to "${cookbook?.title}"!`);
      setShowCookbookModal(false);
      resetForm();
    } catch (error) {
      toast.error("Failed to add recipe to cookbook");
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedCookbook("");
    setNewCookbookName("");
    setNewCookbookDescription("");
    setShowCreateNew(false);
  };

  return (
    <>
      <button
        onClick={handleAddToCookbook}
        className="mise-button-primary flex items-center gap-2"
      >
        <BookOpen size={16} />
        Add to Cookbook
      </button>

      {/* Cookbook Modal */}
      {showCookbookModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="mise-card w-full max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-spectral text-lg text-text-charcoal">
                Add to Cookbook
              </h3>
              <button
                onClick={() => {
                  setShowCookbookModal(false);
                  resetForm();
                }}
                className="p-1 hover:bg-sage/20 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-helper-text text-sm mb-6">
              Choose a cookbook or create a new one for "{recipe.title}".
            </p>

            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-olive-oil-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {!showCreateNew ? (
                  <div className="space-y-4">
                    {/* Existing Cookbooks */}
                    {cookbooks.length > 0 && (
                      <div>
                        <h4 className="font-medium text-text-charcoal mb-3">
                          Your Cookbooks
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {cookbooks.map((cookbook) => (
                            <label
                              key={cookbook.id}
                              className="flex items-center gap-3 p-3 border border-outline-gray rounded-lg hover:bg-butcher-paper cursor-pointer"
                            >
                              <input
                                type="radio"
                                name="cookbook"
                                value={cookbook.id}
                                checked={selectedCookbook === cookbook.id}
                                onChange={(e) =>
                                  setSelectedCookbook(e.target.value)
                                }
                                className="w-4 h-4 text-olive-oil-gold"
                              />
                              <div className="flex-1">
                                <div className="font-medium text-text-charcoal">
                                  {cookbook.title}
                                </div>
                                <div className="text-xs text-helper-text">
                                  {cookbook.recipe_count} recipes
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Create New Button */}
                    <button
                      onClick={() => setShowCreateNew(true)}
                      className="w-full p-3 border-2 border-dashed border-olive-oil-gold/30 rounded-lg hover:border-olive-oil-gold/50 hover:bg-olive-oil-gold/5 flex items-center justify-center gap-2 text-olive-oil-gold"
                    >
                      <Plus size={16} />
                      Create New Cookbook
                    </button>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => {
                          setShowCookbookModal(false);
                          resetForm();
                        }}
                        className="mise-button-secondary flex-1"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveToExistingCookbook}
                        disabled={!selectedCookbook || isSaving}
                        className="mise-button-primary flex-1 disabled:opacity-50"
                      >
                        {isSaving ? "Adding..." : "Add to Cookbook"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Create New Cookbook Form */}
                    <div>
                      <label className="block text-sm font-medium text-text-charcoal mb-2">
                        Cookbook Name *
                      </label>
                      <input
                        type="text"
                        value={newCookbookName}
                        onChange={(e) => setNewCookbookName(e.target.value)}
                        placeholder="My Recipe Collection"
                        className="w-full p-3 border border-outline-gray rounded-lg focus:ring-2 focus:ring-olive-oil-gold/30 focus:border-olive-oil-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-charcoal mb-2">
                        Description (optional)
                      </label>
                      <textarea
                        value={newCookbookDescription}
                        onChange={(e) =>
                          setNewCookbookDescription(e.target.value)
                        }
                        placeholder="A collection of my favorite recipes..."
                        rows={3}
                        className="w-full p-3 border border-outline-gray rounded-lg focus:ring-2 focus:ring-olive-oil-gold/30 focus:border-olive-oil-gold resize-none"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setShowCreateNew(false)}
                        className="mise-button-secondary flex-1"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleCreateNewCookbook}
                        disabled={!newCookbookName.trim() || isSaving}
                        className="mise-button-primary flex-1 disabled:opacity-50"
                      >
                        {isSaving ? "Creating..." : "Create & Add Recipe"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
