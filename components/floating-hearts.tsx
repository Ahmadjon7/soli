"use client"

import { useEffect, useState } from "react"
import { Heart } from "lucide-react"

type FloatHeart = {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<FloatHeart[]>([])

  useEffect(() => {
    const items = Array.from({ length: 14 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 14 + Math.random() * 24,
      duration: 12 + Math.random() * 10,
      delay: Math.random() * 12,
      opacity: 0.12 + Math.random() * 0.18,
    }))
    setHearts(items)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {hearts.map((h) => (
        <Heart
          key={h.id}
          className="absolute bottom-[-40px] animate-float-up fill-primary text-primary"
          style={
            {
              left: `${h.left}%`,
              width: h.size,
              height: h.size,
              "--float-duration": `${h.duration}s`,
              "--float-opacity": h.opacity,
              animationDelay: `${h.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}
