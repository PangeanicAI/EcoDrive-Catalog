import { CatalogItem } from "@/types/catalog";

const CATALOG_API_URL =
  process.env.CATALOG_API_URL || "http://ecodrive.pangeanic.com:19193";

export async function getConnectorCatalog(): Promise<CatalogItem[]> {
  try {
    const response = await fetch(
      `${CATALOG_API_URL}/management/federatedcatalog/request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          offset: 0,
          limit: 100,
          "@context": {
            "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
          },
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(`Connector catalog request failed: ${response.status}`);
    }

    const rawBody = await response.text();
    const data = safeJsonParse(rawBody);
    const normalized = normalizeConnectorResponse(data);
    if (normalized.length === 0) {
      const preview =
        typeof data === "string"
          ? data.slice(0, 500)
          : JSON.stringify(data).slice(0, 500);
      console.info(`[catalog] connector raw preview: ${preview}`);
    }
    console.info(`[catalog] connector items: ${normalized.length}`);
    return normalized;
  } catch (error) {
    console.error("Error fetching connector catalog:", error);
    return [];
  }
}

function safeJsonParse(body: string): any {
  try {
    return JSON.parse(body);
  } catch {
    return body;
  }
}

function normalizeConnectorResponse(data: any): CatalogItem[] {
  const candidates = extractDatasetCandidates(data);
  if (candidates.length === 0) {
    return [];
  }

  const unique = new Map<string, any>();
  for (const item of candidates) {
    const key =
      item?.["@id"] ||
      item?.id ||
      item?.["edc:id"] ||
      JSON.stringify(item).slice(0, 120);
    if (!unique.has(key)) {
      unique.set(key, item);
    }
  }

  return Array.from(unique.values()).map(transformConnectorItem);
}

function extractDatasetCandidates(data: any): any[] {
  const collected: any[] = [];
  const visited = new Set<any>();

  function visit(node: any) {
    if (node === null || node === undefined) {
      return;
    }

    if (typeof node !== "object") {
      return;
    }

    if (visited.has(node)) {
      return;
    }
    visited.add(node);

    if (Array.isArray(node)) {
      node.forEach(visit);
      return;
    }

    const keys = Object.keys(node);
    const hasDatasetKey = keys.some((key) =>
      key.toLowerCase().includes("dataset"),
    );

    if (hasDatasetKey) {
      for (const [key, value] of Object.entries(node)) {
        if (!key.toLowerCase().includes("dataset")) {
          continue;
        }

        if (Array.isArray(value)) {
          value.forEach((entry) => {
            if (entry && typeof entry === "object") {
              collected.push(entry);
            }
          });
        } else if (value && typeof value === "object") {
          collected.push(value);
        }
      }
    }

    const rawType = Array.isArray(node["@type"]) ? node["@type"][0] : node["@type"];
    const normalizedType =
      typeof rawType === "string" ? rawType.toLowerCase() : "";
    const hasIdentity = Boolean(node["@id"] || node.id);
    const isDatasetType = normalizedType.includes("dataset");
    const hasAssetSignals = Boolean(
      node.assetType ||
        node["odrl:hasPolicy"] ||
        node["http://www.w3.org/ns/dcat#distribution"] ||
        node.distribution,
    );
    const hasBasicMetadata = Boolean(
      node["dct:title"] ||
        node.title ||
        node.name ||
        node["http://purl.org/dc/terms/description"] ||
        node["dct:description"] ||
        node.description,
    );
    const looksLikeDataset = hasIdentity && (isDatasetType || (hasAssetSignals && hasBasicMetadata));

    if (looksLikeDataset) {
      collected.push(node);
    }

    Object.values(node).forEach(visit);
  }

  visit(data);
  return collected;
}

function transformConnectorItem(item: any): CatalogItem {
  const endpointUrl =
    item["http://www.w3.org/ns/dcat#endpointUrl"] ||
    item["http://www.w3.org/ns/dcat#endpointURL"] ||
    item.endpointUrl ||
    item.endpointURL;
  const rawType = Array.isArray(item["@type"]) ? item["@type"][0] : item["@type"];
  const inferredType = inferConnectorType(rawType);

  return {
    id: item["@id"] || item.id || item["edc:id"] || generateId(),
    name: inferConnectorName(item),
    description:
      item["http://purl.org/dc/terms/description"] ||
      item["dct:description"] ||
      item.description ||
      (typeof endpointUrl === "string" ? `Endpoint: ${endpointUrl}` : "") ||
      item.shortDescription ||
      "",
    type: inferredType || item.type || item.assetType || "Asset",
    properties: extractProperties(item),
    vocabulary: extractVocabularies(item),
    createdAt: item["dct:created"] || item.createdAt || new Date().toISOString(),
    participantId: item.participantId || "",
    source: "connector",
  };
}

function inferConnectorType(typeValue: unknown): string {
  if (typeof typeValue !== "string") {
    return "";
  }

  const lowerType = typeValue.toLowerCase();
  if (lowerType.includes("dataservice")) {
    return "Data Service";
  }
  if (lowerType.includes("catalog")) {
    return "Catalog";
  }
  if (lowerType.includes("dataset")) {
    return "Dataset";
  }
  return typeValue;
}

function inferConnectorName(item: any): string {
  const directName =
    item.name ||
    item["dct:title"] ||
    item.title ||
    item["http://www.w3.org/ns/dcat#keyword"];
  if (typeof directName === "string" && directName.trim() !== "") {
    return directName;
  }

  const endpointUrl =
    item["http://www.w3.org/ns/dcat#endpointUrl"] ||
    item["http://www.w3.org/ns/dcat#endpointURL"] ||
    item.endpointUrl ||
    item.endpointURL;
  if (typeof endpointUrl === "string" && endpointUrl.trim() !== "") {
    return endpointUrl;
  }

  return item["@id"] || item.id || "Untitled";
}

function extractProperties(item: any): Record<string, any> {
  const properties: Record<string, any> = {};
  const excludedKeys = [
    "@id",
    "@type",
    "id",
    "name",
    "title",
    "description",
    "@context",
    "http://www.w3.org/ns/dcat#distribution",
    "odrl:hasPolicy",
  ];

  for (const [key, value] of Object.entries(item)) {
    if (!excludedKeys.includes(key)) {
      let displayKey = key;
      if (key.startsWith("http://")) {
        const parts = key.split("/");
        displayKey = parts[parts.length - 1] || key;
      }
      properties[displayKey] = value;
    }
  }

  return properties;
}

function extractVocabularies(item: any): string[] {
  const vocabularies: string[] = [];

  if (item["dcat:keyword"]) {
    if (Array.isArray(item["dcat:keyword"])) {
      vocabularies.push(...item["dcat:keyword"]);
    } else {
      vocabularies.push(item["dcat:keyword"]);
    }
  }

  if (item["http://www.w3.org/ns/dcat#keyword"]) {
    const keyword = item["http://www.w3.org/ns/dcat#keyword"];
    if (Array.isArray(keyword)) {
      vocabularies.push(...keyword);
    } else {
      vocabularies.push(keyword);
    }
  }

  if (item.keywords && Array.isArray(item.keywords)) {
    vocabularies.push(...item.keywords);
  }

  if (item.vocabulary && Array.isArray(item.vocabulary)) {
    vocabularies.push(...item.vocabulary);
  }

  if (item.assetType) {
    vocabularies.push(item.assetType);
  }

  if (item.participantId) {
    vocabularies.push(item.participantId);
  }

  if (vocabularies.length === 0 && item["@type"]) {
    const type = Array.isArray(item["@type"]) ? item["@type"][0] : item["@type"];
    const typeName = type.split("/").pop()?.split("#").pop() || "Unknown";
    vocabularies.push(typeName);
  }

  return Array.from(new Set(vocabularies));
}

function generateId(): string {
  return `connector-item-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}
