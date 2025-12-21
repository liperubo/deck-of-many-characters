//src/components/Dots/Dots.tsx
"use client";

import "./Dots.css";
import { toggleDot } from "@/domain/dots";

type Props = {
  value: number;
  maxDots?: number;
  onChange?: (value: number) => void;
};

const Dots = ({ value, maxDots = 5, onChange }: Props) => {
  const handleClick = (index: number) => {
    const next = toggleDot(value, index + 1, maxDots);
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

export default Dots;
