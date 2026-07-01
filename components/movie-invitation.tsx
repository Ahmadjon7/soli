"use client"

import { useState, useRef, useEffect } from "react"
import { Heart, Film, Sparkles, Star } from "lucide-react"

/* ————————————————————————————————————————————————
   Bu yerdagi matnlarni bemalol o'zgartiring
———————————————————————————————————————————————— */
const NAME = "Soliha" // taklif qilinayotgan inson ismi
const SENDER = "Ahmadjon" // sizning ismingiz

const MOVIE = {
  title: "O'rgimchak odam: Yangi kun",
  place: "Magic City",
  date: "Payshanba, 6-avgust",
  time: "17:00",
  seat: "yonimda",
}

const QUESTIONS: {
  q: string
  options: { text: string; correct?: boolean }[]
}[] = [
  {
    q: "6-avgust kuni voqting bormi?",
    options: [
      { text: "Ha, albatta bor 💕", correct: true },
      { text: "Band bo'lishim mumkin 😴" },
      { text: "Hmm, bilmadim 🤔" },
    ],
  },
  {
    q: "Birga qayerga boramiz?",
    options: [
      { text: "Magic City 🏰", correct: true },
      { text: "Toshkent City Mall 🛍️", correct: true },
      { text: "Hech qayerga, dangasalik 🛋️" },
    ],
  },
  {
    q: "Nima ko'ramiz?",
    options: [
      { text: "O'rgimchak odam: Yangi kun 🕷️", correct: true },
      { text: "Avatar 3 🌊" },
      { text: "Dune: 3-qism 🏜️" },
    ],
  },
  {
    q: "Shu oqshomni men bilan o'tkazasanmi?",
    options: [
      { text: "Ha, albatta ❤️", correct: true },
      { text: "O'ylab ko'rishim kerak 🤔" },
    ],
  },
]

type Stage = "intro" | "quiz" | "final"
type Selection = { question: string; answer: string }

async function submitSelections(
  selections: Selection[],
  ticket: typeof MOVIE,
) {
  try {
    await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guestName: NAME,
        sender: SENDER,
        selections,
        movie: ticket,
      }),
    })
  } catch {
    // Mehmon tajribasini buzmaslik uchun xatolikni yashiramiz
  }
}

function buildTicket(selections: Selection[]) {
  const venue = selections.find((s) => s.question.includes("qayerga"))?.answer
  const movie = selections.find((s) => s.question.includes("ko'ramiz"))?.answer

  return {
    ...MOVIE,
    place: venue || MOVIE.place,
    title: movie || MOVIE.title,
  }
}

export function MovieInvitation() {
  const [stage, setStage] = useState<Stage>("intro")
  const [step, setStep] = useState(0)
  const [selections, setSelections] = useState<Selection[]>([])
  const [ticket, setTicket] = useState(MOVIE)

  function restart() {
    setStep(0)
    setStage("intro")
    setSelections([])
    setTicket(MOVIE)
  }

  if (stage === "intro") {
    return <IntroView onStart={() => setStage("quiz")} />
  }

  if (stage === "final") {
    return <FinalView ticket={ticket} onRestart={restart} />
  }

  const current = QUESTIONS[step]

  function answer(selectedText: string) {
    const newSelections = [...selections, { question: current.q, answer: selectedText }]

    if (step < QUESTIONS.length - 1) {
      setSelections(newSelections)
      setStep((s) => s + 1)
    } else {
      const finalTicket = buildTicket(newSelections)
      setSelections(newSelections)
      setTicket(finalTicket)
      setStage("final")
      submitSelections(newSelections, finalTicket)
    }
  }

  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center gap-8 px-5 py-12 text-center">
      <div className="flex items-center gap-1.5 text-primary/50">
        <Star className="size-3.5 fill-current" aria-hidden="true" />
        <Heart className="size-4 fill-current" aria-hidden="true" />
        <Star className="size-3.5 fill-current" aria-hidden="true" />
      </div>

      <h1
        key={current.q}
        className="animate-pop-in text-balance font-serif text-3xl font-bold leading-snug text-foreground sm:text-4xl"
      >
        {current.q}
      </h1>

      <div className="flex w-full flex-col items-center gap-4">
        {current.options.map((opt, i) =>
          opt.correct ? (
            <button
              key={opt.text}
              onClick={() => answer(opt.text)}
              className="inline-flex w-full max-w-sm animate-soft-pulse items-center justify-center rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              {opt.text}
            </button>
          ) : (
            <DodgeButton key={opt.text} text={opt.text} index={i} />
          ),
        )}
      </div>

      <div className="flex items-center gap-2 pt-2">
        {QUESTIONS.map((_, i) => (
          <span
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === step ? "w-6 bg-primary" : i < step ? "w-2 bg-primary/60" : "w-2 bg-primary/20"
            }`}
            aria-hidden="true"
          />
        ))}
      </div>
    </main>
  )
}

/* Injiq, qochib yuradigan tugma */
function DodgeButton({ text, index }: { text: string; index: number }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const teases = ["Bu javob emas 😏", "Yo'q-yo'q 🙈", "Qiziq emas 🙃", "Ushlab bo'lmaydi! 🏃", "Boshqasini tanla 💔"]
  const [tease, setTease] = useState(text)

  function dodge() {
    // Ekran kengligiga qarab siljish masofasini cheklaymiz (telefonda chiqib ketmasligi uchun)
    const maxX = typeof window !== "undefined" ? Math.min(120, window.innerWidth / 4) : 120
    const x = (Math.random() - 0.5) * 2 * maxX
    const y = (Math.random() - 0.5) * 150
    setOffset({ x, y })
    setTease(teases[Math.floor(Math.random() * teases.length)])
  }

  return (
    <button
      onMouseEnter={dodge}
      onClick={(e) => {
        e.preventDefault()
        dodge()
      }}
      onTouchStart={(e) => {
        e.preventDefault()
        dodge()
      }}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      className="inline-flex w-full max-w-sm items-center justify-center rounded-full border border-border bg-card/70 px-6 py-3.5 font-medium text-muted-foreground backdrop-blur-sm transition-all duration-300 ease-out"
    >
      {offset.x === 0 && offset.y === 0 ? text : tease}
    </button>
  )
}

function IntroView({ onStart }: { onStart: () => void }) {
  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center gap-7 px-5 py-12 text-center">
      <p className="animate-pop-in font-serif text-xl italic text-primary">sen uchun, {NAME} 💌</p>

      <h1 className="text-balance font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
        Kichkina kviz —<br />
        katta sir bilan
      </h1>

      <p className="max-w-sm text-pretty leading-relaxed text-muted-foreground">
        Bir nechta savolga javob ber... lekin ehtiyot bo&apos;l — ba&apos;zi tugmalar injiq 😏
      </p>

      <button
        onClick={onStart}
        className="mt-2 inline-flex animate-soft-pulse items-center justify-center gap-2 rounded-full bg-primary px-10 py-4 text-lg font-semibold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
      >
        Boshladik
        <Sparkles className="size-5 fill-primary-foreground/40" aria-hidden="true" />
      </button>
    </main>
  )
}

function FinalView({ ticket, onRestart }: { ticket: typeof MOVIE; onRestart: () => void }) {
  const [hearts, setHearts] = useState<{ id: number; left: number; delay: number; size: number }[]>([])

  useEffect(() => {
    const items = Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      size: 14 + Math.random() * 22,
    }))
    setHearts(items)
  }, [])

  return (
    <main className="relative z-10 mx-auto flex min-h-dvh w-full max-w-xl flex-col items-center justify-center gap-6 px-5 py-12 text-center">
      {hearts.map((h) => (
        <Heart
          key={h.id}
          className="pointer-events-none absolute -top-10 animate-fall fill-primary text-primary"
          style={{
            left: `${h.left}%`,
            width: h.size,
            height: h.size,
            animationDelay: `${h.delay}s`,
            opacity: 0.7,
          }}
          aria-hidden="true"
        />
      ))}

      <div className="flex flex-col items-center gap-1">
        <p className="font-serif text-xl italic text-primary">to&apos;g&apos;ri tanlading 💕</p>
        <h1 className="text-balance font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
          Bu — uchrashuv!
        </h1>
      </div>

      {/* Chipta */}
      <div className="relative w-full animate-pop-in overflow-hidden rounded-[2rem] border border-primary/15 bg-card/80 text-left shadow-[0_24px_60px_-22px_oklch(0.66_0.2_355_/_0.5)] backdrop-blur-md">
        {/* chipta teshiklari */}
        <span className="absolute -left-3 top-[42%] size-6 rounded-full bg-background" aria-hidden="true" />
        <span className="absolute -right-3 top-[42%] size-6 rounded-full bg-background" aria-hidden="true" />

        <div className="flex items-center gap-3 px-6 pt-6">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
            <Film className="size-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-serif text-xl font-bold text-primary">{ticket.place}</p>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Ikki kishilik chipta</p>
          </div>
          <Heart className="ml-auto size-7 fill-primary text-primary" aria-hidden="true" />
        </div>

        <div className="mx-6 my-4 border-t-2 border-dashed border-primary/20" aria-hidden="true" />

        <dl className="space-y-3 px-6 pb-6">
          <TicketRow label="Seans" value={ticket.title} />
          <TicketRow label="Qachon" value={ticket.date} />
          <TicketRow label="Vaqt" value={ticket.time} />
          <TicketRow label="Joy" value={`${ticket.seat} ❤️`} />
        </dl>
      </div>

      {/* Qo'lyozma xat */}
      <div className="flex flex-col items-center gap-1">
        <p className="text-pretty font-serif text-lg italic leading-relaxed text-foreground/90">
          Chiroyli bo&apos;lib tayyorlan,
          <br />
          qolganini o&apos;zim hal qilaman 💖
        </p>
        <p className="text-sm italic text-muted-foreground">Seni taklif qilyapti — {SENDER}</p>
      </div>

      <button
        onClick={onRestart}
        className="text-sm font-medium text-primary underline-offset-4 transition-colors hover:underline"
      >
        yana bir bor o&apos;tish
      </button>
    </main>
  )
}

function TicketRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-right font-semibold text-foreground">{value}</dd>
    </div>
  )
}
