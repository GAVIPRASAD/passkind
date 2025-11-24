import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
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
  Shield,
  Clock,
  ChevronRight,
  Lock,
  LayoutGrid,
  List,
  MoreVertical,
  Calendar,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { ENDPOINTS } from "../constants/api";
import EmptySecretsState from "../components/EmptySecretsState";
import VaultHealth from "../components/VaultHealth";

const Secrets = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleSecrets, setVisibleSecrets] = useState({});
  const [filterType, setFilterType] = useState(""); // "username" or "email"
  const [filterValue, setFilterValue] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "table"

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

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
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
      const dateA = new Date(a.updatedAt || a.createdAt);
      const dateB = new Date(b.updatedAt || b.createdAt);
      return dateB - dateA;
    });

  // Favorites Logic - Server-side
  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await api.get("/users/me");
      return response.data;
    },
  });

  // Parse preferences from JSON string
  const preferences = userData?.preferences
    ? typeof userData.preferences === "string"
      ? JSON.parse(userData.preferences)
      : userData.preferences
    : {};

  const favorites = preferences?.favorites || [];

  const toggleFavorite = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      let newFavorites;
      if (favorites.includes(id)) {
        newFavorites = favorites.filter((favId) => favId !== id);
      } else {
        newFavorites = [...favorites, id];
      }

      // Create updated preferences object
      const updatedPreferences = {
        ...preferences,
        favorites: newFavorites,
      };

      // Update server with JSON string
      await api.put("/users/me", {
        preferences: JSON.stringify(updatedPreferences),
      });

      // Invalidate user query to refetch
      queryClient.invalidateQueries(["user"]);
    } catch (err) {
      console.error("Failed to update favorites", err);
      toast.error("Failed to update favorites. Please try again.");
    }
  };

  // Sort favorites to top
  filteredSecrets?.sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Loading your vault...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-500 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20">
        <Shield className="h-12 w-12 mx-auto mb-3 text-red-500" />
        <h3 className="text-lg font-medium">Access Error</h3>
        <p>Unable to load your secrets. Please try again later.</p>
      </div>
    );

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-row justify-between items-center gap-4 px-1">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-1">
            My Vault
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {secrets?.length || 0} secure credentials
          </p>
        </div>
        <Link
          to="/secrets/new"
          className="group inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all shadow-lg shadow-cyan-500/20 dark:shadow-cyan-900/20 whitespace-nowrap"
        >
          <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
          <span className="hidden sm:inline">New Secret</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {/* Vault Health Dashboard */}
      {secrets && secrets.length > 0 && (
        <VaultHealth secrets={secrets} variant="compact" />
      )}

      {/* Search & Filter Bar */}
      {secrets && secrets.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800/40 dark:backdrop-blur-xl p-3 rounded-xl border border-gray-200 dark:border-white/10 flex flex-col md:flex-row gap-3 shadow-sm dark:shadow-2xl"
        >
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-transparent rounded-lg bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-sm"
              placeholder="Search secrets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-50 dark:bg-black/20 rounded-lg p-1 border border-gray-200 dark:border-white/5 w-full md:w-auto">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex-1 md:flex-none flex items-center justify-center px-3 py-2 rounded-md transition-all ${
                viewMode === "grid"
                  ? "bg-white dark:bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="ml-2 text-sm font-medium">Grid</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex-1 md:flex-none flex items-center justify-center px-3 py-2 rounded-md transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-cyan-600/20 text-cyan-600 dark:text-cyan-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
              title="Table View"
            >
              <List className="h-4 w-4" />
              <span className="ml-2 text-sm font-medium">Table</span>
            </button>
          </div>

          {/* Filter */}
          <div className="flex gap-2 min-w-[200px]">
            <div className="relative flex-1">
              <select
                value={filterType}
                onChange={(e) => {
                  setFilterType(e.target.value);
                  setFilterValue("");
                }}
                className="block w-full pl-3 pr-8 py-2.5 border border-gray-200 dark:border-transparent rounded-lg bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer"
              >
                <option value="">Filter By</option>
                <option value="username">Username</option>
                <option value="email">Email</option>
              </select>
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>

            {filterType && (
              <div className="relative flex-1">
                <select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="block w-full pl-3 pr-8 py-2.5 border border-gray-200 dark:border-transparent rounded-lg bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer"
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
                    className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Content Area */}
      {filteredSecrets.length === 0 ? (
        <EmptySecretsState />
      ) : (
        <AnimatePresence mode="wait">
          {viewMode === "grid" ? (
            /* UNIQUE GRID VIEW */
            <motion.div
              key="grid"
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredSecrets.map((secret) => (
                <motion.div
                  key={secret.id}
                  variants={item}
                  className="group relative bg-gradient-to-br from-white to-cyan-50 dark:from-[#161B22] dark:to-cyan-900/20 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 hover:border-cyan-500/30 transition-all duration-300 shadow-sm hover:shadow-lg dark:hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:hover:shadow-cyan-900/10 flex flex-col"
                >
                  {/* Card Header Content */}
                  <div className="relative h-24 p-5">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                      <Shield className="h-24 w-24 text-gray-900 dark:text-white rotate-12" />
                    </div>

                    <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end z-10">
                      <Link to={`/secrets/${secret.id}`}>
                        <div className="h-12 w-12 rounded-xl bg-white/50 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-sm backdrop-blur-sm group-hover:border-cyan-500/30 transition-colors cursor-pointer">
                          <Lock className="h-6 w-6 text-cyan-600 dark:text-cyan-500" />
                        </div>
                      </Link>
                      <button
                        onClick={(e) => toggleFavorite(secret.id, e)}
                        className={`h-10 w-10 rounded-xl flex items-center justify-center backdrop-blur-sm border transition-all ${
                          favorites.includes(secret.id)
                            ? "bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-900/50 text-yellow-500"
                            : "bg-white/50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:text-yellow-500"
                        }`}
                      >
                        <Star
                          className={`h-5 w-5 ${
                            favorites.includes(secret.id) ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-2">
                    <div className="flex justify-between items-start mb-3">
                      <Link
                        to={`/secrets/${secret.id}`}
                        className="flex-1 min-w-0 mr-2"
                      >
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                          {secret.name}
                        </h3>
                      </Link>
                      <Link
                        to={`/secrets/${secret.id}/edit`}
                        className="relative z-10 p-1 -mr-1 text-gray-400 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                        title="Edit Secret"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    </div>

                    {/* Metadata Pills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {secret.username && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5">
                          <User className="h-3 w-3 mr-1.5 text-gray-400 dark:text-gray-500" />
                          {secret.username}
                        </span>
                      )}
                      {secret.email && (
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/5">
                          <Mail className="h-3 w-3 mr-1.5 text-gray-400 dark:text-gray-500" />
                          {secret.email}
                        </span>
                      )}
                    </div>

                    {/* Secret Value */}
                    <div className="bg-gray-50 dark:bg-black/30 rounded-lg p-1 pl-3 flex items-center justify-between border border-gray-200 dark:border-white/5 group-hover:border-gray-300 dark:group-hover:border-white/10 transition-colors mb-4">
                      <div className="font-mono text-sm text-gray-500 dark:text-gray-400 truncate mr-2">
                        {visibleSecrets[secret.id] ? (
                          <span className="text-cyan-600 dark:text-cyan-300">
                            {visibleSecrets[secret.id]}
                          </span>
                        ) : (
                          "••••••••••••"
                        )}
                      </div>
                      <div className="flex">
                        {visibleSecrets[secret.id] && (
                          <button
                            onClick={() =>
                              copyToClipboard(
                                visibleSecrets[secret.id],
                                secret.id
                              )
                            }
                            className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                          >
                            {copiedId === secret.id ? (
                              <span className="text-green-500 dark:text-green-400 text-xs font-bold">
                                OK
                              </span>
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        )}
                        <button
                          onClick={() => toggleVisibility(secret.id)}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          {visibleSecrets[secret.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
                      <div className="flex gap-1">
                        {secret.tags?.slice(0, 3).map((tag, i) => (
                          <div
                            key={i}
                            className="h-1.5 w-6 rounded-full bg-cyan-100 dark:bg-cyan-900/40"
                            title={tag}
                          ></div>
                        ))}
                      </div>
                      <Link
                        to={`/secrets/${secret.id}`}
                        className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 flex items-center transition-colors"
                      >
                        OPEN
                        <ChevronRight className="h-3 w-3 ml-0.5" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* TABLE VIEW */
            <motion.div
              key="table"
              variants={container}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0 }}
              className="bg-white dark:bg-gray-800/40 dark:backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden shadow-sm dark:shadow-xl"
            >
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-white/5">
                  <thead className="bg-gray-50 dark:bg-black/20">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Account
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Secret
                      </th>
                      <th
                        scope="col"
                        className="hidden md:table-cell px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Tags
                      </th>
                      <th
                        scope="col"
                        className="hidden lg:table-cell px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Updated
                      </th>
                      <th scope="col" className="relative px-6 py-4">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-white/5 bg-transparent">
                    {filteredSecrets.map((secret) => (
                      <motion.tr
                        key={secret.id}
                        variants={item}
                        className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={(e) => toggleFavorite(secret.id, e)}
                              className={`mr-3 focus:outline-none transition-colors ${
                                favorites.includes(secret.id)
                                  ? "text-yellow-500"
                                  : "text-gray-300 dark:text-gray-600 hover:text-yellow-500"
                              }`}
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  favorites.includes(secret.id)
                                    ? "fill-current"
                                    : ""
                                }`}
                              />
                            </button>
                            <Link
                              to={`/secrets/${secret.id}`}
                              className="flex items-center group/link"
                            >
                              <div className="h-8 w-8 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-center text-cyan-600 dark:text-cyan-500 mr-3 group-hover/link:bg-cyan-100 dark:group-hover/link:bg-cyan-900/40 transition-colors">
                                <Lock className="h-4 w-4" />
                              </div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white group-hover/link:text-cyan-600 dark:group-hover/link:text-cyan-400 transition-colors">
                                {secret.name}
                              </div>
                            </Link>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            {secret.username && (
                              <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                                <User className="h-3 w-3 mr-1.5 text-gray-400 dark:text-gray-500" />
                                {secret.username}
                              </div>
                            )}
                            {secret.email && (
                              <div className="text-xs text-gray-500 flex items-center mt-0.5">
                                <Mail className="h-3 w-3 mr-1.5 text-gray-400 dark:text-gray-500" />
                                {secret.email}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <div className="font-mono text-xs text-gray-500 dark:text-gray-400 w-24 truncate">
                              {visibleSecrets[secret.id] ? (
                                <span className="text-cyan-600 dark:text-cyan-300">
                                  {visibleSecrets[secret.id]}
                                </span>
                              ) : (
                                "••••••••••••"
                              )}
                            </div>
                            <button
                              onClick={() => toggleVisibility(secret.id)}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                            >
                              {visibleSecrets[secret.id] ? (
                                <EyeOff className="h-3.5 w-3.5" />
                              ) : (
                                <Eye className="h-3.5 w-3.5" />
                              )}
                            </button>
                            {visibleSecrets[secret.id] && (
                              <button
                                onClick={() =>
                                  copyToClipboard(
                                    visibleSecrets[secret.id],
                                    secret.id
                                  )
                                }
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                              >
                                {copiedId === secret.id ? (
                                  <span className="text-green-500 dark:text-green-400 text-[10px]">
                                    OK
                                  </span>
                                ) : (
                                  <Copy className="h-3.5 w-3.5" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-1">
                            {secret.tags?.slice(0, 2).map((tag, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border border-cyan-100 dark:border-cyan-900/30"
                              >
                                {tag}
                              </span>
                            ))}
                            {secret.tags?.length > 2 && (
                              <span className="text-[10px] text-gray-500">
                                +{secret.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                          {new Date(
                            secret.updatedAt || secret.createdAt
                          ).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            to={`/secrets/${secret.id}/edit`}
                            className="text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Secrets;
