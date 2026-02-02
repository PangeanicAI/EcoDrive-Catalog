import {
  FiTarget,
  FiUsers,
  FiShield,
  FiZap,
  FiGlobe,
  FiTrendingUp,
} from "react-icons/fi";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          About EcoDrive TermSpace
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          A sectoral data space for automotive specialized terminology, driving
          precision, interoperability, and global competitiveness in sustainable
          mobility
        </p>
      </section>

      {/* Project Overview */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12 mb-12">
        <div className="flex items-center mb-6">
          <FiTarget className="text-4xl text-primary-600 mr-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Project Overview
          </h2>
        </div>
        <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>
            The <strong>EcoDrive TermSpace</strong> project, led by{" "}
            <strong>Pangeanic</strong> and the{" "}
            <strong>Universitat Jaume I de Castellón</strong>, aims to develop a
            sectoral data space that centralizes and manages specialized
            terminology in the automotive field.
          </p>
          <p>
            This data space facilitates interoperability, ensures precise
            technical communication, and enables adaptation to international
            markets, addressing the needs of a sector in constant evolution due
            to new technologies, the transition to sustainable mobility, and
            market globalization.
          </p>
          <p>
            Multilingual terminology management is essential to address the
            technical complexity of the automotive industry, which integrates
            advanced systems such as electrification, connectivity, and
            autonomous driving. It is also crucial for operating in global
            markets and complying with international regulations that require
            unified terminology to avoid errors in technical documentation and
            legal processes.
          </p>
        </div>
      </section>

      {/* Key Use Cases */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
          Key Use Cases
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Professional Terminology Management
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Centralized resources for managing specialized automotive
              terminology across all technical domains and languages.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Translation Support
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Assistance for human and machine translators to ensure accurate
              and consistent translations across all documentation.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              User Interface Design
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Clear and accessible interfaces for end users, ensuring consistent
              terminology across all customer-facing materials.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Interdisciplinary Collaboration
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Facilitating collaboration between engineers, documentation
              specialists, and terminologists for unified technical
              communication.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10">
          Our Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
              <FiShield className="text-3xl text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Quality & Consistency
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ensuring high-quality, consistent terminology across all technical
              communications and documentation.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
              <FiGlobe className="text-3xl text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Interoperability
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Seamless integration with management and translation systems,
              enabling global collaboration and standardization.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
              <FiZap className="text-3xl text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
              Innovation
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Leveraging cutting-edge technologies including AI-powered virtual
              assistants and advanced NLP solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-gradient-to-r from-primary-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-lg p-8 md:p-12 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Benefits for the Automotive Sector
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <FiTrendingUp className="text-2xl text-primary-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Process Optimization
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Centralize terminology resources to streamline workflows and
                reduce redundancies.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <FiShield className="text-2xl text-primary-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Enhanced Quality
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Improve consistency and accuracy in all technical communications
                and documentation.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <FiGlobe className="text-2xl text-primary-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Global Market Access
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Gain competitive advantage in international markets with
                standardized terminology.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <FiUsers className="text-2xl text-primary-600 mr-4 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Better Collaboration
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                Enable seamless collaboration across teams, departments, and
                organizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Expected Results */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Expected Outcomes
        </h2>
        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              A <strong>functional and validated data space</strong> for
              automotive terminology management
            </p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <strong>High-quality, interoperable terminology resources</strong>{" "}
              accessible across platforms
            </p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <strong>Enhanced machine translation and NLP technologies</strong>{" "}
              for automotive applications
            </p>
          </div>
          <div className="flex items-start">
            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-4 flex-shrink-0"></div>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              <strong>AI-powered virtual assistants</strong> for terminology
              queries and support
            </p>
          </div>
        </div>

        <div className="mt-8 p-6 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <p className="text-lg text-gray-800 dark:text-gray-200 font-medium">
            In summary, <strong>EcoDrive TermSpace</strong> addresses a
            strategic need of the automotive industry, promoting
            competitiveness, sustainability, and technical precision. Its
            interdisciplinary and scientific approach will ensure significant
            impact for manufacturers, engineers, translators, and end users,
            positioning itself as a reference in the use of data for sustainable
            and globalized mobility.
          </p>
        </div>
      </section>
    </div>
  );
}
