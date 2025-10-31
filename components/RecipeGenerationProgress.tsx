import React, { useState } from 'react';
import { Clock, Zap, CheckCircle, ChefHat } from 'lucide-react';

interface RecipeGenerationProgressProps {
  isGenerating: boolean;
  progress: 'idle' | 'processing' | 'saving' | 'complete';
  estimatedTime?: number;
}

export default function RecipeGenerationProgress({ 
  isGenerating, 
  progress, 
  estimatedTime = 8000 
}: RecipeGenerationProgressProps) {
  const [elapsedTime, setElapsedTime] = useState(0);

  React.useEffect(() => {
    if (!isGenerating) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
    }, 100);

    return () => clearInterval(interval);
  }, [isGenerating]);

  if (!isGenerating) return null;

  const progressPercentage = Math.min((elapsedTime / estimatedTime) * 100, 95);

  const getProgressMessage = () => {
    switch (progress) {
      case 'processing':
        return 'Analyzing your ingredients and crafting something delicious...';
      case 'saving':
        return 'Adding your new creation to the cookbook...';
      case 'complete':
        return 'Your recipe is ready to cook!';
      default:
        return 'Preparing your mise en place...';
    }
  };

  const getProgressIcon = () => {
    switch (progress) {
      case 'processing':
        return <ChefHat className="w-6 h-6 text-olive-oil-gold animate-pulse" />;
      case 'saving':
        return <Clock className="w-6 h-6 text-herb-green animate-spin" />;
      case 'complete':
        return <CheckCircle className="w-6 h-6 text-herb-green" />;
      default:
        return <Clock className="w-6 h-6 text-text-charcoal/60" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-text-charcoal/30 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-up">
      <div className="bg-bone border border-butcher-paper rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl animate-scale-up">
        {/* Icon container with subtle background */}
        <div className="mb-8 inline-flex items-center justify-center w-16 h-16 bg-butcher-paper rounded-full">
          {getProgressIcon()}
        </div>
        
        {/* Title using brand typography */}
        <h3 className="font-spectral text-xl font-medium text-text-charcoal mb-6">
          Creating Your Recipe
        </h3>
        
        {/* Progress bar with brand colors */}
        <div className="mb-6">
          <div className="w-full bg-butcher-paper rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-herb-green to-olive-oil h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-xs text-text-charcoal/60 mt-3 font-inter">
            {(elapsedTime / 1000).toFixed(1)}s elapsed
          </p>
        </div>
        
        {/* Message with brand styling */}
        <p className="text-text-charcoal/80 text-sm font-inter leading-relaxed">
          {getProgressMessage()}
        </p>
        
        {/* Tip with subtle styling */}
        <div className="mt-8 px-4 py-3 bg-butcher-paper rounded-lg">
          <p className="text-xs text-text-charcoal/60 font-inter">
            🍳 <span className="font-medium">Chef's tip:</span> Recipe images are being prepared and will appear shortly
          </p>
        </div>
      </div>
    </div>
  );
}