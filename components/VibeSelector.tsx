"use client";

import { useState } from "react";
import { Box, Plus, X } from "lucide-react";

interface VibeSelectorProps {
  selectedVibes: string[];
  onVibeToggle: (vibe: string) => void;
  disabled?: boolean;
}

const vibes = [
  "Caribbean",
  "Asian",
  "Italian",
  "Comfort",
  "Vegan",
  "Quick 15-min",
  "Soup/Stew",
  "Soul Food",
];

export default function VibeSelector({
  selectedVibes,
  onVibeToggle,
  disabled = false,
}: VibeSelectorProps) {
  const [customVibes, setCustomVibes] = useState<string[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleAddCustomVibe = () => {
    const trimmedValue = inputValue.trim();
    if (
      trimmedValue &&
      !vibes.includes(trimmedValue) &&
      !customVibes.includes(trimmedValue)
    ) {
      setCustomVibes([...customVibes, trimmedValue]);
      setInputValue("");
      setShowInput(false);
    }
  };

  const handleRemoveCustomVibe = (vibe: string) => {
    setCustomVibes(customVibes.filter((v) => v !== vibe));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddCustomVibe();
    } else if (e.key === "Escape") {
      setShowInput(false);
      setInputValue("");
    }
  };

  const allVibes = [...vibes, ...customVibes];

  return (
    <div className="flex flex-wrap gap-3">
      {allVibes.map((vibe) => {
        const isCustom = customVibes.includes(vibe);
        return (
          <button
            key={vibe}
            onClick={() => !disabled && onVibeToggle(vibe)}
            disabled={disabled}
            className={`mise-chip transition-all duration-150 relative group ${
              selectedVibes.includes(vibe) ? "mise-chip-selected" : ""
            } ${
              disabled ? "opacity-50 cursor-not-allowed" : "hover:shadow-sm"
            } ${isCustom ? "flex items-center justify-center" : ""}`}
          >
            <span
              className={
                isCustom ? "group-hover:mr-1 transition-all duration-150" : ""
              }
            >
              {vibe}
            </span>
            {isCustom && !disabled && (
              <X
                size={12}
                className="opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer absolute right-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveCustomVibe(vibe);
                }}
              />
            )}
          </button>
        );
      })}

      {showInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={() => {
              if (!inputValue.trim()) {
                setShowInput(false);
              }
            }}
            placeholder="New vibe"
            className="mise-input text-sm px-2 py-1 w-32"
            autoFocus
            disabled={disabled}
          />
          <button
            onClick={handleAddCustomVibe}
            disabled={disabled || !inputValue.trim()}
            className="mise-button-secondary text-xs px-2 py-1"
          >
            Add
          </button>
        </div>
      ) : (
        <button
          onClick={() => !disabled && setShowInput(true)}
          disabled={disabled}
          className={`mise-chip border-2 border-dashed border-olive-oil-gold/40 text-olive-oil-gold hover:border-olive-oil-gold hover:bg-olive-oil-gold/5 transition-all duration-150 flex items-center ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <Plus size={14} />
        </button>
      )}
    </div>
  );
}
