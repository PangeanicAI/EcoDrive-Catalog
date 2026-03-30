"use client";

import { useState, useEffect } from "react";
import CatalogCard from "@/components/CatalogCard";
import SearchBar from "@/components/SearchBar";
import { fetchCatalog } from "@/lib/api";
import { CatalogItem } from "@/types/catalog";

export default function Home() {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CatalogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVocabulary, setSelectedVocabulary] = useState("");

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    try {
      setLoading(true);
      const data = await fetchCatalog();
      setCatalogItems(data);
      setFilteredItems(data);
      setError(null);
    } catch (err) {
      setError("Error loading catalog. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = catalogItems;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedVocabulary) {
      filtered = filtered.filter((item) =>
        item.vocabulary?.includes(selectedVocabulary)
      );
    }

    setFilteredItems(filtered);
  }, [searchTerm, selectedVocabulary, catalogItems]);

  const vocabularies = Array.from(
    new Set(catalogItems.flatMap((item) => item.vocabulary || []))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          EcoDrive TermSpace Federated Catalog
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Explore and access automotive terminology resources and data
          connectors for sustainable mobility
        </p>
      </section>

      {/* Search Section */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        vocabularies={vocabularies}
        selectedVocabulary={selectedVocabulary}
        onVocabularyChange={setSelectedVocabulary}
      />

      {/* Results Section */}
      <section className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <button
              onClick={loadCatalog}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No results found for your search
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Showing {filteredItems.length} of {catalogItems.length} resources
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <CatalogCard key={item.id} item={item} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
