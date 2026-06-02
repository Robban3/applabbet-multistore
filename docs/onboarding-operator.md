# Onboarding – för dig (plattformsoperatör)

Så här lägger du upp en ny kundbutik. En kodbas driver alla butiker; varje
kund är en **tenant** med eget `theme_key`, egen domän, egna produkter och
eget innehåll. Ingen data delas mellan kunder.

---

## 0. Översikt

| Begrepp | Vad det är |
|---|---|
| **tenant** | En kund/butik (rad i `tenants`) |
| **tenant_settings** | Butikens tema, namn, betalning, footer (rad i `tenant_settings`) |
| **tenant_domains** | Vilken domän som pekar på butiken (måste vara `verification_status = verified`) |
| **theme_key** | Designtemat: `classic`, `luxury`, `sport`, `fashion`, `minimal`, `electronics`, `beauty` |
| **product_categories / products** | Butikens sortiment (per `tenant_id`) |

Värdnamnet (domänen) i webbläsaren → slår upp tenant i `tenant_domains` →
laddar `tenant_settings.theme_key` → rätt design och rätt produkter.

---

## 1. Skapa en ny kund (tenant)

Tenant/domän/tema sätts i databasen (Supabase). Använd ett skript med
**service-role-nyckeln** (samma mönster som befintliga demos). Mall:

```js
// scripts/create-tenant.mjs  – kör med:  node --env-file=apps/web/.env.local scripts/create-tenant.mjs
import { createClient } from "@supabase/supabase-js";
const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

const KUND   = "Salong Stjärna";        // butikens namn
const DOMAIN = "salongstjarna.se";       // kundens riktiga domän (eller kund.localhost lokalt)
const THEME  = "beauty";                 // classic|luxury|sport|fashion|minimal|electronics|beauty

const { data: tenant } = await sb.from("tenants")
  .insert({ name: KUND, slug: slugify(KUND), default_locale: "sv-SE", default_currency: "SEK" })
  .select().single();

await sb.from("tenant_settings").insert({
  tenant_id: tenant.id,
  theme_key: THEME,
  brand_name: KUND,
  support_email: "info@salongstjarna.se",
  footer_show_company_name: true,
});

await sb.from("tenant_domains").insert({
  domain: DOMAIN, tenant_id: tenant.id, verification_status: "verified",
});

console.log("Klart:", tenant.id);
```

> Behöver kunden sortiment direkt? Lägg till `product_categories` och
> `products` (med `tenant_id`, `slug`, `title`, `price_minor`, `currency`,
> `status: "published"`, `category_id`). Se `scripts`-mönstret som användes
> för `beauty-demo`.

---

## 2. Välj tema

Sätt `theme_key` i `tenant_settings` till ett av:

| theme_key | Stil / referens |
|---|---|
| `classic` | Heritage / NK – Ralph Lauren |
| `luxury` | Cartier |
| `sport` | Nike |
| `fashion` | Filippa K |
| `minimal` | Apple |
| `electronics` | Komplett / Webhallen |
| `beauty` | KICKS |

Temat styr header, hero, produktkort, färger och alla sidor automatiskt.

---

## 3. Domän-setup

### Lokalt (test/demo)
Använd `kundnamn.localhost` som domän i `tenant_domains`. Det funkar direkt
mot `localhost:3000` utan DNS. (`localhost` utan subdomän pekar på
`DEFAULT_TENANT_DOMAIN` i `.env`.)

### Produktion (kundens riktiga domän) – Cloudflare for SaaS
1. Kunden pekar sin DNS mot er: `CNAME kundens-doman.se → app.applabbet.se`.
2. Lägg till domänen som **Custom Hostname** i Cloudflare (Dashboard eller API)
   → SSL utfärdas automatiskt.
3. Lägg domänen i `tenant_domains` med `verification_status = verified`,
   kopplad till kundens tenant.

> Fullständiga steg + API-anrop finns i **`docs/hosting-cloudflare.md`**.

> Varje kund kan ha flera domäner (t.ex. `kund.se` + `www.kund.se`) –
> lägg en rad per domän, alla `verified`.

---

## 4. Verifiera

1. Besök domänen.
2. Kontrollera i sidkällan att `<body data-store-theme="...">` är rätt tema.
3. Kolla att produkter/kategorier visas (rätt `tenant_id`).
4. Testa kassan och en order.

---

## 5. Ge kunden admin-tillgång

1. Skapa kundens inloggning (Supabase Auth – kunden registrerar konto eller
   du bjuder in).
2. Koppla användaren som admin för rätt tenant under **Admin → Användare**
   (`/admin/users`).
3. Skicka kunden **kund-guiden** (`onboarding-customer.md`).

---

## 6. Isolering & säkerhet (viktigt)

- **Sessioner är host-scopade** på riktiga domäner → en inloggning på kund A:s
  butik loggar aldrig in på kund B. (Den delade cookien gäller **bara**
  `*.localhost` för din lokala demo.)
- **All data** (produkter, ordrar, favoriter, innehåll) är `tenant_id`-scopad.
- Sätt aldrig en wildcard-cookie-domän på en delad plattformsdomän.

---

## Snabb-checklista per ny kund
- [ ] `tenants`-rad skapad
- [ ] `tenant_settings` med rätt `theme_key` + `brand_name`
- [ ] Sortiment (`product_categories` + `products`) inlagt
- [ ] `tenant_domains` med domän + `verified`
- [ ] Domän tillagd i hosting + DNS pekad
- [ ] Verifierat tema + produkter live
- [ ] Betalning konfigurerad (Admin → Inställningar → Betalningar)
- [ ] Kund-admin-konto + guide skickad
