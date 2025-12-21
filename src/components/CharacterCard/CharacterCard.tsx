import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"

interface CharacterCardProps {
  id: string
  name: string
  avatar?: string
  role: string
  level: number
  status: "active" | "inactive" | "retired"
}

const statusColors = {
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  inactive: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  retired: "bg-gray-500/20 text-gray-400 border-gray-500/30",
}

export default function CharacterCard({ id, name, avatar, role, level, status }: CharacterCardProps) {
  return (
    <Link href={`/character/${id}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50 hover:-translate-y-1">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <Avatar className="h-16 w-16 border-2 border-border">
              <AvatarImage src={avatar || "/placeholder.svg"} alt={name} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <Badge className={statusColors[status]} variant="outline">
              {status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">{name}</h3>
          <p className="text-sm text-muted-foreground">{role}</p>
          <div className="flex items-center gap-2 pt-2">
            <Badge variant="secondary" className="font-mono">
              Lvl {level}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
