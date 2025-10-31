"use client";

import { useState } from "react";
import { ArrowLeft, Clock, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import SaveRecipeButton from "./SaveRecipeButton";

interface Recipe {
  id: string;
  title: string;
  description: string;
  prep_time: string;
  cook_time: string;
  total_time?: string;
  servings: number;
  difficulty: string;
  ingredients?: string[];
  instructions?: string[];
  image_url?: string;
  cuisine_tags?: string[];
  dietary_tags?: string[];
  tips?: string;
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  image_prompt?: string;
  created_at?: string;
  source?: string;
  confidence_score?: number;
  cooking_method?: string;
  equipment_needed?: string[];
  storage_instructions?: string;
  variations?: string[];
}

interface RecipeDisplayProps {
  recipe: Recipe;
  onStartOver: () => void;
}

export default function RecipeDisplay({
  recipe,
  onStartOver,
}: RecipeDisplayProps) {


  // Safety check for recipe data
  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-up">
        <div className="text-center py-12">
          <p className="text-helper-text">No recipe data available</p>
          <button onClick={onStartOver} className="mise-button-primary mt-4">
            Start Over
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onStartOver}
          className="mise-button-secondary flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Start Over
        </button>

        <div className="flex gap-3">
          <SaveRecipeButton 
            recipe={{
              id: recipe.id,
              title: recipe.title,
              description: recipe.description,
              prep_time: recipe.prep_time,
              cook_time: recipe.cook_time,
              servings: recipe.servings,
              difficulty: recipe.difficulty,
              ingredients: recipe.ingredients || [],
              instructions: recipe.instructions || [],
              image_url: recipe.image_url,
              cuisine_tags: recipe.cuisine_tags || [],
              tips: recipe.tips
            }} 
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Recipe Info */}
        <div className="space-y-6">
          {/* Recipe Image */}
          {recipe.image_url && (
            <div className="aspect-video bg-butcher-paper rounded-mise overflow-hidden">
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Recipe Header */}
          <div>
            <h1 className="font-spectral text-2xl text-text-charcoal mb-2">
              {recipe.title || "Untitled Recipe"}
            </h1>
            <p className="text-helper-text text-body leading-relaxed">
              {recipe.description || "No description available"}
            </p>
          </div>

          {/* Recipe Meta */}
          <div className="flex flex-wrap gap-4 text-sm text-helper-text">
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span>
                {recipe.total_time
                  ? `${recipe.total_time} total`
                  : `${recipe.prep_time} prep • ${recipe.cook_time} cook`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{recipe.servings} servings</span>
            </div>
            <div className="px-2 py-1 bg-herb-green/10 rounded text-herb-green text-xs font-medium">
              {recipe.difficulty}
            </div>
          </div>

          {/* Cuisine Tags */}
          <div className="flex flex-wrap gap-2">
            {recipe.cuisine_tags?.map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-1 bg-olive-oil-gold/10 text-olive-oil-gold text-xs font-medium rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Dietary Tags */}
          {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {recipe.dietary_tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-herb-green/10 text-herb-green text-xs font-medium rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Instructions */}
        <div className="space-y-6">
          {/* Ingredients */}
          <div>
            <h2 className="font-spectral text-lg text-text-charcoal mb-4">
              Ingredients
            </h2>
            <ul className="space-y-2">
              {recipe.ingredients?.map((ingredient, index) => (
                <li
                  key={index}
                  className="text-body text-text-charcoal flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-olive-oil-gold rounded-full mt-2 flex-shrink-0" />
                  {ingredient}
                </li>
              )) || (
                <li className="text-body text-text-charcoal">
                  No ingredients available
                </li>
              )}
            </ul>
          </div>

          {/* Instructions */}
          <div>
            <h2 className="font-spectral text-lg text-text-charcoal mb-4">
              Instructions
            </h2>
            <ol className="space-y-4">
              {recipe.instructions?.map((instruction, index) => (
                <li
                  key={index}
                  className="text-body text-text-charcoal flex gap-3"
                >
                  <span className="w-6 h-6 bg-olive-oil-gold text-cast-iron text-xs font-medium rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{instruction}</span>
                </li>
              )) || (
                <li className="text-body text-text-charcoal">
                  No instructions available
                </li>
              )}
            </ol>
          </div>

          {/* Tips */}
          {recipe.tips && (
            <div>
              <h2 className="font-spectral text-lg text-text-charcoal mb-4">
                Chef's Tips
              </h2>
              <div className="p-4 bg-olive-oil-gold/5 rounded-mise border-l-2 border-olive-oil-gold">
                <p className="text-body text-text-charcoal leading-relaxed">
                  {recipe.tips}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>


    </div>
  );
}
