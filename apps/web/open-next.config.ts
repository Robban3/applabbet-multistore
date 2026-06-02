import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Standardkonfiguration för Cloudflare Workers via OpenNext.
// Vill du ha ISR/data-cache senare: lägg till en R2/KV incremental cache här
// (se https://opennext.js.org/cloudflare/caching).
export default defineCloudflareConfig();
