export interface CatalogItem {
  id: string;
  name: string;
  description?: string;
  type?: string;
  properties?: Record<string, any>;
  vocabulary?: string[];
  createdAt?: string;
  participantId?: string;
  source?: "static" | "connector";
  download?: {
    objectKey: string;
    fileName?: string;
    label?: string;
  };
}
