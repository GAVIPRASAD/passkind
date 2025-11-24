import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  User,
  Edit,
  Plus,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import { ENDPOINTS } from "../constants/api";
import { format, formatDistanceToNow } from "date-fns";

const SecretHistory = ({ secretId }) => {
  const [expandedEvents, setExpandedEvents] = useState(new Set());

  const {
    data: history,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["secretHistory", secretId],
    queryFn: async () => {
      const response = await api.get(
        `${ENDPOINTS.SECRETS}/${secretId}/history`
      );
      return response.data;
    },
  });

  const toggleEventExpansion = (eventId) => {
    setExpandedEvents((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case "CREATE":
        return <Sparkles className="h-4 w-4" />;
      case "UPDATE":
        return <Edit className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getChangeBadgeColor = (changeType) => {
    switch (changeType) {
      case "CREATE":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30";
      case "UPDATE":
        return "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-lg shadow-gray-500/30";
    }
  };

  const getIconBgColor = (changeType) => {
    switch (changeType) {
      case "CREATE":
        return "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/40";
      case "UPDATE":
        return "bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/40";
      default:
        return "bg-gradient-to-br from-gray-400 to-gray-500 shadow-lg shadow-gray-500/40";
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 dark:from-[#161B22] dark:via-cyan-900/10 dark:to-blue-900/10 rounded-2xl p-6 h-full shadow-xl border border-gray-200 dark:border-white/10"
      >
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-3/4"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-1/2"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3"></div>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-white to-red-50 dark:from-[#161B22] dark:to-red-900/20 rounded-2xl p-6 h-full shadow-xl border border-red-200 dark:border-red-900/30"
      >
        <div className="text-center py-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          </motion.div>
          <p className="text-red-600 dark:text-red-400 font-semibold text-lg">
            Failed to load history
          </p>
          <p className="text-red-500/70 dark:text-red-400/70 text-sm mt-1">
            Please try again later
          </p>
        </div>
      </motion.div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 dark:from-[#161B22] dark:via-cyan-900/10 dark:to-blue-900/10 rounded-2xl p-6 h-full shadow-xl border border-gray-200 dark:border-white/10"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl mr-3 shadow-lg shadow-cyan-500/30">
            <Clock className="h-5 w-5 text-white" />
          </div>
          Audit Trail
        </h3>
        <div className="text-center py-12">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8 }}
          >
            <Clock className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No history available yet
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Changes will appear here
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/30 dark:from-[#161B22] dark:via-cyan-900/10 dark:to-blue-900/10 rounded-2xl overflow-hidden flex flex-col h-full max-h-[700px] shadow-xl border border-gray-200 dark:border-white/10"
    >
      {/* Header */}
      <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-white/10 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl mr-3 shadow-lg shadow-cyan-500/30">
            <Clock className="h-5 w-5 text-white" />
          </div>
          Audit Trail
          <span className="ml-3 px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-semibold">
            {history.length} {history.length === 1 ? "event" : "events"}
          </span>
        </h3>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        <AnimatePresence>
          {history.map((event, eventIdx) => {
            const isExpanded = expandedEvents.has(event.id);
            const hasPreviousData =
              event.previousData && Object.keys(event.previousData).length > 0;

            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: eventIdx * 0.05 }}
                className="relative"
              >
                {/* Timeline connector */}
                {eventIdx !== history.length - 1 && (
                  <div className="absolute left-[26px] top-14 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-blue-400 to-transparent dark:from-cyan-600 dark:via-blue-600"></div>
                )}

                <div className="relative bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50 dark:border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="flex gap-4">
                    {/* Icon with pulse animation */}
                    <div className="flex-shrink-0 relative">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className={`h-11 w-11 rounded-xl flex items-center justify-center text-white ${getIconBgColor(
                          event.changeType
                        )}`}
                      >
                        {getChangeIcon(event.changeType)}
                      </motion.div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold ${getChangeBadgeColor(
                              event.changeType
                            )}`}
                          >
                            {event.changeType}
                          </span>
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-800/50 rounded-lg">
                            <User className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                              {event.modifiedBy}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <time className="text-xs font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
                            {new Date(event.modifiedAt).toLocaleDateString(
                              "en-IN",
                              {
                                timeZone: "Asia/Kolkata",
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </time>
                          <time className="text-xs font-medium text-gray-500 dark:text-gray-500 whitespace-nowrap">
                            {new Date(event.modifiedAt)
                              .toLocaleTimeString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                              .toLowerCase()}{" "}
                            IST
                          </time>
                          <span className="text-xs text-gray-500 dark:text-gray-500">
                            {formatDistanceToNow(new Date(event.modifiedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>

                      {/* Previous Data - Expandable */}
                      {hasPreviousData && (
                        <div className="mt-3">
                          <button
                            onClick={() => toggleEventExpansion(event.id)}
                            className="w-full flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl border border-gray-200 dark:border-white/10 hover:border-cyan-300 dark:hover:border-cyan-700 transition-all duration-200 group/expand"
                          >
                            <div className="flex items-center gap-2">
                              <Edit className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                Previous Values
                              </span>
                              <span className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded-full text-xs font-semibold">
                                {Object.keys(event.previousData).length}
                              </span>
                            </div>
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronDown className="h-4 w-4 text-gray-500 group-hover/expand:text-cyan-600 dark:group-hover/expand:text-cyan-400 transition-colors" />
                            </motion.div>
                          </button>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-2 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black/20 dark:to-black/30 rounded-xl border border-gray-200 dark:border-white/5">
                                  <dl className="space-y-3">
                                    {Object.entries(event.previousData)
                                      .sort(([keyA], [keyB]) => {
                                        // Sort to show metadata and tags at the end
                                        const order = { metadata: 2, tags: 1 };
                                        const orderA = order[keyA] || 0;
                                        const orderB = order[keyB] || 0;
                                        return orderA - orderB;
                                      })
                                      .map(([key, value]) =>
                                        value ? (
                                          <motion.div
                                            key={key}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white dark:bg-gray-900/50 p-3 rounded-lg border border-gray-200 dark:border-white/5"
                                          >
                                            <dt className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider flex items-center gap-2">
                                              <div className="h-1.5 w-1.5 rounded-full bg-cyan-500"></div>
                                              {key}
                                            </dt>
                                            <dd className="text-sm text-gray-900 dark:text-gray-200 ml-3.5">
                                              {/* Secret Value: Display the decrypted password */}
                                              {key === "secretValue" ? (
                                                <code className="block px-3 py-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300 rounded-lg text-xs font-mono border border-cyan-200 dark:border-cyan-800 overflow-x-auto whitespace-pre-wrap break-all">
                                                  {String(value)}
                                                </code>
                                              ) : /* Tags: Display inline in code blocks */
                                              key === "tags" &&
                                                Array.isArray(value) ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                  {value.map((tag, idx) => (
                                                    <code
                                                      key={idx}
                                                      className="px-2.5 py-1 bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 text-cyan-700 dark:text-cyan-300 rounded-lg text-xs font-semibold shadow-sm"
                                                    >
                                                      {tag}
                                                    </code>
                                                  ))}
                                                </div>
                                              ) : /* Metadata: Display as table */
                                              key === "metadata" &&
                                                typeof value === "object" &&
                                                !Array.isArray(value) ? (
                                                <div className="overflow-x-auto">
                                                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                    <thead className="bg-gray-100 dark:bg-gray-800">
                                                      <tr>
                                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                          Key
                                                        </th>
                                                        <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                                                          Value
                                                        </th>
                                                      </tr>
                                                    </thead>
                                                    <tbody className="bg-white dark:bg-gray-900/50 divide-y divide-gray-200 dark:divide-gray-700">
                                                      {Object.entries(
                                                        value
                                                      ).map(([k, v]) => (
                                                        <tr key={k}>
                                                          <td className="px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                                            {k}
                                                          </td>
                                                          <td className="px-3 py-2 text-xs text-gray-900 dark:text-gray-200 font-mono">
                                                            {String(v)}
                                                          </td>
                                                        </tr>
                                                      ))}
                                                    </tbody>
                                                  </table>
                                                </div>
                                              ) : /* Other arrays */
                                              Array.isArray(value) ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                  {value.map((item, idx) => (
                                                    <code
                                                      key={idx}
                                                      className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs font-mono"
                                                    >
                                                      {typeof item === "object"
                                                        ? JSON.stringify(item)
                                                        : String(item)}
                                                    </code>
                                                  ))}
                                                </div>
                                              ) : /* Other objects */
                                              typeof value === "object" ? (
                                                <pre className="bg-gray-900 dark:bg-black p-3 rounded-lg border border-gray-700 overflow-x-auto">
                                                  <code className="text-xs text-cyan-400 font-mono">
                                                    {JSON.stringify(
                                                      value,
                                                      null,
                                                      2
                                                    )}
                                                  </code>
                                                </pre>
                                              ) : (
                                                /* Simple values */
                                                <span className="break-all font-medium">
                                                  {String(value)}
                                                </span>
                                              )}
                                            </dd>
                                          </motion.div>
                                        ) : null
                                      )}
                                  </dl>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default SecretHistory;
