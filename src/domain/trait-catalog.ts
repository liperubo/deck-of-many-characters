export type TraitTemplate = {
  name: string
  description: string
  min: number
  max: number
  defaultValue: number
}

export const meritTemplates: TraitTemplate[] = [
  {
    name: "Eidetic Memory",
    description: "You remember what you see and hear with perfect detail. Documents, events and conversations can be committed to memory with only minor concentration.",
    min: 2,
    max: 2,
    defaultValue: 2,
  },
]

export const flawTemplates: TraitTemplate[] = [
  {
    name: "Addiction",
    description: "You are dependent on a substance, behavior, or compulsion that can disrupt your life.",
    min: 1,
    max: 5,
    defaultValue: 1,
  },
]

export const backgroundTemplates: TraitTemplate[] = [
  { name: "Allies", description: "People willing to help you.", min: 1, max: 5, defaultValue: 1 },
  { name: "Influence", description: "Your pull over institutions or social groups.", min: 1, max: 5, defaultValue: 1 },
  { name: "Status", description: "Standing within your social circle or faction.", min: 1, max: 5, defaultValue: 1 },
  { name: "Contacts", description: "Informants and connections that provide information.", min: 1, max: 5, defaultValue: 1 },
  { name: "Mentor", description: "A more experienced guide supporting you.", min: 1, max: 5, defaultValue: 1 },
  { name: "Fame", description: "Public recognition that opens or closes doors.", min: 1, max: 5, defaultValue: 1 },
  { name: "Resources", description: "Access to money and material support.", min: 1, max: 5, defaultValue: 1 },
]

export function formatTraitTemplate(template: TraitTemplate) {
  const range = template.min === template.max ? `[${template.min}]` : `[${template.min}-${template.max}]`
  return `${range} ${template.name} - ${template.description}`
}
