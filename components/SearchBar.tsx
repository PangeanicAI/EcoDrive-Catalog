import { FiSearch, FiFilter } from "react-icons/fi";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  vocabularies: string[];
  selectedVocabulary: string;
  onVocabularyChange: (value: string) => void;
}

export default function SearchBar({
  searchTerm,
  onSearchChange,
  vocabularies,
  selectedVocabulary,
  onVocabularyChange,
}: SearchBarProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Vocabulary Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiFilter className="text-gray-400" />
          </div>
          <select
            value={selectedVocabulary}
            onChange={(e) => onVocabularyChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none cursor-pointer"
          >
            <option value="">All vocabularies</option>
            {vocabularies.map((vocab) => (
              <option key={vocab} value={vocab}>
                {vocab}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
