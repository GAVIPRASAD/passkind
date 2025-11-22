import React from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Settings,
  Moon,
  Sun,
  Palette,
} from "lucide-react";
import { motion } from "framer-motion";

const Layout = ({ children }) => {
  const { theme, toggleTheme, colorScheme, setColorScheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-black text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar / Navbar */}
      <nav
        className={`fixed top-0 left-0 h-full w-64 border-r ${
          theme === "dark"
            ? "border-gray-800 bg-black"
            : "border-gray-200 bg-white"
        } hidden md:flex flex-col p-6`}
      >
        <div className="flex items-center gap-2 mb-10">
          <div
            className={`w-8 h-8 rounded-lg ${
              colorScheme === "teal"
                ? "bg-teal-500"
                : colorScheme === "blue"
                ? "bg-blue-500"
                : "bg-white"
            }`}
          ></div>
          <h1 className="text-2xl font-bold tracking-tighter">passKind</h1>
        </div>

        <div className="flex-1 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path
                  ? theme === "dark"
                    ? "bg-white text-black"
                    : "bg-black text-white"
                  : "hover:bg-gray-800/10"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-4 pt-6 border-t border-gray-800">
          <div className="flex items-center justify-between">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-800/20"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => setColorScheme("monochrome")}
                className="w-4 h-4 rounded-full bg-white border border-gray-300"
              ></button>
              <button
                onClick={() => setColorScheme("teal")}
                className="w-4 h-4 rounded-full bg-teal-500"
              ></button>
              <button
                onClick={() => setColorScheme("blue")}
                className="w-4 h-4 rounded-full bg-blue-500"
              ></button>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="md:ml-64 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
