import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Key,
  Star,
  Settings,
  LayoutGrid,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
} from "lucide-react";
import api from "../utils/api";
import { ENDPOINTS } from "../constants/api";
import useAuthStore from "../store/authStore";
import VaultHealth from "../components/VaultHealth";
import Loader from "../components/Loader";

const Dashboard = () => {
  const { user } = useAuthStore();
  const isAutoLockEnabled = useAuthStore((state) => state.isAutoLockEnabled);

  // Fetch secrets for analytics
  const { data: secrets = [], isLoading } = useQuery({
    queryKey: ["secrets"],
    queryFn: async () => {
      const response = await api.get(ENDPOINTS.SECRETS);
      return response.data;
    },
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.fullName || user?.username}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Here's what's happening in your vault today.
          </p>
        </div>
        <Link
          to="/secrets"
          className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
        >
          Go to My Vault
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </motion.div>

      {/* ANALYTICS HERO */}
      <VaultHealth secrets={secrets} variant="full" />

      {/* SERVICE CARDS */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <LayoutGrid className="h-5 w-5 text-cyan-500" />
        Quick Access
      </h2>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {[
          {
            title: "My Vault",
            desc: "Access all your secrets",
            icon: Lock,
            color: "cyan",
            link: "/secrets",
            bg: "bg-cyan-500/10",
            text: "text-cyan-600 dark:text-cyan-400",
          },
          {
            title: "Add New",
            desc: "Securely store a new item",
            icon: Plus,
            color: "green",
            link: "/secrets/new",
            bg: "bg-green-500/10",
            text: "text-green-600 dark:text-green-400",
          },
          {
            title: "Favorites",
            desc: "Your most used items",
            icon: Star,
            color: "yellow",
            link: "/favorites",
            bg: "bg-yellow-500/10",
            text: "text-yellow-600 dark:text-yellow-400",
          },
          {
            title: "Settings",
            desc: "Manage your profile",
            icon: Settings,
            color: "purple",
            link: "/profile",
            bg: "bg-purple-500/10",
            text: "text-purple-600 dark:text-purple-400",
          },
        ].map((card, index) => (
          <motion.div key={index} variants={item}>
            <Link to={card.link} className="block group h-full">
              <div className="h-full bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
                <div
                  className={`h-12 w-12 rounded-xl ${card.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <card.icon className={`h-6 w-6 ${card.text}`} />
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-cyan-500 transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {card.desc}
                </p>

                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="h-5 w-5 text-cyan-500" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Clock className="h-5 w-5 text-cyan-500" />
            Recent Activity
          </h2>
          <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden">
            {secrets.slice(0, 5).map((secret, i) => (
              <Link
                key={secret.id}
                to={`/secrets/${secret.id}`}
                className="flex items-center p-4 border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-4">
                  <Lock className="h-5 w-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {secret.name}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {secret.username || secret.email || "No username"}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  {new Date(secret.updatedAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
            {secrets.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No activity yet.
              </div>
            )}
          </div>
        </div>

        {/* Quick Tips / Promo */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Security Tips
          </h2>

          {!isAutoLockEnabled ? (
            // Show Auto-Lock tip if not enabled
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6">
              <h3 className="font-bold text-cyan-700 dark:text-cyan-400 mb-2">
                Enable Auto-Lock
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Protect your vault when you step away. Set up an auto-lock timer
                in your settings.
              </p>
              <Link
                to="/profile"
                className="text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                Go to Settings &rarr;
              </Link>
            </div>
          ) : (
            // Show alternative tips when auto-lock is enabled
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl p-6">
                <h3 className="font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                  Use Strong Passwords
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Create unique, complex passwords for each account. Avoid
                  reusing passwords across different services.
                </p>
                <Link
                  to="/secrets/new"
                  className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Add New Secret &rarr;
                </Link>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6">
                <h3 className="font-bold text-purple-700 dark:text-purple-400 mb-2">
                  Regular Backups
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Export your vault regularly to keep a secure backup of your
                  passwords.
                </p>
                <Link
                  to="/profile"
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                >
                  Export Vault &rarr;
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
