# applabbet-multistore

Multi-tenant e-handel i Next.js + Supabase: storefront med flera visuella teman, adminpanel, CMS, logistik och checkout.

## Struktur

| Sökväg | Innehåll |
|--------|----------|
| `apps/web` | Next.js (storefront + admin + API routes) |
| `supabase/migrations` | SQL-migrationer (datamodell + RLS) |
| `packages` | Delade paket (förberett) |
| `docs/tenant-onboarding.md` | Checklista för ny tenant i produktion |

## Kom igång lokalt

1. Installera dependencies:

   ```bash
   npm install
   ```

2. Skapa env-fil:

   ```bash
   cp apps/web/.env.example apps/web/.env.local
   ```

3. Fyll i `apps/web/.env.local`:

   | Variabel | Beskrivning |
   |----------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key |
   | `SUPABASE_SERVICE_ROLE_KEY` | Service role (server) |
   | `DEFAULT_TENANT_DOMAIN` | Domän som mappar `localhost` → tenant (t.ex. `localhost` eller `applabbet.localhost`) |
   | `STRIPE_SECRET_KEY` | Valfri (Stripe-checkout) |
   | `STRIPE_WEBHOOK_SECRET` | Valfri (webhooks lokalt) |
   | `ADMIN_BOOTSTRAP_EMAILS` | Valfri komma-separerad lista med e-post som får auto-admin på ny tenant |

4. Kör migrationer i Supabase SQL Editor (se [Databas](#databas--migrationer)).

5. Starta dev-server:

   ```bash
   npm run dev
   ```

6. Öppna storefront (standard-tenant):

   - `http://localhost:3000`

## Demo-butiker och teman (utveckling)

I dev visas en **väljare nere till höger** (“DEV — Demo-butiker”). Varje rad byter butik/tema.

**Subdomän = egen tenant** i databasen (egna kategorier och produkter).  
**Beauty** har ingen egen tenant: väljaren sätter cookien `dev_theme=beauty` på `localhost` (visuell preview på `applabbet-demo`).

| Tema | URL (port 3000) | Tenant-typ | Signatur i UI |
|------|-----------------|------------|----------------|
| Classic | `http://classic.localhost:3000` | Egen demo-tenant | Varm retail / heritage |
| Luxury | `http://luxury.localhost:3000` | Egen demo-tenant | Editorial premium |
| Sport | `http://sport.localhost:3000` | Egen demo-tenant | Nike-inspirerad |
| Fashion | `http://fashion.localhost:3000` | Egen demo-tenant | Filippa K-liknande |
| Electronics | `http://electronics.localhost:3000` | Egen demo-tenant (`electronics-demo`) | Komplett/Webhallen/Apple: stor sök, megameny, deal-kort |
| Minimal | `http://minimal.localhost:3000` | Egen demo-tenant | Apple-liknande minimalism |
| Beauty | `http://localhost:3000` + cookie | Preview på default-tenant | Skönhet / rosa toner |
| Dev (blandat) | `http://localhost:3000` | `applabbet-demo` | Blandad demo-data |

`*.localhost` fungerar i de flesta moderna webbläsare utan extra hosts-fil. Om en subdomän inte når appen, lägg till t.ex. `127.0.0.1 electronics.localhost` i `C:\Windows\System32\drivers\etc\hosts`.

**Tema i databas:** `tenant_settings.theme_key` (admin → Butiksinställningar) eller dev-cookie endast för slug `applabbet-demo`.

### Storefront — viktiga sidor

Gäller alla teman (layout/styling varierar). Byt host enligt tabellen ovan.

| Sida | Sökväg | Kommentar |
|------|--------|-----------|
| Startsida | `/` | Tema-specifik layout (t.ex. electronics = egen header/hero/deals) |
| Produkter | `/products` | Filter, kategorier |
| Produktdetalj | `/products/[slug]` | Varianter, galleri |
| Nyheter | `/nyheter` | `is_new` / nyhetslista |
| Bästsäljare | `/bastsaljare` | Deals / populärt |
| Sök | `/sok?q=...` | Sök + filter (electronics: deal-kort) |
| Varukorg | `/cart` | Tema-specifik cart där det finns |
| Kassa | `/checkout` | `KassaClient` |
| Logga in | `/konto/login` | Kundauth |
| Skapa konto | `/konto/skapa-konto` | |
| Mina sidor | `/mina-sidor` | Översikt (tabs för sport/fashion/minimal/electronics) |
| Ordrar | `/mina-sidor/ordrar` | |
| Favoriter | `/mina-sidor/favoriter` | |
| Profil | `/mina-sidor/profil` | |
| Adresser | `/mina-sidor/adresser` | |
| Admin (butik) | `/admin/login` | Samma host som tenant ska gälla |

Övriga sidor: `/om-oss`, `/kundservice`, `/leverans`, `/kopvillkor`, `/integritetspolicy`, `/gdpr`, `/cookies`, `/returer-aterbetalningar`, `/sidor/[slug]` (CMS custom pages).

## Inlogg (demo)

Kontona skapas i Supabase Auth. E-post med domän `@applabbet.local` kan **automatiskt** kopplas som admin till den tenant du är inloggad på (se `apps/web/src/lib/admin-access.ts`).

### Kund (Mina sidor, favoriter, ordrar)

| | |
|--|--|
| **Login** | `http://localhost:3000/konto/login` (eller samma sökväg på t.ex. `electronics.localhost:3000`) |
| **E-post** | `testkonto@applabbet.local` |
| **Lösenord** | `Testkonto!2026` |

Efter inloggning: `/mina-sidor`, `/mina-sidor/ordrar`, `/mina-sidor/favoriter`.

### Admin (produkter, CMS, inställningar)

| | |
|--|--|
| **Login** | `http://localhost:3000/admin/login` |
| **E-post** | `admin@applabbet.local` |
| **Lösenord** | `Admin!2026` |

**Viktigt:** Admin är **tenant-bundet**. Du måste vara på en host som finns i `tenant_domains` (verified) för just den butiken — t.ex. admin på electronics-demo via `http://electronics.localhost:3000/admin/login`.

Krav för admin (utöver Auth):

- Verifierad rad i `tenant_domains` för aktuell host
- Användare i `tenant_users` med roll `admin`, `editor` eller `product_manager` — eller bootstrap via `@applabbet.local` / `ADMIN_BOOTSTRAP_EMAILS`

### Snabbtest per tema

1. `npm run dev`
2. Välj t.ex. **Electronics** i dev-väljaren (eller öppna `http://electronics.localhost:3000`)
3. Bläddra `/`, `/products`, `/sok?q=laptop`, `/cart`
4. Logga in som kund → `/mina-sidor`
5. Logga in som admin på **samma host** → `/admin/products`

## Butiksnamn och tema i admin

- **Inställningar:** `http://localhost:3000/admin/settings/site` (redirect från `/admin/settings`)
- **Store name:** fältet `brand_name` (visningsnamn i header/footer)
- **Tema:** `theme_key` via temaväljaren på samma sida

Övriga admin-inställningar:

- `/admin/settings/menu` — navigation
- `/admin/settings/company` — företagsuppgifter
- `/admin/settings/payments` — betalmetoder

## Adminpanel (routes)

| Route | Funktion |
|-------|----------|
| `/admin/login` | Inloggning |
| `/admin/products` | Produkter, bilder, varianter |
| `/admin/orders` | Ordrar |
| `/admin/inventory` | Lager |
| `/admin/logistics` | Lagerställen, carriers, frakt |
| `/admin/pages` | CMS standardsidor |
| `/admin/pages/custom` | Egna sidor → `/sidor/[slug]` |
| `/admin/pages/[pageKey]` | Redigera enskild standardsida |
| `/admin/settings/site` | Logo, brand, tema, footer, loyalty |
| `/admin/settings/menu` | Meny |
| `/admin/settings/company` | Företag |
| `/admin/settings/payments` | Betalning |
| `/admin/users` | Roller per tenant |
| `/admin/trust-strip` | Trust badges |

## Databas / migrationer

Kör filerna i `supabase/migrations` **i filnamnsordning** i Supabase SQL Editor:

1. `0001_multitenant_core.sql`
2. `0002_security_and_perf_hardening.sql`
3. `0003_page_content_cms.sql`
4. `0004_tenant_settings_and_custom_pages.sql`
5. `0005_logistics_shipping_inventory.sql`
6. `0006_product_categories.sql`
7. `0007_products_brand.sql`
8. `0008_customer_addresses.sql`
9. `0009_customer_payment_profiles.sql`
10. `0010_customer_profiles.sql`
11. `0011_customer_favorites.sql`
12. `0012_tenant_trust_badges.sql`
13. `0013_tenant_loyalty_program.sql`
14. `0014_products_features.sql`
15. `0015_products_colors.sql`
16. `0016_products_is_new.sql`
17. `0017_tenant_user_roles_and_product_permissions.sql`
18. `0018_footer_company_visibility_settings.sql`
19. `0019_fix_tenant_users_policy_recursion.sql`
20. `0020_navigation_menu_settings.sql`
21. `0021_product_detail_tabs.sql`
22. `0022_product_materials.sql`
23. `0023_product_sizes.sql`
24. `0024_product_gallery_images.sql`
25. `0025_products_manual_best_seller.sql`
26. `0026_tenant_settings_theme_key.sql`
27. `0027_product_categories_description.sql`

Demo-tenants och domäner (t.ex. `electronics.localhost`) måste finnas i `tenants`, `tenant_domains` (status `verified`) och `tenant_settings` med rätt `theme_key`. Utan det visas “Ingen tenant hittades för domänen”.

**Diagnostik (valfritt):** från `apps/web` med ifylld `.env.local`:

```bash
node seed-themes.mjs
```

Skriver ut tenants, kategorier och produkter från databasen.

## Storefront-teman (kod)

Tema-nycklar: `classic`, `luxury`, `sport`, `fashion`, `beauty`, `electronics`, `minimal`.

- Konfiguration per tema: `apps/web/src/lib/storefront/configs/`
- CSS-tokens/overrides: `apps/web/src/app/globals.css` (`body[data-store-theme="…"]`)
- Komponenter: `apps/web/src/components/storefront/<tema>/`

Electronics har dedikerade vyer på bland annat startsida, produktlista, PDP, varukorg, sök, nyheter, bästsäljare och mina sidor (samma omfattning som fashion/minimal där det gäller).

## CMS och plattformsfunktioner

- Blockbaserat CMS per sida och tenant (`page_content`)
- Custom pages (`custom_pages`) → `/sidor/[slug]`
- `tenant_settings`: branding, `theme_key`, betalmetoder, meny, footer
- Logistik: `warehouses`, `carrier_integrations`, `shipping_methods`, `inventory_levels`

## Validering

```bash
npm run lint
npm run build
```

Dev-server: `npm run dev` → `http://localhost:3000`
