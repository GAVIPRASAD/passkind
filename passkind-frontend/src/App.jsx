import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Secrets from "./pages/Secrets";
import SecretForm from "./pages/SecretForm";
import SecretDetail from "./pages/SecretDetail";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import useAuthStore from "./store/authStore";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Navigate to="/secrets" />} />
                <Route path="/secrets" element={<Secrets />} />
                <Route path="/secrets/new" element={<SecretForm />} />
                <Route path="/secrets/:id" element={<SecretDetail />} />
                <Route path="/secrets/:id/edit" element={<SecretForm />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
