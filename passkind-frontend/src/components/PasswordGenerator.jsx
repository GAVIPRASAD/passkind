import React, { useState } from "react";
import { RefreshCw, Copy, Check, Settings } from "lucide-react";

const PasswordGenerator = ({ onGenerate }) => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const charSets = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
    };

    let availableChars = "";
    Object.keys(options).forEach((key) => {
      if (options[key]) {
        availableChars += charSets[key];
      }
    });

    if (availableChars.length === 0) {
      alert("Please select at least one character type");
      return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * availableChars.length);
      password += availableChars[randomIndex];
    }

    setGeneratedPassword(password);
    if (onGenerate) {
      onGenerate(password);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOptionChange = (option) => {
    setOptions({ ...options, [option]: !options[option] });
  };

  return (
    <div className="bg-gradient-to-br from-white to-cyan-50 dark:from-[#161B22] dark:to-cyan-900/20 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-white/5">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
        <Settings className="h-5 w-5 mr-2 text-cyan-500" />
        Password Generator
      </h3>

      {/* Generated Password Display */}
      {generatedPassword && (
        <div className="mb-6">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
            Generated Password
          </label>
          <div className="p-4 bg-gray-50 dark:bg-black/20 rounded-xl border border-gray-200 dark:border-white/5 flex items-center justify-between group">
            <code className="text-lg font-mono text-cyan-600 dark:text-cyan-400 break-all flex-1 mr-2">
              {generatedPassword}
            </code>
            <button
              onClick={copyToClipboard}
              className="p-2 bg-white dark:bg-white/5 rounded-lg text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 shadow-sm transition-all"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Length Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Length
          </label>
          <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-2.5 py-0.5 rounded-md border border-cyan-100 dark:border-cyan-900/30">
            {length} chars
          </span>
        </div>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-600 dark:accent-cyan-500"
        />
        <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium uppercase tracking-wider">
          <span>Min: 8</span>
          <span>Max: 64</span>
        </div>
      </div>

      {/* Character Type Options */}
      <div className="space-y-3 mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
          Include
        </label>

        <div className="grid grid-cols-1 gap-2">
          {[
            { id: "uppercase", label: "Uppercase (A-Z)" },
            { id: "lowercase", label: "Lowercase (a-z)" },
            { id: "numbers", label: "Numbers (0-9)" },
            { id: "symbols", label: "Symbols (!@#$)" },
          ].map((opt) => (
            <label
              key={opt.id}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                options[opt.id]
                  ? "bg-cyan-50 dark:bg-cyan-900/10 border-cyan-200 dark:border-cyan-900/30"
                  : "bg-gray-50 dark:bg-black/20 border-transparent hover:bg-gray-100 dark:hover:bg-white/5"
              }`}
            >
              <span
                className={`text-sm ${
                  options[opt.id]
                    ? "text-cyan-900 dark:text-cyan-100 font-medium"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {opt.label}
              </span>
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                  options[opt.id]
                    ? "bg-cyan-600 border-cyan-600"
                    : "bg-white dark:bg-black/40 border-gray-300 dark:border-gray-600"
                }`}
              >
                {options[opt.id] && (
                  <Check className="h-3.5 w-3.5 text-white" />
                )}
              </div>
              <input
                type="checkbox"
                checked={options[opt.id]}
                onChange={() => handleOptionChange(opt.id)}
                className="hidden"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-cyan-500/20 text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all transform active:scale-[0.98]"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Generate New Password
      </button>
    </div>
  );
};

export default PasswordGenerator;
