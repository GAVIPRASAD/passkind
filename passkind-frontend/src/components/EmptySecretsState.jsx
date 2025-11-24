import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Plus, Lock } from "lucide-react";

const EmptySecretsState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-6 lg:px-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 bg-cyan-100 dark:bg-cyan-900/30 rounded-full blur-2xl opacity-50 animate-pulse"></div>
        <div className="relative bg-white dark:bg-[#0B0C10] p-6 rounded-full shadow-xl border border-gray-100 dark:border-gray-800">
          <Shield className="h-16 w-16 text-cyan-600 dark:text-cyan-400" />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="absolute -bottom-2 -right-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-2 rounded-full shadow-lg"
          >
            <Lock className="h-6 w-6" />
          </motion.div>
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4"
      >
        Secure Your Digital Life
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-md text-lg text-gray-600 dark:text-gray-400 mb-8"
      >
        You haven't added any secrets yet. Start by storing your passwords, API
        keys, or secure notes in our encrypted vault.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <Link
          to="/secrets/new"
          className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl shadow-lg shadow-cyan-500/20 text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transform transition-all duration-200 hover:scale-105"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Your First Secret
        </Link>
      </motion.div>
    </div>
  );
};

export default EmptySecretsState;
