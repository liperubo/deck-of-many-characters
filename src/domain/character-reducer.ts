// src/domain/character-reducer.ts
import { Action } from "./action"
import { CharacterState } from "./character-state"

export function characterReducer(state: CharacterState, action: Action): CharacterState {
  switch (action.type) {
	case "SET_FIELD":
	  return { ...state, [action.field]: action.value }

	case "SET_STAT": {
		const section = action.section

		return {
			...state,
			[section]: {
				...state[section],
				[action.key as keyof typeof state[typeof section]]: {
					...state[section][action.key as keyof typeof state[typeof section]],
					value: action.value
				}
			}
		}
	}

	case "ADD_STAT":
	  return {
		...state,
		[action.section]: {
		  ...state[action.section],
		  [action.key]: { value: 0, observation: null }
		}
	  }

	case "TOGGLE_SECTION":
	  return {
		...state,
		activeSections: state.activeSections.includes(action.section)
		  ? state.activeSections.filter(s => s !== action.section)
		  : [...state.activeSections, action.section]
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