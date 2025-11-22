import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import { motion } from "framer-motion";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, error, isLoading } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 border border-white relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>

        <h2 className="text-3xl font-bold mb-6 text-center tracking-widest uppercase">
          passKind
        </h2>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-900/20 border border-red-500 text-red-500 p-3 mb-4 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-gray-400">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black border border-gray-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-2 uppercase tracking-widest text-gray-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-gray-700 p-3 text-white focus:outline-none focus:border-white transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-bold py-3 hover:bg-gray-200 transition-colors uppercase tracking-widest disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Enter System"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
