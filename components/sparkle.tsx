"use client"

import { useEffect, useState } from "react"
import { Sparkles, Star } from "lucide-react"

type Twinkle = {
  id: number
  top: number
  left: number
  size: number
  duration: number
  delay: number
  star: boolean
}

export function Sparkle() {
  const [items, setItems] = useState<Twinkle[]>([])

  useEffect(() => {
    const data = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      left: Math.random() * 100,
      size: 10 + Math.random() * 16,
      duration: 2.5 + Math.random() * 3,
      delay: Math.random() * 4,
      star: Math.random() > 0.5,
    }))
    setItems(data)
  }, [])

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {items.map((s) => {
        const Icon = s.star ? Star : Sparkles
        return (
          <Icon
            key={s.id}
            className="absolute animate-twinkle fill-primary/40 text-primary/60"
            style={
              {
                top: `${s.top}%`,
                left: `${s.left}%`,
                width: s.size,
                height: s.size,
                "--twinkle-duration": `${s.duration}s`,
                animationDelay: `${s.delay}s`,
              } as React.CSSProperties
            }
          />
        )
      })}
    </div>
  )
}
