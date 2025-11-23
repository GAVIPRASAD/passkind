import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogOut, Shield, Menu, X, Moon, Sun, User } from "lucide-react";
import useAuthStore from "../store/authStore";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = () => {
    logout();
    setShowLogoutDialog(false);
    navigate("/login");
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Shield className="h-8 w-8 text-ocean-600" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                PassKind
              </span>
            </Link>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500"
                  title={
                    theme === "dark"
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                >
                  {theme === "dark" ? (
                    <Sun className="h-5 w-5" />
                  ) : (
                    <Moon className="h-5 w-5" />
                  )}
                </button>
                <Link
                  to="/profile"
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500"
                  title="Profile"
                >
                  <User className="h-5 w-5" />
                </Link>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {user?.username || user?.email}
                </span>
                <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500"
                  title="Logout"
                >
                  <LogOut className="h-6 w-6" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-300 hover:text-ocean-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>

          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ocean-500"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 mb-2">
                  Signed in as{" "}
                  <span className="font-bold">
                    {user?.username || user?.email}
                  </span>
                </div>

                <button
                  onClick={() => {
                    toggleTheme();
                    setIsOpen(false);
                  }}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center">
                    {theme === "dark" ? (
                      <>
                        <Sun className="h-5 w-5 mr-3" /> Switch to Light Mode
                      </>
                    ) : (
                      <>
                        <Moon className="h-5 w-5 mr-3" /> Switch to Dark Mode
                      </>
                    )}
                  </div>
                </button>

                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-3" /> Profile
                  </div>
                </Link>

                <button
                  onClick={() => setShowLogoutDialog(true)}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <div className="flex items-center">
                    <LogOut className="h-5 w-5 mr-3" /> Sign out
                  </div>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutDialog && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowLogoutDialog(false)}
            ></div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 sm:mx-0 sm:h-10 sm:w-10">
                    <LogOut className="h-6 w-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900 dark:text-white"
                      id="modal-title"
                    >
                      Confirm Logout
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Are you sure you want to logout? You will need to login
                        again to access your secrets.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={() => setShowLogoutDialog(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
