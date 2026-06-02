# Cloudflare – exakt vad du gör (quickstart)

**Kort svar:** Skapa **en Worker** (inte Pages), koppla **GitHub** så den
auto-deployar. En Worker hostar alla butiker.

---

## A. Engångs: koppla GitHub → Worker

1. Logga in på **dash.cloudflare.com**.
2. Vänster meny: **Compute (Workers)** → **Workers & Pages** → **Create**.
3. Välj fliken **Workers** → **Import a repository** (Connect to Git) → välj GitHub
   och repot `applabbet-multistore`.
4. **Build-inställningar** (viktigt – monorepo):
   - **Root directory:** `apps/web`
   - **Build command:** `npx opennextjs-cloudflare build`
   - **Deploy command:** `npx opennextjs-cloudflare deploy`
   - (Wrangler hittar `apps/web/wrangler.jsonc` automatiskt.)
5. Klicka **Create / Deploy**. Cloudflare bygger och driftsätter Workern
   `applabbet-multistore`.

> Varje `git push` till main triggar nu en ny deploy automatiskt.

---

## B. Engångs: miljövariabler & secrets

I Workern: **Settings → Variables and Secrets**.

**Vanliga variabler (Plaintext):**
```
NEXT_PUBLIC_SUPABASE_URL      = https://DITT-PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJ...anon...
DEFAULT_TENANT_DOMAIN         = applabbet.se
OPENAI_MODEL                  = gpt-4o-mini
```

**Secrets (Encrypted):**
```
SUPABASE_SERVICE_ROLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
OPENAI_API_KEY
```

> `NEXT_PUBLIC_*` måste finnas redan vid **bygget** – lägg dem som variabler så
> de finns när Cloudflare bygger. Lägg om en variabel → kör en ny deploy.

---

## C. Engångs: din plattformsdomän

1. Lägg till din zon (t.ex. `applabbet.se`) i Cloudflare (om den inte redan finns).
2. I Workern: **Settings → Domains & Routes → Add → Custom domain**
   → `app.applabbet.se` (din “origin” som kunddomäner pekar mot).

---

## D. Per kund: koppla deras domän (Cloudflare for SaaS)

1. På din zon: **SSL/TLS → Custom Hostnames** → aktivera (engång).
2. Kunden lägger DNS: `CNAME kundens-doman.se → app.applabbet.se`.
3. Lägg `kundens-doman.se` som **Custom Hostname** (Dashboard eller API) → SSL auto.
4. Lägg domänen i **`tenant_domains`** (`verified`) kopplad till kundens tenant.

Klart – Workern matchar `Host` → rätt butik.

---

## Sammanfattning (vad du faktiskt klickar)
| Steg | Var | Vad |
|---|---|---|
| 1 | Workers & Pages → Create → Workers → Connect Git | Koppla GitHub-repot |
| 2 | Build-inställningar | Root `apps/web`, build/deploy = opennextjs-cloudflare |
| 3 | Worker → Variables and Secrets | Lägg env-vars + secrets |
| 4 | Worker → Domains & Routes | `app.applabbet.se` som custom domain |
| 5 | Zon → Custom Hostnames | Kunddomäner (per kund) |

Ingen Pages. Ingen separat backend. En Worker, allt kör där.
