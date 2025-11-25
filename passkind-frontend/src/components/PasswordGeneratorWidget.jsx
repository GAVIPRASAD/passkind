import React, { useState, useEffect } from "react";
import { Copy, RefreshCw, Check, Settings, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PasswordGeneratorWidget = ({ className = "" }) => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = charset;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(newPassword);
    setCopied(false);
  };

  useEffect(() => {
    generatePassword();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-2xl p-6 h-full flex flex-col ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg text-cyan-600 dark:text-cyan-400">
          <Wand2 size={20} />
        </div>
        <h3 className="font-bold text-gray-900 dark:text-white">
          Quick Generator
        </h3>
      </div>

      <div className="flex-1 flex flex-col justify-center">
        <div className="relative mb-4 group">
          <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 font-mono text-lg text-center break-all text-gray-800 dark:text-gray-200 tracking-wide">
            {password}
          </div>
          <button
            onClick={copyToClipboard}
            className="absolute top-1/2 right-2 -translate-y-1/2 p-2 text-gray-400 hover:text-green-500 transition-colors"
            title="Copy to clipboard"
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
          </button>
        </div>

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase">
              Length: {length}
            </span>
            <input
              type="range"
              min="8"
              max="32"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-24 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-cyan-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIncludeNumbers(!includeNumbers)}
              className={`px-2 py-1 text-xs font-bold rounded border transition-colors ${
                includeNumbers
                  ? "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800"
                  : "bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700"
              }`}
            >
              123
            </button>
            <button
              onClick={() => setIncludeSymbols(!includeSymbols)}
              className={`px-2 py-1 text-xs font-bold rounded border transition-colors ${
                includeSymbols
                  ? "bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800"
                  : "bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700"
              }`}
            >
              #$&
            </button>
          </div>
        </div>

        <button
          onClick={generatePassword}
          className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95"
        >
          <RefreshCw size={18} /> Generate New
        </button>
      </div>
    </div>
  );
};

export default PasswordGeneratorWidget;
