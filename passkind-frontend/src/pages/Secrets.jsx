import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Edit,
  Copy,
  Filter,
  X,
  Mail,
  User,
} from "lucide-react";
import api from "../utils/api";
import { ENDPOINTS } from "../constants/api";
import EmptySecretsState from "../components/EmptySecretsState";

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
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
          My Secrets
        </h1>
        <Link
          to="/secrets/new"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Secret
        </Link>
      </div>
      {secrets && secrets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative md:col-span-2">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border border-gray-200 dark:border-none rounded-xl bg-white dark:bg-[#1F2833] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
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
              className={`block px-4 py-3 border border-gray-200 dark:border-none rounded-xl bg-white dark:bg-[#1F2833] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                filterType ? "w-1/2" : "w-full"
              }`}
            >
              <option value="">All Filters</option>
              <option value="username">Username</option>
              <option value="email">Email</option>
            </select>

            {filterType && (
              <div className="relative flex-1">
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="block w-full px-4 py-3 pr-10 border border-gray-200 dark:border-none rounded-xl bg-white dark:bg-[#1F2833] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all appearance-none"
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {filteredSecrets.length === 0 ? (
        <EmptySecretsState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSecrets.map((secret) => (
            <div
              key={secret.id}
              className="bg-white dark:bg-[#0B0C10] rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-800 group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate flex-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {secret.name}
                  </h3>
                  <Link
                    to={`/secrets/${secret.id}/edit`}
                    className="ml-2 text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </Link>
                </div>

                {secret.email && (
                  <div className="mb-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                    {secret.email}
                  </div>
                )}

                {secret.username && (
                  <div className="mb-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <User className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
                    {secret.username}
                  </div>
                )}

                <div className="flex items-center justify-between bg-gray-50 dark:bg-[#1F2833] rounded-xl p-3 mt-4 border border-gray-200 dark:border-gray-800">
                  <div className="flex-1 overflow-hidden">
                    {visibleSecrets[secret.id] ? (
                      <span className="text-sm font-mono text-cyan-600 dark:text-cyan-300">
                        {visibleSecrets[secret.id]}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">
                        ••••••••••••
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => toggleVisibility(secret.id)}
                    className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                  >
                    {visibleSecrets[secret.id] ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {secret.tags && secret.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {secret.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-gray-100 dark:bg-[#1F2833] text-cyan-700 dark:text-cyan-400 border border-gray-200 dark:border-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Link
                    to={`/secrets/${secret.id}`}
                    className="text-sm text-cyan-600 dark:text-cyan-500 hover:text-cyan-700 dark:hover:text-cyan-400 font-medium flex items-center"
                  >
                    View Details <span className="ml-1">→</span>
                  </Link>
                  <span className="text-xs text-gray-500 dark:text-gray-600">
                    {new Date(
                      secret.updatedAt || secret.createdAt
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Secrets;
