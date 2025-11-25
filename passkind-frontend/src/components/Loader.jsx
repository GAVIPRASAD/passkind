import React, { useState, useEffect } from "react";
import { ShieldCheck } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Loader = ({
  onComplete,
  theme: propTheme,
  className = "",
  style = {},
}) => {
  const [progress, setProgress] = useState(0);
  const { theme: globalTheme } = useTheme();
  const activeTheme = propTheme || globalTheme;
  const isLight = activeTheme === "light";

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          if (onComplete) onComplete();
          return 100;
        }
        return prev + 1;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  // CSS Variables for dynamic theming
  const themeVars = {
    // Backgrounds
    "--border-main": isLight ? "#f8fafc" : "#000000", // Slate-50

    // Ring Two (Rotating Band) - Swapped greys for Ice/Crystal tones
    "--r2-start": isLight ? "#ffffff" : "#273e42ff",
    "--r2-end": isLight ? "#f1f5f9" : "#2e4245ff", // Slate-100 instead of Blue
    "--r2-border": isLight ? "#e2e8f0" : "#111111", // Slate-200

    // Core & Ring Three (Inner Spheres)
    "--core-start": isLight ? "#ffffff" : "#4a7273ff",
    "--core-end": isLight ? "#f8fafc" : "#000000ff", // Slate-50
    "--core-shadow": isLight ? "#cbd5e1" : "#000000", // Slate-300
    "--r3-shadow": isLight ? "#e2e8f0" : "#000000", // Slate-200

    "--core-text": isLight ? "#0d9488" : "#91ffff", // Teal-600
    "--core-text-hover": isLight ? "#0f766e" : "#ffffff", // Teal-700

    // The "Spin" (Radar Sweep)
    "--spin-c1": isLight ? "#2dd4bf" : "#91ffff", // Teal-400
    "--spin-c2": isLight ? "#99f6e4" : "#0fb4e7", // Teal-200
    "--spin-bg": isLight ? "rgba(255,255,255,0)" : "rgba(0,0,0,0)",

    // Glows
    "--outer-glow": isLight
      ? "rgba(148, 163, 184, 0.1)" // Slate-400 low opacity
      : "rgba(15, 180, 231, 0.2)",
    "--shield-glow": isLight
      ? "rgba(45, 212, 191, 0.3)" // Teal glow
      : "rgba(145, 255, 255, 0.8)",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center font-sans rounded-xl border transition-colors duration-500 ${
        className || "min-h-[400px] w-full"
      }`}
      style={{
        backgroundColor: "var(--bg-main)",
        borderColor: "var(--border-main)",
        ...themeVars,
        ...style,
      }}
    >
      <style>{`
        .orbital {
          width: 100px;
          height: 100px;
          position: relative;
          margin: 0 auto;
          cursor: pointer;
          user-select: none;
          border-radius: 110px;
          transition: transform 0.3s ease-in-out;
          transform: scale(1.5);
        }

        .orbital:hover {
          transform: scale(1.6);
        }

        /* Outer Glow Ring */
        .ringOne {
          position: absolute;
          top: -10px;
          right: -10px;
          bottom: -10px;
          left: -10px;
          border-radius: 200px;
          box-shadow: -5px -5px 15px var(--outer-glow);
          z-index: 1;
        }

        /* Rotating Metal Ring */
        .ringTwo {
          background: linear-gradient(to bottom, var(--r2-start) 0%, var(--r2-end) 100%);
          border: 1px solid var(--r2-border);
          position: absolute;
          top: -25px;
          right: -25px;
          bottom: -25px;
          left: -25px;
          border-radius: 200px;
          z-index: 0;
          animation: rotateClockwise 4s infinite linear;
        }

        /* Static Inner Ring */
        .ringThree {
          background: radial-gradient(ellipse at center, var(--core-start) 1%, var(--core-end) 100%);
          position: absolute;
          top: -10px;
          left: -10px;
          right: -10px;
          bottom: -10px;
          z-index: 0;
          border-radius: 110px;
          box-shadow: -1px 0px 0px var(--r3-shadow), 0px -1px 0px var(--r3-shadow);
        }

        /* Central Core */
        .core {
          position: absolute;
          top: 5px;
          left: 5px;
          right: 5px;
          bottom: 5px;
          z-index: 10;
          border-radius: 110px;
          background: radial-gradient(ellipse at center, var(--core-start) 1%, var(--core-end) 100%);
          box-shadow: -1px 0px 0px var(--core-shadow), 0px -1px 0px var(--core-shadow);
          animation: pulse 2s infinite ease-in-out;
          
          /* Shield Centering */
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--core-text);
          transition: color 0.3s, background 0.3s;
        }

        .core:hover {
          background: radial-gradient(ellipse at center, var(--r2-end) 1%, var(--core-end) 100%);
          color: var(--core-text-hover);
        }

        /* The Radar Sweep */
        .spin {
          background: radial-gradient(
            ellipse at 20% 20%,
            var(--spin-c1) 0%,
            var(--spin-c2) 24%,
            var(--spin-bg) 74%,
            var(--spin-bg) 100%
          );
          border-radius: 110px;
          padding: 10px;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          z-index: 5;
          animation: rotateAntiClockwise 6s infinite linear;
        }

        @keyframes rotateClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes rotateAntiClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }

        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 5px var(--core-shadow); }
          50% { transform: scale(1.05); box-shadow: 0 0 15px var(--spin-c2); }
          100% { transform: scale(1); box-shadow: 0 0 5px var(--core-shadow); }
        }
      `}</style>

      {/* Orbital Component */}
      <div className="orbital">
        <div className="ringOne"></div>
        <div className="ringTwo"></div>
        <div className="ringThree"></div>

        <div className="core">
          <ShieldCheck
            size={48}
            strokeWidth={1.5}
            style={{ filter: "drop-shadow(0 0 5px var(--shield-glow))" }}
          />
        </div>

        <div className="spin"></div>
      </div>
    </div>
  );
};

export default Loader;
