import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { LiveChatWidget } from "@/components/live-chat-widget";
import { getCmsBlockField, getPublishedPageContent } from "@/lib/cms/content";
import { createDefaultBlocksContent, getCmsPage } from "@/lib/cms/registry";
import { SiteFooter } from "@/components/site-footer";
import { DevThemeSwitcher } from "@/components/dev-theme-switcher";
import { isElectronicsStorefront } from "@/lib/account-context";
import { getTenantSettings, normalizeThemeKey } from "@/lib/tenant-settings";
import { getCurrentHost, resolveTenantByHost } from "@/lib/tenant";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
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
  const cookieStore = await cookies();
  const previewPageKey = cookieStore.get("cms_preview_page_key")?.value;
  const previewCustomPageId = cookieStore.get("cms_preview_custom_page_id")?.value;
  const previewIsActive = Boolean(previewPageKey || previewCustomPageId);
  const backToEditorHref = previewPageKey ? `/admin/pages/${previewPageKey}?view=edit` : "/admin/pages/custom";

  async function closePreview() {
    "use server";
    const actionCookies = await cookies();
    actionCookies.delete("cms_preview_page_key");
    actionCookies.delete("cms_preview_custom_page_id");
    redirect("/admin/pages");
  }

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

  const host = await getCurrentHost();
  const tenant = await resolveTenantByHost(host);
  const tenantSettings = tenant ? await getTenantSettings(tenant) : null;
  const themeKey = normalizeThemeKey(tenantSettings?.theme_key);
  const storeTheme = isElectronicsStorefront(host, themeKey) ? "electronics" : themeKey;

  return (
    <html lang="sv" className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" data-store-theme={storeTheme}>
        {previewIsActive ? (
          <div className="sticky top-0 z-[70] border-b border-sky-200 bg-sky-50/95 px-3 py-2 backdrop-blur">
            <div className="mx-auto flex w-full max-w-[1380px] flex-wrap items-center justify-between gap-2">
              <p className="text-xs font-medium text-sky-900">
                Preview-läge aktivt. Du tittar på ett utkast.
              </p>
              <div className="flex items-center gap-2">
                <Link
                  href={backToEditorHref}
                  className="inline-flex rounded-md border border-sky-300 bg-white px-2.5 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-100"
                >
                  Tillbaka till redigering
                </Link>
                <form action={closePreview}>
                  <button
                    type="submit"
                    className="inline-flex rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Stäng preview
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : null}
        {children}
        {process.env.NODE_ENV === "development" && (
          <DevThemeSwitcher currentTheme={storeTheme} />
        )}
        <div data-storefront-footer>
          <SiteFooter />
        </div>
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
