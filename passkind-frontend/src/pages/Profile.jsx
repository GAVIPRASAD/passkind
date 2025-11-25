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
  Download,
  LogOut,
  AlertTriangle,
  Lock,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import api from "../utils/api";
import useAuthStore from "../store/authStore";

import { getFriendlyErrorMessage } from "../utils/errorUtils";
import { ENDPOINTS } from "../constants/api";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const Profile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: authUser, login, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
    navigate("/");
  };

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNumber: "",
    fullName: "",
  });

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportPassword, setExportPassword] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", authUser?.username],
    queryFn: async () => {
      try {
        const response = await api.get(`/users/me`);
        return response.data;
      } catch (err) {
        if (err.response?.status === 404) {
          // User not found (likely stale token or DB reset)
          toast.error("Session expired or user not found. Please login again.");
          useAuthStore.getState().logout();
          navigate("/login");
        }
        throw err;
      }
    },
    retry: false, // Don't retry if 404
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

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState("");

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.put("/users/me", data);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["user"]);

      // If username changed, we get a new token. Update it.
      const newToken = data.accessToken || useAuthStore.getState().token;

      // Update auth store with new user data and token
      login(data, newToken);
      setIsEditing(false);
      setError(null);

      // Check if email verification is needed
      if (data.isEmailVerified === false) {
        setShowOtpModal(true);
        toast.success("Profile updated. Please verify your new email.");
      } else {
        toast.success("Profile updated successfully");
      }
    },
    onError: (err) => {
      const message = getFriendlyErrorMessage(err);
      setError(message);
      // Auto dismiss only if it's not a critical/long error, or keep it longer
      setTimeout(() => setError(null), 6000);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: async (otpCode) => {
      const response = await api.post(ENDPOINTS.VERIFY_OTP, {
        email: formData.email,
        otpCode,
      });
      return response.data;
    },
    onSuccess: async (data) => {
      setShowOtpModal(false);
      setOtp("");
      toast.success("Email verified successfully!");
      // Refresh user data to show verified status
      queryClient.invalidateQueries(["user"]);
      const userResponse = await api.get(`/users/me`);
      login(userResponse.data, useAuthStore.getState().token);
    },
    onError: (err) => {
      toast.error(getFriendlyErrorMessage(err));
    },
  });

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    verifyOtpMutation.mutate(otp);
  };

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

  if (isLoading) return <Loader />;

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
        <div className="flex items-center space-x-3">
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLogoutDialog(true)}
            className="inline-flex items-center px-4 py-3 border border-transparent shadow-sm text-base font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </motion.button>
        </div>
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

              <button
                onClick={async () => {
                  try {
                    // Use bulk export endpoint that returns all secrets with decrypted values
                    const response = await api.get(
                      `${ENDPOINTS.SECRETS}/export`
                    );
                    const secretsWithValues = response.data;

                    const dataStr = JSON.stringify(secretsWithValues, null, 2);
                    const blob = new Blob([dataStr], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = `passkind-vault-${
                      new Date().toISOString().split("T")[0]
                    }.json`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  } catch (err) {
                    console.error("Export failed", err);
                    toast.error(
                      "Failed to export vault data. Please try again."
                    );
                  }
                }}
                className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Vault Data (JSON)
              </button>

              <button
                onClick={() => setIsExportModalOpen(true)}
                className="w-full mt-2 flex items-center justify-center px-4 py-2 border border-green-300 dark:border-green-600 rounded-xl text-sm font-medium text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Vault Data (Excel)
              </button>
            </div>
          </div>
        </motion.div>

        {/* Password Modal for Excel Export */}
        <AnimatePresence>
          {isExportModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#161b22] rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Enter Password to Export
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                  To protect your Excel file, we use your login password as the
                  encryption key. Please enter it below to confirm and download.
                </p>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsExporting(true);
                    try {
                      const response = await api.post(
                        `${ENDPOINTS.SECRETS}/export/excel`,
                        { password: exportPassword },
                        { responseType: "blob" }
                      );

                      const blob = new Blob([response.data], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                      });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.href = url;
                      link.download = `passkind-vault-${
                        new Date().toISOString().split("T")[0]
                      }.xlsx`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);

                      setIsExportModalOpen(false);
                      setExportPassword("");
                      toast.success("Vault exported successfully!");
                    } catch (err) {
                      console.error("Excel export failed", err);
                      if (
                        err.response?.status === 400 ||
                        err.response?.status === 401
                      ) {
                        toast.error("Invalid password. Please try again.");
                      } else {
                        toast.error(
                          "Failed to export vault. Please try again."
                        );
                      }
                    } finally {
                      setIsExporting(false);
                    }
                  }}
                >
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      value={exportPassword}
                      onChange={(e) => setExportPassword(e.target.value)}
                      className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      placeholder="Enter your login password"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setIsExportModalOpen(false);
                        setExportPassword("");
                      }}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isExporting}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 transition-all flex items-center"
                    >
                      {isExporting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* OTP Verification Modal */}
        <AnimatePresence>
          {showOtpModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#161b22] rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="text-center mb-6">
                  <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Verify New Email
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    We sent a verification code to <br />
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formData.email}
                    </span>
                  </p>
                </div>

                <form onSubmit={handleVerifyOtp}>
                  <div className="mb-6">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="000000"
                      maxLength={6}
                      className="w-full text-center text-3xl tracking-[0.5em] font-mono py-3 bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      autoFocus
                    />
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowOtpModal(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={verifyOtpMutation.isPending || otp.length !== 6}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 disabled:opacity-50 transition-all flex items-center"
                    >
                      {verifyOtpMutation.isPending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                          Verifying...
                        </>
                      ) : (
                        "Verify Email"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

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

        {/* Security Settings Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <div className="bg-gradient-to-br from-white to-cyan-50 dark:from-[#161B22] dark:to-cyan-900/20 shadow-xl rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
            <div className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-cyan-600" />
                Security Settings
              </h3>

              <SecuritySettings />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Logout Confirmation Dialog */}
      <AnimatePresence>
        {showLogoutDialog && (
          <div
            className="fixed inset-0 z-[60] overflow-y-auto"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-50"
                onClick={() => setShowLogoutDialog(false)}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.3 }}
                className="relative z-50 inline-block align-bottom bg-gradient-to-br from-white to-gray-50 dark:from-[#161B22] dark:to-[#0d1117] rounded-2xl text-left overflow-hidden shadow-2xl transform sm:my-8 sm:align-middle sm:max-w-md sm:w-full border border-gray-200 dark:border-gray-700/50"
              >
                {/* Header with gradient */}
                <div className="relative px-6 pt-6 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 shadow-lg shadow-red-500/30">
                      <LogOut className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        Sign Out
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Are you sure you want to sign out of your account?
                      </p>
                    </div>
                  </div>
                </div>

                {/* Info card */}
                <div className="px-6 pb-6">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        You'll need to sign in again to access your vault.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="bg-gray-50 dark:bg-[#0d1117]/50 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setShowLogoutDialog(false)}
                    className="flex-1 inline-flex justify-center items-center rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-2.5 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex-1 inline-flex justify-center items-center rounded-xl border border-transparent px-4 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-sm font-medium text-white hover:from-red-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-lg shadow-red-500/30 transition-all"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Separate component for Security Settings to use hooks properly
const SecuritySettings = () => {
  const { isAutoLockEnabled, autoLockDuration, updateAutoLockSettings } =
    useAuthStore();

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Auto-Lock Toggle */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#1F2833] dark:to-[#1a2332] rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex-1">
          <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">
            Auto-Lock Timer
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Automatically lock your vault after a period of inactivity
          </p>
        </div>
        <button
          onClick={() => {
            updateAutoLockSettings(!isAutoLockEnabled, autoLockDuration);
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            isAutoLockEnabled ? "bg-ocean-600" : "bg-gray-300 dark:bg-gray-600"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              isAutoLockEnabled ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      {/* Duration Selector */}
      <AnimatePresence>
        {isAutoLockEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#1F2833] dark:to-[#1a2332] rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Lock after inactivity
            </label>
            <select
              value={autoLockDuration}
              onChange={(e) => {
                updateAutoLockSettings(true, parseInt(e.target.value));
              }}
              className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0d1117] text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
            >
              <option value={1}>1 minute</option>
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
            </select>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Change Password Button */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-[#1F2833] dark:to-[#1a2332] rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="flex-1">
          <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">
            Password
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Change your password to keep your account secure
          </p>
        </div>
        <button
          onClick={() => setIsChangePasswordOpen(true)}
          className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
        >
          <Lock className="w-4 h-4 mr-2" />
          Change Password
        </button>
      </div>

      <AnimatePresence>
        {isChangePasswordOpen && (
          <ChangePasswordModal onClose={() => setIsChangePasswordOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
};

const ChangePasswordModal = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await api.post(ENDPOINTS.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
        confirmNewPassword,
      });
      toast.success("Password changed successfully");
      onClose();
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-[#161b22] rounded-2xl shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
      >
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-ocean-100 dark:bg-ocean-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-ocean-600 dark:text-ocean-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Change Password
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Enter your current password and a new password to update your
            credentials.
          </p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
              required
              minLength={6}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gradient-ocean text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Update Password
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Profile;
