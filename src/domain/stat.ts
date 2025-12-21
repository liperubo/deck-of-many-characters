// src/domain/stat.ts
export type Stat = {
  value: number
  observation?: string | null
}

export type Stats = Record<string, Stat>

export type AttributeCategory = "physical" | "social" | "mental"
export const attributeCategories = ["physical", "social", "mental"] as const

export type AbilityCategory = "talents" | "skills" | "knowledges"
export const abilityCategories = ["talents", "skills", "knowledges"] as const