"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const DEFAULT_TRIGGER_PHRASES = [
  "livechat",
  "live chatt",
  "starta chatt",
  "starta chat",
  "öppna livechatt",
  "chatta med oss",
  "till chatten",
  "öppna chatten",
  "öppna chatt",
  "till live chatt",
];

export type LiveChatWidgetConfig = {
  enabled: boolean;
  agentName: string;
  headerTitle: string;
  statusText: string;
  welcomeMessage: string;
  launcherLabel: string;
  closeLabel: string;
  inputPlaceholder: string;
  sendLabel: string;
  typingLabel: string;
  triggerPhrases: string[];
};

const DEFAULT_CONFIG: LiveChatWidgetConfig = {
  enabled: true,
  agentName: "Ava",
  headerTitle: "Livechatt med AI-assistent",
  statusText: "Online nu",
  welcomeMessage: "Hej! Jag är din AI-assistent. Hur kan jag hjälpa dig i dag?",
  launcherLabel: "Livechatt",
  closeLabel: "Stäng",
  inputPlaceholder: "Skriv ditt meddelande...",
  sendLabel: "Skicka",
  typingLabel: "Skriver...",
  triggerPhrases: DEFAULT_TRIGGER_PHRASES,
};

function generateLocalFallbackReply(input: string, agentName: string) {
  const message = input.toLowerCase();

  if (message.includes("retur") || message.includes("återbetal")) {
    return "Jag hjälper dig gärna med returer. Gå till Mina sidor > Returer & återbetalningar så kan du registrera returen steg för steg.";
  }
  if (message.includes("leverans") || message.includes("frakt") || message.includes("spår")) {
    return "När det gäller leverans och spårning hittar du status under Mina ordrar. Jag kan guida dig till rätt sida om du vill.";
  }
  if (message.includes("betal") || message.includes("kort") || message.includes("faktura")) {
    return "Jag hjälper dig gärna med betalning. Beskriv vad som händer (till exempel felmeddelande i kassan), så felsöker vi tillsammans.";
  }
  if (message.includes("konto") || message.includes("logga in") || message.includes("inlogg")) {
    return "Har du problem med inloggning eller konto? Jag kan guida dig genom lösenordsåterställning eller kontroll av kundprofil steg för steg.";
  }

  return `Tack! Jag är ${agentName} och hjälper dig gärna vidare i chatten. Beskriv ditt ärende så tydligt du kan, så tar vi nästa steg tillsammans.`;
}

function matchesLiveChatTrigger(element: HTMLElement, triggerPhrases: string[]) {
  if (element.dataset.liveChatTrigger === "true") return true;

  if (element instanceof HTMLAnchorElement) {
    const href = element.getAttribute("href") || "";
    if (href.includes("#live-chat") || href.includes("open-live-chat=1")) {
      return true;
    }
  }

  const normalizedText = (element.textContent || "").toLowerCase().replace(/\s+/g, " ").trim();
  if (!normalizedText) return false;

  return triggerPhrases.some((phrase) => normalizedText.includes(phrase));
}

export function LiveChatWidget({ config }: { config?: Partial<LiveChatWidgetConfig> }) {
  const mergedConfig = useMemo<LiveChatWidgetConfig>(
    () => ({
      ...DEFAULT_CONFIG,
      ...config,
      triggerPhrases: config?.triggerPhrases?.length ? config.triggerPhrases : DEFAULT_CONFIG.triggerPhrases,
    }),
    [config],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      text: mergedConfig.welcomeMessage,
    },
  ]);

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mergedConfig.enabled) return;

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const trigger = target.closest<HTMLElement>("a,button,[role='button'],[data-live-chat-trigger]");
      if (!trigger) return;
      if (!matchesLiveChatTrigger(trigger, mergedConfig.triggerPhrases)) return;

      event.preventDefault();
      setIsOpen(true);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("click", handleDocumentClick, true);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mergedConfig.enabled, mergedConfig.triggerPhrases]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isTyping, isOpen]);

  const canSend = useMemo(() => input.trim().length > 0 && !isTyping, [input, isTyping]);

  const sendMessage = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isTyping) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    const conversation = [...messages, userMessage].map((message) => ({
      role: message.role,
      text: message.text,
    }));

    try {
      const response = await fetch("/api/live-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentName: mergedConfig.agentName,
          messages: conversation,
        }),
      });

      let assistantText = "";
      if (response.ok) {
        const payload = (await response.json()) as { reply?: string };
        assistantText = String(payload.reply || "").trim();
      }

      if (!assistantText) {
        assistantText = generateLocalFallbackReply(trimmed, mergedConfig.agentName);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: assistantText,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: generateLocalFallbackReply(trimmed, mergedConfig.agentName),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  if (!mergedConfig.enabled) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[120] flex flex-col items-end gap-3">
      {isOpen ? (
        <section className="pointer-events-auto w-[min(360px,calc(100vw-1rem))] overflow-hidden rounded-2xl border border-[#e6ddd1] bg-white shadow-[0_12px_40px_rgba(15,12,9,0.2)]">
          <header className="flex items-center justify-between border-b border-[#efe7dc] bg-[#11100d] px-4 py-3 text-white">
            <div>
              <p className="text-sm font-semibold">{mergedConfig.headerTitle}</p>
              <p className="text-xs text-white/75">{mergedConfig.statusText}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-md border border-white/20 px-2 py-1 text-xs font-semibold hover:bg-white/10"
              aria-label="Stäng chatten"
            >
              {mergedConfig.closeLabel}
            </button>
          </header>

          <div ref={listRef} className="max-h-[420px] space-y-2 overflow-y-auto bg-[#faf7f2] px-3 py-3">
            {messages.map((message) => (
              <article
                key={message.id}
                className={`max-w-[88%] rounded-xl px-3 py-2 text-sm ${
                  message.role === "assistant"
                    ? "mr-auto bg-white text-slate-800"
                    : "ml-auto bg-[#d7ad62] text-slate-900"
                }`}
              >
                {message.text}
              </article>
            ))}
            {isTyping ? (
              <article className="mr-auto rounded-xl bg-white px-3 py-2 text-sm text-slate-500">{mergedConfig.typingLabel}</article>
            ) : null}
          </div>

          <form onSubmit={sendMessage} className="border-t border-[#efe7dc] bg-white p-3">
            <label className="sr-only" htmlFor="live-chat-input">
              Skriv meddelande
            </label>
            <div className="flex items-center gap-2">
              <input
                id="live-chat-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={mergedConfig.inputPlaceholder}
                className="h-10 flex-1 rounded-lg border border-[#dfd3c4] px-3 text-sm outline-none transition focus:border-[#b88f50]"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="h-10 rounded-lg bg-black px-4 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {mergedConfig.sendLabel}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white shadow-[0_8px_26px_rgba(0,0,0,0.28)] hover:bg-[#1d1a15]"
        aria-label="Öppna livechatten"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
          <path d="M4 6h16v10H8l-4 4V6Z" />
        </svg>
        {mergedConfig.launcherLabel}
      </button>
    </div>
  );
}
