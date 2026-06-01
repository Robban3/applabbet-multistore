import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
const env = readFileSync(".env.local","utf8");
const get = k => (env.match(new RegExp(`^${k}=(.*)$`,"m"))||[])[1]?.trim().replace(/^["']|["']$/g,"");
const sb = createClient(get("NEXT_PUBLIC_SUPABASE_URL")||get("SUPABASE_URL"), get("SUPABASE_SERVICE_ROLE_KEY"), { auth:{persistSession:false}});

const { data: tenants } = await sb.from("tenants").select("id, name, slug");
console.log("TENANTS:", tenants);
const { data: cats } = await sb.from("product_categories").select("id, tenant_id, slug, name").limit(50);
console.log("\nCATEGORIES:", cats);
const { data: prods } = await sb.from("products").select("id, tenant_id, slug, title, image_url, category_id").limit(50);
console.log("\nPRODUCTS:", prods);
