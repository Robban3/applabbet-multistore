import { NextRequest, NextResponse } from "next/server";

type IncomingMessage = {
  role: "assistant" | "user";
  text: string;
};

type LiveChatRequest = {
  agentName?: string;
  messages?: IncomingMessage[];
};

function fallbackReply(message: string, agentName: string) {
  const lower = message.toLowerCase();
  if (lower.includes("retur")) {
    return "För returer: gå till Mina sidor > Returer & återbetalningar och starta din retur därifrån. Behöver du hjälp kan jag guida dig steg för steg.";
  }
  if (lower.includes("leverans") || lower.includes("frakt")) {
    return "För leveransfrågor kan du kolla status i Mina ordrar. Om du vill kan jag hjälpa dig hitta rätt order direkt.";
  }
  return `Jag är ${agentName} och hjälper dig gärna vidare. Beskriv gärna mer detaljerat vad du vill lösa så tar vi det steg för steg.`;
}

export async function POST(request: NextRequest) {
  let body: LiveChatRequest | null = null;
  try {
    body = (await request.json()) as LiveChatRequest;
  } catch {
    return NextResponse.json({ reply: "Kunde inte läsa chattmeddelandet." }, { status: 400 });
  }

  const messages = Array.isArray(body?.messages) ? body!.messages : [];
  const latestUserMessage =
    [...messages].reverse().find((message) => message.role === "user")?.text?.trim() || "";
  const agentName = String(body?.agentName || "Ava").trim() || "Ava";

  if (!latestUserMessage) {
    return NextResponse.json({ reply: `Hej! Jag är ${agentName}. Hur kan jag hjälpa dig i dag?` });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return NextResponse.json({
      reply:
        "AI-chatten är inte konfigurerad ännu (saknar OPENAI_API_KEY). Jag kan fortfarande hjälpa dig med grundläggande frågor: " +
        fallbackReply(latestUserMessage, agentName),
    });
  }

  const chatMessages = messages
    .filter((message) => message.text && (message.role === "assistant" || message.role === "user"))
    .slice(-14)
    .map((message) => ({
      role: message.role,
      content: message.text,
    }));

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.5,
        messages: [
          {
            role: "system",
            content:
              `Du är ${agentName}, en hjälpsam svensk kundserviceagent för en e-handelsbutik. ` +
              "Svara kort, tydligt och lösningsorienterat. Om du saknar information, be om exakt det som behövs.",
          },
          ...chatMessages,
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        reply:
          "AI-tjänsten svarar inte just nu. Försök igen om en stund. " +
          `(Teknisk information: ${errorText.slice(0, 180)})`,
      });
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = payload.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json({
        reply: fallbackReply(latestUserMessage, agentName),
      });
    }

    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({
      reply: "Något gick fel när AI-chatten skulle svara. Försök igen om en stund.",
    });
  }
}
