import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, ArrowLeft, Plus, Trash } from "lucide-react";
import api from "../utils/api";
import { ENDPOINTS } from "../constants/api";

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
        metadata: secret.metadata || {},
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

  if (isEditMode && isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
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

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Secret Value
          </label>
          <textarea
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
            value={formData.value}
            onChange={(e) =>
              setFormData({ ...formData, value: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email (Optional)
            </label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Username (Optional)
            </label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tags
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag"
            />
            <button
              type="button"
              onClick={addTag}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Metadata
          </label>
          <div className="mt-1 flex space-x-2">
            <input
              type="text"
              className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={metaKey}
              onChange={(e) => setMetaKey(e.target.value)}
              placeholder="Key"
            />
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              value={metaValue}
              onChange={(e) => setMetaValue(e.target.value)}
              placeholder="Value"
            />
            <button
              type="button"
              onClick={addMetadata}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {Object.entries(formData.metadata).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded"
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">{key}:</span> {value}
                </span>
                <button
                  type="button"
                  onClick={() => removeMetadata(key)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200"
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            {mutation.isPending ? "Saving..." : "Save Secret"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SecretForm;
