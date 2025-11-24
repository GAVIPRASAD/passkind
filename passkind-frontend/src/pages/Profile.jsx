import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Save,
  ArrowLeft,
  User,
  Mail,
  Phone,
  Edit,
  X,
  Check,
  Calendar,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import useAuthStore from "../store/authStore";

import { getFriendlyErrorMessage } from "../utils/errorUtils";

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

  const [error, setError] = useState(null);

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
      setError(null);
    },
    onError: (err) => {
      const message = getFriendlyErrorMessage(err);
      setError(message);
      // Auto dismiss only if it's not a critical/long error, or keep it longer
      setTimeout(() => setError(null), 6000);
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
    setError(null);
  };

  // Get initials for avatar
  const getInitials = () => {
    if (user?.fullName) {
      return user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.username?.slice(0, 2).toUpperCase() || "U";
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Error Overlay */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-red-500/90 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl border border-red-400/50 flex items-start gap-3">
              <div className="bg-white/20 p-1.5 rounded-full flex-shrink-0 mt-0.5">
                <X className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm mb-0.5">Update Failed</h4>
                <p className="text-sm text-white/90 leading-relaxed break-words">
                  {error}
                </p>
              </div>
              <button
                onClick={() => setError(null)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 -mr-1 -mt-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div className="flex items-center">
          <button
            onClick={() => navigate("/secrets")}
            className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            My Profile
          </h1>
        </div>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all"
          >
            <Edit className="mr-2 h-5 w-5" />
            Edit Profile
          </motion.button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="bg-gradient-to-br from-white to-cyan-50 dark:from-[#161B22] dark:to-cyan-900/20 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 p-8">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4"
              >
                {getInitials()}
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {user?.fullName || user?.username}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                @{user?.username}
              </p>

              {/* Verification Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                  user?.isEmailVerified
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800"
                    : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800"
                }`}
              >
                <Shield className="w-4 h-4 mr-1.5" />
                {user?.isEmailVerified ? "Verified Account" : "Unverified"}
              </motion.div>
            </div>

            {/* Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                <Calendar className="w-4 h-4 mr-2" />
                Member since{" "}
                {user?.createdDate &&
                  new Date(user.createdDate).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Information Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <div className="bg-gradient-to-br from-white to-cyan-50 dark:from-[#161B22] dark:to-cyan-900/20 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Personal Information
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Username */}
                <motion.div whileHover={{ scale: 1.01 }} className="group">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                    <User className="w-4 h-4 mr-2 text-cyan-600 dark:text-cyan-400" />
                    Username
                  </label>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.input
                        key="edit-username"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1F2833] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent p-3 transition-all"
                        required
                      />
                    ) : (
                      <motion.div
                        key="view-username"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#1F2833] dark:to-[#1a2332] rounded-xl border border-gray-200 dark:border-gray-700 group-hover:border-cyan-500 dark:group-hover:border-cyan-500 transition-all"
                      >
                        <span className="text-base font-medium text-gray-900 dark:text-white">
                          {user?.username}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Full Name */}
                <motion.div whileHover={{ scale: 1.01 }} className="group">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                    <User className="w-4 h-4 mr-2 text-cyan-600 dark:text-cyan-400" />
                    Full Name
                  </label>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.input
                        key="edit-fullname"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1F2833] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent p-3 transition-all"
                      />
                    ) : (
                      <motion.div
                        key="view-fullname"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#1F2833] dark:to-[#1a2332] rounded-xl border border-gray-200 dark:border-gray-700 group-hover:border-cyan-500 dark:group-hover:border-cyan-500 transition-all"
                      >
                        <span className="text-base font-medium text-gray-900 dark:text-white">
                          {user?.fullName || "Not set"}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Email */}
                <motion.div whileHover={{ scale: 1.01 }} className="group">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                    <Mail className="w-4 h-4 mr-2 text-cyan-600 dark:text-cyan-400" />
                    Email Address
                  </label>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.input
                        key="edit-email"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1F2833] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent p-3 transition-all"
                        required
                      />
                    ) : (
                      <motion.div
                        key="view-email"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#1F2833] dark:to-[#1a2332] rounded-xl border border-gray-200 dark:border-gray-700 group-hover:border-cyan-500 dark:group-hover:border-cyan-500 transition-all"
                      >
                        <span className="text-base font-medium text-gray-900 dark:text-white">
                          {user?.email}
                        </span>
                        {user?.isEmailVerified && (
                          <Check className="w-5 h-5 text-green-500" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Phone */}
                <motion.div whileHover={{ scale: 1.01 }} className="group">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-400 mb-2">
                    <Phone className="w-4 h-4 mr-2 text-cyan-600 dark:text-cyan-400" />
                    Phone Number
                  </label>
                  <AnimatePresence mode="wait">
                    {isEditing ? (
                      <motion.input
                        key="edit-phone"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phoneNumber: e.target.value,
                          })
                        }
                        className="block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1F2833] text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent p-3 transition-all"
                      />
                    ) : (
                      <motion.div
                        key="view-phone"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#1F2833] dark:to-[#1a2332] rounded-xl border border-gray-200 dark:border-gray-700 group-hover:border-cyan-500 dark:group-hover:border-cyan-500 transition-all"
                      >
                        <span className="text-base font-medium text-gray-900 dark:text-white">
                          {user?.phoneNumber || "Not set"}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Action Buttons */}
                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-800"
                    >
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleCancel}
                        className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-base font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all"
                      >
                        <X className="mr-2 h-5 w-5" />
                        Cancel
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        disabled={updateMutation.isPending}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-50 transition-all"
                      >
                        <Save className="mr-2 h-5 w-5" />
                        {updateMutation.isPending
                          ? "Saving..."
                          : "Save Changes"}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
