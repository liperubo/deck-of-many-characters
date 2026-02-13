"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useReducer, useState } from "react"
import { ArrowLeft, Eye, Plus, Trash2 } from "lucide-react"
import { characterReducer } from "@/domain/character-reducer"
import { cloneBaseCharacter, normalizeMageTraits, requiredMageTraits } from "@/domain/character-state"
import { abilityCategories, attributeCategories, FlatStatSection } from "@/domain/stat"
import Dots from "@/components/Dots"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { loadCharacterSheets, saveCharacterSheets } from "@/storage/characterStorage"
import { SectionKey } from "@/domain/section"
import ThemeSwitch from "@/components/ThemeSwitch"

const sphereList = ["correspondence", "life", "prime", "entropy", "matter", "spirit", "forces", "mind", "time"] as const
const commonBackgrounds = ["allies", "influence", "status", "contacts", "mentor", "fame", "resources"] as const

const optionalSections: { key: SectionKey; labelPt: string; labelEn: string }[] = [
  { key: "spheres", labelPt: "Esferas", labelEn: "Spheres" },
  { key: "magetraits", labelPt: "Traços de Mago", labelEn: "Mage Traits" },
  { key: "backgrounds", labelPt: "Antecedentes", labelEn: "Backgrounds" },
  { key: "merits", labelPt: "Qualidades", labelEn: "Merits" },
  { key: "flaws", labelPt: "Defeitos", labelEn: "Flaws" },
  { key: "tags", labelPt: "Tags", labelEn: "Tags" },
]

const attributeCategoryLabels = {
  physical: { pt: "Físico", en: "Physical" },
  social: { pt: "Social", en: "Social" },
  mental: { pt: "Mental", en: "Mental" },
} as const

const abilityCategoryLabels = {
  talents: { pt: "Talentos", en: "Talents" },
  skills: { pt: "Perícias", en: "Skills" },
  knowledges: { pt: "Conhecimentos", en: "Knowledges" },
} as const


const sphereLabels = {
  correspondence: { pt: "Correspondência", en: "Correspondence" },
  life: { pt: "Vida", en: "Life" },
  prime: { pt: "Primórdio", en: "Prime" },
  entropy: { pt: "Entropia", en: "Entropy" },
  matter: { pt: "Matéria", en: "Matter" },
  spirit: { pt: "Espírito", en: "Spirit" },
  forces: { pt: "Forças", en: "Forces" },
  mind: { pt: "Mente", en: "Mind" },
  time: { pt: "Tempo", en: "Time" },
} as const

const backgroundLabels = {
  allies: { pt: "Aliados", en: "Allies" },
  influence: { pt: "Influência", en: "Influence" },
  status: { pt: "Status", en: "Status" },
  contacts: { pt: "Contatos", en: "Contacts" },
  mentor: { pt: "Mentor", en: "Mentor" },
  fame: { pt: "Fama", en: "Fame" },
  resources: { pt: "Recursos", en: "Resources" },
} as const

const statLabels = {
  strength: { pt: "Força", en: "Strength" },
  dexterity: { pt: "Destreza", en: "Dexterity" },
  stamina: { pt: "Vigor", en: "Stamina" },
  charisma: { pt: "Carisma", en: "Charisma" },
  manipulation: { pt: "Manipulação", en: "Manipulation" },
  appearance: { pt: "Aparência", en: "Appearance" },
  perception: { pt: "Percepção", en: "Perception" },
  intelligence: { pt: "Inteligência", en: "Intelligence" },
  wits: { pt: "Raciocínio", en: "Wits" },
  alertness: { pt: "Prontidão", en: "Alertness" },
  art: { pt: "Arte", en: "Art" },
  athletics: { pt: "Atletismo", en: "Athletics" },
  awareness: { pt: "Consciência", en: "Awareness" },
  arete: { pt: "Arete", en: "Arete" },
  willpower: { pt: "Força de Vontade", en: "Willpower" },
  quintessence: { pt: "Quintessência", en: "Quintessence" },
  paradox: { pt: "Paradoxo", en: "Paradox" },
  brawl: { pt: "Briga", en: "Brawl" },
  empathy: { pt: "Empatia", en: "Empathy" },
  expression: { pt: "Expressão", en: "Expression" },
  intimidation: { pt: "Intimidação", en: "Intimidation" },
  leadership: { pt: "Liderança", en: "Leadership" },
  streetwise: { pt: "Manha", en: "Streetwise" },
  subterfuge: { pt: "Lábia", en: "Subterfuge" },
  crafts: { pt: "Ofícios", en: "Crafts" },
  drive: { pt: "Condução", en: "Drive" },
  etiquette: { pt: "Etiqueta", en: "Etiquette" },
  firearms: { pt: "Armas de Fogo", en: "Firearms" },
  martial_arts: { pt: "Artes Marciais", en: "Martial Arts" },
  meditation: { pt: "Meditação", en: "Meditation" },
  melee: { pt: "Armas Brancas", en: "Melee" },
  research: { pt: "Pesquisa", en: "Research" },
  stealth: { pt: "Furtividade", en: "Stealth" },
  survival: { pt: "Sobrevivência", en: "Survival" },
  technology: { pt: "Tecnologia", en: "Technology" },
  academics: { pt: "Acadêmicos", en: "Academics" },
  computer: { pt: "Computador", en: "Computer" },
  cosmology: { pt: "Cosmologia", en: "Cosmology" },
  enigmas: { pt: "Enigmas", en: "Enigmas" },
  esoterica: { pt: "Esoterismo", en: "Esoterica" },
  investigation: { pt: "Investigação", en: "Investigation" },
  law: { pt: "Direito", en: "Law" },
  medicine: { pt: "Medicina", en: "Medicine" },
  occult: { pt: "Ocultismo", en: "Occult" },
  politics: { pt: "Política", en: "Politics" },
  science: { pt: "Ciência", en: "Science" },
  correspondence: { pt: "Correspondência", en: "Correspondence" },
  life: { pt: "Vida", en: "Life" },
  prime: { pt: "Primórdio", en: "Prime" },
  entropy: { pt: "Entropia", en: "Entropy" },
  matter: { pt: "Matéria", en: "Matter" },
  spirit: { pt: "Espírito", en: "Spirit" },
  forces: { pt: "Forças", en: "Forces" },
  mind: { pt: "Mente", en: "Mind" },
  time: { pt: "Tempo", en: "Time" },
  allies: { pt: "Aliados", en: "Allies" },
  influence: { pt: "Influência", en: "Influence" },
  status: { pt: "Status", en: "Status" },
  contacts: { pt: "Contatos", en: "Contacts" },
  mentor: { pt: "Mentor", en: "Mentor" },
  fame: { pt: "Fama", en: "Fame" },
  resources: { pt: "Recursos", en: "Resources" },
} as const

function getLocalizedStatName(locale: Locale, key: string) {
  const localized = statLabels[key as keyof typeof statLabels]
  if (localized) return localized[locale]
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const messages = {
  pt: {
    back: "Voltar",
    autosave: "Mudanças salvas automaticamente.",
    visibleSections: "Seções visíveis da ficha",
    identity: "Identidade da Ficha",
    attributes: "Atributos",
    abilities: "Habilidades",
    notes: "Anotações",
    add: "Adicionar",
    addTag: "Adicionar tag",
    noItems: "Sem itens nesta seção.",
    notesPlaceholder: "Histórico, objetivos, observações da campanha...",
    name: "Nome",
    concept: "Conceito",
    nature: "Natureza",
    demeanor: "Comportamento",
    chronicle: "Crônica",
    openSections: "Seções",
    language: "Idioma",
    deleteSheet: "Deletar ficha",
    backgroundsCommon: "Antecedentes comuns",
    customBackground: "Antecedente personalizado",
  },
  en: {
    back: "Back",
    autosave: "Changes are saved automatically.",
    visibleSections: "Visible character sections",
    identity: "Character Identity",
    attributes: "Attributes",
    abilities: "Abilities",
    notes: "Notes",
    add: "Add",
    addTag: "Add tag",
    noItems: "No items in this section.",
    notesPlaceholder: "Backstory, goals, campaign observations...",
    name: "Name",
    concept: "Concept",
    nature: "Nature",
    demeanor: "Demeanor",
    chronicle: "Chronicle",
    openSections: "Sections",
    language: "Language",
    deleteSheet: "Delete sheet",
    backgroundsCommon: "Common backgrounds",
    customBackground: "Custom background",
  },
} as const

type Locale = keyof typeof messages

function FlatSectionEditor({
  title,
  section,
  data,
  onAdd,
  onUpdate,
  addLabel,
  emptyLabel,
}: {
  title: string
  section: Exclude<FlatStatSection, "backgrounds" | "spheres">
  data: Record<string, { value: number }>
  onAdd: (section: FlatStatSection, key: string) => void
  onUpdate: (section: FlatStatSection, key: string, value: number) => void
  addLabel: string
  emptyLabel: string
}) {
  const [draft, setDraft] = useState("")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={`${addLabel} ${title}`} />
          <Button
            size="sm"
            onClick={() => {
              const normalized = draft.trim().toLowerCase().replace(/\s+/g, "_")
              if (!normalized || data[normalized]) return
              onAdd(section, normalized)
              setDraft("")
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {addLabel}
          </Button>
        </div>

        {Object.keys(data).length === 0 && <p className="text-sm text-muted-foreground">{emptyLabel}</p>}

        <div className="space-y-3">
          {Object.entries(data).map(([key, stat]) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <span className="capitalize">{key.replace(/_/g, " ")}</span>
              <Dots value={stat.value} onChange={(value) => onUpdate(section, key, value)} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export default function CharacterDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const characterId = params.id
  const sheets = useMemo(() => loadCharacterSheets(), [])
  const selected = sheets.find((sheet) => sheet.id === characterId)
  const [tagDraft, setTagDraft] = useState("")
  const [locale, setLocale] = useState<Locale>("pt")
  const [isSectionsModalOpen, setIsSectionsModalOpen] = useState(false)
  const [backgroundDraft, setBackgroundDraft] = useState<(typeof commonBackgrounds)[number]>(commonBackgrounds[0])
  const [customBackgroundDraft, setCustomBackgroundDraft] = useState("")
  const [abilityDrafts, setAbilityDrafts] = useState<Record<(typeof abilityCategories)[number], string>>({
    talents: "",
    skills: "",
    knowledges: "",
  })

  const [state, dispatch] = useReducer(characterReducer, selected?.data ?? cloneBaseCharacter(), (initial) => ({
    ...initial,
    magetraits: normalizeMageTraits(initial.magetraits),
  }))
  const t = messages[locale]
  const availableBackgrounds = commonBackgrounds.filter((item) => !state.backgrounds[item])

  useEffect(() => {
    if (availableBackgrounds.length > 0 && !availableBackgrounds.includes(backgroundDraft)) {
      setBackgroundDraft(availableBackgrounds[0])
    }
  }, [availableBackgrounds, backgroundDraft])

  useEffect(() => {
    const updated = loadCharacterSheets().map((sheet) =>
      sheet.id === characterId
        ? {
            ...sheet,
            updatedAt: new Date().toISOString(),
            data: state,
          }
        : sheet,
    )
    saveCharacterSheets(updated)
  }, [characterId, state])

  const handleDeleteSheet = () => {
    const remainingSheets = loadCharacterSheets().filter((sheet) => sheet.id !== characterId)
    saveCharacterSheets(remainingSheets)
    router.push("/")
  }

  const sectionLabels = [
    { key: "attributes", labelPt: "Atributos", labelEn: "Attributes" },
    { key: "abilities", labelPt: "Habilidades", labelEn: "Abilities" },
    ...optionalSections,
  ]

  return (
    <main className="min-h-screen bg-background px-4 py-8 md:px-8">
      <section className="mx-auto grid w-full max-w-7xl gap-6 text-foreground lg:grid-cols-[260px_1fr]">
        <aside className="h-fit rounded-2xl border border-border bg-card p-4 lg:sticky lg:top-6">
          <div className="space-y-3">
            <Link href="/">
              <Button variant="outline" className="w-full justify-start gap-2">
                <ArrowLeft className="h-4 w-4" />
                {t.back}
              </Button>
            </Link>

            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setIsSectionsModalOpen(true)}>
              <Eye className="h-4 w-4" />
              {t.openSections}
            </Button>

            <div className="space-y-1">
              <Label>{t.language}</Label>
              <select
                value={locale}
                onChange={(event) => setLocale(event.target.value as Locale)}
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="en">🇺🇸 English</option>
                <option value="pt">🇧🇷 Português</option>
              </select>
            </div>

            <ThemeSwitch />

            <Button variant="destructive" className="w-full justify-start gap-2" onClick={handleDeleteSheet}>
              <Trash2 className="h-4 w-4" />
              {t.deleteSheet}
            </Button>
          </div>
        </aside>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">{t.autosave}</p>

          <Card>
            <CardHeader><CardTitle>{t.identity}</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div><Label>{t.name}</Label><Input value={state.name} onChange={(e) => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })} /></div>
              <div><Label>{t.concept}</Label><Input value={state.concept} onChange={(e) => dispatch({ type: "SET_FIELD", field: "concept", value: e.target.value })} /></div>
              <div><Label>{t.nature}</Label><Input value={state.nature} onChange={(e) => dispatch({ type: "SET_FIELD", field: "nature", value: e.target.value })} /></div>
              <div><Label>{t.demeanor}</Label><Input value={state.demeanor} onChange={(e) => dispatch({ type: "SET_FIELD", field: "demeanor", value: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>{t.chronicle}</Label><Input value={state.chronicle} onChange={(e) => dispatch({ type: "SET_FIELD", field: "chronicle", value: e.target.value })} /></div>
            </CardContent>
          </Card>

          {state.activeSections.includes("attributes") && (
            <Card>
              <CardHeader><CardTitle>{t.attributes}</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {attributeCategories.map((category) => (
                  <Card key={category} className="bg-secondary/40">
                    <CardHeader><CardTitle className="text-base">{attributeCategoryLabels[category][locale]}</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      {Object.entries(state.attributes[category]).map(([key, stat]) => (
                        <div key={key} className="flex items-center justify-between gap-2 text-sm">
                          <Label>{getLocalizedStatName(locale, key)}</Label>
                          <Dots value={stat.value} onChange={(value) => dispatch({ type: "SET_STAT", section: "attributes", category, key, value })} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {state.activeSections.includes("abilities") && (
            <Card>
              <CardHeader><CardTitle>{t.abilities}</CardTitle></CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {abilityCategories.map((category) => (
                  <Card key={category} className="bg-secondary/40">
                    <CardHeader><CardTitle className="text-base">{abilityCategoryLabels[category][locale]}</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          value={abilityDrafts[category]}
                          onChange={(event) => setAbilityDrafts((prev) => ({ ...prev, [category]: event.target.value }))}
                          placeholder={`${t.add} ${abilityCategoryLabels[category][locale]}`}
                        />
                        <Button
                          size="sm"
                          onClick={() => {
                            const normalized = abilityDrafts[category].trim().toLowerCase().replace(/\s+/g, "_")
                            if (!normalized || state.abilities[category][normalized]) return
                            dispatch({ type: "SET_STAT", section: "abilities", category, key: normalized, value: 0 })
                            setAbilityDrafts((prev) => ({ ...prev, [category]: "" }))
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {Object.entries(state.abilities[category]).map(([key, stat]) => (
                        <div key={key} className="flex items-center justify-between gap-2 text-sm">
                          <Label>{getLocalizedStatName(locale, key)}</Label>
                          <Dots value={stat.value} onChange={(value) => dispatch({ type: "SET_STAT", section: "abilities", category, key, value })} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {state.activeSections.includes("spheres") && (
            <Card>
              <CardHeader><CardTitle>{locale === "pt" ? "Esferas" : "Spheres"}</CardTitle></CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                {sphereList.map((sphere) => (
                  <div key={sphere} className="flex items-center justify-between gap-2 text-sm">
                    <Label>{getLocalizedStatName(locale, sphere)}</Label>
                    <Dots
                      value={state.spheres[sphere]?.value ?? 0}
                      onChange={(value) => dispatch({ type: "SET_STAT", section: "spheres", key: sphere, value })}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {state.activeSections.includes("backgrounds") && (
            <Card>
              <CardHeader><CardTitle>{locale === "pt" ? "Antecedentes" : "Backgrounds"}</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <select
                    value={backgroundDraft}
                    onChange={(event) => setBackgroundDraft(event.target.value as (typeof commonBackgrounds)[number])}
                    disabled={availableBackgrounds.length === 0}
                    className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {availableBackgrounds.length > 0 ? (
                      availableBackgrounds.map((item) => (
                        <option key={item} value={item}>{getLocalizedStatName(locale, item)}</option>
                      ))
                    ) : (
                      <option value="">{t.noItems}</option>
                    )}
                  </select>
                  <Button
                    onClick={() => {
                      if (!backgroundDraft) return
                      if (state.backgrounds[backgroundDraft]) return
                      dispatch({ type: "SET_STAT", section: "backgrounds", key: backgroundDraft, value: 0 })
                    }}
                    disabled={availableBackgrounds.length === 0}
                  >
                    {t.add}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={customBackgroundDraft}
                    onChange={(event) => setCustomBackgroundDraft(event.target.value)}
                    placeholder={t.customBackground}
                  />
                  <Button
                    onClick={() => {
                      const normalized = customBackgroundDraft.trim().toLowerCase().replace(/\s+/g, "_")
                      if (!normalized || state.backgrounds[normalized]) return
                      dispatch({ type: "SET_STAT", section: "backgrounds", key: normalized, value: 0 })
                      setCustomBackgroundDraft("")
                    }}
                  >
                    {t.add}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">{t.backgroundsCommon}: {commonBackgrounds.map((item) => backgroundLabels[item][locale]).join(", ")}.</p>

                <div className="grid gap-3 md:grid-cols-3">
                  {Object.entries(state.backgrounds).map(([key, stat]) => (
                    <div key={key} className="flex items-center justify-between gap-2 text-sm">
                      <Label>{getLocalizedStatName(locale, key)}</Label>
                      <Dots value={stat.value} onChange={(value) => dispatch({ type: "SET_STAT", section: "backgrounds", key, value })} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {state.activeSections.includes("magetraits") && (
            <Card>
              <CardHeader><CardTitle>{locale === "pt" ? "Traços de Mago" : "Mage Traits"}</CardTitle></CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {requiredMageTraits.map((trait) => (
                  <div key={trait} className="flex items-center justify-between gap-2 text-sm">
                    <Label>{getLocalizedStatName(locale, trait)}</Label>
                    <Dots value={state.magetraits[trait]?.value ?? 0} onChange={(value) => dispatch({ type: "SET_STAT", section: "magetraits", key: trait, value })} />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {state.activeSections.includes("merits") && (
            <FlatSectionEditor title={locale === "pt" ? "Qualidades" : "Merits"} section="merits" data={state.merits} onAdd={(section, key) => dispatch({ type: "ADD_STAT", section, key })} onUpdate={(section, key, value) => dispatch({ type: "SET_STAT", section, key, value })} addLabel={t.add} emptyLabel={t.noItems} />
          )}
          {state.activeSections.includes("flaws") && (
            <FlatSectionEditor title={locale === "pt" ? "Defeitos" : "Flaws"} section="flaws" data={state.flaws} onAdd={(section, key) => dispatch({ type: "ADD_STAT", section, key })} onUpdate={(section, key, value) => dispatch({ type: "SET_STAT", section, key, value })} addLabel={t.add} emptyLabel={t.noItems} />
          )}

          {state.activeSections.includes("tags") && (
            <Card>
              <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input value={tagDraft} onChange={(e) => setTagDraft(e.target.value)} placeholder={t.addTag} />
                  <Button
                    onClick={() => {
                      const normalized = tagDraft.trim()
                      if (!normalized) return
                      if (state.tags.some((tag) => tag.toLowerCase() === normalized.toLowerCase())) return
                      dispatch({ type: "SET_TAGS", tags: [...state.tags, normalized] })
                      setTagDraft("")
                    }}
                  >
                    {t.add}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {state.tags.map((tag) => (
                    <Badge key={tag} className="cursor-pointer" onClick={() => dispatch({ type: "SET_TAGS", tags: state.tags.filter((item) => item !== tag) })}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>{t.notes}</CardTitle></CardHeader>
            <CardContent>
              <Textarea className="min-h-40" value={state.notes} onChange={(e) => dispatch({ type: "SET_FIELD", field: "notes", value: e.target.value })} placeholder={t.notesPlaceholder} />
            </CardContent>
          </Card>
        </div>
      </section>

      {isSectionsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card className="w-full max-w-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t.visibleSections}</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setIsSectionsModalOpen(false)}>×</Button>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {sectionLabels.map((section) => {
                const active = state.activeSections.includes(section.key as SectionKey)
                return (
                  <Button
                    key={section.key}
                    size="sm"
                    variant={active ? "default" : "outline"}
                    onClick={() => dispatch({ type: "TOGGLE_SECTION", section: section.key as SectionKey })}
                  >
                    {locale === "pt" ? section.labelPt : section.labelEn}
                  </Button>
                )
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
