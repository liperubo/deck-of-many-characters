//src/components/Dots/Dots.tsx
"use client";

type Props = {
  value: number;
  maxDots?: number;
  minDots?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
};

const Dots = ({ value, maxDots = 5, minDots = 0, disabled = false, onChange }: Props) => {
  return (
    <div className={`inline-flex gap-1 ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}>
      {Array.from({ length: maxDots }).map((_, i) => {
        const filled = i < value

        return (
          <span
            key={i}
            onClick={() => {
              if (disabled) return
              onChange?.(i + 1 === value ? minDots : i + 1)
            }}
            className={[
              "h-3.5 w-3.5 rounded-full border transition-colors",
              filled
                ? disabled
                  ? "bg-foreground border-foreground"
                  : "bg-foreground border-foreground hover:bg-foreground/80"
                : disabled
                  ? "border-foreground/60"
                  : "border-foreground/60 hover:bg-foreground/40"
            ].join(" ")}
          />
        )
      })}
    </div>
  );
};

export default Dots;
