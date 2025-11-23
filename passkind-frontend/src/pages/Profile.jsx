import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, ArrowLeft, User, Mail, Phone, Edit, X } from "lucide-react";
import api from "../utils/api";
import useAuthStore from "../store/authStore";

const Profile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: authUser, login } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    fullName: "",
  });

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", authUser?.username],
    queryFn: async () => {
      const response = await api.get(`/users/me`);
      return response.data;
    },
  });

  // Populate form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        fullName: user.fullName || "",
      });
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put("/users/me", data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user"]);
      // Update auth store with new user data
      login(data, useAuthStore.getState().token);
      setIsEditing(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        fullName: user.fullName || "",
      });
    }
    setIsEditing(false);
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/secrets")}
            className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-ocean hover:bg-gradient-ocean-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <form
          onSubmit={handleSubmit}
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          <div className="px-4 py-5 sm:p-6 space-y-6">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Username
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-ocean-500 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  required
                />
              ) : (
                <p className="text-gray-900 dark:text-white">
                  {user?.username}
                </p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-ocean-500 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">
                  {user?.fullName || "Not set"}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-ocean-500 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  required
                />
              ) : (
                <p className="text-gray-900 dark:text-white">{user?.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-brand-500 focus:ring-ocean-500 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                />
              ) : (
                <p className="text-gray-900 dark:text-white">
                  {user?.phoneNumber || "Not set"}
                </p>
              )}
            </div>

            {/* Account Info */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Account Information
              </h3>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">
                    Email Verified
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {user?.isEmailVerified ? (
                      <span className="text-green-600 dark:text-green-400">
                        ✓ Verified
                      </span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">
                        ✗ Not Verified
                      </span>
                    )}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-500 dark:text-gray-400">
                    Account Created
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                    {user?.createdDate &&
                      new Date(user.createdDate).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {isEditing && (
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 sm:px-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-950 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-ocean hover:bg-gradient-ocean-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500 disabled:opacity-50"
              >
                <Save className="mr-2 h-4 w-4" />
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
