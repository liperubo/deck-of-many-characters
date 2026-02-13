// src/domain/character-reducer.ts
import { Action } from "./action"
import { CharacterState } from "./character-state"
import { Stats } from "./stat"

const requiredSections = ["attributes", "abilities", "backgrounds", "merits", "flaws", "tags"] as const

export function characterReducer(state: CharacterState, action: Action): CharacterState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }

    case "SET_STAT": {
      if (action.category) {
        return {
          ...state,
          [action.section]: {
            ...state[action.section],
            [action.category]: {
              ...(state[action.section] as Record<string, any>)[action.category],
              [action.key]: {
                ...((state[action.section] as Record<string, any>)[action.category] as Record<string, any>)[action.key],
                value: action.value,
              },
            },
          },
        }
      }

      return {
        ...state,
        [action.section]: {
          ...state[action.section],
          [action.key]: {
            ...(state[action.section] as Record<string, any>)[action.key],
            value: action.value,
          },
        },
      }
    }

    case "ADD_STAT": {
      if (action.section === "attributes") {
        return state
      }

      return {
        ...state,
        [action.section]: {
          ...(state[action.section] as Stats),
          [action.key]: action.stat ?? { value: 0, observation: null },
        },
      }
    }

    case "SET_TAGS":
      return { ...state, tags: action.tags }

    case "DELETE_STAT": {
      if (action.category) {
        const currentCategory = (state[action.section] as Record<string, any>)[action.category] as Record<string, any>
        const { [action.key]: _removed, ...remaining } = currentCategory

        return {
          ...state,
          [action.section]: {
            ...state[action.section],
            [action.category]: remaining,
          },
        }
      }

      const currentSection = state[action.section] as Stats
      const { [action.key]: _removed, ...remaining } = currentSection
      return {
        ...state,
        [action.section]: remaining,
      }
    }

    case "TOGGLE_SECTION":
      if (requiredSections.includes(action.section as (typeof requiredSections)[number])) {
        return state
      }

      return {
        ...state,
        activeSections: state.activeSections.includes(action.section)
          ? state.activeSections.filter((s) => s !== action.section)
          : [...state.activeSections, action.section],
      }

    case "INIT":
      return action.payload

    default:
      return state
  }
}

//const [state, dispatch] = useReducer(characterReducer, initialState)
/*
<input
  value={state.name}
  onChange={e =>
  dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })
  }
/>
*/
