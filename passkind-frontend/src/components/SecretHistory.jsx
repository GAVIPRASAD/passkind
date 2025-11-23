import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, User } from "lucide-react";
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

  if (isLoading)
    return <div className="text-center py-4">Loading history...</div>;
  if (error)
    return (
      <div className="text-center py-4 text-red-500">
        Failed to load history
      </div>
    );
  if (!history || history.length === 0)
    return (
      <div className="text-center py-4 text-gray-500">No history available</div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 h-full overflow-y-auto">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2" />
        History
      </h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {history.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== history.length - 1 ? (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                    aria-hidden="true"
                  />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white dark:ring-gray-800">
                      <User className="h-5 w-5 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {event.modifiedBy}
                        </span>{" "}
                        {event.changeType.toLowerCase()}d this secret
                      </p>
                      {event.previousData &&
                        Object.keys(event.previousData).length > 0 && (
                          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-2 rounded">
                            <p className="font-semibold mb-1">
                              Previous Values:
                            </p>
                            <ul className="list-disc pl-4 space-y-1">
                              {Object.entries(event.previousData).map(
                                ([key, value]) =>
                                  value && (
                                    <li key={key}>
                                      <span className="font-medium">
                                        {key}:
                                      </span>{" "}
                                      {typeof value === "object"
                                        ? JSON.stringify(value)
                                        : String(value)}
                                    </li>
                                  )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                      <time dateTime={event.modifiedAt}>
                        {format(
                          new Date(event.modifiedAt),
                          "MMM d, yyyy HH:mm"
                        )}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SecretHistory;
