# Tenant Onboarding Checklist

Denna checklista används när en ny butik (tenant) ska sättas upp i plattformen.

## 1) Förberedelser

- Bekräfta butikens namn, organisationsnummer, kontaktuppgifter och ansvarig kontaktperson.
- Bekräfta primär domän och eventuella extra domäner/subdomäner.
- Bekräfta språk, valuta och vilka betalmetoder som ska vara aktiva vid launch.
- Skapa ett internt ticket-ID för onboarding och koppla alla delmoment till det.

## 2) Tenant och access

- Skapa tenant-post med unikt `tenant_id`.
- Lägg in domäner i `tenant_domains` och verifiera mapping mot rätt tenant.
- Skapa första admin-konto i `tenant_users`.
- Sätt roller för teamet (admin, editor, produktansvarig osv).
- Verifiera att användare utan rätt roll inte kan nå admin-vyer.

## 3) Databas och schema

- Kör senaste migrationer innan setup börjar.
- Bekräfta att alla tenant-känsliga tabeller använder `tenant_id`.
- Verifiera RLS-policies för tenant-isolering.
- Säkerställ att seed-data skapas per tenant (inte globalt).
- Skapa minst ett lagerställe om lagerhantering ska användas direkt.

## 4) Cloudflare och DNS

- Peka domän till rätt miljö (staging/produktion) via Cloudflare DNS.
- Sätt proxyläge enligt driftkrav och verifiera att origin nås korrekt.
- Verifiera TLS/SSL (Full/Strict rekommenderas).
- Konfigurera cache-regler:
  - Cacha statiska assets aggressivt.
  - Undvik cache på admin, checkout och dynamiska API-responser.
- Konfigurera WAF/rate limits för inloggning och API-endpoints.

## 5) E-post per domän

- **Utgående e-post** (orderbekräftelse, kvitto, notifieringar):
  - Konfigurera e-postleverantör per domän (t.ex. Resend, Postmark, SES).
  - Lägg SPF, DKIM och DMARC i DNS.
  - Verifiera från-adress och testskicka.
- **Inkommande e-post** (kundservice):
  - Sätt MX-records till vald mailhost.
  - Skapa funktionsadresser (t.ex. `support@`, `orders@`).
  - Verifiera mottagning och eventuell forwarding.

## 6) Butiksinnehåll

- Ladda upp logotyp och företagsuppgifter.
- Sätt navigation/meny och ordning på länkar.
- Lägg in startsideinnehåll och toppbar-kort.
- Lägg in juridiska sidor (köpvillkor, integritet, GDPR, leverans, returer).
- Verifiera footer-inställningar (visa/dölj företagsdata).

## 7) Produkter och katalog

- Skapa kategorier.
- Lägg in produkter med:
  - titel, slug, pris, status
  - färger/material/storlekar (vid behov)
  - lagersaldo
  - bilder + bildordning
- Verifiera att produktdetaljsida visar korrekt variantval.
- Verifiera att lagerstatus (i lager/fåtal/slut) följer lagersaldo.

## 8) Betalning och checkout

- Aktivera önskade betalmetoder för tenant.
- Kör testköp end-to-end:
  - Lägg i kundvagn
  - Köp nu (direkt till checkout)
  - Slutför betalning
  - Kontrollera order i admin
- Verifiera att lagersaldo uppdateras korrekt efter genomförd order.

## 9) Kvalitetssäkring före launch

- Verifiera mobil/tablet/desktop på:
  - startsida
  - kategori/listning
  - produktsida
  - kundvagn
  - checkout
- Verifiera att admin inte visar storefront-footer.
- Verifiera att tenant inte kan se annan tenants data.
- Verifiera 404/500-sidor och fallback-flöden.

## 10) Go-live

- Publicera nödvändiga sidor och produkter.
- Töm/uppdatera cache där det behövs.
- Kör slutlig smoke test i produktion.
- Övervaka fel/loggar första timmarna efter launch.
- Dokumentera avslutad onboarding i ticket med datum och ansvarig.

## Snabb kontrollista (kortversion)

- [ ] Tenant + domän mapping klar
- [ ] Adminanvändare + roller klara
- [ ] Migrationer och RLS verifierade
- [ ] DNS + SSL + cache-regler klara
- [ ] SPF/DKIM/DMARC + MX klara
- [ ] Sidor, meny och footer klara
- [ ] Produkter, varianter, bilder och lager klara
- [ ] Testköp och orderflöde verifierat
- [ ] Mobil/desktop QA godkänd
- [ ] Go-live + övervakning klar
