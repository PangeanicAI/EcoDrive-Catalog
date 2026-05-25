import { CatalogItem } from "@/types/catalog";

export async function fetchCatalog(): Promise<CatalogItem[]> {
  try {
    const response = await fetch("/api/catalog", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Catalog request failed: ${response.status}`);
    }
    const data = (await response.json()) as CatalogItem[];
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching catalog:", error);
    return [];
  }
}
