"use client";

import "./AttributeDots.css";
import { clampAttribute } from "@/domain/attributes";

type AttributeDotsProps = {
  value: number;
  maxDots?: number;
  onChange?: (value: number) => void;
};

const AttributeDots = ({ value, maxDots = 5, onChange }: AttributeDotsProps) => {
  const handleClick = (index: number) => {
    const newValue = index + 1 === value ? 0 : index + 1;
    onChange?.(clampAttribute(newValue, maxDots));
  };

  return (
    <div className="dots">
      {Array.from({ length: maxDots }).map((_, i) => (
        <span
          key={i}
          role="button"
          tabIndex={0}
          aria-pressed={i < value}
          className={`dot ${i < value ? "filled" : ""}`}
          onClick={() => handleClick(i)}
          onKeyDown={(e) => e.key === "Enter" && handleClick(i)}
        />
      ))}
    </div>
  );
};

export default AttributeDots;