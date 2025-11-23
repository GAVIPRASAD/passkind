import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, User, Edit, Plus, AlertCircle } from "lucide-react";
import api from "../utils/api";
import { ENDPOINTS } from "../constants/api";
import { format } from "date-fns";

const SecretHistory = ({ secretId }) => {
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

  const getChangeIcon = (changeType) => {
    switch (changeType) {
      case "CREATE":
        return <Plus className="h-4 w-4" />;
      case "UPDATE":
        return <Edit className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getChangeBadgeColor = (changeType) => {
    switch (changeType) {
      case "CREATE":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "UPDATE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 h-full">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 h-full">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-500 dark:text-red-400">
            Failed to load history
          </p>
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 h-full">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Clock className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          History
        </h3>
        <div className="text-center py-8">
          <Clock className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400">
            No history available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden flex flex-col h-full max-h-[600px]">
      <div className="px-6 pt-6 pb-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Clock className="h-5 w-5 mr-2 text-indigo-600 dark:text-indigo-400" />
          Audit Trail
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {history.map((event, eventIdx) => (
          <div
            key={event.id}
            className="relative group hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-4 transition-colors duration-200"
          >
            {/* Timeline connector */}
            {eventIdx !== history.length - 1 && (
              <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-indigo-200 to-transparent dark:from-indigo-800"></div>
            )}

            <div className="flex gap-4">
              {/* Icon */}
              <div className="flex-shrink-0">
                <div
                  className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    event.changeType === "CREATE"
                      ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                      : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                  }`}
                >
                  {getChangeIcon(event.changeType)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getChangeBadgeColor(
                        event.changeType
                      )}`}
                    >
                      {event.changeType}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {event.modifiedBy}
                    </span>
                  </div>
                  <time className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {format(new Date(event.modifiedAt), "MMM d, HH:mm")}
                  </time>
                </div>

                {/* Previous Data */}
                {event.previousData &&
                  Object.keys(event.previousData).length > 0 && (
                    <div className="mt-3 bg-gray-50 dark:bg-gray-900/50 rounded-md p-3 border border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <Edit className="h-3 w-3 mr-1" />
                        Previous Values
                      </p>
                      <dl className="space-y-2">
                        {Object.entries(event.previousData).map(
                          ([key, value]) =>
                            value ? (
                              <div key={key} className="text-xs">
                                <dt className="font-medium text-gray-600 dark:text-gray-400 mb-1">
                                  {key}:
                                </dt>
                                <dd className="text-gray-900 dark:text-gray-200 ml-2">
                                  {/* Tags: Display inline in code blocks */}
                                  {key === "tags" && Array.isArray(value) ? (
                                    <div className="flex flex-wrap gap-1">
                                      {value.map((tag, idx) => (
                                        <code
                                          key={idx}
                                          className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs"
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
                                      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
                                        <thead className="bg-gray-100 dark:bg-gray-800">
                                          <tr>
                                            <th className="px-2 py-1 text-left font-medium text-gray-600 dark:text-gray-400">
                                              Key
                                            </th>
                                            <th className="px-2 py-1 text-left font-medium text-gray-600 dark:text-gray-400">
                                              Value
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                          {Object.entries(value).map(
                                            ([k, v]) => (
                                              <tr key={k}>
                                                <td className="px-2 py-1 font-medium text-gray-700 dark:text-gray-300">
                                                  {k}
                                                </td>
                                                <td className="px-2 py-1 text-gray-900 dark:text-gray-200">
                                                  {String(v)}
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </tbody>
                                      </table>
                                    </div>
                                  ) : /* Other arrays: Display as inline code blocks */
                                  Array.isArray(value) ? (
                                    <div className="flex flex-wrap gap-1">
                                      {value.map((item, idx) => (
                                        <code
                                          key={idx}
                                          className="px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-xs"
                                        >
                                          {typeof item === "object"
                                            ? JSON.stringify(item)
                                            : String(item)}
                                        </code>
                                      ))}
                                    </div>
                                  ) : /* Other objects: Display as formatted JSON */
                                  typeof value === "object" ? (
                                    <pre className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 overflow-x-auto">
                                      <code className="text-xs">
                                        {JSON.stringify(value, null, 2)}
                                      </code>
                                    </pre>
                                  ) : (
                                    /* Simple values */
                                    <span className="break-all">
                                      {String(value)}
                                    </span>
                                  )}
                                </dd>
                              </div>
                            ) : null
                        )}
                      </dl>
                    </div>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SecretHistory;
