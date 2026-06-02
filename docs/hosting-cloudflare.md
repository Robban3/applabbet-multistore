# Hosting på Cloudflare

Appen körs på **Cloudflare Workers** via **OpenNext** (`@opennextjs/cloudflare`).
Det passar multi-tenant-upplägget perfekt: Workern läser `Host`-headern och
slår upp rätt tenant – precis som koden redan gör (`getCurrentHost` →
`tenant_domains`). De 200 kunddomänerna hanteras med **Cloudflare for SaaS**.

> Alla kommandon körs i `apps/web/`.

---

## 1. Engångsinstallation

```bash
cd apps/web
npm install                 # installerar @opennextjs/cloudflare + wrangler
npx wrangler login          # logga in mot ditt Cloudflare-konto
```

Konfigfiler som redan finns i repot:
- `wrangler.jsonc` – Worker-namn, `nodejs_compat`, assets-binding
- `open-next.config.ts` – OpenNext-config
- `next.config.ts` – kallar `initOpenNextCloudflareForDev()` (bara dev)
- `.dev.vars.example` – mall för lokala secrets

---

## 2. Miljövariabler & secrets

Två typer:

**A) Build-time (måste finnas när bygget körs)** – `NEXT_PUBLIC_*` bakas in:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Sätt dem i build-miljön (CI) eller i `.dev.vars` lokalt.

**B) Runtime-secrets (server)** – sätts som Worker-secrets:
```bash
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put STRIPE_WEBHOOK_SECRET
npx wrangler secret put OPENAI_API_KEY
```

Icke-hemliga vars (t.ex. `DEFAULT_TENANT_DOMAIN`, `OPENAI_MODEL`,
`ADMIN_BOOTSTRAP_EMAILS`, `THEME_BUILDER_EMAILS`) kan ligga i `vars`-blocket i
`wrangler.jsonc`.

> Koden läser `process.env.*` – med `nodejs_compat` fyller OpenNext på
> `process.env` från Worker-bindningarna, så ingen kodändring behövs.

---

## 3. Lokal preview (i Workers-runtime)

```bash
cp .dev.vars.example .dev.vars   # fyll i värden
npm run preview                  # bygger med OpenNext och kör i workerd lokalt
```

(`npm run dev` fortsätter funka som vanligt för snabb utveckling.)

---

## 4. Deploy

```bash
npm run deploy
```

Detta bygger med OpenNext och publicerar Workern. Första gången skapas Workern
`applabbet-multistore` (namnet i `wrangler.jsonc`).

CI-tips: kör `npm ci && npm run deploy` med `CLOUDFLARE_API_TOKEN` och
`CLOUDFLARE_ACCOUNT_ID` samt `NEXT_PUBLIC_*` satta i pipelinen.

---

## 5. De 200 kunddomänerna – Cloudflare for SaaS

Använd **Cloudflare for SaaS (Custom Hostnames)** så slipper du lägga upp varje
domän manuellt och får automatiska SSL-certifikat.

### Engångsuppsättning
1. Ha en **plattformszon** i Cloudflare (t.ex. `applabbet.se`).
2. Skapa en **fallback origin** som pekar på din Worker
   (t.ex. `app.applabbet.se` → Worker via Custom Domain/Route).
3. Aktivera **SSL/TLS → Custom Hostnames** på zonen.

### Per ny kund
1. Kunden pekar sin domän mot er:
   - `CNAME  kundens-doman.se  →  app.applabbet.se` (eller den CNAME Cloudflare anger).
2. Lägg till kundens domän som **Custom Hostname** (Dashboard eller API):
   ```bash
   curl -X POST \
     "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/custom_hostnames" \
     -H "Authorization: Bearer <API_TOKEN>" \
     -H "Content-Type: application/json" \
     -d '{"hostname":"kundens-doman.se","ssl":{"method":"http","type":"dv"}}'
   ```
3. Cloudflare utfärdar SSL automatiskt. Trafiken når din Worker.
4. Lägg domänen i **`tenant_domains`** (`verification_status = verified`) kopplad
   till kundens tenant. Klart – Workern matchar `Host` → rätt butik.

> Detta steg går att automatisera: när du skapar en tenant (se
> `onboarding-operator.md`) kan du i samma flöde anropa Custom Hostnames-API:t.

---

## 6. Supabase & Stripe

- **Supabase:** inget att ändra – appen pratar med Supabase över HTTPS. Se till
  att service-role-nyckeln är en **Worker-secret**, aldrig `NEXT_PUBLIC`.
- **Stripe webhooks:** peka webhook-URL:en till din publika Worker-URL
  (`/api/webhooks/...`) och sätt `STRIPE_WEBHOOK_SECRET` som secret. Verifiera
  att webhook-routen kör i Node-kompat-läge (den gör det med `nodejs_compat`).

---

## 7. Att känna till

- **Next.js 16 + OpenNext Cloudflare:** OpenNext utvecklas snabbt. Kör en
  `npm run preview` och klicka igenom flödena (kassa, server actions, mina sidor,
  favoriter) innan första prod-deploy. Uppstår en inkompatibilitet, lås
  `@opennextjs/cloudflare` till en version som stödjer din Next-version.
- **Caching:** standardconfigen kör utan ISR/data-cache (appen är till stor del
  dynamisk pga auth/cookies). Vill du cacha publika sidor senare – lägg till en
  R2/KV incremental cache i `open-next.config.ts`.
- **`nodejs_compat`** krävs (satt i `wrangler.jsonc`) för Supabase/Stripe/Node-API:er.

---

## Snabbreferens
```bash
npm install            # deps + wrangler
npm run preview        # bygg + kör lokalt i Workers-runtime
npm run deploy         # bygg + publicera
npx wrangler secret put <NAMN>   # lägg server-secret
npx wrangler tail      # live-loggar från Workern
```
