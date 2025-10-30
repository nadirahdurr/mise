"use client";

import { useState } from "react";
import { X, Upload, Palette } from "lucide-react";
import { toast } from "react-hot-toast";

interface Cookbook {
  id?: string;
  title: string;
  description: string;
  author: string;
  cover_color: string;
  cover_photo_url?: string;
  cover_style: string;
}

interface CookbookCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cookbook: Partial<Cookbook>;
  onSave: (cookbook: Partial<Cookbook>) => void;
  isEditing?: boolean;
}

const coverColors = [
  { name: "Herb Green", value: "#5F6B3C" },
  { name: "Cast Iron", value: "#2C3E21" },
  { name: "Olive Oil Gold", value: "#C5A75A" },
  { name: "Sage", value: "#A8B5A0" },
  { name: "Terracotta", value: "#C17B5C" },
  { name: "Deep Navy", value: "#1F2937" },
  { name: "Burgundy", value: "#7C2D12" },
  { name: "Forest", value: "#365314" },
];

const coverStyles = [
  {
    name: "Classic",
    value: "classic",
    description: "Traditional cookbook style",
  },
  {
    name: "Modern",
    value: "modern",
    description: "Clean, contemporary design",
  },
  { name: "Rustic", value: "rustic", description: "Handcrafted, organic feel" },
  {
    name: "Elegant",
    value: "elegant",
    description: "Sophisticated and refined",
  },
];

export default function CookbookCustomizationModal({
  isOpen,
  onClose,
  cookbook,
  onSave,
  isEditing = false,
}: CookbookCustomizationModalProps) {
  const [formData, setFormData] = useState<Partial<Cookbook>>({
    title: cookbook.title || "",
    description: cookbook.description || "",
    author: cookbook.author || "Mise Chef",
    cover_color: cookbook.cover_color || "#5F6B3C",
    cover_photo_url: cookbook.cover_photo_url || "",
    cover_style: cookbook.cover_style || "classic",
  });
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field: keyof Cookbook, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      // In a real app, you'd upload to your storage service
      // For now, we'll use a placeholder URL
      const imageUrl = URL.createObjectURL(file);
      handleInputChange("cover_photo_url", imageUrl);
      toast.success("Cover photo uploaded!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim()) {
      toast.error("Title is required");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="mise-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-spectral text-xl text-text-charcoal">
              {isEditing ? "Customize Cookbook" : "Create New Cookbook"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="p-1 hover:bg-sage/20 rounded"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-charcoal mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="My Recipe Collection"
                  className="mise-input w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-charcoal mb-2">
                  Author
                </label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => handleInputChange("author", e.target.value)}
                  placeholder="Mise Chef"
                  className="mise-input w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-charcoal mb-2">
                Description (optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="A collection of my favorite recipes..."
                rows={3}
                className="mise-input w-full resize-none"
              />
            </div>

            {/* Cover Photo */}
            <div>
              <label className="block text-sm font-medium text-text-charcoal mb-2">
                Cover Photo (optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="mise-button-secondary cursor-pointer flex items-center gap-2">
                  <Upload size={16} />
                  {isUploading ? "Uploading..." : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    disabled={isUploading}
                  />
                </label>
                {formData.cover_photo_url && (
                  <div className="flex items-center gap-2">
                    <img
                      src={formData.cover_photo_url}
                      alt="Cover preview"
                      className="w-12 h-16 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => handleInputChange("cover_photo_url", "")}
                      className="text-xs text-helper-text hover:text-text-charcoal"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Cover Color */}
            <div>
              <label className="block text-sm font-medium text-text-charcoal mb-3">
                Cover Color
              </label>
              <div className="grid grid-cols-4 gap-3">
                {coverColors.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      handleInputChange("cover_color", color.value)
                    }
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.cover_color === color.value
                        ? "border-olive-oil-gold"
                        : "border-outline-gray hover:border-olive-oil-gold/50"
                    }`}
                  >
                    <div
                      className="w-full h-8 rounded mb-2"
                      style={{ backgroundColor: color.value }}
                    />
                    <div className="text-xs text-text-charcoal font-medium">
                      {color.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Cover Style */}
            <div>
              <label className="block text-sm font-medium text-text-charcoal mb-3">
                Cover Style
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {coverStyles.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() =>
                      handleInputChange("cover_style", style.value)
                    }
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.cover_style === style.value
                        ? "border-olive-oil-gold bg-olive-oil-gold/5"
                        : "border-outline-gray hover:border-olive-oil-gold/50"
                    }`}
                  >
                    <div className="font-medium text-text-charcoal mb-1">
                      {style.name}
                    </div>
                    <div className="text-xs text-helper-text">
                      {style.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-medium text-text-charcoal mb-3">
                Preview
              </label>
              <div className="flex justify-center">
                <div
                  className="w-48 h-64 rounded-lg shadow-lg flex flex-col justify-between p-4 text-bone relative overflow-hidden"
                  style={{
                    backgroundColor: formData.cover_color,
                    backgroundImage: formData.cover_photo_url
                      ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${formData.cover_photo_url})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-3 border border-bone/30 rounded pointer-events-none" />
                  <div className="relative z-10">
                    <div className="border-b border-bone/30 pb-2 mb-2">
                      <h4 className="font-spectral font-bold text-sm leading-tight">
                        {formData.title || "Cookbook Title"}
                      </h4>
                    </div>
                  </div>
                  <div className="relative z-10 text-xs">
                    <div>Curated by {formData.author}</div>
                    <div className="mt-1 opacity-75">Designed by Mise</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-6 mt-6 border-t border-outline-gray/20">
            <button
              type="button"
              onClick={onClose}
              className="mise-button-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="mise-button-primary flex-1">
              {isEditing ? "Save Changes" : "Create Cookbook"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
