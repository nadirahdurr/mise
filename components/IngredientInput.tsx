"use client";

import { useState } from "react";

interface IngredientInputProps {
  onInputChange?: (value: string) => void;
}

export default function IngredientInput({
  onInputChange,
}: IngredientInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onInputChange?.(value);
  };

  return (
    <div>
      {/* Input Field */}
      <div className="relative">
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          placeholder="What ingredients do you have on hand?"
          className="mise-input w-full resize-none overflow-hidden"
          rows={1}
          style={{
            minHeight: "48px",
            height: "75px",
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = "auto";
            target.style.height = Math.max(48, target.scrollHeight) + "px";
          }}
        />
      </div>
    </div>
  );
}
