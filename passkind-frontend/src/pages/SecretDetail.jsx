import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Edit,
  Eye,
  EyeOff,
  Copy,
  Lock,
  Mail,
  User,
  Tag,
  Database,
  Trash2,
  X,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { ENDPOINTS } from "../constants/api";
import SecretHistory from "../components/SecretHistory";
import { getFriendlyErrorMessage } from "../utils/errorUtils";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const SecretDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isVisible, setIsVisible] = useState(false);
  const [decryptedValue, setDecryptedValue] = useState("");
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const {
    data: secret,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["secret", id],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.SECRETS);
      const found = response.data.find((s) => s.id === id);
      if (!found) throw new Error("Secret not found");
      return found;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`${ENDPOINTS.SECRETS}/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["secrets"]);
      navigate("/secrets");
    },
    onError: (err) => {
      setError(getFriendlyErrorMessage(err));
      setTimeout(() => setError(null), 5000);
      setIsDeleteModalOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const toggleVisibility = async () => {
    if (isVisible) {
      setIsVisible(false);
    } else {
      try {
        if (!decryptedValue) {
          const response = await api.get(`${ENDPOINTS.SECRETS}/${id}/value`);
          setDecryptedValue(response.data);
        }
        setIsVisible(true);
      } catch (err) {
        console.error("Failed to decrypt secret", err);
        setError(getFriendlyErrorMessage(err));
        setTimeout(() => setError(null), 5000);
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (fetchError)
    return (
      <div className="text-center py-10 text-red-500">Error loading secret</div>
    );
  if (!secret) return <div className="text-center py-10">Secret not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isDeleting={deleteMutation.isPending}
        title="Delete Secret"
        message={`Are you sure you want to delete "${secret.name}"? This action cannot be undone and will remove all history associated with this secret.`}
      />

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

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/secrets")}
            className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {secret.name}
          </h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-red-200 dark:border-red-900/30 text-sm font-medium rounded-lg text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </button>
          <Link
            to={`/secrets/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Secret Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#161B22] shadow-sm rounded-2xl overflow-hidden border border-gray-200 dark:border-white/5">
            <div className="px-4 py-5 sm:p-6 space-y-6">
              {/* Secret Value Section */}
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-gray-400" /> Secret Value
                </h3>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-black/20 rounded-xl p-4 border border-gray-200 dark:border-white/5">
                  <code className="text-sm text-gray-800 dark:text-gray-200 break-all font-mono">
                    {isVisible
                      ? decryptedValue
                      : "••••••••••••••••••••••••••••"}
                  </code>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={toggleVisibility}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                      title={isVisible ? "Hide" : "Show"}
                    >
                      {isVisible ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                    {isVisible && (
                      <button
                        onClick={() => copyToClipboard(decryptedValue)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
                        title="Copy"
                      >
                        <Copy className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Metadata Section */}
              {secret.metadata && Object.keys(secret.metadata).length > 0 && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                    <Database className="h-5 w-5 mr-2 text-gray-400" /> Metadata
                  </h3>
                  <div className="bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden">
                    <dl className="divide-y divide-gray-200 dark:divide-white/5">
                      {Object.entries(secret.metadata).map(([key, value]) => (
                        <div
                          key={key}
                          className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
                        >
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {key}
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                            {String(value)}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {secret.username && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-1">
                      <User className="h-4 w-4 mr-1" /> Username
                    </h4>
                    <p className="text-gray-900 dark:text-white">
                      {secret.username}
                    </p>
                  </div>
                )}
                {secret.email && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-1">
                      <Mail className="h-4 w-4 mr-1" /> Email
                    </h4>
                    <p className="text-gray-900 dark:text-white">
                      {secret.email}
                    </p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {secret.tags && secret.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center mb-2">
                    <Tag className="h-4 w-4 mr-1" /> Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {secret.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-900/50"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-1">
          <SecretHistory secretId={id} />
        </div>
      </div>
    </div>
  );
};

export default SecretDetail;
