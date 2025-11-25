import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  Edit2,
  AlertTriangle,
  X,
  Lock,
  User,
  Mail,
  Tag,
  Database,
  Key,
  Shield,
  Type,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { ENDPOINTS } from "../constants/api";
import PasswordGenerator from "../components/PasswordGenerator";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { getFriendlyErrorMessage } from "../utils/errorUtils";

const SecretForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    value: "",
    email: "",
    username: "",
    tags: [],
    metadata: {},
  });

  const [tagInput, setTagInput] = useState("");
  const [metaKey, setMetaKey] = useState("");
  const [metaValue, setMetaValue] = useState("");
  const [editingMetaKey, setEditingMetaKey] = useState(null);
  const [error, setError] = useState(null);

  const {
    data: secret,
    isLoading,
    isError,
    error: fetchError,
  } = useQuery({
    queryKey: ["secret", id],
    queryFn: async () => {
      // Fetch metadata and value in parallel for better performance
      const [metadataResponse, valueResponse] = await Promise.all([
        api.get(`${ENDPOINTS.SECRETS}/${id}`),
        api.get(`${ENDPOINTS.SECRETS}/${id}/value`),
      ]);
      return { ...metadataResponse.data, decryptedValue: valueResponse.data };
    },
    enabled: isEditMode,
    retry: 1,
  });

  useEffect(() => {
    if (isError) {
      console.error("Failed to fetch secret:", fetchError);
      toast.error("Failed to load secret details");
      navigate("/secrets");
    }
  }, [isError, fetchError, navigate]);

  useEffect(() => {
    if (secret) {
      setFormData({
        name: secret.name || "",
        value: secret.decryptedValue || "",
        email: secret.email || "",
        username: secret.username || "",
        tags: secret.tags || [],
        metadata:
          secret.metadata && typeof secret.metadata === "object"
            ? secret.metadata
            : {},
      });
    }
  }, [secret]);

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (isEditMode) {
        return api.put(`${ENDPOINTS.SECRETS}/${id}`, data);
      } else {
        return api.post(ENDPOINTS.SECRETS, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["secrets"]);
      navigate("/secrets");
    },
    onError: (err) => {
      toast.error(getFriendlyErrorMessage(err));
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const addTag = () => {
    if (tagInput.trim()) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    const newTags = [...formData.tags];
    newTags.splice(index, 1);
    setFormData({ ...formData, tags: newTags });
  };

  const addMetadata = () => {
    if (metaKey.trim() && metaValue.trim()) {
      setFormData({
        ...formData,
        metadata: { ...formData.metadata, [metaKey.trim()]: metaValue.trim() },
      });
      setMetaKey("");
      setMetaValue("");
    }
  };

  const removeMetadata = (key) => {
    const newMeta = { ...formData.metadata };
    delete newMeta[key];
    setFormData({ ...formData, metadata: newMeta });
  };

  const startEditMetadata = (key, value) => {
    setEditingMetaKey(key);
    setMetaKey(key);
    setMetaValue(value);
  };

  const saveEditMetadata = () => {
    if (metaKey.trim() && metaValue.trim()) {
      const newMeta = { ...formData.metadata };
      if (editingMetaKey && editingMetaKey !== metaKey.trim()) {
        delete newMeta[editingMetaKey];
      }
      newMeta[metaKey.trim()] = metaValue.trim();
      setFormData({ ...formData, metadata: newMeta });
      setMetaKey("");
      setMetaValue("");
      setEditingMetaKey(null);
    }
  };

  const cancelEditMetadata = () => {
    setMetaKey("");
    setMetaValue("");
    setEditingMetaKey(null);
  };

  if (isEditMode && isLoading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );

  const handlePasswordGenerate = (password) => {
    setFormData({ ...formData, value: password });
  };

  const generateRandomPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let password = "";
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleQuickGenerate = () => {
    const newPassword = generateRandomPassword();
    setFormData({ ...formData, value: newPassword });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative pb-20">
      {/* Error Overlay */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-red-500/90 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-red-400/50 flex items-start gap-3">
              <div className="bg-white/20 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-0.5">Error</h4>
                <p className="text-sm text-white/90 leading-relaxed break-words">
                  {error}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 -mr-1 -mt-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/secrets")}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
              {isEditMode ? "Edit Secret" : "New Secret"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {isEditMode
                ? "Update your secure credential details"
                : "Add a new secure credential to your vault"}
            </p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate("/secrets")}
            className="flex-1 sm:flex-none px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-300 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/10 transition-colors text-center"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            className="flex-1 sm:flex-none inline-flex items-center justify-center px-6 py-3 sm:py-2 border border-transparent text-sm font-medium rounded-xl shadow-lg shadow-cyan-500/20 text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <>
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Secret
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Identity Section */}
          <div className="bg-gradient-to-br from-white to-cyan-50 dark:from-[#161B22] dark:to-cyan-900/20 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-cyan-500" />
              Identity Details
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Type className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Netflix, AWS Root, Personal Email"
                    className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="johndoe"
                      className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secret Value Section */}
          <div className="bg-gradient-to-br from-white to-cyan-50 dark:from-[#161B22] dark:to-cyan-900/20 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-cyan-500" />
              Secret Value
            </h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password / Key / Token
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Enter your secret value here..."
                  className="block w-full pl-10 pr-12 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all font-mono text-lg"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={handleQuickGenerate}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                  title="Generate Secure Password"
                >
                  <span className="text-xs font-medium mr-2 hidden sm:inline">
                    Generate
                  </span>
                  <div className="p-1.5 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                    <RefreshCw className="h-4 w-4" />
                  </div>
                </button>
              </div>
              <PasswordStrengthMeter password={formData.value} />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                <span>This value will be encrypted before being stored.</span>
                <span
                  className="text-cyan-600 dark:text-cyan-400 cursor-pointer hover:underline sm:hidden"
                  onClick={handleQuickGenerate}
                >
                  Tap icon to generate
                </span>
              </p>
            </div>
          </div>

          {/* Organization Section */}
          <div className="bg-gradient-to-br from-white to-cyan-50 dark:from-[#161B22] dark:to-cyan-900/20 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/5">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Database className="h-5 w-5 mr-2 text-cyan-500" />
              Organization
            </h2>

            {/* Tags */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all sm:text-sm"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Add a tag..."
                  />
                </div>
                <button
                  type="button"
                  onClick={addTag}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-transparent text-sm font-medium text-white bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {formData.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-900/30"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-2 text-cyan-400 hover:text-cyan-600 dark:hover:text-cyan-200 focus:outline-none"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                  No tags added yet.
                </p>
              )}
            </div>

            {/* Metadata */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Metadata
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="block w-1/3 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all sm:text-sm"
                  value={metaKey}
                  onChange={(e) => setMetaKey(e.target.value)}
                  placeholder="Key"
                />
                <input
                  type="text"
                  className="block w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all sm:text-sm"
                  value={metaValue}
                  onChange={(e) => setMetaValue(e.target.value)}
                  placeholder="Value"
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(),
                    editingMetaKey ? saveEditMetadata() : addMetadata())
                  }
                />
                {editingMetaKey ? (
                  <>
                    <button
                      type="button"
                      onClick={saveEditMetadata}
                      className="inline-flex items-center justify-center w-10 rounded-xl bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditMetadata}
                      className="inline-flex items-center justify-center w-10 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={addMetadata}
                    className="inline-flex items-center justify-center w-10 rounded-xl bg-gray-900 dark:bg-gray-700 text-white hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {Object.entries(formData.metadata).length > 0 ? (
                  Object.entries(formData.metadata).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center bg-gray-50 dark:bg-black/20 p-3 rounded-xl border border-gray-200 dark:border-white/5 group"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 block mb-0.5">
                          {key}
                        </span>
                        <span className="text-sm text-gray-900 dark:text-white truncate block">
                          {value}
                        </span>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => startEditMetadata(key, value)}
                          className="p-1.5 text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeMetadata(key)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    No custom metadata added.
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Helper Tools */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="sticky top-6 space-y-6">
            <PasswordGenerator onGenerate={handlePasswordGenerate} />

            <div className="bg-cyan-50 dark:bg-cyan-900/10 rounded-2xl p-6 border border-cyan-100 dark:border-cyan-900/20">
              <h3 className="text-sm font-semibold text-cyan-900 dark:text-cyan-100 mb-2">
                Security Tip
              </h3>
              <p className="text-sm text-cyan-800 dark:text-cyan-200/80 leading-relaxed">
                Use a combination of uppercase letters, numbers, and symbols to
                create a strong password. Avoid using personal information like
                birthdays or names.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SecretForm;
