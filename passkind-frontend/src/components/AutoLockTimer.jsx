import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { Lock } from "lucide-react";

const AutoLockTimer = () => {
  const { logout, isAuthenticated, autoLockDuration, isAutoLockEnabled } =
    useAuthStore();
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds warning

  // Configurable timeout in milliseconds
  const TIMEOUT_MS = autoLockDuration * 60 * 1000;
  const WARNING_MS = 60 * 1000; // Show warning 1 minute before

  const lastActivityRef = useRef(Date.now());
  const timerRef = useRef(null);
  const warningTimerRef = useRef(null);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
    setShowWarning(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warningTimerRef.current) clearInterval(warningTimerRef.current);
  }, [logout, navigate]);

  const resetTimer = useCallback(() => {
    // console.log("resetTimer called - clearing timers and hiding warning");
    lastActivityRef.current = Date.now();

    // Clear existing timers first
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearInterval(warningTimerRef.current);
      warningTimerRef.current = null;
    }

    // Reset state
    setShowWarning(false);
    setTimeLeft(60);

    // Calculate when to show warning
    // If total timeout is less than warning time, show warning at 75% of timeout
    const warningDelay =
      TIMEOUT_MS > WARNING_MS
        ? TIMEOUT_MS - WARNING_MS
        : Math.floor(TIMEOUT_MS * 0.75);

    // console.log(
    //   `Setting warning timer for ${warningDelay}ms (total timeout: ${TIMEOUT_MS}ms)`
    // );

    // Set new warning timer
    timerRef.current = setTimeout(() => {
      // console.log("Showing auto-lock warning");
      setShowWarning(true);

      // Calculate countdown time based on remaining time
      const countdownSeconds = Math.floor((TIMEOUT_MS - warningDelay) / 1000);
      setTimeLeft(countdownSeconds);

      // Start countdown
      warningTimerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleLogout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, warningDelay);
  }, [TIMEOUT_MS, WARNING_MS, handleLogout]);

  useEffect(() => {
    if (!isAuthenticated || !isAutoLockEnabled) return;

    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];

    const handleActivity = () => {
      // Throttle resets to avoid performance issues
      if (Date.now() - lastActivityRef.current > 1000) {
        resetTimer();
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    resetTimer();

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (timerRef.current) clearTimeout(timerRef.current);
      if (warningTimerRef.current) clearInterval(warningTimerRef.current);
    };
  }, [isAuthenticated, isAutoLockEnabled, resetTimer]);

  if (!showWarning || !isAuthenticated) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-center border border-gray-200 dark:border-white/10">
        <div className="mx-auto w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
          <Lock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          Auto-Lock Warning
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Your session will be locked in{" "}
          <span className="font-bold text-gray-900 dark:text-white">
            {timeLeft}
          </span>{" "}
          seconds due to inactivity.
        </p>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            // console.log("Stay Logged In clicked");
            resetTimer();
          }}
          className="w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-xl transition-colors"
        >
          Stay Logged In
        </button>
      </div>
    </div>
  );
};

export default AutoLockTimer;
