"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDeleteRecipe } from "@/stores/recipeStore";

interface DeleteRecipeButtonProps {
  recipeId: string;
  recipeName: string;
}

export default function DeleteRecipeButton({
  recipeId,
  recipeName,
}: DeleteRecipeButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const deleteRecipe = useDeleteRecipe();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      // Use the Zustand store delete function instead of direct API call
      await deleteRecipe(recipeId);

      toast.success(`"${recipeName}" deleted successfully`);

      // Redirect to recipes list
      router.push("/recipes");
    } catch (error) {
      console.error("Delete recipe error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to delete recipe: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="mise-button-secondary text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
      >
        <Trash2 size={16} />
        Delete Recipe
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="mise-card w-full max-w-md">
            <h3 className="font-spectral text-lg text-text-charcoal mb-4">
              Delete Recipe
            </h3>
            <p className="text-helper-text text-sm mb-6">
              Are you sure you want to delete <strong>"{recipeName}"</strong>?
              This action cannot be undone and will remove the recipe from all
              cookbooks.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
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
