import React, { useState } from "react";
import { RefreshCw, Copy, Check } from "lucide-react";

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
    <div className="bg-gradient-to-br from-brand-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg p-6 border border-brand-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <RefreshCw className="h-5 w-5 mr-2 text-brand-600 dark:text-brand-400" />
        Password Generator
      </h3>

      {/* Generated Password Display */}
      {generatedPassword && (
        <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border-2 border-brand-300 dark:border-brand-600">
          <div className="flex items-center justify-between">
            <code className="text-lg font-mono text-gray-900 dark:text-white break-all flex-1">
              {generatedPassword}
            </code>
            <button
              onClick={copyToClipboard}
              className="ml-3 p-2 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-5 w-5 text-green-500" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Length Slider */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Password Length
          </label>
          <span className="text-sm font-semibold text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-900 px-3 py-1 rounded-full">
            {length}
          </span>
        </div>
        <input
          type="range"
          min="8"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-brand-600"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>8</span>
          <span>64</span>
        </div>
      </div>

      {/* Character Type Options */}
      <div className="space-y-3 mb-6">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
          Include Characters
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-brand-300 dark:hover:border-brand-600 transition-colors">
            <input
              type="checkbox"
              checked={options.uppercase}
              onChange={() => handleOptionChange("uppercase")}
              className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-ocean-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Uppercase (A-Z)
            </span>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-brand-300 dark:hover:border-brand-600 transition-colors">
            <input
              type="checkbox"
              checked={options.lowercase}
              onChange={() => handleOptionChange("lowercase")}
              className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-ocean-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Lowercase (a-z)
            </span>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-brand-300 dark:hover:border-brand-600 transition-colors">
            <input
              type="checkbox"
              checked={options.numbers}
              onChange={() => handleOptionChange("numbers")}
              className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-ocean-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Numbers (0-9)
            </span>
          </label>

          <label className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-brand-300 dark:hover:border-brand-600 transition-colors">
            <input
              type="checkbox"
              checked={options.symbols}
              onChange={() => handleOptionChange("symbols")}
              className="w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-ocean-500 dark:focus:ring-brand-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Symbols (!@#$...)
            </span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Generate Password
      </button>
    </div>
  );
};

export default PasswordGenerator;
