// src/domain/stat.ts
export type Stat = {
  value: number
  observation?: string | null
}

export type Stats = Record<string, Stat>