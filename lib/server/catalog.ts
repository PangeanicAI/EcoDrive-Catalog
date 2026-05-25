import { readFile } from "fs/promises";
import path from "path";
import { CatalogItem } from "@/types/catalog";

const CATALOG_FILE_PATH = path.join(process.cwd(), "data", "catalog.json");

export async function getStaticCatalog(): Promise<CatalogItem[]> {
  const fileContent = await readFile(CATALOG_FILE_PATH, "utf-8");
  const parsed = JSON.parse(fileContent);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return (parsed as CatalogItem[]).map((item) => ({
    ...item,
    source: "static",
  }));
}

export async function getCatalogItemById(
  id: string,
): Promise<CatalogItem | undefined> {
  const catalog = await getStaticCatalog();
  return catalog.find((item) => item.id === id);
}
