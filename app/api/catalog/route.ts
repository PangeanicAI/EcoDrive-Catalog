import { NextResponse } from "next/server";
import { getStaticCatalog } from "@/lib/server/catalog";
import { getConnectorCatalog } from "@/lib/server/connectorCatalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const [staticCatalog, connectorCatalog] = await Promise.all([
    getStaticCatalog().catch((error) => {
      console.error("Error reading static catalog:", error);
      return [];
    }),
    getConnectorCatalog().catch((error) => {
      console.error("Error reading connector catalog:", error);
      return [];
    }),
  ]);

  if (staticCatalog.length === 0 && connectorCatalog.length === 0) {
    return NextResponse.json(
      { error: "Error loading static and connector catalog data" },
      { status: 500 },
    );
  }

  console.info(
    `[catalog] merged static=${staticCatalog.length} connector=${connectorCatalog.length}`,
  );

  return NextResponse.json([...staticCatalog, ...connectorCatalog]);
}
