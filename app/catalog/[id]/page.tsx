"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiCalendar, FiTag, FiDatabase } from "react-icons/fi";
import ContactForm from "@/components/ContactForm";
import { fetchCatalog } from "@/lib/api";
import { CatalogItem } from "@/types/catalog";

export default function CatalogDetailPage() {
  const params = useParams();
  const [item, setItem] = useState<CatalogItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    const loadCatalogItem = async () => {
      try {
        setLoading(true);
        const data = await fetchCatalog();
        const foundItem = data.find((i: CatalogItem) => i.id === params.id);
        setItem(foundItem || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCatalogItem();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Resource not found
          </h1>
          <Link
            href="/"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <FiArrowLeft className="mr-2" />
            Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
      >
        <FiArrowLeft className="mr-2" />
        Back to catalog
      </Link>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {item.name || item.id}
        </h1>
        {item.description && (
          <div className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            <span dangerouslySetInnerHTML={{ __html: item.description }} />
          </div>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 mb-6">
          {item.createdAt && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FiCalendar className="mr-2" />
              <span className="text-sm">
                Created: {new Date(item.createdAt).toLocaleDateString("en-US")}
              </span>
            </div>
          )}
          {item.vocabulary && item.vocabulary.length > 0 && (
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <FiTag className="mr-2" />
              <span className="text-sm">
                Vocabularies: {item.vocabulary.join(", ")}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowContactForm(true)}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-medium"
        >
          Request access to this resource
        </button>
      </div>

      {/* Properties */}
      {item.properties && Object.keys(item.properties).length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <FiDatabase className="mr-2" />
            Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(item.properties).map(([key, value]) => (
              <div
                key={key}
                className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
              >
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {key}
                </p>
                <div className="text-gray-900 dark:text-white break-words">
                  <span dangerouslySetInnerHTML={{ __html: value }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Additional Information */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Technical Information
        </h2>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Resource ID
            </p>
            <p className="text-gray-900 dark:text-white font-mono text-sm">
              {item.id}
            </p>
          </div>
          {item.type && (
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Type
              </p>
              <p className="text-gray-900 dark:text-white">{item.type}</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm
          catalogItem={item}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </div>
  );
}
