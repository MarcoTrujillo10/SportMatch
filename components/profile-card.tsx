import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

interface ProfileCardProps {
  profile: {
    id: string
    name: string
    age: number
    location: string
    bio: string
    sports: string[]
    distance: number
    profilePicture: string
  }
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Card className="overflow-hidden h-[70vh]">
      <div className="relative h-full">
        <div className="absolute inset-0">
          <img
            src={profile.profilePicture || "/placeholder.svg"}
            alt={profile.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mb-2">
            <h2 className="text-2xl font-bold">
              {profile.name}, {profile.age}
            </h2>
            <p className="flex items-center gap-1 text-white/80">
              <MapPin className="h-4 w-4" />
              {profile.location} • a {profile.distance} km
            </p>
          </div>
          <p className="mb-4 line-clamp-3">{profile.bio}</p>
          <div className="flex flex-wrap gap-2">
            {profile.sports.map((sport) => (
              <Badge key={sport} variant="secondary">
                {sport}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
