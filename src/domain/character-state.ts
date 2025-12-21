// src/domain/character-state.ts
import { Attributes } from "./attribute";
import { Stats } from "./stats";

export type CharacterState = {
  name: string
  nature: string
  demeanor: string
  attributes: Attributes
  abilities: Stats
  spheres: Stats
  magetraits: Stats
  backgrounds: Stats
  merits: Stats
  flaws: Stats
  tags: string[]
  activeSections: string[]
}