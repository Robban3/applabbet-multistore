# applabbet-multistore

Multi-tenant e-commerce i Next.js + Supabase med storefront, adminpanel, CMS, logistik och checkout.

## Struktur

- `apps/web` - Next.js app (storefront + admin + API routes)
- `supabase/migrations` - SQL-migrationer för datamodell och RLS
- `packages` - delade paket (förberett)

## Kom igång lokalt

1. Installera dependencies:
   - `npm install`
2. Skapa env-fil:
   - kopiera `apps/web/.env.example` -> `apps/web/.env.local`
3. Fyll i env-värden i `apps/web/.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY` (valfri om endast Klarna/Swish-simulerat flöde)
   - `STRIPE_WEBHOOK_SECRET` (valfri för lokal utveckling)
   - `DEFAULT_TENANT_DOMAIN` (t.ex. `localhost`)
4. Starta appen:
   - `npm run dev`
5. Öppna:
   - storefront: `http://localhost:3000`
   - admin login: `http://localhost:3000/admin/login`

## Demo-inlogg (kund)

Använd följande testkonto för att logga in och testa Mina sidor:

- login-sida: `http://localhost:3000/konto/login`
- e-post: `testkonto@applabbet.local`
- lösenord: `Testkonto!2026`

## Demo-inlogg (admin)

Använd följande testkonto för adminpanelen:

- admin login: `http://localhost:3000/admin/login`
- e-post: `admin@applabbet.local`
- lösenord: `Admin!2026`

## Store name i admin/CMS

Store name sätts i admin på:

- `http://localhost:3000/admin/settings`
- fält: `Store name (visningsnamn)` (`brand_name`)

## Databas / migrationer

Kör SQL-filerna i `supabase/migrations` i ordning i Supabase SQL Editor:

1. `0001_multitenant_core.sql`
2. `0002_security_and_perf_hardening.sql`
3. `0003_page_content_cms.sql`
4. `0004_tenant_settings_and_custom_pages.sql`
5. `0005_logistics_shipping_inventory.sql`

## Adminpanel (routes)

- `/admin/login` - inloggning
- `/admin/products` - produkt-CRUD + bilduppladdning
- `/admin/orders` - orderlista + fulfillment/payment-info
- `/admin/pages` - CMS för standardsidor
- `/admin/pages/custom` - skapa/redigera egna sidor (`/sidor/[slug]`)
- `/admin/settings/site` - sidinställningar (logo, site name, kontakt, footer-visning)
- `/admin/settings/menu` - menyinställningar (visning, länkar, slug, ordning)
- `/admin/settings/company` - företagsinställningar (företagsuppgifter/adress)
- `/admin/settings/payments` - betalmetoder och betal-konfiguration
- `/admin/users` - koppla e-post till adminroll och behörighet
- `/admin/logistics` - lagerställen, fraktkedjor, leveransmetoder, lagersaldo

## Viktigt för admin-access

Admin är tenant-bundet. För att en användare ska kunna logga in i admin krävs:

- en verifierad domän i `tenant_domains` för aktuell host
- användaren kopplad till tenant i `tenant_users`
- roll `admin`, `editor` (redigerare) eller `product_manager` (produktansvarig) för att skriva data

## CMS / funktioner

- Blockbaserat CMS per sida och tenant (`page_content`)
- Custom pages (`custom_pages`) publiceras på `/sidor/[slug]`
- Tenant-inställningar (`tenant_settings`) för branding + betalmetoder
- Logistik/lager:
  - `warehouses`
  - `carrier_integrations`
  - `shipping_methods` (leveransdagar, cutoff, pris)
  - `inventory_levels` (on hand/reserverat/beställningspunkt)

## Validering

- lint: `npm run lint`
- build: `npm run build`
