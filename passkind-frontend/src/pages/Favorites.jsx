import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  EyeOff,
  Copy,
  Edit,
  Trash2,
  Grid,
  List,
  Star,
  Mail,
  User,
  Calendar,
  Tag,
  Clock,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Filter,
  X,
  Shield,
  Lock,
} from "lucide-react";
import api from "../utils/api";
import { ENDPOINTS } from "../constants/api";
import { motion, AnimatePresence } from "framer-motion";
import VaultHealth from "../components/VaultHealth";
import Loader from "../components/Loader";

const Favorites = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [visibleSecrets, setVisibleSecrets] = React.useState({});
  const [filterType, setFilterType] = React.useState(""); // "username" or "email"
  const [sortBy, setSortBy] = React.useState("updatedAt"); // "name", "createdAt", "updatedAt"
  const [viewMode, setViewMode] = React.useState("grid"); // "grid" or "table"
  const [expandedRows, setExpandedRows] = React.useState({});
  const [showFilterMenu, setShowFilterMenu] = React.useState(false);

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

  // Filter to show only favorites
  const favoriteSecrets = secrets?.filter((secret) =>
    favorites.includes(secret.id)
  );

  // Apply search and filters
  let filteredSecrets = favoriteSecrets?.filter((secret) => {
    const matchesSearch =
      secret.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      secret.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      secret.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterType === "username") {
      return matchesSearch && secret.username;
    } else if (filterType === "email") {
      return matchesSearch && secret.email;
    }
    return matchesSearch;
  });

  // Sort
  filteredSecrets = filteredSecrets?.sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    } else if (sortBy === "createdAt") {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB - dateA;
    } else {
      const dateA = new Date(a.updatedAt);
      const dateB = new Date(b.updatedAt);
      return dateB - dateA;
    }
  });

  const toggleVisibility = (id) => {
    setVisibleSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = async (text, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this secret?")) {
      try {
        await api.delete(`${ENDPOINTS.SECRETS}/${id}`);
        queryClient.invalidateQueries(["secrets"]);
      } catch (err) {
        console.error("Failed to delete secret", err);
      }
    }
  };

  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error loading favorites</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
              Favorites
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {favoriteSecrets?.length || 0} favorite{" "}
              {favoriteSecrets?.length === 1 ? "secret" : "secrets"}
            </p>
          </div>
          <Link
            to="/secrets/new"
            className="inline-flex items-center justify-center px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Secret
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search favorites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                className={`px-4 py-2 border rounded-xl flex items-center gap-2 transition-colors ${
                  filterType
                    ? "bg-cyan-50 dark:bg-cyan-900/20 border-cyan-600 text-cyan-700 dark:text-cyan-400"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Filter className="h-5 w-5" />
                Filter
              </button>

              <AnimatePresence>
                {showFilterMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-10"
                  >
                    <button
                      onClick={() => {
                        setFilterType("");
                        setShowFilterMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-t-xl"
                    >
                      All
                    </button>
                    <button
                      onClick={() => {
                        setFilterType("username");
                        setShowFilterMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      With Username
                    </button>
                    <button
                      onClick={() => {
                        setFilterType("email");
                        setShowFilterMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-b-xl"
                    >
                      With Email
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="updatedAt">Recently Updated</option>
              <option value="createdAt">Recently Created</option>
              <option value="name">Name (A-Z)</option>
            </select>

            <div className="flex border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 ${
                  viewMode === "grid"
                    ? "bg-cyan-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-2 ${
                  viewMode === "table"
                    ? "bg-cyan-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {filteredSecrets?.length === 0 && (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No favorites yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Star secrets from your vault to see them here
            </p>
          </div>
        )}

        {/* Grid View */}
        {viewMode === "grid" && filteredSecrets?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSecrets.map((secret) => (
              <div
                key={secret.id}
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
                          onClick={(e) => {
                            e.preventDefault();
                            copyToClipboard(visibleSecrets[secret.id]);
                          }}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleVisibility(secret.id);
                        }}
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
              </div>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === "table" && filteredSecrets?.length > 0 && (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSecrets.map((secret) => (
                  <tr
                    key={secret.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/secrets/${secret.id}`)
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => toggleFavorite(secret.id, e)}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              favorites.includes(secret.id)
                                ? "text-yellow-500 fill-yellow-500"
                                : "text-gray-400"
                            }`}
                          />
                        </button>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {secret.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {secret.username || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {secret.email || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {new Date(secret.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/secrets/${secret.id}/edit`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-cyan-600 hover:text-cyan-900 dark:hover:text-cyan-400"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={(e) => handleDelete(secret.id, e)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
