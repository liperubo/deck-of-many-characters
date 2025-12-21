// src/domain/attribute.ts
import { Stat } from "./stat"

export type AttributeKey =
  | "strength"
  | "dexterity"
  | "stamina"
  | "charisma"
  | "manipulation"
  | "appearance"
  | "perception"
  | "intelligence"
  | "wits"

export const attributeKeys: AttributeKey[] = [
  "strength",
  "dexterity",
  "stamina",
  "charisma",
  "manipulation",
  "appearance",
  "perception",
  "intelligence",
  "wits"
]

export type Attributes = Record<AttributeKey, Stat>