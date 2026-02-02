import Link from "next/link";
import { FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400 mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Page not found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
        >
          <FiHome className="mr-2" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
