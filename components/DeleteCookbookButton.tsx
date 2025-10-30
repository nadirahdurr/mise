"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface DeleteCookbookButtonProps {
  cookbookId: string;
  cookbookName: string;
  recipeCount: number;
}

export default function DeleteCookbookButton({
  cookbookId,
  cookbookName,
  recipeCount,
}: DeleteCookbookButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/cookbooks/${cookbookId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete cookbook");
      }

      toast.success(`"${cookbookName}" deleted successfully`);

      // Redirect to cookbooks list
      router.push("/cookbooks");
    } catch (error) {
      console.error("Delete cookbook error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to delete cookbook: ${errorMessage}`);
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
        title="Delete Cookbook"
      >
        <Trash2 size={20} />
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="mise-card w-full max-w-md">
            <h3 className="font-spectral text-lg text-text-charcoal mb-4">
              Delete Cookbook
            </h3>
            <p className="text-helper-text text-sm mb-4">
              Are you sure you want to delete <strong>"{cookbookName}"</strong>?
            </p>
            {recipeCount > 0 && (
              <p className="text-helper-text text-sm mb-6 p-3 bg-amber-50 border border-amber-200 rounded-mise">
                <strong>Note:</strong> This cookbook contains {recipeCount}{" "}
                recipe{recipeCount !== 1 ? "s" : ""}. The recipes themselves
                will not be deleted, but they will be removed from this
                cookbook.
              </p>
            )}
            <p className="text-helper-text text-sm mb-6">
              This action cannot be undone.
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
