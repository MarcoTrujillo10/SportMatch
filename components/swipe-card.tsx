"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { MapPin, X, Check } from "lucide-react"
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion"

interface SwipeCardProps {
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
  isTop: boolean
  onSwipeLeft: () => void
  onSwipeRight: () => void
}

export function SwipeCard({ profile, isTop, onSwipeLeft, onSwipeRight }: SwipeCardProps) {
  const [exitX, setExitX] = useState(0)

  // Motion values para el deslizamiento
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-20, 0, 20])
  const leftIndicatorOpacity = useTransform(x, [-100, -20, 0], [1, 0, 0])
  const rightIndicatorOpacity = useTransform(x, [0, 20, 100], [0, 0, 1])
  const controls = useAnimation()

  // Umbral para considerar un swipe completo (en píxeles)
  const swipeThreshold = 100

  const handleDragEnd = async (_, info) => {
    if (info.offset.x < -swipeThreshold) {
      setExitX(-500)
      await controls.start({
        x: -500,
        opacity: 0,
        transition: { duration: 0.3 },
      })
      onSwipeLeft()
    } else if (info.offset.x > swipeThreshold) {
      setExitX(500)
      await controls.start({
        x: 500,
        opacity: 0,
        transition: { duration: 0.3 },
      })
      onSwipeRight()
    } else {
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      })
    }
  }

  // Resetear la posición cuando cambia el perfil
  useEffect(() => {
    x.set(0)
    controls.set({ x: 0, opacity: 1 })
  }, [profile.id, controls, x])

  return (
    <motion.div
      className="swipe-card"
      style={{
        x,
        rotate,
        zIndex: isTop ? 10 : 0,
      }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileTap={{ scale: 1.02 }}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.8 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.8 }}
      transition={{ duration: 0.2 }}
      exit={{ x: exitX, opacity: 0, transition: { duration: 0.2 } }}
    >
      <div className="relative h-full rounded-lg overflow-hidden">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <img
            src={profile.profilePicture || "/placeholder.svg"}
            alt={profile.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Gradiente mejorado para mejor contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

        {/* Contenido del perfil con mejor contraste */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="mb-3">
            <h2 className="text-2xl font-bold text-white drop-shadow-md">
              {profile.name}, {profile.age}
            </h2>
            <p className="flex items-center gap-1 text-white drop-shadow-md">
              <MapPin className="h-4 w-4" />
              {profile.location} • a {profile.distance} km
            </p>
          </div>

          {/* Fondo semi-transparente para la bio para mejorar legibilidad */}
          <div className="bg-black/40 p-3 rounded-lg mb-4 backdrop-blur-sm">
            <p className="text-white">{profile.bio}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile.sports.map((sport) => (
              <Badge
                key={sport}
                variant="secondary"
                className="bg-white/20 text-white backdrop-blur-sm border border-white/30"
              >
                {sport}
              </Badge>
            ))}
          </div>
        </div>

        {/* Indicadores de acción */}
        <motion.div
          className="absolute top-8 left-8 bg-destructive text-white p-3 rounded-full shadow-lg"
          style={{ opacity: leftIndicatorOpacity }}
        >
          <X className="h-8 w-8" />
        </motion.div>
        <motion.div
          className="absolute top-8 right-8 bg-primary text-white p-3 rounded-full shadow-lg"
          style={{ opacity: rightIndicatorOpacity }}
        >
          <Check className="h-8 w-8" />
        </motion.div>
      </div>
    </motion.div>
  )
}
