import React, { useState, useEffect } from "react";
import { Lightbulb, ChevronRight, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TIPS = [
  {
    title: "Length matters most",
    text: "A 12-character password takes 62 trillion times longer to crack than an 8-character one.",
  },
  {
    title: "Avoid common patterns",
    text: "Sequences like '123456' or 'qwerty' are the first things hackers try. Randomness is key.",
  },
  {
    title: "Unique is better",
    text: "Using the same password everywhere means one breach compromises all your accounts.",
  },
  {
    title: "Two-Factor Authentication",
    text: "2FA adds a second layer of defense. Even if they have your password, they can't get in.",
  },
  {
    title: "Phishing Awareness",
    text: "Always check the URL before logging in. Attackers create fake sites that look identical to real ones.",
  },
];

const DidYouKnowWidget = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTip = () => {
    setCurrentIndex((prev) => (prev + 1) % TIPS.length);
  };

  const prevTip = () => {
    setCurrentIndex((prev) => (prev - 1 + TIPS.length) % TIPS.length);
  };

  // Auto-rotate every 10 seconds
  useEffect(() => {
    const interval = setInterval(nextTip, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/10 dark:to-orange-900/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/20 rounded-full blur-3xl"></div>

      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
            <Lightbulb size={20} />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white">
            Did You Know?
          </h3>
        </div>
        <div className="flex gap-1">
          <button
            onClick={prevTip}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronLeft size={16} className="text-gray-500" />
          </button>
          <button
            onClick={nextTip}
            className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronRight size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <h4 className="font-bold text-amber-800 dark:text-amber-200 mb-2 text-lg">
              {TIPS[currentIndex].title}
            </h4>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {TIPS[currentIndex].text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-1.5 mt-4 relative z-10">
        {TIPS.map((_, idx) => (
          <div
            key={idx}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              idx === currentIndex
                ? "bg-amber-500"
                : "bg-amber-200 dark:bg-amber-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default DidYouKnowWidget;
