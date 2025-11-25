import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Shield, ArrowRight, Loader2, LogOut, Mail } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import api from "../utils/api";
import { ENDPOINTS } from "../constants/api";
import useAuthStore from "../store/authStore";
import { getFriendlyErrorMessage } from "../utils/errorUtils";
import { useTheme } from "../context/ThemeContext";

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { user, login, logout } = useAuthStore();
  const { theme } = useTheme();
  const [otp, setOtp] = useState("");
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const resendOtpMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post(ENDPOINTS.RESEND_OTP, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Verification code sent!");
      setCanResend(false);
      setCountdown(30);
    },
    onError: (err) => {
      // Ignore "already verified" error if it happens during auto-send
      if (!err.response?.data?.message?.includes("already verified")) {
        toast.error(getFriendlyErrorMessage(err));
      }
    },
  });

  // Auto-send OTP on mount REMOVED to prevent double emails
  // React.useEffect(() => {
  //   if (user?.email) {
  //     resendOtpMutation.mutate({ email: user.email });
  //   }
  // }, []);

  // Countdown timer
  React.useEffect(() => {
    let timer;
    if (countdown > 0 && !canResend) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [countdown, canResend]);

  const handleResendOtp = () => {
    if (!user?.email) return;
    resendOtpMutation.mutate({ email: user.email });
  };

  const verifyOtpMutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post(ENDPOINTS.VERIFY_OTP, data);
      return response.data;
    },
    onSuccess: async (data) => {
      toast.success("Email verified successfully!");
      // Refresh user data to show verified status
      try {
        const userResponse = await api.get(`${ENDPOINTS.USERS}/me`);
        login(userResponse.data, useAuthStore.getState().token);
        navigate("/dashboard");
      } catch (err) {
        console.error("Failed to fetch user details", err);
        toast.error("Verification successful but failed to load profile");
      }
    },
    onError: (err) => {
      toast.error(getFriendlyErrorMessage(err));
    },
  });

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (!user?.email) {
      toast.error("User email not found. Please login again.");
      return;
    }
    verifyOtpMutation.mutate({ email: user.email, otpCode: otp });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-400 dark:bg-cyan-900 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-400 dark:bg-emerald-900 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden p-8 relative z-10"
      >
        {/* Logo at top left */}
        <div className="absolute top-6 left-6 flex items-center">
          <Shield className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
          <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
            PassKind
          </span>
        </div>

        <div className="mt-12 mb-8 text-center">
          <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Verify Your Email
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            We sent a verification code to <br />
            <span className="font-medium text-gray-900 dark:text-white">
              {user?.email}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="000000"
              maxLength={6}
              className="w-full text-center text-3xl tracking-[0.5em] font-mono py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 transition-all"
              autoFocus
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">Enter the 6-digit code</p>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={!canResend || resendOtpMutation.isPending}
                className="text-xs font-medium text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendOtpMutation.isPending
                  ? "Sending..."
                  : canResend
                  ? "Resend Code"
                  : `Resend in ${countdown}s`}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={verifyOtpMutation.isPending || otp.length !== 6}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg shadow-gray-900/10 dark:shadow-none flex justify-center items-center"
          >
            {verifyOtpMutation.isPending ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              <>
                Verify Email <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
          <button
            onClick={handleLogout}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmailPage;
