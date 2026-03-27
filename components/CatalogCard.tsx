import Link from "next/link";
import { FiExternalLink, FiCalendar, FiTag } from "react-icons/fi";
import { CatalogItem } from "@/types/catalog";

interface CatalogCardProps {
  item: CatalogItem;
}

export default function CatalogCard({ item }: CatalogCardProps) {
  return (
    <Link href={`/catalog/${item.id}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 h-full cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">
            {item.name || item.id}
          </h3>
          <FiExternalLink className="text-gray-400 ml-2 flex-shrink-0" />
        </div>

        {item.description && (
          <div className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
            <span dangerouslySetInnerHTML={{ __html: item.description }} />
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-4">
          {item.vocabulary &&
            item.vocabulary.slice(0, 3).map((vocab, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
              >
                <FiTag className="mr-1" size={12} />
                {vocab}
              </span>
            ))}
          {item.vocabulary && item.vocabulary.length > 3 && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              +{item.vocabulary.length - 3} more
            </span>
          )}
        </div>

        {item.createdAt && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FiCalendar className="mr-2" size={14} />
            <span>{new Date(item.createdAt).toLocaleDateString("es-ES")}</span>
          </div>
        )}
      </div>
    </Link>
  );
}
