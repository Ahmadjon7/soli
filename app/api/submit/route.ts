import { NextResponse } from "next/server"

type Selection = { question: string; answer: string }

type SubmitBody = {
  guestName: string
  sender: string
  selections: Selection[]
  movie: {
    title: string
    place: string
    date: string
    time: string
    seat: string
  }
}

function formatMessage(body: SubmitBody): string {
  const lines = [
    `🎬 <b>${body.guestName}</b> kvizni tugatdi!`,
    "",
    "<b>Tanlovlar:</b>",
    ...body.selections.map((s, i) => `${i + 1}. ${s.question}\n   → ${s.answer}`),
    "",
    "<b>Chipta:</b>",
    `🎥 ${body.movie.title}`,
    `📍 ${body.movie.place}`,
    `📅 ${body.movie.date}, ${body.movie.time}`,
    `💺 ${body.movie.seat}`,
    "",
    `⏰ ${new Date().toLocaleString("uz-UZ", { timeZone: "Asia/Tashkent" })}`,
  ]
  return lines.join("\n")
}

async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return false

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML" }),
  })

  return res.ok
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmitBody

    if (!body.selections?.length) {
      return NextResponse.json({ error: "Tanlovlar topilmadi" }, { status: 400 })
    }

    const message = formatMessage(body)
    const sent = await sendTelegram(message)

    if (!sent) {
      console.log("[submit] Telegram sozlanmagan — tanlovlar:", message)
    }

    return NextResponse.json({ ok: true, notified: sent })
  } catch {
    return NextResponse.json({ error: "Xatolik yuz berdi" }, { status: 500 })
  }
}
