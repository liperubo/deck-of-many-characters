"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useReducer, useState } from "react"
import { ArrowLeft, Eye, Pencil, Plus, Trash2, XCircle } from "lucide-react"
import { characterReducer } from "@/domain/character-reducer"
import { cloneBaseCharacter, normalizeActiveSections, normalizeLore, normalizeMageTraits, requiredMageTraits } from "@/domain/character-state"
import { abilityCategories, attributeCategories, FlatStatSection, Stat } from "@/domain/stat"
import Dots from "@/components/Dots"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { loadCharacterSheets, saveCharacterSheets } from "@/storage/characterStorage"
import { SectionKey } from "@/domain/section"
import ThemeSwitch from "@/components/ThemeSwitch"
import { backgroundTemplates, flawTemplates, formatTraitTemplate, meritTemplates, TraitTemplate } from "@/domain/trait-catalog"

const sphereList = ["correspondence", "life", "prime", "entropy", "matter", "spirit", "forces", "mind", "time"] as const
const removableDefaultAbilities = new Set(["talents", "skills", "knowledges"])

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
    lore: "Lore",
    add: "Adicionar",
    addTag: "Adicionar tag",
    noItems: "Sem itens nesta seção.",
    lorePlaceholder: "<h1>Capítulo 1</h1><p>Era uma vez...</p>",
    name: "Nome",
    concept: "Conceito",
    nature: "Natureza",
    demeanor: "Comportamento",
    chronicle: "Crônica",
    openSections: "Seções",
    language: "Idioma",
    deleteSheet: "Deletar ficha",
    readMode: "Modo Leitura",
    editMode: "Modo Edição",
    customBackground: "Antecedente personalizado",
    backgroundsCommon: "Antecedentes comuns",
    remove: "Remover",
  },
  en: {
    back: "Back",
    autosave: "Changes are saved automatically.",
    visibleSections: "Visible character sections",
    identity: "Character Identity",
    attributes: "Attributes",
    abilities: "Abilities",
    lore: "Lore",
    add: "Add",
    addTag: "Add tag",
    noItems: "No items in this section.",
    lorePlaceholder: "<h1>Chapter 1</h1><p>Once upon a time...</p>",
    name: "Name",
    concept: "Concept",
    nature: "Nature",
    demeanor: "Demeanor",
    chronicle: "Chronicle",
    openSections: "Sections",
    language: "Language",
    deleteSheet: "Delete sheet",
    readMode: "Read Mode",
    editMode: "Edit Mode",
    customBackground: "Custom background",
    backgroundsCommon: "Common backgrounds",
    remove: "Remove",
  },
} as const

type Locale = keyof typeof messages

const backgroundsWiki = {
  resources: {
    en: [
      "Sufficient. You can maintain a typical residence in the style of the working class with stability, even if spending sprees come seldom.",
      "Moderate. You can display yourself as a member in good standing of the middle class, with the occasional gift and indulgence seemly for a person of even higher station. You can maintain a servant or hire specific help as necessary. A fraction of your resources are available in cash, readily portable property (like jewelry or furniture), and other valuables (such as a car or modest home) that let you maintain a standard of living at the one-dot level wherever you happen to be, for up to six months.",
      "Comfortable. You are a prominent and established member of your community, with land and an owned dwelling, and you have a reputation that lets you draw on credit at very generous terms. You likely have more tied up in equity and property than you do in ready cash. You can maintain a one dot quality of existence wherever you are without difficulty, for as long as you choose.",
      "Wealthy. You rarely touch cash, as most of your assets exist in tangible forms that are themselves more valuable and stable than paper money. You hold more wealth than many of your local peers (if they can be called such a thing). When earning your Resources doesn’t enjoy your usual degree of attention, you can maintain a three-dot existence for up to a year, and a two-dot existence indefinitely.",
      "Extremely Wealthy. You are the model to which others strive to achieve, at least in the popular mind. Television shows, magazine spreads, and gossip websites speculate about your clothing, the appointments of your numerous homes, and the luxury of your modes of transportation. You have vast and widely distributed assets, perhaps tied to the fates of nations, each with huge staffs and connections to every level of society through a region. You travel with a minimum of three-dot comforts, more with a little effort. Corporations and governments sometimes come to you to buy into stocks or bond programs.",
    ],
    pt: [
      "Suficiente. Você consegue manter uma residência típica de classe trabalhadora com estabilidade, mesmo que gastos extras sejam raros.",
      "Moderado. Você pode se apresentar como alguém em boa posição na classe média, com presentes e indulgências ocasionais condizentes com alguém de posição ainda mais alta. Você pode manter um empregado ou contratar ajuda específica quando necessário. Parte dos seus recursos está disponível em dinheiro, bens portáteis (como joias ou móveis) e outros valores (como um carro ou casa modesta), permitindo manter um padrão de vida de 1 ponto em qualquer lugar por até seis meses.",
      "Confortável. Você é um membro proeminente e estabelecido da comunidade, com terras e residência própria, além de reputação que permite crédito em termos generosos. Provavelmente tem mais em patrimônio e propriedades do que em dinheiro imediato. Você consegue manter um padrão de vida de 1 ponto onde estiver, pelo tempo que desejar.",
      "Rico. Você raramente usa dinheiro vivo, já que a maior parte dos seus bens existe em formas tangíveis mais valiosas e estáveis que papel-moeda. Você possui mais riqueza que muitos de seus pares locais. Quando sua fonte de Recursos não recebe a atenção habitual, você mantém um padrão de vida de 3 pontos por até um ano e de 2 pontos indefinidamente.",
      "Extremamente Rico. Você é o modelo que outros almejam alcançar, ao menos no imaginário popular. Programas de TV, revistas e sites de fofoca especulam sobre suas roupas, suas casas e o luxo dos seus meios de transporte. Você tem ativos vastos e distribuídos, talvez ligados ao destino de nações, com grandes equipes e conexões em todos os níveis sociais de uma região. Você viaja com confortos de no mínimo 3 pontos, e mais com pouco esforço. Corporações e governos às vezes recorrem a você para investimentos em ações ou títulos.",
    ],
  },
} as const
function findExistingKey(data: Record<string, Stat>, name: string) {
  const normalized = name.trim().toLowerCase()
  if (!normalized) return null
  return Object.keys(data).find((key) => key.toLowerCase() === normalized) ?? null
}

function TraitSearchAdd({
  section,
  templates,
  data,
  onAdd,
  locale,
}: {
  section: "backgrounds" | "merits" | "flaws"
  templates: TraitTemplate[]
  data: Record<string, Stat>
  onAdd: (section: "backgrounds" | "merits" | "flaws", key: string, stat: Stat) => void
  locale: Locale
}) {
  const [query, setQuery] = useState("")
  const normalizedQuery = query.trim().toLowerCase()

  const suggestions = templates.filter((template) => {
    if (!normalizedQuery) return true
    return template.name.toLowerCase().includes(normalizedQuery)
  })

  const addTemplate = (template: TraitTemplate) => {
    const existingKey = findExistingKey(data, template.name)
    if (existingKey) return

    onAdd(section, template.name, {
      value: template.defaultValue,
      minValue: template.min,
      maxValue: template.max,
      label: template.name,
      description: template.description,
      observation: null,
    })
    setQuery("")
  }

  const addCustom = () => {
    const trimmed = query.trim()
    if (!trimmed || findExistingKey(data, trimmed)) return

    const minValue = section === "backgrounds" ? 1 : 0
    onAdd(section, trimmed, {
      value: minValue,
      minValue,
      maxValue: 5,
      label: trimmed,
      observation: null,
    })
    setQuery("")
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={locale === "pt" ? "Buscar ou criar" : "Search or create"}
        />
        <Button onClick={addCustom} disabled={!normalizedQuery}>
          {locale === "pt" ? "Criar" : "Create"}
        </Button>
      </div>

      {normalizedQuery && !suggestions.some((item) => item.name.toLowerCase() === normalizedQuery) && !findExistingKey(data, query) && (
        <Button variant="outline" size="sm" onClick={addCustom} className="w-full justify-start">
          {locale === "pt" ? `Adicionar "${query.trim()}" nesta ficha` : `Add "${query.trim()}" to this sheet`}
        </Button>
      )}

      {suggestions.length > 0 && (
        <div className="max-h-44 space-y-2 overflow-auto rounded-md border border-border p-2">
          {suggestions.map((template) => {
            const alreadyAdded = Boolean(findExistingKey(data, template.name))
            return (
              <Button
                key={template.name}
                variant="ghost"
                size="sm"
                className="h-auto w-full justify-start whitespace-normal text-left"
                onClick={() => addTemplate(template)}
                disabled={alreadyAdded}
              >
                {formatTraitTemplate(template)}
              </Button>
            )
          })}
        </div>
      )}
    </div>
  )
}

function FlatSectionEditor({
  title,
  section,
  templates,
  data,
  onAdd,
  onUpdate,
  onDelete,
  isEditMode,
  emptyLabel,
  locale,
  onOpenWiki,
}: {
  title: string
  section: "backgrounds" | "merits" | "flaws"
  templates: TraitTemplate[]
  data: Record<string, Stat>
  onAdd: (section: "backgrounds" | "merits" | "flaws", key: string, stat: Stat) => void
  onUpdate: (section: FlatStatSection, key: string, value: number) => void
  onDelete: (section: FlatStatSection, key: string) => void
  isEditMode: boolean
  emptyLabel: string
  locale: Locale
  onOpenWiki?: (key: string) => void
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditMode && <TraitSearchAdd section={section} templates={templates} data={data} onAdd={onAdd} locale={locale} />}

        {Object.keys(data).length === 0 && <p className="text-sm text-muted-foreground">{emptyLabel}</p>}

        <div className="space-y-3">
          {Object.entries(data).map(([key, stat]) => {
            const minValue = stat.minValue ?? (section === "backgrounds" ? 1 : 0)
            const maxValue = stat.maxValue ?? 5
            return (
              <div key={key} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <span className="text-sm">{stat.label ?? getLocalizedStatName(locale, key)}</span>
                  {onOpenWiki && backgroundsWiki[key as keyof typeof backgroundsWiki] && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onOpenWiki(key)}
                      aria-label={`${locale === "pt" ? "Abrir wiki de" : "Open wiki for"} ${getLocalizedStatName(locale, key)}`}
                    >
                      ?
                    </Button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Dots
                    value={stat.value}
                    minDots={minValue}
                    maxDots={maxValue}
                    onChange={isEditMode ? (value) => onUpdate(section, key, value) : undefined}
                    disabled={!isEditMode}
                  />
                  {isEditMode && (
                    <Button variant="ghost" size="icon" onClick={() => onDelete(section, key)} aria-label={`Delete ${key}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
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
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedBackgroundWiki, setSelectedBackgroundWiki] = useState<string | null>(null)
  const [abilityDrafts, setAbilityDrafts] = useState<Record<(typeof abilityCategories)[number], string>>({
    talents: "",
    skills: "",
    knowledges: "",
  })


  const [state, dispatch] = useReducer(characterReducer, selected?.data ?? cloneBaseCharacter(), (initial) => ({
    ...initial,
    magetraits: normalizeMageTraits(initial.magetraits),
    activeSections: normalizeActiveSections(initial.activeSections),
    lore: normalizeLore(initial.lore, (initial as { notes?: string }).notes),
  }))
  const t = messages[locale]
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
    const confirmed = window.confirm(locale === "pt" ? "Tem certeza que deseja deletar esta ficha?" : "Are you sure you want to delete this sheet?")
    if (!confirmed) return

    const remainingSheets = loadCharacterSheets().filter((sheet) => sheet.id !== characterId)
    saveCharacterSheets(remainingSheets)
    router.push("/")
  }

  const sectionLabels = [
    { key: "attributes", labelPt: "Atributos", labelEn: "Attributes" },
    { key: "abilities", labelPt: "Habilidades", labelEn: "Abilities" },
    ...optionalSections,
  ]
  const requiredSectionKeys = new Set<SectionKey>(["attributes", "abilities", "backgrounds", "merits", "flaws", "tags"])
  const selectedBackgroundWikiEntries = selectedBackgroundWiki
    ? backgroundsWiki[selectedBackgroundWiki as keyof typeof backgroundsWiki]?.[locale]
    : null
  const selectedBackgroundCurrentValue = selectedBackgroundWiki ? state.backgrounds[selectedBackgroundWiki]?.value ?? 0 : 0

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

            <Button variant={isEditMode ? "default" : "outline"} className="w-full justify-start gap-2" onClick={() => setIsEditMode((prev) => !prev)}>
              <Pencil className="h-4 w-4" />
              {isEditMode ? t.readMode : t.editMode}
            </Button>


            <Button variant="destructive" className="w-full justify-start gap-2" onClick={handleDeleteSheet}>
              <XCircle className="h-4 w-4" />
              {t.deleteSheet}
            </Button>
          </div>
        </aside>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground">{t.autosave}</p>

          <Card>
            <CardHeader><CardTitle>{t.identity}</CardTitle></CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div><Label>{t.name}</Label><Input disabled={!isEditMode} value={state.name} onChange={(e) => dispatch({ type: "SET_FIELD", field: "name", value: e.target.value })} /></div>
              <div><Label>{t.concept}</Label><Input disabled={!isEditMode} value={state.concept} onChange={(e) => dispatch({ type: "SET_FIELD", field: "concept", value: e.target.value })} /></div>
              <div><Label>{t.nature}</Label><Input disabled={!isEditMode} value={state.nature} onChange={(e) => dispatch({ type: "SET_FIELD", field: "nature", value: e.target.value })} /></div>
              <div><Label>{t.demeanor}</Label><Input disabled={!isEditMode} value={state.demeanor} onChange={(e) => dispatch({ type: "SET_FIELD", field: "demeanor", value: e.target.value })} /></div>
              <div className="md:col-span-2"><Label>{t.chronicle}</Label><Input disabled={!isEditMode} value={state.chronicle} onChange={(e) => dispatch({ type: "SET_FIELD", field: "chronicle", value: e.target.value })} /></div>
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
                          <Dots
                            value={stat.value}
                            onChange={isEditMode ? (value) => dispatch({ type: "SET_STAT", section: "attributes", category, key, value }) : undefined}
                            disabled={!isEditMode}
                          />
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
                      {isEditMode && (
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
                      )}

                      {Object.entries(state.abilities[category]).map(([key, stat]) => (
                        <div key={key} className="flex items-center justify-between gap-2 text-sm">
                          <Label>{getLocalizedStatName(locale, key)}</Label>
                          <div className="flex items-center gap-2">
                            <Dots
                              value={stat.value}
                              onChange={isEditMode ? (value) => dispatch({ type: "SET_STAT", section: "abilities", category, key, value }) : undefined}
                              disabled={!isEditMode}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className={!isEditMode || removableDefaultAbilities.has(key) ? "invisible" : ""}
                              disabled={!isEditMode || removableDefaultAbilities.has(key)}
                              onClick={() => dispatch({ type: "DELETE_STAT", section: "abilities", category, key })}
                              aria-label={`Delete ${key}`}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
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
                      onChange={isEditMode ? (value) => dispatch({ type: "SET_STAT", section: "spheres", key: sphere, value }) : undefined}
                      disabled={!isEditMode}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {state.activeSections.includes("backgrounds") && (
            <FlatSectionEditor
              title={locale === "pt" ? "Antecedentes" : "Backgrounds"}
              section="backgrounds"
              templates={backgroundTemplates}
              data={state.backgrounds}
              onAdd={(section, key, stat) => dispatch({ type: "ADD_STAT", section, key, stat })}
              onUpdate={(section, key, value) => dispatch({ type: "SET_STAT", section, key, value })}
              onDelete={(section, key) => dispatch({ type: "DELETE_STAT", section: "backgrounds", key })}
              isEditMode={isEditMode}
              emptyLabel={t.noItems}
              locale={locale}
              onOpenWiki={setSelectedBackgroundWiki}
            />
          )}

          {state.activeSections.includes("magetraits") && (
            <Card>
              <CardHeader><CardTitle>{locale === "pt" ? "Traços de Mago" : "Mage Traits"}</CardTitle></CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {requiredMageTraits.map((trait) => (
                  <div key={trait} className="flex items-center justify-between gap-2 text-sm">
                    <Label>{getLocalizedStatName(locale, trait)}</Label>
                    <Dots
                      value={state.magetraits[trait]?.value ?? 0}
                      onChange={isEditMode ? (value) => dispatch({ type: "SET_STAT", section: "magetraits", key: trait, value }) : undefined}
                      disabled={!isEditMode}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          {state.activeSections.includes("merits") && (
            <FlatSectionEditor
              title={locale === "pt" ? "Qualidades" : "Merits"}
              section="merits"
              templates={meritTemplates}
              data={state.merits}
              onAdd={(section, key, stat) => dispatch({ type: "ADD_STAT", section, key, stat })}
              onUpdate={(section, key, value) => dispatch({ type: "SET_STAT", section, key, value })}
              onDelete={(section, key) => dispatch({ type: "DELETE_STAT", section: section as "merits" | "flaws", key })}
              isEditMode={isEditMode}
              emptyLabel={t.noItems}
              locale={locale}
            />
          )}
          {state.activeSections.includes("flaws") && (
            <FlatSectionEditor
              title={locale === "pt" ? "Defeitos" : "Flaws"}
              section="flaws"
              templates={flawTemplates}
              data={state.flaws}
              onAdd={(section, key, stat) => dispatch({ type: "ADD_STAT", section, key, stat })}
              onUpdate={(section, key, value) => dispatch({ type: "SET_STAT", section, key, value })}
              onDelete={(section, key) => dispatch({ type: "DELETE_STAT", section: section as "merits" | "flaws", key })}
              isEditMode={isEditMode}
              emptyLabel={t.noItems}
              locale={locale}
            />
          )}

          {state.activeSections.includes("tags") && (
            <Card>
              <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input disabled={!isEditMode} value={tagDraft} onChange={(e) => setTagDraft(e.target.value)} placeholder={t.addTag} />
                  <Button
                    disabled={!isEditMode}
                    onClick={() => {
                      if (!isEditMode) return
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
                    <Badge
                      key={tag}
                      className={isEditMode ? "cursor-pointer" : "cursor-default"}
                      onClick={isEditMode ? () => dispatch({ type: "SET_TAGS", tags: state.tags.filter((item) => item !== tag) }) : undefined}
                    >
                      {tag}{isEditMode ? " ×" : ""}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t.lore}</CardTitle>
              {isEditMode && (
                <Button
                  size="sm"
                  onClick={() => dispatch({ type: "ADD_LORE", entry: { id: crypto.randomUUID(), content: "" } })}
                >
                  <Plus className="h-4 w-4" />
                  {t.add}
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {state.lore.length === 0 && <p className="text-sm text-muted-foreground">{t.noItems}</p>}
              {state.lore.map((entry, index) => (
                <details key={entry.id} className="rounded-md border border-border" open={isEditMode}>
                  <summary className="cursor-pointer px-3 py-2 text-sm font-medium">
                    {t.lore} #{index + 1}
                  </summary>
                  <div className="space-y-3 border-t border-border p-3">
                    {isEditMode ? (
                      <>
                        <textarea
                          className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={entry.content}
                          onChange={(event) => dispatch({ type: "UPDATE_LORE", id: entry.id, content: event.target.value })}
                          placeholder={t.lorePlaceholder}
                        />
                        <Button variant="ghost" size="sm" onClick={() => dispatch({ type: "DELETE_LORE", id: entry.id })}>
                          <Trash2 className="mr-1 h-4 w-4 text-destructive" />
                          {t.remove}
                        </Button>
                      </>
                    ) : (
                      <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: entry.content }} />
                    )}
                  </div>
                </details>
              ))}
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
                const required = requiredSectionKeys.has(section.key as SectionKey)
                return (
                  <Button
                    key={section.key}
                    size="sm"
                    variant={active ? "default" : "outline"}
                    disabled={required}
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

      {selectedBackgroundWiki && selectedBackgroundWikiEntries && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <Card className="w-full max-w-3xl">
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle>{getLocalizedStatName(locale, selectedBackgroundWiki)} Wiki</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setSelectedBackgroundWiki(null)}>×</Button>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {selectedBackgroundWikiEntries.map((entry, index) => {
                const level = index + 1
                const isCurrent = selectedBackgroundCurrentValue === level
                return (
                  <div key={level} className={`rounded-md border p-3 ${isCurrent ? "border-primary bg-primary/10" : "border-border"}`}>
                    <p>
                      <span className="font-semibold">[{level}]</span> {entry}
                    </p>
                    {isCurrent && (
                      <p className="mt-1 text-xs font-semibold text-primary">{locale === "pt" ? "Nível atual" : "Current level"}</p>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  )
}
