import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  ArrowLeft,
  Plus,
  Trash,
  Edit,
  AlertTriangle,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { ENDPOINTS } from "../constants/api";
import PasswordGenerator from "../components/PasswordGenerator";
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

  const { data: secret, isLoading } = useQuery({
    queryKey: ["secret", id],
    queryFn: async () => {
      const response = await api.get(`${ENDPOINTS.SECRETS}/${id}/value`);
      // We need to fetch the full secret details too, not just value
      // But for now let's assume we get the list and find it or fetch it
      // Actually the value endpoint returns string, we need details
      // Let's fetch the list to get details
      const listResponse = await api.get(ENDPOINTS.SECRETS);
      const secretDetails = listResponse.data.find((s) => s.id === id);
      return { ...secretDetails, decryptedValue: response.data };
    },
    enabled: isEditMode,
  });

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
      setError(getFriendlyErrorMessage(err));
      setTimeout(() => setError(null), 5000);
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
      // If key changed, remove old key
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

  if (isEditMode && isLoading) return <div>Loading...</div>;

  const handlePasswordGenerate = (password) => {
    setFormData({ ...formData, value: password });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
      <div className="mb-6 flex items-center">
        <button
          onClick={() => navigate("/secrets")}
          className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {isEditMode ? "Edit Secret" : "New Secret"}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white dark:bg-[#0B0C10] p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Name
              </label>
              <input
                type="text"
                required
                className="block w-full rounded-xl border border-gray-200 dark:border-none bg-gray-50 dark:bg-[#1F2833] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 p-2.5 transition-all"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Secret Value
              </label>
              <input
                type="text"
                required
                className="block w-full rounded-xl border border-gray-200 dark:border-none bg-gray-50 dark:bg-[#1F2833] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 p-2.5 transition-all font-mono"
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  className="block w-full rounded-xl border border-gray-200 dark:border-none bg-gray-50 dark:bg-[#1F2833] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 p-2.5 transition-all"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                  Username (Optional)
                </label>
                <input
                  type="text"
                  className="block w-full rounded-xl border border-gray-200 dark:border-none bg-gray-50 dark:bg-[#1F2833] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 p-2.5 transition-all"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Tags
              </label>
              <div className="mt-1 flex space-x-2">
                <input
                  type="text"
                  className="block w-full rounded-xl border border-gray-200 dark:border-none bg-gray-50 dark:bg-[#1F2833] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 p-2.5 transition-all"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="inline-flex items-center justify-center w-14 rounded-xl border border-transparent shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
                >
                  <Plus className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 dark:bg-[#1F2833] text-cyan-700 dark:text-cyan-400 border border-gray-200 dark:border-gray-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                Metadata
              </label>
              <div className="mt-1 flex space-x-2">
                <input
                  type="text"
                  className="block w-1/3 rounded-xl border border-gray-200 dark:border-none bg-gray-50 dark:bg-[#1F2833] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 p-2.5 transition-all"
                  value={metaKey}
                  onChange={(e) => setMetaKey(e.target.value)}
                  placeholder="Key"
                />
                <input
                  type="text"
                  className="block w-full rounded-xl border border-gray-200 dark:border-none bg-gray-50 dark:bg-[#1F2833] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 p-2.5 transition-all"
                  value={metaValue}
                  onChange={(e) => setMetaValue(e.target.value)}
                  placeholder="Value"
                />
                {editingMetaKey ? (
                  <>
                    <button
                      type="button"
                      onClick={saveEditMetadata}
                      className="inline-flex items-center justify-center w-14 rounded-xl border border-transparent shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    >
                      <Save className="h-6 w-6" />
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditMetadata}
                      className="inline-flex items-center justify-center w-14 rounded-xl border border-gray-600 text-gray-400 bg-transparent hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={addMetadata}
                    className="inline-flex items-center justify-center w-14 rounded-xl border border-transparent shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
                  >
                    <Plus className="h-6 w-6" />
                  </button>
                )}
              </div>
              <div className="mt-4 space-y-2">
                {Object.entries(formData.metadata).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between items-center bg-gray-50 dark:bg-[#1F2833] p-3 rounded-xl border border-gray-200 dark:border-gray-700"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                        {key}:
                      </span>{" "}
                      {value}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => startEditMetadata(key, value)}
                        className="text-gray-400 hover:text-white transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMetadata(key)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 transition-all"
              >
                <Save className="mr-2 h-5 w-5" />
                {mutation.isPending ? "Saving..." : "Save Secret"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Password Generator */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            <PasswordGenerator onGenerate={handlePasswordGenerate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretForm;
