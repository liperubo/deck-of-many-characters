"use client"

import { Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface HeaderProps {
  title: string
  onNewClick?: () => void
  newButtonText?: string
}

export default function Header({ title, onNewClick, newButtonText = "New Character" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-8">
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search..." className="pl-10 bg-card" />
          </div>

          {/* New Character Button */}
          {onNewClick && (
            <Button onClick={onNewClick} className="gap-2">
              <Plus className="h-4 w-4" />
              {newButtonText}
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
