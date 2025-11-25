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
import toast from "react-hot-toast";
import Loader from "../components/Loader";

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
      toast.error(getFriendlyErrorMessage(err));
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
        toast.error(getFriendlyErrorMessage(err));
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) return <Loader />;

  if (fetchError)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-center py-10 px-6 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/20 max-w-md">
          <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-red-500" />
          <h3 className="text-lg font-medium text-red-900 dark:text-red-100">
            Access Error
          </h3>
          <p className="text-red-700 dark:text-red-200/80 mt-2">
            Unable to load this secret. Please try again later.
          </p>
        </div>
      </div>
    );

  if (!secret)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center py-10 px-6 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 max-w-md">
          <Lock className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Secret Not Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            This secret doesn't exist or you don't have access to it.
          </p>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative pb-20">
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

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4"
      >
        <div className="flex items-center min-w-0 flex-1">
          <button
            onClick={() => navigate("/secrets")}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-all flex-shrink-0"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight truncate">
              {secret.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              Secure credential details
            </p>
          </div>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-red-200 dark:border-red-900/30 text-sm font-medium rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </button>
          <Link
            to={`/secrets/${id}/edit`}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-lg shadow-cyan-500/20 text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left Column: Secret Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="lg:col-span-3 space-y-6"
        >
          {/* Secret Value Section */}
          <div className="bg-gradient-to-br from-white to-cyan-50 dark:from-[#161B22] dark:to-cyan-900/20 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/5">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-cyan-500" />
              Secret Value
            </h3>
            <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 border border-gray-200 dark:border-white/5">
              <div className="flex items-center justify-between gap-4">
                <code className="text-base text-cyan-600 dark:text-cyan-400 break-all font-mono flex-1">
                  {isVisible ? decryptedValue : "••••••••••••••••••••••••••••"}
                </code>
                <div className="flex space-x-2 flex-shrink-0">
                  <button
                    onClick={toggleVisibility}
                    className="p-2 bg-white dark:bg-white/5 rounded-lg text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 shadow-sm transition-all"
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
                      className="p-2 bg-white dark:bg-white/5 rounded-lg text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 shadow-sm transition-all"
                      title="Copy"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Identity Details Section */}
          {(secret.username || secret.email) && (
            <div className="bg-gradient-to-br from-white to-cyan-50 dark:from-[#161B22] dark:to-cyan-900/20 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-cyan-500" />
                Identity Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {secret.username && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Username
                    </label>
                    <p className="text-base text-gray-900 dark:text-white font-medium">
                      {secret.username}
                    </p>
                  </div>
                )}
                {secret.email && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                      Email
                    </label>
                    <p className="text-base text-gray-900 dark:text-white font-medium">
                      {secret.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata Section */}
          {secret.metadata && Object.keys(secret.metadata).length > 0 && (
            <div className="bg-gradient-to-br from-white to-cyan-50 dark:from-[#161B22] dark:to-cyan-900/20 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Database className="h-5 w-5 mr-2 text-cyan-500" />
                Custom Metadata
              </h3>
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-white/5">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-white/5">
                  <thead className="bg-gray-50 dark:bg-black/20">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Key
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                      >
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-transparent divide-y divide-gray-200 dark:divide-white/5">
                    {Object.entries(secret.metadata).map(([key, value]) => (
                      <tr key={key}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {key}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 break-all">
                          {String(value)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tags Section */}
          {secret.tags && secret.tags.length > 0 && (
            <div className="bg-gradient-to-br from-white to-cyan-50 dark:from-[#161B22] dark:to-cyan-900/20 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Tag className="h-5 w-5 mr-2 text-cyan-500" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {secret.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 border border-cyan-100 dark:border-cyan-900/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Right Column: History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <SecretHistory secretId={id} />
        </motion.div>
      </div>
    </div>
  );
};

export default SecretDetail;
