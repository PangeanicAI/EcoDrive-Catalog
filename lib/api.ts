import axios from "axios";
import { CatalogItem } from "@/types/catalog";

const CATALOG_API_URL =
  process.env.CATALOG_API_URL || "http://ecodrive.pangeanic.com:19193";

export async function fetchCatalog(): Promise<CatalogItem[]> {
  try {
    const response = await axios.post(
      `${CATALOG_API_URL}/management/federatedcatalog/request`,
      {
        offset: 0,
        limit: 100,
        "@context": {
          "@vocab": "https://w3id.org/edc/v0.0.1/ns/",
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        timeout: 10000,
      }
    );

    // Process federated catalog response
    // Response is an array of catalogs, each containing datasets
    const data = response.data;

    // If response is a direct array of catalogs
    if (Array.isArray(data)) {
      // Extract all datasets from all catalogs
      const allDatasets: any[] = [];
      
      data.forEach((catalog: any) => {
        // Get datasets from catalog
        const datasets = catalog["http://www.w3.org/ns/dcat#dataset"] || 
                        catalog["dcat:dataset"] || 
                        [];
        
        if (Array.isArray(datasets)) {
          allDatasets.push(...datasets);
        }
      });
      
      return allDatasets.map(transformCatalogItem);
    }

    // If response has a nested structure
    if (data["dcat:dataset"] && Array.isArray(data["dcat:dataset"])) {
      return data["dcat:dataset"].map(transformCatalogItem);
    }

    // If response has a structure with @graph
    if (data["@graph"] && Array.isArray(data["@graph"])) {
      return data["@graph"].map(transformCatalogItem);
    }

    // If it's a single object, convert to array
    if (typeof data === "object" && data !== null) {
      return [transformCatalogItem(data)];
    }

    return [];
  } catch (error) {
    console.error("Error fetching catalog:", error);

    // Demo data in case of error
    return getDemoCatalogData();
  }
}

function transformCatalogItem(item: any): CatalogItem {
  return {
    id: item["@id"] || item.id || item["edc:id"] || generateId(),
    name: item.name || item["dct:title"] || item.title || item["http://www.w3.org/ns/dcat#keyword"] || "Untitled",
    description: item["http://purl.org/dc/terms/description"] || item["dct:description"] || item.description || item.shortDescription || "",
    type: item["@type"] || item.type || item.assetType || "Asset",
    properties: extractProperties(item),
    vocabulary: extractVocabularies(item),
    createdAt: item["dct:created"] || item.createdAt || new Date().toISOString(),
    participantId: item.participantId || "",
  };
}

function extractProperties(item: any): Record<string, any> {
  const properties: Record<string, any> = {};

  // Extract common properties
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
      // Simplify property names for better display
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

  // Search for vocabularies in different properties
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

  // Add asset type as vocabulary
  if (item.assetType) {
    vocabularies.push(item.assetType);
  }

  // Add participant ID as vocabulary
  if (item.participantId) {
    vocabularies.push(item.participantId);
  }

  // If no vocabularies, infer from type
  if (vocabularies.length === 0 && item["@type"]) {
    const type = Array.isArray(item["@type"])
      ? item["@type"][0]
      : item["@type"];
    const typeName = type.split("/").pop()?.split("#").pop() || "Unknown";
    vocabularies.push(typeName);
  }

  return Array.from(new Set(vocabularies)) as string[]; // Remove duplicates
}

function generateId(): string {
  return `catalog-item-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;
}

// Demo data for automotive terminology
function getDemoCatalogData(): CatalogItem[] {
  return [
    {
      id: "termbase-electric-vehicles",
      name: "Electric Vehicle Terminology Database",
      description:
        "Comprehensive multilingual terminology database for electric vehicle components, systems, and technologies including battery management, charging infrastructure, and powertrain systems.",
      type: "Terminology Database",
      properties: {
        format: "TBX, JSON-LD",
        languages: "EN, ES, DE, FR, IT",
        entries: "15,000+ terms",
        domains: "Electrification, Battery Systems, Charging",
        license: "Open Access",
      },
      vocabulary: [
        "Electric Vehicles",
        "Automotive",
        "Electrification",
        "Multilingual",
      ],
      createdAt: "2024-01-15T10:00:00Z",
    },
    {
      id: "corpus-adas-documentation",
      name: "ADAS Technical Documentation Corpus",
      description:
        "Annotated text corpus containing technical documentation for Advanced Driver Assistance Systems (ADAS) including terminology for sensors, algorithms, and safety features.",
      type: "Text Corpus",
      properties: {
        format: "XML, Plain Text",
        size: "250 MB",
        documents: "5,000+ technical documents",
        annotation: "Term extraction, Part-of-speech",
        updateFrequency: "Quarterly",
      },
      vocabulary: [
        "ADAS",
        "Autonomous Driving",
        "Safety Systems",
        "Technical Documentation",
      ],
      createdAt: "2024-02-20T14:30:00Z",
    },
    {
      id: "glossary-connected-mobility",
      name: "Connected Mobility Glossary",
      description:
        "Standardized glossary for connected vehicle technologies including V2X communication, telematics, and IoT integration in automotive applications.",
      type: "Glossary",
      properties: {
        format: "CSV, SKOS",
        languages: "EN, ES, IT",
        terms: "8,500+",
        domains: "Connectivity, IoT, Telematics",
      },
      vocabulary: ["Connected Vehicles", "V2X", "IoT", "Telematics"],
      createdAt: "2024-03-10T09:15:00Z",
    },
    {
      id: "termbase-sustainable-mobility",
      name: "Sustainable Mobility Term Base",
      description:
        "Terminology resource covering sustainable transportation concepts, environmental standards, emission systems, and green mobility solutions for the automotive industry.",
      type: "Terminology Database",
      properties: {
        format: "TBX, RDF",
        languages: "EN, ES, DE, FR",
        entries: "12,000+ terms",
        domains: "Sustainability, Emissions, Green Technology",
        standards: "ISO 1087, ISO 26162",
      },
      vocabulary: [
        "Sustainability",
        "Green Mobility",
        "Emissions",
        "Environmental",
      ],
      createdAt: "2024-01-25T11:45:00Z",
    },
    {
      id: "api-terminology-lookup",
      name: "Automotive Terminology Lookup API",
      description:
        "RESTful API providing real-time access to automotive terminology resources with multilingual search, definition retrieval, and context-based suggestions.",
      type: "API Service",
      properties: {
        endpoint: "https://api.ecodrive-termspace.com/v1/",
        authentication: "OAuth 2.0",
        rateLimit: "10,000 requests/day",
        responseFormat: "JSON, XML",
        languages: "EN, ES, DE, FR, IT",
      },
      vocabulary: ["API", "Terminology Service", "Multilingual", "Integration"],
      createdAt: "2024-02-05T16:20:00Z",
    },
    {
      id: "translation-memory-automotive",
      name: "Automotive Translation Memory",
      description:
        "Specialized translation memory containing translated automotive documentation segments across multiple language pairs, optimized for technical accuracy and consistency.",
      type: "Translation Memory",
      properties: {
        format: "TMX, XLIFF",
        segments: "500,000+ translation units",
        languagePairs: "EN-ES, EN-DE, EN-FR, DE-ES",
        domains: "Technical Manuals, User Interfaces, Marketing",
      },
      vocabulary: ["Translation", "Localization", "Technical Communication"],
      createdAt: "2024-01-30T08:00:00Z",
    },
    {
      id: "ontology-automotive-systems",
      name: "Automotive Systems Ontology",
      description:
        "Formal ontology representing relationships between automotive concepts, components, and systems with support for semantic queries and knowledge graph integration.",
      type: "Ontology",
      properties: {
        format: "OWL, RDF/XML",
        concepts: "25,000+ classes",
        relations: "15,000+ properties",
        standards: "ISO 22745, SAE J2735",
        queryLanguage: "SPARQL",
      },
      vocabulary: ["Ontology", "Semantic Web", "Knowledge Graph", "Standards"],
      createdAt: "2024-03-15T16:45:00Z",
    },
    {
      id: "dataset-automotive-neologisms",
      name: "Automotive Neologisms Dataset",
      description:
        "Curated dataset of new automotive terminology emerging from technological innovations in autonomous driving, electrification, and digital services.",
      type: "Dataset",
      properties: {
        format: "JSON, CSV",
        entries: "3,500+ neologisms",
        timeRange: "2020-2024",
        languages: "EN, ES, DE",
        categories: "New Technologies, Digital Services, Mobility Solutions",
      },
      vocabulary: [
        "Neologisms",
        "Innovation",
        "Terminology Evolution",
        "Lexicography",
      ],
      createdAt: "2024-02-28T12:20:00Z",
    },
  ];
}
