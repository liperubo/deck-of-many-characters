// src/domain/dots.ts
export function clampDot(value: number, max: number) {
  return Math.max(0, Math.min(value, max));
}

export function toggleDot(
  current: number,
  next: number,
  max: number
) {
  const value = current === next ? 0 : next;
  return clampDot(value, max);
}
