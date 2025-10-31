import React from "react";
import { Zap, Clock } from "lucide-react";

interface FastModeToggleProps {
  fastMode: boolean;
  onToggle: (enabled: boolean) => void;
}

export default function FastModeToggle({
  fastMode,
  onToggle,
}: FastModeToggleProps) {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600">Standard</span>
        </div>

        <button
          onClick={() => onToggle(!fastMode)}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${fastMode ? "bg-green-500" : "bg-gray-300"}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${fastMode ? "translate-x-6" : "translate-x-1"}
            `}
          />
        </button>

        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-gray-600">Fast Mode</span>
        </div>
      </div>

      <div className="ml-4 text-xs text-gray-500 max-w-xs">
        {fastMode ? (
          <span>⚡ Recipes generate ~3x faster, images load in background</span>
        ) : (
          <span>🎨 Full experience with immediate images</span>
        )}
      </div>
    </div>
  );
}
