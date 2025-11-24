import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Clock,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

const VaultHealth = ({ secrets = [], variant = "full" }) => {
  const stats = useMemo(() => {
    if (!secrets.length)
      return { score: 0, weak: 0, reused: 0, old: 0, total: 0 };

    let weak = 0;
    let reused = 0;
    let old = 0;

    secrets.forEach((secret) => {
      // Simple weak check (length < 8) - in real app, use zxcvbn
      // Since we don't have the decrypted value here without individual fetch,
      // we'll rely on metadata if available or just count total for now.

      const daysOld =
        (new Date() - new Date(secret.updatedAt)) / (1000 * 60 * 60 * 24);
      if (daysOld > 90) old++;
    });

    const total = secrets.length;
    // Score calculation: Start at 100, deduct 5 for each old password
    const score = Math.max(0, 100 - old * 5);

    return { score, weak, reused, old, total };
  }, [secrets]);

  // Variant: "full" (Dashboard Hero)
  if (variant === "full") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-cyan-950 dark:to-blue-950 rounded-2xl md:rounded-3xl p-4 md:p-8 text-gray-900 dark:text-white shadow-xl dark:shadow-2xl mb-8 md:mb-12 relative overflow-hidden border border-gray-200 dark:border-cyan-500/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-20 dark:opacity-30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-tr from-purple-400 to-pink-500 opacity-20 dark:opacity-30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8 items-start md:items-center">
          {/* Score Circle */}
          <div className="flex flex-col items-center justify-center text-center w-full md:w-auto">
            <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx={
                    typeof window !== "undefined" && window.innerWidth < 768
                      ? "64"
                      : "80"
                  }
                  cy={
                    typeof window !== "undefined" && window.innerWidth < 768
                      ? "64"
                      : "80"
                  }
                  r={
                    typeof window !== "undefined" && window.innerWidth < 768
                      ? "56"
                      : "70"
                  }
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className="text-gray-200 dark:text-gray-700"
                />
                <motion.circle
                  initial={{ strokeDasharray: 440, strokeDashoffset: 440 }}
                  animate={{
                    strokeDashoffset: 440 - (440 * stats.score) / 100,
                  }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx={
                    typeof window !== "undefined" && window.innerWidth < 768
                      ? "64"
                      : "80"
                  }
                  cy={
                    typeof window !== "undefined" && window.innerWidth < 768
                      ? "64"
                      : "80"
                  }
                  r={
                    typeof window !== "undefined" && window.innerWidth < 768
                      ? "56"
                      : "70"
                  }
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="transparent"
                  className={`${
                    stats.score > 80
                      ? "text-emerald-500 dark:text-emerald-400"
                      : stats.score > 50
                      ? "text-amber-500 dark:text-amber-400"
                      : "text-red-500 dark:text-red-400"
                  }`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl md:text-4xl font-bold">
                  {stats.score}
                </div>
                <div className="text-xs md:text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  SCORE
                </div>
              </div>
            </div>
            <h3 className="text-lg md:text-xl font-bold mt-3 md:mt-4">
              Vault Health
            </h3>
          </div>

          {/* Stats Grid */}
          <div className="w-full md:col-span-2 grid grid-cols-2 gap-3 md:gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl p-4 border border-blue-200 dark:border-blue-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg text-white shadow-lg shadow-blue-500/30">
                  <Lock className="h-5 w-5" />
                </div>
                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Total Items
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {stats.total}
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-4 border border-amber-200 dark:border-amber-500/30 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg text-white shadow-lg shadow-amber-500/30">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Old Passwords
                </span>
              </div>
              <div className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                {stats.old}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {"> 90 days"}
              </div>
            </div>

            {/* Placeholder for future stats */}
            <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/40 dark:to-pink-900/40 rounded-2xl p-4 border border-red-200 dark:border-red-500/40 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg text-white shadow-lg shadow-red-500/20">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Weak
                </span>
              </div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                -
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Password strength
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-900/40 dark:to-yellow-900/40 rounded-2xl p-4 border border-orange-200 dark:border-orange-500/40 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg text-white shadow-lg shadow-orange-500/20">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                  Reused
                </span>
              </div>
              <div className="text-2xl font-bold">-</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Duplicate passwords
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Variant: "compact" (Secrets Page) - Slim horizontal bar
  return (
    <div className="bg-white dark:bg-gray-800/40 dark:backdrop-blur-xl rounded-xl p-4 border border-gray-200 dark:border-white/10 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Left: Title & Score */}
      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${
              stats.score > 80
                ? "bg-green-100 dark:bg-green-900/20 text-green-600"
                : stats.score > 50
                ? "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600"
                : "bg-red-100 dark:bg-red-900/20 text-red-600"
            }`}
          >
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Vault Health
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stats.score}/100 Score
            </p>
          </div>
        </div>

        {/* Score Circle Mini (Optional, or just the number) */}
        <div
          className={`text-2xl font-bold sm:hidden ${
            stats.score > 80
              ? "text-green-500"
              : stats.score > 50
              ? "text-yellow-500"
              : "text-red-500"
          }`}
        >
          {Math.round(stats.score)}
        </div>
      </div>

      {/* Right: Stats Row */}
      <div className="flex items-center gap-2 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-gray-100 dark:border-white/5 pt-3 sm:pt-0">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-blue-500" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Total
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {stats.total}
            </span>
          </div>
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-yellow-500" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Old
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {stats.old}
            </span>
          </div>
        </div>

        <div className="w-px h-8 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>

        <div className="flex items-center gap-2 opacity-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Weak
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              -
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultHealth;
