"use client"

import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

const THEME_KEY = "deck.theme"

export default function ThemeSwitch() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    const saved = localStorage.getItem(THEME_KEY)
    const dark = saved ? saved === "dark" : true
    root.classList.toggle("dark", dark)
    setIsDark(dark)
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    const next = !isDark
    root.classList.toggle("dark", next)
    localStorage.setItem(THEME_KEY, next ? "dark" : "light")
    setIsDark(next)
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  )
}
