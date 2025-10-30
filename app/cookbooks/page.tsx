"use client";

import { useState, useEffect } from "react";
import { Plus, BookOpen, Clock, Users, Trash2 } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { toast } from "react-hot-toast";
import Link from "next/link";
import CookbookCustomizationModal from "@/components/CookbookCustomizationModal";

interface Cookbook {
  id: string;
  title: string;
  description?: string;
  author: string;
  cover_color: string;
  cover_photo_url?: string;
  cover_style: string;
  created_at: string;
  recipe_count?: number;
}

export default function CookbooksPage() {
  const [cookbooks, setCookbooks] = useState<Cookbook[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCustomizationModal, setShowCustomizationModal] = useState(false);

  useEffect(() => {
    fetchCookbooks();
  }, []);

  const fetchCookbooks = async () => {
    try {
      const response = await fetch("/api/cookbooks");
      if (response.ok) {
        const data = await response.json();
        setCookbooks(data.cookbooks);
      }
    } catch (error) {
      console.error("Error fetching cookbooks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCookbook = async (cookbookData: Partial<Cookbook>) => {
    try {
      const response = await fetch("/api/cookbooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cookbookData),
      });

      if (response.ok) {
        const data = await response.json();
        setCookbooks([data.cookbook, ...cookbooks]);
        setShowCustomizationModal(false);
        toast.success("Cookbook created!");
      } else {
        toast.error("Failed to create cookbook");
      }
    } catch (error) {
      toast.error("Failed to create cookbook");
      console.error("Create cookbook error:", error);
    }
  };

  const handleDeleteCookbook = (deletedCookbookId: string) => {
    setCookbooks(
      cookbooks.filter((cookbook) => cookbook.id !== deletedCookbookId)
    );
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-spectral text-2xl text-text-charcoal">
              Your Cookbooks
            </h1>
            <button
              onClick={() => setShowCustomizationModal(true)}
              className="mise-button-primary flex items-center gap-2"
            >
              <Plus size={16} />
              New Cookbook
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-olive-oil-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : cookbooks.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="mx-auto text-helper-text mb-4" size={48} />
              <p className="text-helper-text text-body mb-4">
                No cookbooks created yet.
              </p>
              <button
                onClick={() => setShowCustomizationModal(true)}
                className="mise-button-primary"
              >
                Create Your First Cookbook
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cookbooks.map((cookbook) => (
                <CookbookCard
                  key={cookbook.id}
                  cookbook={cookbook}
                  onDelete={handleDeleteCookbook}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Cookbook Customization Modal */}
      <CookbookCustomizationModal
        isOpen={showCustomizationModal}
        onClose={() => setShowCustomizationModal(false)}
        cookbook={{}}
        onSave={handleCreateCookbook}
        isEditing={false}
      />
    </div>
  );
}

function CookbookCard({
  cookbook,
  onDelete,
}: {
  cookbook: Cookbook;
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
      const response = await fetch(`/api/cookbooks/${cookbook.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to delete cookbook");
      }

      toast.success(`"${cookbook.title}" deleted successfully`);
      onDelete(cookbook.id);
    } catch (error) {
      console.error("Delete cookbook error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to delete cookbook: ${errorMessage}`);
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
          title="Delete cookbook"
        >
          <Trash2 size={12} />
        </button>

        <Link href={`/cookbooks/${cookbook.id}`} className="block">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-olive-oil-gold/10 rounded-mise flex items-center justify-center flex-shrink-0 group-hover:bg-olive-oil-gold/20 transition-colors">
              <BookOpen className="text-olive-oil-gold" size={20} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-spectral text-lg text-text-charcoal mb-1 line-clamp-1">
                {cookbook.title}
              </h3>

              {cookbook.description && (
                <p className="text-helper-text text-sm line-clamp-2 mb-2">
                  {cookbook.description}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-helper-text">
                <span>{cookbook.recipe_count || 0} recipes</span>
                <span>
                  Created {new Date(cookbook.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="mise-card w-full max-w-md">
            <h3 className="font-spectral text-lg text-text-charcoal mb-4">
              Delete Cookbook
            </h3>
            <p className="text-helper-text text-sm mb-4">
              Are you sure you want to delete{" "}
              <strong>"{cookbook.title}"</strong>?
            </p>
            {(cookbook.recipe_count || 0) > 0 && (
              <p className="text-helper-text text-sm mb-6 p-3 bg-amber-50 border border-amber-200 rounded-mise">
                <strong>Note:</strong> This cookbook contains{" "}
                {cookbook.recipe_count} recipe
                {cookbook.recipe_count !== 1 ? "s" : ""}. The recipes themselves
                will not be deleted.
              </p>
            )}
            <p className="text-helper-text text-sm mb-6">
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
