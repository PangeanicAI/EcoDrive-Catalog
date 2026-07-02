import Link from "next/link";
import Image from "next/image";
import { FiGithub, FiLinkedin, FiTwitter, FiGlobe } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-xl font-bold">EcoDrive TermSpace</span>
            </div>
            <p className="text-gray-400 mb-4">
              Federated catalog platform for managing and sharing automotive
              terminology through secure data space connectors.
            </p>
            <p className="text-sm text-gray-500">
              A project by Pangeanic and Universitat Jaume I de Castellón
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-primary-400 transition"
                >
                  Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-primary-400 transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-primary-400 transition"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.pangeanic.com"
                className="text-gray-400 hover:text-primary-400 transition"
                aria-label="Website"
              >
                <FiGlobe size={24} />
              </a>
              <a
                href="https://www.linkedin.com/company/pangeanic"
                className="text-gray-400 hover:text-primary-400 transition"
                aria-label="LinkedIn"
              >
                <FiLinkedin size={24} />
              </a>
              <a
                href="https://github.com/PangeanicAI"
                className="text-gray-400 hover:text-primary-400 transition"
                aria-label="GitHub"
              >
                <FiGithub size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Partners Logos */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <h3 className="text-center text-lg font-semibold mb-6 text-gray-400">
            Project Partners
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {/* Pangeanic Logo */}
            <div className="flex items-center justify-center">
              <Image
                src="/logos/Logo Pangeanic Alta.webp"
                alt="Pangeanic"
                width={180}
                height={60}
                className="h-12 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition"
              />
            </div>

            {/* UJI Logo */}
            <div className="flex items-center justify-center">
              <Image
                src="/logos/marca-uji-color-fons-transparent.png"
                alt="Universitat Jaume I"
                width={180}
                height={60}
                className="h-12 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition"
              />
            </div>

            {/* Valgrai Logo */}
            <div className="flex items-center justify-center">
              <Image
                src="/logos/valgrai-logo.svg"
                alt="Valgrai"
                width={180}
                height={60}
                className="h-12 w-auto object-contain brightness-0 invert opacity-80 hover:opacity-100 transition"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} EcoDrive TermSpace. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
