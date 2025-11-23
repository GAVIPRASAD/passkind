import React, { useState } from "react";
import { X, RefreshCw, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { API_ENDPOINTS } from "../utils/constants";

const SecretModal = ({ onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      value: "",
      tags: [],
      metadata: {},
    }
  );
  const [tagInput, setTagInput] = useState("");
  const [showGenerator, setShowGenerator] = useState(false);

  // Generator State
  const [genLength, setGenLength] = useState(16);
  const [genOptions, setGenOptions] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
  });

  const generatePassword = () => {
    const chars = {
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lower: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };
    let charset = "";
    if (genOptions.upper) charset += chars.upper;
    if (genOptions.lower) charset += chars.lower;
    if (genOptions.numbers) charset += chars.numbers;
    if (genOptions.symbols) charset += chars.symbols;

    if (!charset) return;

    let password = "";
    for (let i = 0; i < genLength; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, value: password });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        // Update logic
      } else {
        await api.post(API_ENDPOINTS.SECRETS, formData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900/80 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold">
            {initialData ? "Edit Secret" : "New Secret"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-3 focus:border-ocean-500 dark:focus:border-ocean-400 outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Value
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.value}
                onChange={(e) =>
                  setFormData({ ...formData, value: e.target.value })
                }
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-3 pr-24 focus:border-ocean-500 dark:focus:border-ocean-400 outline-none transition-colors font-mono"
              />
              <button
                type="button"
                onClick={() => setShowGenerator(!showGenerator)}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-800 rounded-lg text-xs font-bold hover:bg-gray-700"
              >
                GENERATE
              </button>
            </div>

            {showGenerator && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                className="mt-4 bg-gray-800/50 rounded-xl p-4 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Length: {genLength}
                  </span>
                  <input
                    type="range"
                    min="8"
                    max="64"
                    value={genLength}
                    onChange={(e) => setGenLength(parseInt(e.target.value))}
                    className="w-32"
                  />
                </div>
                <div className="flex gap-4 flex-wrap">
                  {Object.keys(genOptions).map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-2 text-sm capitalize cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={genOptions[opt]}
                        onChange={() =>
                          setGenOptions({
                            ...genOptions,
                            [opt]: !genOptions[opt],
                          })
                        }
                        className="rounded bg-gray-900 border-gray-600"
                      />
                      {opt}
                    </label>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="w-full bg-white text-black py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-200"
                >
                  <RefreshCw size={16} /> Generate New
                </button>
              </motion.div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Tags (Press Enter)
            </label>
            <div className="flex flex-wrap gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-2 min-h-[50px]">
              {formData.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-800 px-2 py-1 rounded-lg text-sm flex items-center gap-1"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        tags: formData.tags.filter((t) => t !== tag),
                      })
                    }
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                className="bg-transparent outline-none flex-1 min-w-[100px]"
                placeholder="Add tag..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl hover:bg-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-white text-black rounded-xl font-bold hover:bg-gray-200"
            >
              Save Secret
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SecretModal;
