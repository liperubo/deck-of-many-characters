// src/domain/character-state.ts
// import { Attributes } from "./attribute";
import { Stats } from "./stat";
import { ActiveSections } from "./section";

export type CharacterState = {
  name: string
  nature: string
  demeanor: string
  attributes: {
    physical: Stats
    social: Stats
    mental: Stats
  }
  abilities: {
    talents: Stats
    skills: Stats
    knowledges: Stats
  }
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
    physical: {
      strength: { value: 1, observation: null },
      dexterity: { value: 1, observation: null },
      stamina: { value: 1, observation: null },
    },
    social: {
      charisma: { value: 1, observation: null },
      manipulation: { value: 1, observation: null },
      appearance: { value: 1, observation: null },
    },
    mental: {
      perception: { value: 1, observation: null },
      intelligence: { value: 1, observation: null },
      wits: { value: 1, observation: null },
    },
  },

  abilities: {
    talents: {},
    skills: {},
    knowledges: {},
  },
  spheres: {},
  magetraits: {},
  backgrounds: {},
  merits: {},
  flaws: {},

  tags: [],
  activeSections: ["attributes", "abilities"] satisfies ActiveSections
}
