import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Eye, EyeOff, Edit, Copy, Filter, X } from "lucide-react";
import api from "../utils/api";
import { ENDPOINTS } from "../constants/api";

const Secrets = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSecrets, setVisibleSecrets] = useState({});
  const [filterType, setFilterType] = useState(""); // "username" or "email"
  const [filterValue, setFilterValue] = useState("");

  const {
    data: secrets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["secrets"],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.SECRETS);
      return response.data;
    },
  });

  const toggleVisibility = async (id) => {
    if (visibleSecrets[id]) {
      const newVisible = { ...visibleSecrets };
      delete newVisible[id];
      setVisibleSecrets(newVisible);
    } else {
      try {
        const response = await api.get(`${ENDPOINTS.SECRETS}/${id}/value`);
        setVisibleSecrets({ ...visibleSecrets, [id]: response.data });
      } catch (err) {
        console.error("Failed to decrypt secret", err);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  // Get unique usernames and emails for filter options
  const uniqueUsernames = [
    ...new Set(secrets?.map((s) => s.username).filter(Boolean)),
  ];
  const uniqueEmails = [
    ...new Set(secrets?.map((s) => s.email).filter(Boolean)),
  ];

  const filteredSecrets = secrets
    ?.filter((secret) => {
      // Apply search filter
      const matchesSearch =
        !searchTerm ||
        secret.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (secret.tags &&
          secret.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )) ||
        (secret.email &&
          secret.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (secret.username &&
          secret.username.toLowerCase().includes(searchTerm.toLowerCase()));

      // Apply type filter
      const matchesFilter =
        !filterType ||
        !filterValue ||
        (filterType === "username" && secret.username === filterValue) ||
        (filterType === "email" && secret.email === filterValue);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      // Sort by updatedAt in descending order (most recent first)
      const dateA = new Date(a.updatedAt || a.createdAt);
      const dateB = new Date(b.updatedAt || b.createdAt);
      return dateB - dateA;
    });

  if (isLoading)
    return <div className="text-center py-10">Loading secrets...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">
        Error loading secrets
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          My Secrets
        </h1>
        <Link
          to="/secrets/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Secret
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative md:col-span-2">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Search secrets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setFilterValue("");
            }}
            className="block w-1/2 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            <option value="">All</option>
            <option value="username">Username</option>
            <option value="email">Email</option>
          </select>

          {filterType && (
            <div className="relative flex-1">
              <select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="block w-full px-3 py-2 pr-8 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="">Select {filterType}</option>
                {filterType === "username" &&
                  uniqueUsernames.map((username) => (
                    <option key={username} value={username}>
                      {username}
                    </option>
                  ))}
                {filterType === "email" &&
                  uniqueEmails.map((email) => (
                    <option key={email} value={email}>
                      {email}
                    </option>
                  ))}
              </select>
              {filterValue && (
                <button
                  onClick={() => {
                    setFilterType("");
                    setFilterValue("");
                  }}
                  className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredSecrets?.map((secret) => (
          <div
            key={secret.id}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    <Link
                      to={`/secrets/${secret.id}`}
                      className="hover:underline"
                    >
                      {secret.name}
                    </Link>
                  </h3>
                  {secret.username && (
                    <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                      {secret.username}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/secrets/${secret.id}/edit`}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-md p-2">
                  <code className="text-sm text-gray-800 dark:text-gray-200 break-all">
                    {visibleSecrets[secret.id] || "••••••••••••"}
                  </code>
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={() => toggleVisibility(secret.id)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {visibleSecrets[secret.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    {visibleSecrets[secret.id] && (
                      <button
                        onClick={() =>
                          copyToClipboard(visibleSecrets[secret.id])
                        }
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {secret.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Secrets;
