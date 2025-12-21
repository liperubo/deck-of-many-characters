// src/domain/character-state.ts
import { Attributes } from "./attribute";
import { Stats } from "./stat";
import { ActiveSections } from "./section";

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
  activeSections: ActiveSections
}

export const initialState: CharacterState = {
  name: "",
  nature: "",
  demeanor: "",

  attributes: {
    strength: { value: 1 },
    dexterity: { value: 1 },
    stamina: { value: 1 },
    charisma: { value: 1 },
    manipulation: { value: 1 },
    appearance: { value: 1 },
    perception: { value: 1 },
    intelligence: { value: 1 },
    wits: { value: 1 },
  },

  abilities: {},
  spheres: {},
  magetraits: {},
  backgrounds: {},
  merits: {},
  flaws: {},

  tags: [],
  activeSections: ["attributes", "abilities"],
}
