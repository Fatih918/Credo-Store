import { NextResponse } from "next/server";
import { getPublicCatalog } from "@/features/catalog/data/public-catalog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * Read-only public catalog contract for trusted integrations such as CredoBOT.
 * getPublicCatalog uses the public Supabase client and RLS; this route never
 * exposes service-role credentials or inactive catalog records.
 */
export async function GET() {
  const catalog = await getPublicCatalog();
  const headers = {
    "Cache-Control": "no-store, max-age=0",
  };

  if (catalog.status === "unavailable") {
    return NextResponse.json(
      { status: "unavailable", categories: [], items: [] },
      { status: 503, headers },
    );
  }

  return NextResponse.json(
    {
      status: "ready",
      generatedAt: new Date().toISOString(),
      categories: catalog.categories,
      items: catalog.items,
    },
    { headers },
  );
}
