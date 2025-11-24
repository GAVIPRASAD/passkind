import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Secrets from "./pages/Secrets";
import SecretForm from "./pages/SecretForm";
import SecretDetail from "./pages/SecretDetail";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/authStore";
import AutoLockTimer from "./components/AutoLockTimer";

import LandingPageDemo from "./pages/LandingPageDemo";
import Dashboard from "./pages/Dashboard";

const queryClient = new QueryClient();

function App() {
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Routes>
            {/* Public landing page */}
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <LandingPageDemo />
                ) : (
                  <Navigate to="/dashboard" />
                )
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/secrets" element={<Secrets />} />
                <Route path="/secrets/new" element={<SecretForm />} />
                <Route path="/secrets/:id" element={<SecretDetail />} />
                <Route path="/secrets/:id/edit" element={<SecretForm />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/favorites" element={<Favorites />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <AutoLockTimer />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
