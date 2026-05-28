import { NextResponse } from "next/server";
import { requireAdminAccess } from "@/lib/admin-access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

function sanitizeSegment(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const pageKey = String(formData.get("pageKey") || "").trim();
  const blockKey = String(formData.get("blockKey") || "").trim();
  const fieldKey = String(formData.get("fieldKey") || "").trim();
  const file = formData.get("file");

  if (!pageKey || !(file instanceof File) || file.size <= 0) {
    return NextResponse.json({ error: "Ogiltig upload payload." }, { status: 400 });
  }

  const access = await requireAdminAccess(`/admin/pages/${pageKey}`);
  if (access.status !== "allowed") {
    return NextResponse.json({ error: "Åtkomst nekad." }, { status: 403 });
  }

  const extension = file.name.includes(".")
    ? file.name.split(".").pop()?.toLowerCase() || "png"
    : "png";

  const admin = createSupabaseAdminClient();
  const bucket = "brand-assets";
  await admin.storage
    .createBucket(bucket, {
      public: true,
      fileSizeLimit: 10 * 1024 * 1024,
    })
    .catch(() => undefined);

  const pageSegment = sanitizeSegment(pageKey) || "page";
  const blockSegment = sanitizeSegment(blockKey) || "block";
  const fieldSegment = sanitizeSegment(fieldKey) || "field";
  const path = `${access.tenant.id}/cms/${pageSegment}/${blockSegment}-${fieldSegment}-${Date.now()}.${extension}`;

  const { error } = await admin.storage.from(bucket).upload(path, file, {
    contentType: file.type || "image/png",
    upsert: true,
  });
  if (error) {
    return NextResponse.json({ error: `Kunde inte ladda upp bild: ${error.message}` }, { status: 500 });
  }

  const { data } = admin.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
