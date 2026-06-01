import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { env } from "@/lib/env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  // Demo: dela auth-sessionen över alla *.localhost-subdomäner (sport.localhost,
  // luxury.localhost, …) så att en inloggning gäller alla demo-butiker. Riktiga
  // tenant-domäner (separata domäner) påverkas inte — de får host-scopad cookie.
  let cookieDomain: string | undefined;
  try {
    const headerHost = (await headers()).get("host") || "";
    const hostname = headerHost.split(":")[0]?.toLowerCase() || "";
    if (hostname === "localhost" || hostname.endsWith(".localhost")) {
      cookieDomain = "localhost";
    }
  } catch {
    // headers() ej tillgänglig i denna kontext — host-scopad cookie räcker.
  }

  return createServerClient(env.supabaseUrl(), env.supabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const cookie of cookiesToSet) {
          try {
            const options = cookieDomain
              ? { ...cookie.options, domain: cookieDomain }
              : cookie.options;
            cookieStore.set(cookie.name, cookie.value, options);
          } catch {
            // Setting cookies from Server Components can be ignored.
          }
        }
      },
    },
  });
}
