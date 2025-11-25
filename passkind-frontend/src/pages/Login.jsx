import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../utils/api";
import { ENDPOINTS } from "../constants/api";
import { motion } from "framer-motion";
import {
  Loader2,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { AnimatePresence } from "framer-motion";

import { getFriendlyErrorMessage } from "../utils/errorUtils";

const Login = () => {
  const { theme, toggleTheme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const updateUser = useAuthStore((state) => state.updateUser);

  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [fpStep, setFpStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState("");
  const [fpNewPassword, setFpNewPassword] = useState("");
  const [fpConfirmPassword, setFpConfirmPassword] = useState("");
  const [fpLoading, setFpLoading] = useState(false);

  const handleInitiateForgotPassword = async (e) => {
    e.preventDefault();
    setFpLoading(true);
    try {
      await api.post(ENDPOINTS.FORGOT_PASSWORD, { email: fpEmail });
      toast.success("OTP sent to your email");
      setFpStep(2);
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err));
    } finally {
      setFpLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (fpNewPassword !== fpConfirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setFpLoading(true);
    try {
      await api.post(ENDPOINTS.RESET_PASSWORD, {
        email: fpEmail,
        otp: fpOtp,
        newPassword: fpNewPassword,
      });
      toast.success("Password reset successfully. Please login.");
      setShowForgotPassword(false);
      setFpStep(1);
      setFpEmail("");
      setFpOtp("");
      setFpNewPassword("");
      setFpConfirmPassword("");
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err));
    } finally {
      setFpLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post(ENDPOINTS.LOGIN, {
        username,
        password,
      });

      const token = response.data.accessToken;
      login(null, token);

      const userResponse = await api.get(`${ENDPOINTS.USERS}/me`);
      updateUser(userResponse.data);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      const message = getFriendlyErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 dark:bg-blue-600/40 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-400 dark:bg-cyan-600/40 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-emerald-400 dark:bg-emerald-600/40 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden p-8 relative z-10"
      >
        {/* Logo at top left */}
        {/* Logo at top left */}
        <div className="absolute top-6 left-6 flex items-center">
          <Shield className="h-6 w-6 text-ocean-600 dark:text-ocean-400" />
          <span className="ml-2 text-lg font-bold text-gray-900 dark:text-white">
            PassKind
          </span>
        </div>

        {/* Theme Toggle at top right */}
        <button
          onClick={toggleTheme}
          className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-ocean-500"
          title={
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
          }
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        <div className="mt-12 mb-8 text-center">
          <div className="mx-auto w-16 h-16 bg-ocean-50 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <User className="h-8 w-8 text-ocean-600 dark:text-ocean-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            Enter your credentials to access your secure vault
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl mb-6 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username or Email"
              required
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-500 transition-all"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full pl-11 pr-12 py-3.5 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm font-medium text-ocean-600 hover:text-ocean-700 dark:text-ocean-400 dark:hover:text-ocean-300"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3.5 rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors shadow-lg shadow-gray-900/10 dark:shadow-none flex justify-center items-center"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-ocean-600 hover:text-ocean-700 dark:text-ocean-400 dark:hover:text-ocean-300"
            >
              Get Started
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <AnimatePresence>
        {showForgotPassword && (
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
                  Reset Password
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {fpStep === 1
                    ? "Enter your email to receive a verification code"
                    : fpStep === 2
                    ? "Enter the code sent to your email"
                    : "Create a new password"}
                </p>
              </div>

              {fpStep === 1 && (
                <form onSubmit={handleInitiateForgotPassword}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={fpEmail}
                      onChange={(e) => setFpEmail(e.target.value)}
                      className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      placeholder="name@example.com"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={fpLoading}
                      className="px-4 py-2 bg-gradient-ocean text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center"
                    >
                      {fpLoading ? (
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      ) : null}
                      Send OTP
                    </button>
                  </div>
                </form>
              )}

              {fpStep === 2 && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFpStep(3);
                  }}
                >
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={fpOtp}
                      onChange={(e) => setFpOtp(e.target.value)}
                      className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white p-3 text-center tracking-widest text-2xl focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      placeholder="000000"
                      maxLength={6}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setFpStep(1)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-ocean text-white rounded-xl hover:opacity-90 transition-all"
                    >
                      Verify
                    </button>
                  </div>
                </form>
              )}

              {fpStep === 3 && (
                <form onSubmit={handleResetPassword}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={fpNewPassword}
                      onChange={(e) => setFpNewPassword(e.target.value)}
                      className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      placeholder="New password"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={fpConfirmPassword}
                      onChange={(e) => setFpConfirmPassword(e.target.value)}
                      className="block w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#0d1117] text-gray-900 dark:text-white p-3 focus:ring-2 focus:ring-ocean-500 focus:border-transparent"
                      placeholder="Confirm password"
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setFpStep(2)}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={fpLoading}
                      className="px-4 py-2 bg-gradient-ocean text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all flex items-center"
                    >
                      {fpLoading ? (
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                      ) : null}
                      Reset Password
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
