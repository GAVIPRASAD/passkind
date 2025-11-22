import React, { useState } from "react";
import Layout from "../components/Layout";
import SecretModal from "../components/SecretModal";
import api from "../utils/api";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Copy, Eye, EyeOff, Share2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { API_ENDPOINTS } from "../utils/constants";

const Dashboard = () => {
  const [search, setSearch] = useState("");
  const [revealed, setRevealed] = useState({});

  const [showModal, setShowModal] = useState(false);

  const {
    data: secrets = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["secrets"],
    queryFn: async () => {
      const res = await api.get(API_ENDPOINTS.SECRETS);
      return res.data;
    },
  });

  const toggleReveal = async (id) => {
    if (revealed[id]) {
      setRevealed((prev) => ({ ...prev, [id]: null }));
    } else {
      try {
        const res = await api.get(`${API_ENDPOINTS.SECRETS}/${id}/value`);
        setRevealed((prev) => ({ ...prev, [id]: res.data }));
      } catch (err) {
        console.error("Failed to decrypt", err);
      }
    }
  };

  const filteredSecrets = secrets.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Secrets</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-black px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <Plus size={20} /> New Secret
        </button>
      </div>

      <div className="relative mb-8">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search secrets..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900/50 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-white transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredSecrets.map((secret) => (
            <motion.div
              key={secret.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-colors group"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{secret.title}</h3>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-gray-800 rounded-lg">
                    <Share2 size={16} />
                  </button>
                  <button className="p-2 hover:bg-red-900/30 text-red-500 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-black/50 rounded-lg p-3 flex items-center justify-between mb-4 font-mono text-sm">
                <span className="truncate mr-2">
                  {revealed[secret.id] || "••••••••••••"}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleReveal(secret.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    {revealed[secret.id] ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(revealed[secret.id] || "")
                    }
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {secret.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-800 px-2 py-1 rounded-full text-gray-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {showModal && (
        <SecretModal onClose={() => setShowModal(false)} onSave={refetch} />
      )}
    </Layout>
  );
};

export default Dashboard;
