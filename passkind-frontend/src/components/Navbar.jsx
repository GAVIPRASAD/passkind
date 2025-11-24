import React from "react";
import { Link } from "react-router-dom";
import { Menu, Shield, User, Sun, Moon } from "lucide-react";
import useAuthStore from "../store/authStore";
import { useTheme } from "../context/ThemeContext";

const Navbar = ({ onToggleSidebar }) => {
  const user = useAuthStore((state) => state.user);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="bg-transparent h-16 flex items-center justify-between px-4">
      {/* Mobile: Hamburger */}
      {/* Hamburger and Logo */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500"
        >
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/dashboard" className="ml-4 flex items-center">
          <Shield className="h-8 w-8 text-cyan-600" />
          <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
            PassKind
          </span>
        </Link>
      </div>

      {/* Desktop: Logo (Hidden on Mobile as it's in Sidebar, but user asked for Navbar visible) */}
      {/* Actually, user said "navbar ... visible except in mobile devices" - wait.
         "should be still visible except in mobile devices" -> Navbar visible on desktop.
         "i m seeing sidebar bar only in mobile i want in other screen size also" -> Sidebar visible on desktop.
         "navbar with our logo and text and who logged in ... should be still visible except in mobile devices"
         This implies Navbar should be visible on Desktop.
         On Mobile, we have the Sidebar (drawer) and the Top Bar (Hamburger).
      */}

      {/* Right Side: User Profile & Theme Toggle */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10 transition-colors"
          title="Toggle Theme"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>

        {/* User Profile Link */}
        <Link
          to="/profile"
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.username}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.email}
            </p>
          </div>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.username?.charAt(0).toUpperCase() || "U"}
          </div>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
