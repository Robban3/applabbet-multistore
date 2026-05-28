import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LiveChatWidget } from "@/components/live-chat-widget";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multistore",
  description: "Multi-tenant e-commerce platform with custom domains.",
};

function parseEnabledValue(value: string) {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return true;
  return ["true", "1", "yes", "on", "ja", "aktiv"].includes(normalized);
}

function parseTriggerPhrases(value: string) {
  return value
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const definition = getCmsPage("live-chat");
  const fallbackBlocks = definition ? createDefaultBlocksContent(definition) : {};
  const liveChatCms = await getPublishedPageContent("live-chat", { blocks: fallbackBlocks });

  const enabledValue = getCmsBlockField(liveChatCms.blocks, "settings", "enabled", "true");
  const triggerPhrasesValue = getCmsBlockField(
    liveChatCms.blocks,
    "settings",
    "triggerPhrases",
    "livechat, live chatt, starta chat, chatta med oss, till chatten, öppna chatten, öppna chatt, till live chatt",
  );

  return (
    <html lang="sv" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <SiteFooter />
        <LiveChatWidget
          config={{
            enabled: parseEnabledValue(enabledValue),
            agentName: getCmsBlockField(liveChatCms.blocks, "settings", "agentName", "Ava"),
            headerTitle: getCmsBlockField(liveChatCms.blocks, "settings", "headerTitle", "Livechatt med AI-agent"),
            statusText: getCmsBlockField(liveChatCms.blocks, "settings", "statusText", "Online nu"),
            welcomeMessage: getCmsBlockField(
              liveChatCms.blocks,
              "settings",
              "welcomeMessage",
              "Hej! Jag är din AI-agent. Hur kan jag hjälpa dig idag?",
            ),
            launcherLabel: getCmsBlockField(liveChatCms.blocks, "settings", "launcherLabel", "Livechatt"),
            closeLabel: getCmsBlockField(liveChatCms.blocks, "settings", "closeLabel", "Stäng"),
            inputPlaceholder: getCmsBlockField(
              liveChatCms.blocks,
              "settings",
              "inputPlaceholder",
              "Skriv ditt meddelande...",
            ),
            sendLabel: getCmsBlockField(liveChatCms.blocks, "settings", "sendLabel", "Skicka"),
            typingLabel: getCmsBlockField(liveChatCms.blocks, "settings", "typingLabel", "Skriver..."),
            triggerPhrases: parseTriggerPhrases(triggerPhrasesValue),
          }}
        />
      </body>
    </html>
  );
}
