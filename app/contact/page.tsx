"use client";

import { useState } from "react";
import { FiMail, FiPhone, FiMapPin, FiSend } from "react-icons/fi";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the actual form submission
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Have questions or need more information? We are here to help
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <FiMail className="text-2xl text-primary-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Email
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  support@pangeanic.com
                </p>
              </div>
            </div>
          </div>

          {/* <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <FiPhone className="text-2xl text-primary-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Phone
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  +34 XXX XXX XXX
                </p>
              </div>
            </div>
          </div> */}

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <FiMapPin className="text-2xl text-primary-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Location
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Av. de les Corts Valencianes 26, Valencia, Spain
                </p>
              </div>
            </div>
          </div>

          {/* Partner Information */}
          <div className="bg-gradient-to-br from-primary-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Project Partners
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                Pangeanic
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary-600 rounded-full mr-2"></div>
                Universitat Jaume I de Castellón
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Send us a message
            </h2>

            {submitted && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-800 dark:text-green-200">
                  Message sent successfully! We will get back to you soon.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition font-medium flex items-center justify-center"
              >
                <FiSend className="mr-2" />
                Send message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
