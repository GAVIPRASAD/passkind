import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
} from "lucide-react";
import api from "../utils/api";
import { ENDPOINTS } from "../constants/api";
import SecretHistory from "../components/SecretHistory";

const SecretDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [decryptedValue, setDecryptedValue] = useState("");

  const {
    data: secret,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["secret", id],
    queryFn: async () => {
      // Fetch list to get details (since we don't have a specific get-detail endpoint yet, or we do?)
      // We don't have a specific get-detail endpoint in Controller, only getSecrets (list) and getSecretValue.
      // Ideally we should have one, but for now we can filter from the list or just rely on the list being cached.
      // Wait, fetching the whole list is inefficient. But let's stick to what we have or add a get-detail endpoint.
      // For now, let's assume we fetch the list.
      const response = await api.get(ENDPOINTS.SECRETS);
      const found = response.data.find((s) => s.id === id);
      if (!found) throw new Error("Secret not found");
      return found;
    },
  });

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
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (error)
    return (
      <div className="text-center py-10 text-red-500">Error loading secret</div>
    );
  if (!secret) return <div className="text-center py-10">Secret not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <Link
          to={`/secrets/${id}/edit`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Secret Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6 space-y-6">
              {/* Secret Value Section */}
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-gray-400" /> Secret Value
                </h3>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-md p-4 border border-gray-200 dark:border-gray-700">
                  <code className="text-sm text-gray-800 dark:text-gray-200 break-all font-mono">
                    {isVisible
                      ? decryptedValue
                      : "••••••••••••••••••••••••••••"}
                  </code>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={toggleVisibility}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
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
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <dl className="divide-y divide-gray-200 dark:divide-gray-700">
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
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
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
