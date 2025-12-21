// src/domain/character-state.ts
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
    talents: {
      alertness: { value: 0, observation: null },
      art: { value: 0, observation: null },
      athletics: { value: 0, observation: null },
      awareness: { value: 0, observation: null },
      brawl: { value: 0, observation: null },
      empathy: { value: 0, observation: null },
      expression: { value: 0, observation: null },
      intimidation: { value: 0, observation: null },
      leadership: { value: 0, observation: null },
      streetwise: { value: 0, observation: null },
      subterfuge: { value: 0, observation: null }
    },
    skills: {
      crafts: { value: 0, observation: null },
      drive: { value: 0, observation: null },
      etiquette: { value: 0, observation: null },
      firearms: { value: 0, observation: null },
      martial_arts: { value: 0, observation: null },
      meditation: { value: 0, observation: null },
      melee: { value: 0, observation: null },
      research: { value: 0, observation: null },
      stealth: { value: 0, observation: null },
      survival: { value: 0, observation: null },
      technology: { value: 0, observation: null }
    },
    knowledges: {
      academics: { value: 0, observation: null },
      computer: { value: 0, observation: null },
      cosmology: { value: 0, observation: null },
      enigmas: { value: 0, observation: null },
      esoterica: { value: 0, observation: null },
      investigation: { value: 0, observation: null },
      law: { value: 0, observation: null },
      medicine: { value: 0, observation: null },
      occult: { value: 0, observation: null },
      politics: { value: 0, observation: null },
      science: { value: 0, observation: null }
    }
  },

  spheres: {},
  magetraits: {},
  backgrounds: {},
  merits: {},
  flaws: {},

  tags: [],
  activeSections: ["attributes", "abilities"] satisfies ActiveSections
}

