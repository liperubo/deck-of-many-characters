//src/components/AttributeDots/AttributeDots.tsx
"use client";

import "./AttributeDots.css";
import { toggleAttribute } from "@/domain/attributes";

type Props = {
  value: number;
  maxDots?: number;
  onChange?: (value: number) => void;
};

const AttributeDots = ({ value, maxDots = 5, onChange }: Props) => {
  const handleClick = (index: number) => {
    const next = toggleAttribute(value, index + 1, maxDots);
    onChange?.(next);
  };

  return (
    <div className="dots">
      {Array.from({ length: maxDots }).map((_, i) => (
        <span
          key={i}
          className={`dot ${i < value ? "filled" : ""}`}
          onClick={() => handleClick(i)}
          tabIndex={0}
        />
      ))}
    </div>
  );
};

export default AttributeDots;
