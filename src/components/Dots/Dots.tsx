//src/components/Dots/Dots.tsx
"use client";

import { toggleDot } from "@/domain/dots";

type Props = {
  value: number;
  maxDots?: number;
  minDots?: number;
  onChange?: (value: number) => void;
};

const Dots = ({ value, maxDots = 5, minDots = 0, onChange }: Props) => {
  const handleClick = (index: number) => {
    const next = toggleDot(value, index + 1, maxDots);
    onChange?.(next);
  };

  return (
    <div className="inline-flex gap-1 cursor-pointer">
      {Array.from({ length: maxDots }).map((_, i) => {
        const filled = i < value

        return (
          <span
            key={i}
            onClick={() => onChange?.(i + 1 === value ? minDots : i + 1)}
            className={[
              "h-3.5 w-3.5 rounded-full border transition-colors",
              filled
                ? "bg-foreground border-foreground hover:bg-foreground/80"
                : "border-foreground/60 hover:bg-foreground/40"
            ].join(" ")}
          />
        )
      })}
    </div>
  );
};

export default Dots;
