import { MovieInvitation } from "@/components/movie-invitation"
import { FloatingHearts } from "@/components/floating-hearts"
import { Sparkle } from "@/components/sparkle"

export default function Page() {
  return (
    <div className="romantic-bg relative min-h-dvh overflow-hidden">
      <Sparkle />
      <FloatingHearts />
      <MovieInvitation />
    </div>
  )
}
